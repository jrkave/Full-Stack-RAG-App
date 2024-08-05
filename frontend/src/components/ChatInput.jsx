import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

function ChatInput({ onSubmit }) {
    const [query, setQuery] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        if (query.trim()) {
            onSubmit(query);
            setQuery('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='relative mx-4'>
            <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Send a message'
                className='bg-gray-100 border-2 dark:border-0 dark:bg-darker text-gray-700 dark:text-zinc-200 rounded-full py-3 w-full pl-4'
            />
            <button type='submit' aria-label='submit' className='absolute top-2.5 right-3 bg-gray-300 hover:bg-gray-200 mt-0.5 dark:bg-gray-500 dark:hover:bg-gray-400 p-1 rounded-full'><FaArrowUp className='text-xl text-gray-700 dark:text-darkest'/></button>
        </form>
    );
}

export default ChatInput;