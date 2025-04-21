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
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 429 || error.response.status >= 500;
  },
});

const Home = () => {
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/history`);
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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/query`, { question });
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

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <div className="flex-1 p-4 lg:p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Query Assistant
          </h1>
          <button
            onClick={toggleHistory}
            className="lg:hidden px-3 py-1 bg-blue-500 text-white rounded-md"
            aria-label={isHistoryOpen ? 'Hide history' : 'Show history'}
          >
            {isHistoryOpen ? 'Hide History' : 'Show History'}
          </button>
        </div>
        <div className="sticky top-0 bg-gray-100 z-10 pb-4 shadow-md">
          <ChatInput onSubmit={handleQuery} loading={loading} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatResponse response={response} loading={loading} />
        </div>
      </div>
      <div
        className={`lg:w-1/3 lg:block ${isHistoryOpen ? 'block' : 'hidden'} w-full`}
      >
        <QueryHistory
          history={history}
          onResubmit={handleResubmit}
          onClear={handleClearHistory}
        />
      </div>
    </div>
  );
}

export default Home;