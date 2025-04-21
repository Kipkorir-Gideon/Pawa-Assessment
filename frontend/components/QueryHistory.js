import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import InfiniteScroll from 'react-infinite-scroll-component';

const QueryHistory = ({ history, onResubmit, onClear }) => {
    const [displayedHistory, setDisplayedHistory] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;

    useEffect(() => {
        setDisplayedHistory(history.slice(0, pageSize));
        setHasMore(history.length > pageSize);
    }, [history]);

    const loadMore = () => {
        const nextItems = history.slice(
            displayedHistory.length,
            displayedHistory.length + pageSize
        );
        setDisplayedHistory([...displayedHistory, ...nextItems]);
        setHasMore(displayedHistory.length + nextItems.length < history.length);
    };

    return (
        <div className='w-full lg:w-1/3 p-4 bg-gray-50 border-t lg:border-t-0 lg:border-l'>
            <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl font-semibold'>Query History</h2>
                {history.length > 0 && (
                    <button
                        onClick={onClear}
                        className='text-red-500 text-sm hover:underline'
                        aria-label='Clear history'
                    >
                        Clear History
                    </button>
                )}
            </div>
            {history.length === 0 ? (
                <p className='text-gray-500'>No queries yet.</p>
            ) : (
                <InfiniteScroll
                    dataLength={displayedHistory.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<p className='text-center text-gray-500'>Loading...</p>}
                    endMessage={
                        <p className='text-center text-gray-500'>No more queries.</p>
                    }
                >
                    <ul className='space-y-4'>
                        {history.map((item, index) => (
                            <li key={index} className='p-3 bg-white rounded shadow-sm'>
                                <button
                                    onClick={() => onResubmit(item.question)}
                                    className='font-medium text-blue-600 hover:underline'
                                    aria-label={`Resubmit query: ${item.question}`}
                                >
                                    {item.question}
                                </button>
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        className='text-gray-700'
                                    >
                                        {item.answer}
                                    </ReactMarkdown>
                                </div>
                                <p className='text-xs text-gray-400'>
                                    {new Date(item.timestamp).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </InfiniteScroll>
            )}
        </div>
    )
}

export default QueryHistory;