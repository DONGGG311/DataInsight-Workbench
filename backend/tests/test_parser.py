from services.parser import parse_file

def test_parse_csv(sample_csv):
    result = parse_file(sample_csv, "test.csv")
    assert result["row_count"] == 5
    assert result["col_count"] == 3
    assert len(result["columns"]) == 3
    assert result["columns"][0]["name"] == "销售额"
    assert result["columns"][0]["dtype"] == "numeric"
    assert result["columns"][0]["missing_count"] == 1
    assert result["columns"][1]["dtype"] == "categorical"

def test_parse_nonexistent_file():
    try:
        parse_file("/nonexistent/file.csv", "x.csv")
        assert False, "Expected exception"
    except FileNotFoundError:
        pass
