import { useState, useEffect } from 'react';
import { PiCardsBold } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa6';
import StarRating from './StarRating';
import { useAlert } from 'react-alert'
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import { useAuth } from '../context/AuthProvider';
import api from '../api';

function EpisodeCard({ episode, removeEpisode }) {
    const [avgRating, setAvgRating] = useState(null);
    const [isCollected, setIsCollected] = useState(null);
    const [error, setError] = useState('');
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const alert = useAlert();
    const { isAuthorized } = useAuth();

    const toggleToolTip = () => setIsTooltipVisible(!isTooltipVisible);

    useEffect(() => {
        fetchEpisodeData();
    }, [episode]);

    async function fetchEpisodeData() {
        try {
            const ratingRes = await api.get(`/api/average_rating/episode/${episode.id}/`);
            if (ratingRes.status < 200 || ratingRes.status >= 300) {
                throw new Error('HTTP Error fetching rating');
            }
            setAvgRating(ratingRes.data.average_rating);
    
            const collectedRes = await api.get(`/api/episodes/ratings/${episode.id}/`);
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
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCircleXmark className='mr-1'/>You must be logged in to collect episodes.</div>);
            return;
        }

        try { 
            const res = await api.post(`/api/episodes/ratings/${episode.id}/`, {
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
        if (removeEpisode) {
            removeEpisode(episode.id);
        }
        postCollected();
    }
    
    return (
        <div className='card-container bg-white dark:bg-lighter rounded-md my-2 flex flex-col justify-between w-120'>
            <div className='w-full flex flex-col relative'>
                <div>
                    <img src={`/images/ep_${episode.id}.webp`} alt={`Episode ${episode.id}`} className='rounded-md'/>
                </div>
                <div className='flex justify-between'>
                    <div className='m-1'>
                        <div className='flex items-center ml-1'>
                            <StarRating episodeId={episode.id} />
                            <p className='text-gray-700 dark:text-zinc-400 ml-2 text-base'>{avgRating}</p>
                        </div>
                        <h1 className='pt-1 ml-1 text-gray-700 dark:text-zinc-200 text-xl font-bold'>
                        {`${episode.episode}: `}
                        <span className="dark:text-zinc-400">{`"${episode.name}"`}</span>
                        </h1>
                    </div>
                    {isCollected ? 
                        <div>
                            <FaPlus onClick={handleRemove} onMouseEnter={toggleToolTip} onMouseLeave={toggleToolTip} className='rotate-45 mt-2 mr-2 text-base text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:text-gray-500'/>
                            <div className={`absolute ${isTooltipVisible ? 'block' : 'hidden'} top-60 right-1 p-1 px-2 rounded-md text-sm font-semibold bg-white dark:bg-lighter dark:text-zinc-200 text-gray-700`}>
                            Remove from <PiCardsBold className='inline-block'/></div>
                        </div> :
                        <div>
                            <FaPlus onClick={handleRemove} onMouseEnter={toggleToolTip} onMouseLeave={toggleToolTip} className='mt-2 mr-2 text-base text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:text-gray-500'/>
                            <div className={`absolute ${isTooltipVisible ? 'block' : 'hidden'} top-60 right-1 p-1 px-2 rounded-md text-sm font-semibold bg-white dark:bg-lighter dark:text-zinc-200 text-gray-700`}>
                            Add to <PiCardsBold className='inline-block'/></div>
                        </div> 
                    }
                </div>
            </div>
                <div className='mx-2 mb-2'>
                    <span className='font-bold text-gray-700 dark:text-zinc-400 text-base'>Aired on: </span>
                    <span className='text-gray-700 dark:text-zinc-100 text-base'>{episode.air_date}</span>
                </div>
            </div>
    );
};

export default EpisodeCard;