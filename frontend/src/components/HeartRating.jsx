import { useState, useEffect } from 'react';
import Heart from './Heart';
import { useAlert } from 'react-alert'
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import { useAuth } from '../context/AuthProvider';
import api from '../api';

const createArray = (length) => [...Array(length)];

export default function HeartRating({ totalHearts = 5, characterId }) {
    const [selectedHearts, setSelectedHearts] = useState(0);
    const alert = useAlert();
    const [error, setError] = useState('');
    const { isAuthorized } = useAuth();

    useEffect(() => {
        async function fetchRating() {
            try {
                const res = await api.get(`/api/characters/ratings/${characterId}/`);
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('HTTP Error fetching rating');
                }
                setSelectedHearts(res.data.rating);
            } catch (error) {
                setError(error);
            }
        }

        fetchRating();
    }, [characterId])

    async function postRating(newRating) {
        // Show error and return early if not authorized
        if (!isAuthorized) {
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCircleXmark className='mr-1'/>You must be logged in to rate characters.</div>);
            return;
        }
        
        try {
            const res = await api.post(`/api/characters/ratings/${characterId}/`, {
                rating: newRating
            });
            if (res.status < 200 || res.status >= 300) {
                throw new Error('HTTP Error updating rating');
            }

            // Update state after successful post
            setSelectedHearts(newRating);
            alert.success(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCheckCircle className='mr-1'/>Rating successfully updated.</div>);
        } catch (error) {
            setError(error);
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCircleXmark className='mr-1'/>Oops! Something went wrong.</div>);
        }
    };

    return (
        <div className='flex'>
            {createArray(totalHearts).map((n, i) => (
                <Heart 
                    key={i}
                    selected={selectedHearts > i}
                    onSelect={() => postRating(i+1)}
                />
            ))}
        </div>
    );
}