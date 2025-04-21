import { useState, useEffect, useCallback } from 'react';
import ChatInput from '../components/ChatInput';
import ChatResponse from '../components/ChatResponse';
import QueryHistory from '../components/QueryHistory';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

// Configure axios to retry requests
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Exponential backoff
  },
  retryCondition: (error) => {
    return error.response.status === 429 || error.response.status >= 500;
  },
});

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
        toast.success('Query answered successfully')
        await fetchHistory();
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to process query');
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleResubmit = (question) => {
    handleQuery(question);
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete('/api/history');
      setHistory([]);
      toast.success('History cleared');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to clear history');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <div className="flex-1 p-4 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Query Assistant
        </h1>
        <ChatInput onSubmit={handleQuery} loading={loading} />
        <ChatResponse response={response} loading={loading} />
      </div>
      <QueryHistory
        history={history}
        onResubmit={handleResubmit}
        onClear={handleClearHistory}
      />
    </div>
  );
}

export default Home;