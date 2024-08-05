import { useState, useEffect } from 'react';

function InlineEdit({ value, setValue }) {
    const [editingValue, setEditingValue] = useState(value);

    // Rerender if 'value' changes
    useEffect(() => {
        setEditingValue(value);
    }, [value]);
    
    const onChange = (event) => setEditingValue(event.target.value);

    const onKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.target.blur();
        } 
    }

    const onBlur = (event) => {
        if (event.target.value.trim() === '') {
            setEditingValue(value);
        } else {
            setValue(event.target.value);
        }
    }

    return (
        <input 
            type='text'
            aria-label='Field name'
            placeholder='Enter name'
            value={editingValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            className='rounded-md bg-white dark:bg-lighter hover:cursor-pointer hover:border-2 hover:border-blue-500 border-2 border-transparent inline-block w-40 text-gray-700 dark:text-zinc-200 font-normal placeholder:text-gray-400 dark:placeholder:text-zinc-500'
        />
    )
}

export default InlineEdit;