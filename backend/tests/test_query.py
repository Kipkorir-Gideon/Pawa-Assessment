from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_query_endpoint():
    """Test the /api/query endpoint."""
    response = client.post(
        "/api/query",
        json={"question": "What is the capital of France?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "question" in data
    assert "answer" in data
    assert "timestamp" in data
    assert data["question"] == "What is the capital of France?"
    assert isinstance(data["timestamp"], str)
    assert len(data["answer"]) > 0
    
def test_history_endpoint():
    """Test the /api/history endpoint."""
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert "question" in data[0]
        assert "answer" in data[0]
        assert "timestamp" in data[0]
        assert isinstance(data[0]["timestamp"], str)
        assert len(data[0]["answer"]) > 0
    assert len(data) > 0