import pytest
from services.chart_builder import build_chart_data
import pandas as pd
import os


@pytest.fixture
def sales_csv(tmp_path):
    path = str(tmp_path / "sales.csv")
    pd.DataFrame({
        "product": ["A", "B", "A", "C", "B", "C", "A", "B"],
        "region": ["East", "East", "West", "East", "West", "West", "East", "West"],
        "sales": [100, 200, 150, 300, 250, 350, 120, 180],
        "date": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04",
                 "2024-01-05", "2024-01-06", "2024-01-07", "2024-01-08"]
    }).to_csv(path, index=False)
    return path


def test_bar_chart(sales_csv):
    result = build_chart_data(sales_csv, "bar", "product", "sales", None)
    assert result["type"] == "bar"
    assert len(result["labels"]) > 0
    assert len(result["values"]) > 0


def test_scatter_chart(sales_csv):
    result = build_chart_data(sales_csv, "scatter", "sales", "sales", "region")
    assert result["type"] == "scatter"
    assert len(result["datasets"]) > 0


def test_pie_chart(sales_csv):
    result = build_chart_data(sales_csv, "pie", "region", "sales", None)
    assert result["type"] == "pie"
    assert len(result["labels"]) > 0


def test_histogram(sales_csv):
    result = build_chart_data(sales_csv, "histogram", "sales", None, None)
    assert result["type"] == "histogram"
    assert len(result["values"]) > 0


def test_line_chart(sales_csv):
    result = build_chart_data(sales_csv, "line", "date", "sales", None)
    assert result["type"] == "line"


def test_boxplot(sales_csv):
    result = build_chart_data(sales_csv, "boxplot", "sales", None, "region")
    assert result["type"] == "boxplot"
    assert len(result["series"]) > 0


def test_heatmap(sales_csv):
    result = build_chart_data(sales_csv, "heatmap", None, None, None)
    assert result["type"] == "heatmap"
    assert len(result["labels"]) > 0
    assert len(result["values"]) > 0


def test_filter(sales_csv):
    result = build_chart_data(sales_csv, "bar", "product", "sales", None,
                              [{"column": "region", "op": "=", "value": "East"}])
    assert result["type"] == "bar"


def test_unsupported_chart(sales_csv):
    try:
        build_chart_data(sales_csv, "unknown", None, None, None)
        assert False, "Expected ValueError"
    except ValueError:
        pass


def test_line_with_group(sales_csv):
    result = build_chart_data(sales_csv, "line", "date", "sales", "product")
    assert result["type"] == "line"
    assert len(result["datasets"]) > 0


def test_bar_without_y(sales_csv):
    result = build_chart_data(sales_csv, "bar", "product", None, None)
    assert result["type"] == "bar"
    assert "计数" in result["y_label"] or "count" in result["y_label"].lower()


def test_scatter_no_group(sales_csv):
    result = build_chart_data(sales_csv, "scatter", "sales", "sales", None)
    assert result["type"] == "scatter"
    assert len(result["datasets"]) == 1
