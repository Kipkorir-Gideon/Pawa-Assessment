import React, { useState } from 'react';

const ChatInput = ({ onSubmit, loading }) => {
    const [question, setQuestion] = useState('');
    const maxLength = 500;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim() && !loading && question.length <= maxLength) {
            onSubmit(question);
            setQuestion('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-10">
            <div className="flex items-center border rounded-lg overflow-hidden">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 p-2 outline-none border-none"
                    disabled={loading}
                    aria-label="Enter your question"
                    maxLength={maxLength}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 disabled:bg-blue-300"
                    disabled={loading || !question.trim() || question.length > maxLength}
                    aria-label="Submit question"
                >
                    {loading ? 'Sending...' : 'Submit'}
                </button>
            </div>
            <p className={`text-sm mt-1 ${question.length > maxLength ? 'text-red-500' : 'text-gray-500'
                }`}>
                {question.length}/{maxLength} characters
            </p>
        </form>
    );
}

export default ChatInput;