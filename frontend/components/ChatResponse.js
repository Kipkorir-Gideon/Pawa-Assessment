import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const ChatResponse = ({ response, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-4 bg-white rounded-lg shadow-md"
    >
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
    </motion.div>
  );
};

export default ChatResponse;