import { useState, useEffect } from 'react';
import api from '../api';
import InfiniteScroll from 'react-infinite-scroll-component';
import CharacterCard from '../components/CharacterCard';
import EpisodeCard from '../components/EpisodeCard';

function CardCollection() {
    const [episodes, setEpisodes] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Retrieves collected episodes and characters
    useEffect(() => {
        // Gets collection from DB
        async function getCollection(type) {
            try {
                const res = await api.get(`/api/collection/${type}/`);
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('HTTP Error fetching collection');
                }
                return res.data;
            } catch (error) {
                setError(error);
            }
        }

        // Fetches character or episode data from API
        async function fetchItem(type, id) {
            const url = `https://rickandmortyapi.com/api/${type}/${id}`;

            try {
                const res = await fetch(url);
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('HTTP Error fetching item for collection');
                }
                const data = await res.json();
                return data;
            } catch (error) {
                setError(error);
                return null;
            }
        }

        // Sets state with collected items
        async function setItems(type) {
            setLoading(true);

            try { 
                // Retrieve collected items
                const data = await getCollection(type);
                
                // Create array of ids
                let ids;
                if (type === 'characters') {
                    ids = data.map(item => item.character_id);
                } else if (type === 'episodes') {
                    ids = data.map(item => item.episode_id);
                }

                // Fetch items by id
                const items = [] 
                for (let i = 0; i < ids.length; i++) {
                    const item = await fetchItem(type.slice(0, -1), ids[i]);
                    if (item) {
                        items.push(item);
                    }
                }

                // Set state
                if (type === 'characters') {
                    setCharacters(items);
                } else if (type === 'episodes') {
                    setEpisodes(items);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        setItems('characters');
        setItems('episodes');
    }, []);

    // Modifies characters by adding first_appearance property
    useEffect(() => {
        async function fetchFirstAppearance(character) {
            try {
                const res = await fetch(character.episode[0]);
                if (!res.ok) {
                    throw new Error('HTTP Error fetching episode appearance');
                }
                const data = await res.json();
                const episodeName = data.name;
                return { ...character, first_appearance: episodeName };
            } catch (error) {
                setError(error);
                return character;
            }
        }

        // Updates characters with first appearance
        async function updateCharacters() {
            setLoading(true);
            try {
                const modifiedCharacters = await Promise.all(characters.map(fetchFirstAppearance));
                setCharacters(modifiedCharacters);
            } catch (error) {
                console.log('Error updating characters with first appearance: ', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        if (characters.length > 0) {
            updateCharacters();
        }
    }, [characters]);

    function removeCharacter(characterId) {
        setCharacters(prevCharacters => {
            const updatedCharacters = prevCharacters.filter(character => character.id !== characterId);
            return updatedCharacters;
        });        
    }

    function removeEpisode(episodeId) {
        setEpisodes(prevEpisodes => {
            const updatedEpisodes = prevEpisodes.filter(episode => episode.id !== episodeId);
            return updatedEpisodes;
        })
    }

    return (
        <div className='min-h-screen bg-garage bg-cover bg-fixed'>
            <div className='min-h-screen bg-gray-300 bg-opacity-40 dark:bg-darker dark:bg-opacity-70'>
                {characters.length > 0 || episodes.length > 0 ? 
                (
                <>
                <div className='text-gray-700 dark:text-zinc-200 text-center text-4xl font-extrabold pt-2 pb-2 font-mono'>Card Collection</div>
                <div className='pt-2'>
                    <h1 className='text-gray-700 dark:text-zinc-200 text-3xl font-bold ml-6 font-mono'>Characters</h1>
                    <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 mt-2 justify-items-center'>
                        {characters.map(character => (
                            <CharacterCard key={character.id} character={character} removeCharacter={removeCharacter}/>
                        ))}
                    </div>
                </div>
                <div className='pt-2 pb-4 mt-10'>
                    <h1 className='text-gray-700 dark:text-zinc-200 text-3xl font-bold ml-6 font-mono'>Episodes</h1>
                    <div className='grid grid-cols-1 lg-0:grid-cols-2 xl-1:grid-cols-3 gap-x-8 gap-y-2 justify-items-start m-4'>
                        {episodes.map(episode => (
                            <EpisodeCard key={episode.id} episode={episode} removeEpisode={removeEpisode} />
                        ))}
                    </div>
                </div>
                </>
                ) : (
                    <div className='text-gray-700 dark:text-zinc-200 text-center text-3xl font-bold pt-52 pb-2 font-mono'>Collect a card to get started!</div>
                )
            }
            </div>
        </div>
    );
}

export default CardCollection;
