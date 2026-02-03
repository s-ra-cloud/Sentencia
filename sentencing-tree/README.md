# Sentencing Choice Tree (HTML + FastAPI)

Prototype web app with an HTML/JS frontend and a Python backend.

## Run

```bash
cd /Users/sacharaoult/Documents/sentencing-tree-web
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://127.0.0.1:8000` in your browser.

## Notes

- Backend supports `scikit-learn`, `xgboost`, and `lightgbm`.
- If a package isn't installed, the UI will return a clear error.
