import { useState } from 'react';

const SearchBar = ({ query, onSearch }) => {
    const handleInputChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <div className='w-full'>
            <input
                type='text'
                placeholder='Search...'
                value={query}
                onChange={handleInputChange}
                className='p-3 w-full bg-white dark:bg-lighter border dark:border-zinc-600 text-gray-700 dark:text-white font-semibold rounded-3xl placeholder-gray-400 dark:placeholder-zinc-400'
            />
        </div>
    );
}

export default SearchBar;