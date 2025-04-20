import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatResponse = ({ response, loading }) => {
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : response ? (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {response.answer}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-gray-500">No response yet</p>
      )}
    </div>
  );
};

export default ChatResponse;