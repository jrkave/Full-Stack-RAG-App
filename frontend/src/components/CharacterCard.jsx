import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { PiCardsBold } from 'react-icons/pi';
import HeartRating from './HeartRating';
import CircleStatus from './CircleStatus';
import api from '../api';
import { useAlert } from 'react-alert'
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import { useAuth } from '../context/AuthProvider';

function capitalizeFirstLetter(string='') {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function CharacterCard({ character={}, removeCharacter }) {
    const [avgRating, setAvgRating] = useState(null);
    const [isCollected, setIsCollected] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [error, setError] = useState('');
    const alert = useAlert();
    const { isAuthorized } = useAuth();

    const toggleToolTip = () => { setIsTooltipVisible(!isTooltipVisible) };

    useEffect(() => {
        fetchCharacterData();
    }, [character]);

    async function fetchCharacterData() {
        try {
            const ratingRes = await api.get(`/api/average_rating/character/${character.id}/`);
            if (ratingRes.status < 200 || ratingRes.status >= 300) {
                throw new Error('HTTP Error fetching rating');
            }
            setAvgRating(ratingRes.data.average_rating);
    
            const collectedRes = await api.get(`/api/characters/ratings/${character.id}/`);
            if (collectedRes.status < 200 || collectedRes.status >= 300) {
                throw new Error('HTTP Error fetching collected');
            }
            setIsCollected(collectedRes.data.is_collected);
        } catch (error) {
            setError(error);
        }
    }

    async function postCollected() {
        // Show error and return early if not authorized
        if (!isAuthorized) {
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCircleXmark className='mr-1'/>You must be logged in to collect characters.</div>);
            return;
        }

        try { 
            const payload = {
                is_collected: !isCollected
            };

            const res = await api.post(`/api/characters/ratings/${character.id}/`, {
                is_collected: !isCollected
            });

            if (res.status < 200 || res.status >= 300) {
                throw new Error('HTTP Error updating card collection');
            }
            setIsCollected(!isCollected);
            alert.success(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCheckCircle className='mr-1'/>Collection successfully updated.</div>);
        } catch (error) {
            setError(error);
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCircleXmark className='mr-1'/>Oops! Something went wrong.</div>);
        }
    }

    function handleRemove() {
        if (removeCharacter) {
            removeCharacter(character.id);
        }
        postCollected();
    }

    return (
        <div className='card-container w-64 bg-white dark:bg-lighter rounded-xl overflow-hidden relative'>
            <div className='w-full flex flex-col'>
                <div>
                    <img src={character.image} className='mb-1 w-full h-full object-cover' alt='Character' />
                </div>
                <div className='flex justify-between'>
                    <div className='ml-2'>
                        <div className='flex items-center'>
                            <HeartRating characterId={character.id} />
                            <p className='text-base text-gray-700 dark:text-zinc-400 ml-2'>{avgRating}</p>
                        </div>
                        <h1 className='text-gray-700 dark:text-zinc-200 text-2xl font-bold'>{character.name}</h1>
                        <p className='text-gray-700 dark:text-zinc-400 text-sm'><CircleStatus status={character.status} />{capitalizeFirstLetter(character.status)} - {capitalizeFirstLetter(character.species)}</p>
                    </div>
                    {isCollected ? 
                        <div>
                            <FaPlus onClick={handleRemove} onMouseEnter={toggleToolTip} onMouseLeave={toggleToolTip} className='rotate-45 mt-0.5 mr-2 fa-md text-base text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:text-gray-500'/>
                            <div className={`absolute ${isTooltipVisible ? 'block' : 'hidden'} top-56 right-1 p-1 px-2 rounded-md text-sm font-semibold bg-white dark:bg-lighter dark:text-zinc-200 text-gray-700`}>
                            Remove from <PiCardsBold className='inline-block'/></div>
                        </div> :
                        <div>
                            <FaPlus onClick={handleRemove} onMouseEnter={toggleToolTip} onMouseLeave={toggleToolTip} className='mt-0.5 mr-2 fa-md text-base text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:text-gray-500'/>
                            <div className={`absolute ${isTooltipVisible ? 'block' : 'hidden'} top-56 right-1 p-1 px-2 rounded-md text-sm font-semibold bg-white dark:bg-lighter dark:text-zinc-200 text-gray-700`}>
                            Add to <PiCardsBold className='inline-block'/></div>
                        </div>
                    }
                </div>
            </div>
            <div className='m-2 flex flex-col justify-between'>
                <div>
                    <p className='text-base text-gray-700 dark:text-zinc-400 font-semibold'>Last Known Location:</p>
                    <p className='text-base text-gray-700 dark:text-zinc-200'>{character?.location?.name}</p>
                </div>
                <div className='mt-4'>
                    <p className='text-base text-gray-700 dark:text-zinc-400 font-semibold'>First Seen In:</p>
                    <p className='text-base text-gray-700 dark:text-zinc-200'>{character.first_appearance}</p>
                </div>
            </div>
        </div>
    );
};

export default CharacterCard;
