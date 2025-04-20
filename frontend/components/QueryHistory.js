const QueryHistory = ({ history }) => {
    return (
        <div className='w-full lg:w-1/3 bg-gray-200 p-4 overflow-y-auto max-h-screen'>
            <h2 className='text-xl font-bold mb-4 text-gray-800'>Query History</h2>
            {history.length === 0 ? (
                <p className='text-gray-500'>No queries yet.</p>
            ) : (
                history.map((item, index) => (
                    <div
                        key={index}
                        className='mb-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow'
                    >
                        <p className='font-semibold text-gray-800'>{item.question}</p>
                        <p className='text-sm text-gray-600'>
                            {new Date(item.timestamp).toLocaleString()}
                        </p>
                        <p className='text-gray-700 line-clamp'>{item.answer}</p>
                    </div>
                ))
            )}
        </div>
    )
}

export default QueryHistory;