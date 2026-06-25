from services.profiler import compute_profile
import pandas as pd, os

def test_compute_profile_numeric(tmp_path):
    path = str(tmp_path / "num.csv")
    pd.DataFrame({"x": [1,2,3,4,5], "y": [2,4,6,8,10]}).to_csv(path, index=False)
    result = compute_profile(path)
    assert result["row_count"] == 5
    assert result["col_count"] == 2
    x = result["columns"][0]
    assert x["name"] == "x"
    assert x["type"] == "numeric"
    assert x["stats"]["mean"] == 3.0
    assert x["stats"]["median"] == 3.0
    assert x["stats"]["min"] == 1.0
    assert x["stats"]["max"] == 5.0
    assert "histogram" in x["stats"]
    assert len(x["stats"]["histogram"]["bins"]) > 0
    assert len(result["correlation_matrix"]) == 2
    assert result["correlation_matrix"][0][1] > 0.9  # perfect linear correlation

def test_compute_profile_categorical(tmp_path):
    path = str(tmp_path / "cat.csv")
    pd.DataFrame({"region": ["A","A","B","B","C"]}).to_csv(path, index=False)
    result = compute_profile(path)
    c = result["columns"][0]
    assert c["type"] == "categorical"
    assert "value_counts" in c["stats"]
    assert c["stats"]["value_counts"]["A"] == 2
    assert c["stats"]["value_counts"]["B"] == 2
    assert c["stats"]["value_counts"]["C"] == 1

def test_compute_profile_with_missing(tmp_path):
    path = str(tmp_path / "miss.csv")
    pd.DataFrame({"a": [1, None, 3, None, 5], "b": ["x", "y", None, "x", "y"]}).to_csv(path, index=False)
    result = compute_profile(path)
    assert result["columns"][0]["missing"] == 2
    assert result["columns"][1]["missing"] == 1

def test_compute_profile_excel(tmp_path):
    path = str(tmp_path / "test.xlsx")
    pd.DataFrame({"x": [10,20,30], "y": [1,2,3]}).to_excel(path, index=False)
    result = compute_profile(path)
    assert result["row_count"] == 3
