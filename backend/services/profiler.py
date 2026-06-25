import pandas as pd
import numpy as np
from scipy import stats as sp_stats

def compute_profile(filepath: str) -> dict:
    df = pd.read_csv(filepath) if filepath.endswith('.csv') else pd.read_excel(filepath)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    columns = []
    for col_name in df.columns:
        series = df[col_name]
        if pd.api.types.is_numeric_dtype(series):
            clean = series.dropna()
            hist, bins = np.histogram(clean.values, bins='auto')
            columns.append({
                "name": str(col_name),
                "type": "numeric",
                "missing": int(series.isna().sum()),
                "stats": {
                    "mean": round(float(clean.mean()), 2) if len(clean) > 0 else None,
                    "median": round(float(clean.median()), 2) if len(clean) > 0 else None,
                    "std": round(float(clean.std()), 2) if len(clean) > 0 else None,
                    "min": round(float(clean.min()), 2) if len(clean) > 0 else None,
                    "max": round(float(clean.max()), 2) if len(clean) > 0 else None,
                    "histogram": {
                        "bins": [round(float(b), 2) for b in bins],
                        "counts": [int(c) for c in hist]
                    }
                }
            })
        else:
            vc = series.dropna().value_counts().head(10).to_dict()
            columns.append({
                "name": str(col_name),
                "type": "categorical",
                "missing": int(series.isna().sum()),
                "stats": {"value_counts": {str(k): int(v) for k, v in vc.items()}}
            })

    corr_matrix = None
    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr().values.tolist()
        corr_matrix = [[round(float(v), 3) if not (isinstance(v, float) and np.isnan(v)) else 0 for v in row] for row in corr]

    return {
        "row_count": len(df),
        "col_count": len(df.columns),
        "numeric_cols": numeric_cols,
        "columns": columns,
        "correlation_matrix": corr_matrix
    }
