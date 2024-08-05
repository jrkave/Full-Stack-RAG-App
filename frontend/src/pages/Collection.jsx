import { useState, useEffect } from 'react';
import api from '../api';
import InfiniteScroll from 'react-infinite-scroll-component';
import CharacterCard from '../components/CharacterCard';
import EpisodeCard from '../components/EpisodeCard';

function Collection({ type }) {
    const [collectionIds, setCollectionIds] = useState([]);
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const itemsPerLoad = 20;
    const divStyle = {
        episode: 'grid grid-cols-1 lg-0:grid-cols-2 xl-1:grid-cols-3 gap-x-8 gap-y-2 justify-items-start m-4',
        character: 'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 mt-2 justify-items-center',
    }
    const name = (type === 'characters') ? 'Character' : 'Episode';

    useEffect(() => {
        // Reset state when type changes
        setCollectionIds([]);
        setData([]);
        setHasMore(true);
        setCurrentIndex(0);
        setError('');
        setLoading(true);
        getCollection(type);
    }, [type]);

    // Fetch data when collectionIds changes
    useEffect(() => {
        if (collectionIds.length > 0) {
            fetchMore();
        }
    }, [collectionIds]);

    // Sets state of collectionIds after retrieval
    async function getCollection(type) {
        setLoading(true);
        try {
            // Get collection from database
            const res = await api.get(`/api/collection/${type}/`);
            if (res.status < 200 || res.status >= 300) {
                throw new Error('HTTP Error fetching collection');
            }

            // Extract ids from response data
            const ids = res.data.map(item => {
                if (type === 'characters') {
                    return item.character_id;
                } else if (type === 'episodes') {
                    return item.episode_id;
                }
            });

            // Set state with ids
            setCollectionIds(ids);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Fetches character or episode data from API
    async function fetchItem(type, id) {
        setLoading(true);
        const url = `https://rickandmortyapi.com/api/${type}/${id}`;

        try {
            const res = await fetch(url);
            if (res.status < 200 || res.status >= 300) {
                throw new Error('HTTP Error fetching item for collection');
            }
            const data = await res.json();

            // Fetch first episode appearance for character object
            if (type === 'character') {
                let episodeName = 'Unknown';

                // Fetch name of first episode that character is seen in
                try {
                    const epRes = await fetch(data.episode[0]);
                    if (epRes.status < 200 || epRes.status >= 300) {
                        throw new Error('HTTP Error fetching episode for character');
                    }
                    const epData = await epRes.json();
                    episodeName = epData.name;
                } catch (error) {
                    setError(error.message);
                    return {
                        id: 0,
                        name: 'Not Found',
                        image: 'https://rickandmortyapi.com/api/character/avatar/19.jpeg',
                        status: 'Unknown',
                        species: 'Error',
                        location: { 
                            name: 'Rickipedia' 
                        },
                        first_appearance: 'Now'
                    };
                }

                // Add episode name to character object
                data['first_appearance'] = episodeName;
            }
            return data;
        } catch (error) {
            setError(error.message);
            return {
                id: 0,
                name: 'Not Found',
                image: 'https://rickandmortyapi.com/api/character/avatar/19.jpeg',
                status: 'Unknown',
                species: 'Error',
                location: { 
                    name: 'Rickipedia' 
                },
                first_appearance: 'Now'
            };
        } finally {
            setLoading(false);
        }
    }

    async function fetchMore() {
        const endIndex = currentIndex + itemsPerLoad;
        const idsToFetch = collectionIds.slice(currentIndex, endIndex);

        if (idsToFetch.length === 0) {
            setHasMore(false);
            return;
        }

        const fetchedData = await Promise.all(idsToFetch.map(id => fetchItem(type.slice(0, -1), id)));
        setData(prevData => [...prevData, ...fetchedData]);
        setCurrentIndex(endIndex);
        setLoading(false);
    };

    function removeFromCollection(id) {
        setData(prevData => {
            const updatedData = prevData.filter(item => item.id !== id);
            return updatedData;
        });        
    }

    return (
        <div className='min-h-screen bg-garage bg-cover bg-fixed'>
            <div className='min-h-screen bg-gray-300 bg-opacity-40 dark:bg-darker dark:bg-opacity-70'>
                <h1 className='text-gray-700 dark:text-zinc-200 text-center text-4xl font-extrabold pt-2 pb-2 font-mono'>{name} Collection</h1>
                {data.length > 0 ? (
                    <InfiniteScroll
                        dataLength={data.length}
                        next={() => fetchMore()}
                        hasMore={hasMore}
                    >
                        <div className={type === 'characters' ? divStyle.character : divStyle.episode}>
                        {data.map(item =>
                            type === 'characters' ? <CharacterCard key={item.id} character={item} removeCharacter={removeFromCollection} /> : 
                            type === 'episodes' ? <EpisodeCard key={item.id} episode={item} removeEpisode={removeFromCollection}/> : 
                            null
                        )}
                        </div>
                    </InfiniteScroll>
                ): (
                    <div className='text-gray-700 dark:text-zinc-200 text-center text-3xl font-bold pt-52 pb-2 font-mono'>Collect a card to get started!</div>
                )}
            </div>
        </div>
    );
}

export default Collection;