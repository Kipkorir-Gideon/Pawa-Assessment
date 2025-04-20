import { useState, useEffect, useCallback } from 'react';
import ChatInput from '../components/ChatInput';
import ChatResponse from '../components/ChatResponse';
import QueryHistory from '../components/QueryHistory';
import axios from 'axios';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

const Home = () => {
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/history');
      setHistory(res.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to load history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleQuery = useCallback(
    debounce(async (question) => {
      setLoading(true);
      try {
        const res = await axios.post('/api/query', { question });
        setResponse(res.data);
        await fetchHistory();
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to process query');
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <div className="flex-1 p-4 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Query Assistant
        </h1>
        <ChatInput onSubmit={handleQuery} loading={loading} />
        <ChatResponse response={response} loading={loading} />
      </div>
      <QueryHistory history={history} />
    </div>
  );
}

export default Home;