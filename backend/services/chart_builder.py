"""L2 Chart Data Builder - builds structured JSON for ECharts consumption.

Supports 7 chart types: bar, line, scatter, pie, histogram, boxplot, heatmap.
"""

import pandas as pd
import numpy as np
from typing import Optional


SUPPORTED_CHARTS = {"bar", "line", "scatter", "pie", "histogram", "boxplot", "heatmap"}


def _read_file(filepath: str) -> pd.DataFrame:
    """Read CSV or Excel into a DataFrame."""
    if filepath.endswith(".csv"):
        return pd.read_csv(filepath)
    elif filepath.endswith((".xlsx", ".xls")):
        return pd.read_excel(filepath)
    else:
        raise ValueError(f"不支持的文件格式: {filepath}")


def _apply_filters(df: pd.DataFrame, filters: Optional[list[dict]]) -> pd.DataFrame:
    """Apply filter conditions to the DataFrame.

    Each filter is a dict with keys: column, op ("=" or "!="), value.
    """
    if not filters:
        return df

    df = df.copy()
    for f in filters:
        col = f.get("column")
        op = f.get("op", "=")
        val = f.get("value")

        if col not in df.columns:
            raise ValueError(f"过滤列不存在: {col}")

        if op == "=":
            df = df[df[col] == val]
        elif op == "!=":
            df = df[df[col] != val]
        else:
            raise ValueError(f"不支持的过滤操作: {op}")

    return df


def _is_numeric(series: pd.Series) -> bool:
    """Check if a series is numeric."""
    return pd.api.types.is_numeric_dtype(series)


def _build_bar(df: pd.DataFrame, x_field: str, y_field: Optional[str],
               group_by: Optional[str]) -> dict:
    """Build bar chart data.

    Groups by x_field, aggregates y_field (mean if numeric, count otherwise).
    If group_by is provided, produces multiple series.
    """
    if y_field and not _is_numeric(df[y_field]):
        raise ValueError(f"y_field 必须是数值列用于柱状图聚合: {y_field}")

    if group_by and group_by not in df.columns:
        raise ValueError(f"分组列不存在: {group_by}")

    agg_col = y_field if y_field else x_field
    is_num = y_field and _is_numeric(df[y_field])

    if group_by:
        # Multi-series bar: one series per group_by value
        groups = df[group_by].unique()
        # Get all x categories
        x_cats = sorted(df[x_field].unique(), key=str)
        datasets = []
        for grp in sorted(groups, key=str):
            group_df = df[df[group_by] == grp]
            if is_num:
                agg = group_df.groupby(x_field)[y_field].mean()
            else:
                agg = group_df.groupby(x_field).size()
            data = [float(agg.get(cat, 0)) for cat in x_cats]
            datasets.append({"label": str(grp), "data": data})
        return {
            "type": "bar",
            "labels": [str(c) for c in x_cats],
            "datasets": datasets,
            "x_label": x_field,
            "y_label": y_field if y_field else "计数"
        }
    else:
        # Single series
        if is_num:
            agg = df.groupby(x_field)[y_field].mean()
        else:
            agg = df.groupby(x_field).size()

        # Preserve original order of appearance
        seen = []
        labels = []
        values = []
        for val in df[x_field]:
            if val not in seen:
                seen.append(val)
        for label in seen:
            labels.append(str(label))
            values.append(float(agg.get(label, 0)))

        return {
            "type": "bar",
            "labels": labels,
            "values": values,
            "x_label": x_field,
            "y_label": y_field if y_field else "计数"
        }


def _build_line(df: pd.DataFrame, x_field: str, y_field: Optional[str],
                group_by: Optional[str]) -> dict:
    """Build line chart data.

    Similar to bar but sorted by x_field, with optional group_by.
    """
    if y_field and not _is_numeric(df[y_field]):
        raise ValueError(f"y_field 必须是数值列用于折线图: {y_field}")

    if group_by and group_by not in df.columns:
        raise ValueError(f"分组列不存在: {group_by}")

    # Sort by x_field
    try:
        df = df.sort_values(by=x_field)
    except (TypeError, KeyError):
        pass

    is_num = y_field and _is_numeric(df[y_field])

    if group_by:
        groups = df[group_by].unique()
        x_cats = []
        seen = set()
        for val in df[x_field]:
            if val not in seen:
                seen.add(val)
                x_cats.append(val)
        datasets = []
        for grp in sorted(groups, key=str):
            group_df = df[df[group_by] == grp]
            if is_num:
                agg = group_df.groupby(x_field)[y_field].mean()
            else:
                agg = group_df.groupby(x_field).size()
            data = [float(agg.get(cat, 0)) for cat in x_cats]
            datasets.append({"label": str(grp), "data": data})
        return {
            "type": "line",
            "labels": [str(c) for c in x_cats],
            "datasets": datasets,
            "x_label": x_field,
            "y_label": y_field if y_field else "计数"
        }
    else:
        seen = []
        labels = []
        values = []
        for val in df[x_field]:
            if val not in seen:
                seen.append(val)
        if is_num:
            agg = df.groupby(x_field)[y_field].mean()
        else:
            agg = df.groupby(x_field).size()
        for label in seen:
            labels.append(str(label))
            values.append(float(agg.get(label, 0)))

        return {
            "type": "line",
            "labels": labels,
            "values": values,
            "x_label": x_field,
            "y_label": y_field if y_field else "计数"
        }


def _build_scatter(df: pd.DataFrame, x_field: Optional[str],
                   y_field: Optional[str], group_by: Optional[str]) -> dict:
    """Build scatter chart data.

    Returns [{x, y}] pairs, with optional group_by splitting into multiple datasets.
    """
    if not x_field or not y_field:
        raise ValueError("散点图需要 x_field 和 y_field")

    if not _is_numeric(df[x_field]) or not _is_numeric(df[y_field]):
        raise ValueError("散点图的 x_field 和 y_field 必须是数值列")

    if group_by:
        if group_by not in df.columns:
            raise ValueError(f"分组列不存在: {group_by}")
        datasets = []
        for grp in sorted(df[group_by].unique(), key=str):
            group_df = df[df[group_by] == grp]
            points = [
                {"x": float(row[x_field]), "y": float(row[y_field])}
                for _, row in group_df.iterrows()
            ]
            datasets.append({"label": str(grp), "data": points})
        return {
            "type": "scatter",
            "datasets": datasets,
            "x_label": x_field,
            "y_label": y_field
        }
    else:
        points = [
            {"x": float(row[x_field]), "y": float(row[y_field])}
            for _, row in df.iterrows()
        ]
        return {
            "type": "scatter",
            "datasets": [{"label": "", "data": points}],
            "x_label": x_field,
            "y_label": y_field
        }


def _build_pie(df: pd.DataFrame, x_field: str, y_field: Optional[str],
               group_by=None) -> dict:
    """Build pie chart data.

    Groups by x_field, aggregates y_field (sum).
    """
    if y_field and not _is_numeric(df[y_field]):
        raise ValueError(f"y_field 必须是数值列用于饼图聚合: {y_field}")

    if y_field:
        agg = df.groupby(x_field)[y_field].sum()
    else:
        agg = df.groupby(x_field).size()

    labels = []
    values = []
    for label in agg.index:
        labels.append(str(label))
        values.append(float(agg[label]))

    return {
        "type": "pie",
        "labels": labels,
        "values": values,
        "x_label": x_field,
        "y_label": y_field if y_field else "计数"
    }


def _build_histogram(df: pd.DataFrame, x_field: str, y_field=None,
                     group_by=None) -> dict:
    """Build histogram data using np.histogram on x_field values."""
    if not _is_numeric(df[x_field]):
        raise ValueError(f"x_field 必须是数值列用于直方图: {x_field}")

    data = df[x_field].dropna().values
    if len(data) == 0:
        return {
            "type": "histogram",
            "bins": [],
            "values": [],
            "x_label": x_field,
            "y_label": "频数"
        }

    counts, bins = np.histogram(data, bins="auto")

    return {
        "type": "histogram",
        "bins": [float(b) for b in bins],
        "values": [int(c) for c in counts],
        "x_label": x_field,
        "y_label": "频数"
    }


def _build_boxplot(df: pd.DataFrame, x_field: str, y_field=None,
                   group_by: Optional[str] = None) -> dict:
    """Build boxplot data.

    If group_by is provided, builds series of values per group.
    Otherwise, builds a single box from x_field.
    """
    if not _is_numeric(df[x_field]):
        raise ValueError(f"x_field 必须是数值列用于箱线图: {x_field}")

    if group_by:
        if group_by not in df.columns:
            raise ValueError(f"分组列不存在: {group_by}")
        series = []
        for grp in sorted(df[group_by].unique(), key=str):
            group_vals = df[df[group_by] == grp][x_field].dropna().values.tolist()
            series.append({
                "name": str(grp),
                "data": [float(v) for v in group_vals]
            })
        return {
            "type": "boxplot",
            "series": series,
            "x_label": group_by,
            "y_label": x_field
        }
    else:
        vals = df[x_field].dropna().values.tolist()
        return {
            "type": "boxplot",
            "series": [{"name": x_field, "data": [float(v) for v in vals]}],
            "x_label": x_field,
            "y_label": "值"
        }


def _build_heatmap_corr(df: pd.DataFrame, x_field=None, y_field=None,
                        group_by=None) -> dict:
    """Build heatmap data: correlation matrix of all numeric columns."""
    numeric_cols = [c for c in df.columns if _is_numeric(df[c])]
    if len(numeric_cols) < 2:
        # With only one numeric column, still return a 1x1 matrix or empty
        pass

    if len(numeric_cols) == 0:
        return {
            "type": "heatmap",
            "labels": [],
            "values": [],
            "x_label": "",
            "y_label": ""
        }

    corr = df[numeric_cols].corr()

    labels = [str(c) for c in numeric_cols]
    values = []
    for _, row in corr.iterrows():
        values.append([round(float(v), 4) for v in row])

    return {
        "type": "heatmap",
        "labels": labels,
        "values": values,
        "x_label": "",
        "y_label": ""
    }


# Mapping from chart type to builder function
_BUILDERS = {
    "bar": _build_bar,
    "line": _build_line,
    "scatter": _build_scatter,
    "pie": _build_pie,
    "histogram": _build_histogram,
    "boxplot": _build_boxplot,
    "heatmap": _build_heatmap_corr,
}


def build_chart_data(filepath: str,
                     chart_type: str,
                     x_field: Optional[str] = None,
                     y_field: Optional[str] = None,
                     group_by: Optional[str] = None,
                     filters: Optional[list[dict]] = None) -> dict:
    """Build structured chart data from a dataset file.

    Args:
        filepath: Path to the CSV/Excel file.
        chart_type: One of: bar, line, scatter, pie, histogram, boxplot, heatmap.
        x_field: X-axis column name.
        y_field: Y-axis column name (aggregation target).
        group_by: Optional column to split into multiple series/datasets.
        filters: Optional list of filter dicts [{column, op, value}].

    Returns:
        A dict with at least {"type": ...} plus chart-specific fields.

    Raises:
        ValueError: On unsupported chart type, missing required fields,
                    non-numeric columns where numeric is required, etc.
    """
    chart_type = chart_type.lower().strip()

    if chart_type not in SUPPORTED_CHARTS:
        raise ValueError(
            f"不支持的图表类型: {chart_type}。支持的类型: {', '.join(sorted(SUPPORTED_CHARTS))}"
        )

    builder = _BUILDERS[chart_type]

    df = _read_file(filepath)
    df = _apply_filters(df, filters)

    if len(df) == 0:
        return {
            "type": chart_type,
            "labels": [],
            "values": [],
            "x_label": x_field or "",
            "y_label": y_field or ""
        }

    # Validate required fields per chart type
    if chart_type == "heatmap":
        # heatmap ignores x/y_field, uses all numeric columns
        result = builder(df, None, None, None)
    elif chart_type == "histogram":
        if not x_field:
            raise ValueError("直方图需要 x_field")
        if x_field not in df.columns:
            raise ValueError(f"列不存在: {x_field}")
        result = builder(df, x_field, y_field, group_by)
    elif chart_type == "boxplot":
        if not x_field:
            raise ValueError("箱线图需要 x_field")
        if x_field not in df.columns:
            raise ValueError(f"列不存在: {x_field}")
        result = builder(df, x_field, y_field, group_by)
    elif chart_type == "scatter":
        if not x_field or not y_field:
            raise ValueError("散点图需要 x_field 和 y_field")
        if x_field not in df.columns:
            raise ValueError(f"列不存在: {x_field}")
        if y_field not in df.columns:
            raise ValueError(f"列不存在: {y_field}")
        result = builder(df, x_field, y_field, group_by)
    else:
        # bar, line, pie
        if not x_field:
            raise ValueError(f"{chart_type} 图需要 x_field")
        if x_field not in df.columns:
            raise ValueError(f"列不存在: {x_field}")
        if y_field and y_field not in df.columns:
            raise ValueError(f"列不存在: {y_field}")
        result = builder(df, x_field, y_field, group_by)

    return result
