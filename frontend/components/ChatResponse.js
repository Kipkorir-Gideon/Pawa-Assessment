import ReactMarkdown from 'react-markdown';
import { ClipLoader } from 'react-spinners';

const ChatResponse = ({ response, loading }) => {
    return (
        <div className='bg-white p-6 rounded-lg shadow-md transition-all'>
            {loading && (
                <div className='flex justify-center'>
                    <ClipLoader color='#3B82F6' size={40} />
                </div>
            )}
            {response && !loading && (
                <div>
                    <h2 className='text-lg font-semibold text-gray-800'>Question:</h2>
                    <p className='mb-4 text-gray-600'>{response.question}</p>
                    <h2 className='text-lg font-semibold text-gray-800'>Answer:</h2>
                    <ReactMarkdown className='prose text-gray-700'>
                        {response.answer}
                    </ReactMarkdown>
                </div>
            )}
            {!response && !loading && (
                <p className='text-gray-500 text-center'>No response yet.</p>
            )}
        </div>
    );
}

export default ChatResponse;