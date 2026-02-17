import base64
import io
import json
import os
from collections import defaultdict
from datetime import datetime
from typing import List, Optional

import numpy as np
import pandas as pd
from fastapi import FastAPI, File, Form, UploadFile, Request, Header
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from matplotlib import pyplot as plt
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor, plot_tree as skl_plot_tree

try:
    import xgboost as xgb
except Exception:
    xgb = None

try:
    import lightgbm as lgb
except Exception:
    lgb = None

app = FastAPI(title="Sentencing Choice Tree")
app.mount("/static", StaticFiles(directory="static"), name="static")

RATE_LIMIT = 10
RATE_DATA_FILE = os.path.join(os.path.dirname(__file__), "rate_data.json")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Trismegiste")
ALLOWED_IPS = os.environ.get("ALLOWED_IPS", "").split(",")

def load_rate_data():
    if os.path.exists(RATE_DATA_FILE):
        try:
            with open(RATE_DATA_FILE, "r") as f:
                data = json.load(f)
                return {
                    "counts": defaultdict(int, data.get("counts", {})),
                    "blocked": set(data.get("blocked", [])),
                }
        except Exception:
            pass
    return {"counts": defaultdict(int), "blocked": set()}

def save_rate_data(data):
    with open(RATE_DATA_FILE, "w") as f:
        json.dump({
            "counts": dict(data["counts"]),
            "blocked": list(data["blocked"]),
        }, f)

rate_data = load_rate_data()

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

def is_ip_allowed(ip: str) -> bool:
    return ip in ALLOWED_IPS or ip in ["127.0.0.1", "localhost"]

def check_rate_limit(ip: str) -> tuple:
    if is_ip_allowed(ip):
        return True, None
    if ip in rate_data["blocked"]:
        return False, "Your IP has been blocked due to excessive usage. Contact the administrator to unblock."
    if rate_data["counts"][ip] >= RATE_LIMIT:
        rate_data["blocked"].add(ip)
        save_rate_data(rate_data)
        return False, f"Rate limit exceeded ({RATE_LIMIT} analyses). Your IP has been blocked."
    return True, None

def increment_ip_count(ip: str):
    if not is_ip_allowed(ip):
        rate_data["counts"][ip] += 1
        save_rate_data(rate_data)


def _detect_task(y: pd.Series) -> str:
    unique = y.dropna().unique()
    if len(unique) == 2:
        return "classification"
    if pd.api.types.is_bool_dtype(y):
        return "classification"
    if pd.api.types.is_numeric_dtype(y) and set(unique).issubset({0, 1}):
        return "classification"
    return "regression"


def _prep_features(df: pd.DataFrame, features: List[str]) -> pd.DataFrame:
    x = df[features].copy()
    cat_cols = x.select_dtypes(include=["object", "category", "bool"]).columns.tolist()
    if cat_cols:
        x = pd.get_dummies(x, columns=cat_cols, drop_first=True)
    return x


def _train_tree(
    x: pd.DataFrame,
    y: pd.Series,
    task: str,
    max_depth: Optional[int],
    min_samples_leaf: int,
    random_state: int,
    package: str,
):
    if package == "scikit-learn":
        if task == "classification":
            model = DecisionTreeClassifier(
                max_depth=max_depth,
                min_samples_leaf=min_samples_leaf,
                random_state=random_state,
            )
        else:
            model = DecisionTreeRegressor(
                max_depth=max_depth,
                min_samples_leaf=min_samples_leaf,
                random_state=random_state,
            )
        model.fit(x, y)
        return model

    if package == "xgboost":
        if xgb is None:
            raise RuntimeError("xgboost is not installed.")
        if task == "classification":
            model = xgb.XGBClassifier(
                max_depth=max_depth,
                min_child_weight=min_samples_leaf,
                random_state=random_state,
                n_estimators=50,
                subsample=0.9,
                colsample_bytree=0.9,
                eval_metric="logloss",
            )
        else:
            model = xgb.XGBRegressor(
                max_depth=max_depth,
                min_child_weight=min_samples_leaf,
                random_state=random_state,
                n_estimators=50,
                subsample=0.9,
                colsample_bytree=0.9,
            )
        model.fit(x, y)
        return model

    if package == "lightgbm":
        if lgb is None:
            raise RuntimeError("lightgbm is not installed.")
        if task == "classification":
            model = lgb.LGBMClassifier(
                max_depth=max_depth,
                min_child_samples=min_samples_leaf,
                random_state=random_state,
                n_estimators=50,
            )
        else:
            model = lgb.LGBMRegressor(
                max_depth=max_depth,
                min_child_samples=min_samples_leaf,
                random_state=random_state,
                n_estimators=50,
            )
        model.fit(x, y)
        return model

    raise RuntimeError(f"Unsupported package: {package}")


def _plot_tree_png(model, feature_names: List[str], package: str) -> str:
    fig, ax = plt.subplots(figsize=(14, 8))
    if package == "scikit-learn":
        skl_plot_tree(
            model,
            feature_names=feature_names,
            filled=True,
            rounded=True,
            impurity=True,
            proportion=True,
            fontsize=9,
            ax=ax,
        )
    elif package == "xgboost":
        if xgb is None:
            raise RuntimeError("xgboost is not installed.")
        xgb.plot_tree(model, num_trees=0, ax=ax)
    elif package == "lightgbm":
        if lgb is None:
            raise RuntimeError("lightgbm is not installed.")
        lgb.plot_tree(model, ax=ax)
    else:
        raise RuntimeError(f"Unsupported package: {package}")
    ax.set_title("Decision Tree")
    buf = io.BytesIO()
    fig.tight_layout()
    fig.savefig(buf, format="png", dpi=150)
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


@app.get("/", response_class=HTMLResponse)
def index():
    with open("static/index.html", "r", encoding="utf-8") as f:
        return f.read()


@app.post("/train")
async def train(
    request: Request,
    file: UploadFile = File(...),
    target: str = Form(...),
    features: str = Form(...),
    task: str = Form(...),
    package: str = Form("scikit-learn"),
    max_depth: int = Form(4),
    min_samples_leaf: int = Form(5),
    test_size: float = Form(0.2),
    random_state: int = Form(42),
):
    client_ip = get_client_ip(request)
    allowed, error_msg = check_rate_limit(client_ip)
    if not allowed:
        return JSONResponse(status_code=429, content={"error": error_msg})
    
    content = await file.read()
    if content[:3] == b'\xef\xbb\xbf':
        content = content[3:]
    try:
        df = pd.read_csv(io.BytesIO(content), encoding='utf-8')
    except Exception as exc:
        return JSONResponse(status_code=400, content={"error": str(exc)})

    df.columns = [c.strip().strip('"') for c in df.columns]
    target = target.strip().strip('"')

    if target not in df.columns:
        return JSONResponse(
            status_code=400,
            content={"error": "Target column not found in CSV."},
        )

    feature_list = [f.strip().strip('"') for f in features.split(",") if f.strip()]
    if not feature_list:
        return JSONResponse(status_code=400, content={"error": "No features selected."})

    y = df[target]
    detected_task = _detect_task(y)
    if task not in {"classification", "regression", "auto"}:
        return JSONResponse(status_code=400, content={"error": "Invalid task."})
    if task == "auto":
        task = detected_task

    x = _prep_features(df, feature_list)
    mask = y.notna()
    x = x.loc[mask]
    y = y.loc[mask]

    if task == "classification":
        if y.dtype == "object":
            y = y.astype("category").cat.codes

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=test_size, random_state=int(random_state)
    )

    try:
        model = _train_tree(
        x_train,
        y_train,
        task=task,
        max_depth=max_depth,
        min_samples_leaf=min_samples_leaf,
        random_state=int(random_state),
        package=package,
    )
    except Exception as exc:
        return JSONResponse(status_code=400, content={"error": str(exc)})

    if task == "classification":
        preds = model.predict(x_test)
        acc = accuracy_score(y_test, preds)
        cm = confusion_matrix(y_test, preds)
        metrics = {
            "accuracy": float(acc),
            "confusion_matrix": cm.tolist(),
        }
    else:
        preds = model.predict(x_test)
        mae = mean_absolute_error(y_test, preds)
        mse = mean_squared_error(y_test, preds)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, preds)
        metrics = {"mae": float(mae), "rmse": float(rmse), "r2": float(r2)}

    try:
        tree_png_b64 = _plot_tree_png(model, list(x.columns), package=package)
    except Exception as exc:
        return JSONResponse(status_code=400, content={"error": str(exc)})

    increment_ip_count(client_ip)
    
    return {
        "package": package,
        "task": task,
        "features_used": list(x.columns),
        "metrics": metrics,
        "tree_png_b64": tree_png_b64,
    }


@app.get("/admin/rate-stats")
def get_rate_stats(authorization: str = Header(None)):
    if not authorization or authorization.replace("Bearer ", "") != ADMIN_PASSWORD:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    return {
        "counts": dict(rate_data["counts"]),
        "blocked": list(rate_data["blocked"]),
        "rate_limit": RATE_LIMIT,
    }


@app.post("/admin/unblock-ip")
def unblock_ip(request_data: dict, authorization: str = Header(None)):
    if not authorization or authorization.replace("Bearer ", "") != ADMIN_PASSWORD:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    ip = request_data.get("ip")
    if ip in rate_data["blocked"]:
        rate_data["blocked"].remove(ip)
        rate_data["counts"][ip] = 0
        save_rate_data(rate_data)
        return {"success": True, "message": f"IP {ip} unblocked"}
    return {"success": False, "message": f"IP {ip} was not blocked"}


@app.post("/admin/reset-ip")
def reset_ip(request_data: dict, authorization: str = Header(None)):
    if not authorization or authorization.replace("Bearer ", "") != ADMIN_PASSWORD:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    ip = request_data.get("ip")
    if ip in rate_data["counts"]:
        rate_data["counts"][ip] = 0
        save_rate_data(rate_data)
        return {"success": True, "message": f"IP {ip} count reset"}
    return {"success": False, "message": f"IP {ip} not found"}
