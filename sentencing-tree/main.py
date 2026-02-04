import base64
import io
from typing import List, Optional

import numpy as np
import pandas as pd
from fastapi import FastAPI, File, Form, UploadFile
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
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as exc:
        return JSONResponse(status_code=400, content={"error": str(exc)})

    if target not in df.columns:
        return JSONResponse(
            status_code=400,
            content={"error": "Target column not found in CSV."},
        )

    feature_list = [f for f in features.split(",") if f]
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

    return {
        "package": package,
        "task": task,
        "features_used": list(x.columns),
        "metrics": metrics,
        "tree_png_b64": tree_png_b64,
    }
