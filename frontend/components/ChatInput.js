import React, { useState } from 'react';

const ChatInput = ({ onSubmit, loading }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim() && !loading) {
            onSubmit(question);
            setQuestion('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 p-2 outline-none"
                    disabled={loading}
                    aria-label="Enter your question"
                    maxLength={500}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 disabled:bg-blue-300"
                    disabled={loading || !question.trim()}
                    aria-label="Submit question"
                >
                    {loading ? 'Sending...' : 'Submit'}
                </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
                {question.length}/500 characters
            </p>
        </form>
    )
}

export default ChatInput;