import { useState } from 'react';

const ChatInput = ({ onSubmit, loading }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            onSubmit(question);
            setQuestion('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                rows="4"
                disabled={loading}
            />
            <button
                type="submit"
                className={`mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Submit'}
            </button>
        </form>
    )
}

export default ChatInput;