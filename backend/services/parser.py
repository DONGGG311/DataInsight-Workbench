import pandas as pd
import numpy as np
import uuid

def parse_file(filepath: str, filename: str) -> dict:
    if filename.endswith('.csv'):
        df = pd.read_csv(filepath)
    elif filename.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(filepath)
    else:
        raise ValueError(f"Unsupported file format: {filename}")

    columns = []
    for i, col_name in enumerate(df.columns):
        series = df[col_name].dropna()
        if pd.api.types.is_numeric_dtype(df[col_name]):
            dtype = "numeric"
        elif pd.api.types.is_datetime64_any_dtype(df[col_name]):
            dtype = "datetime"
        else:
            dtype = "categorical"

        missing_count = int(df[col_name].isna().sum())
        columns.append({
            "name": str(col_name),
            "dtype": dtype,
            "missing_count": missing_count
        })

    df = df.replace({np.nan: None})

    return {
        "id": uuid.uuid4().hex[:12],
        "filename": filename,
        "row_count": len(df),
        "col_count": len(df.columns),
        "columns": columns,
        "rows": [[_safe_value(v) for v in row] for _, row in df.iterrows()]
    }

def _safe_value(v):
    if v is None: return None
    if isinstance(v, (np.integer,)): return int(v)
    if isinstance(v, (np.floating,)): return float(v)
    if isinstance(v, (np.bool_,)): return bool(v)
    if isinstance(v, pd.Timestamp): return str(v)
    return v
