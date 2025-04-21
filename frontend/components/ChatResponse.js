import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClipLoader } from 'react-spinners';

const ChatResponse = ({ response, loading }) => {
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
      {loading ? (
        <div className="flex items-center justify-center">
          <ClipLoader size={30} color="#3b82f6" />
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
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