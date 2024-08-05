import { useState, useEffect } from 'react';
import CharacterCard from '../components/CharacterCard';
import SearchBar from '../components/SearchBar';
import useFetch from '../hooks/useFetch';
import InfiniteScroll from 'react-infinite-scroll-component';

function Characters () {
    const baseUrl = 'https://rickandmortyapi.com/api/character/?page=1';
    const { data: characters, loading, error, fetchMore, hasMore } = useFetch(baseUrl); 
    const [updatedCharacters, setUpdatedCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [fetchError, setFetchError] = useState('');
    const [fetchLoading, setFetchLoading] = useState(false);

    async function fetchFirstAppearance(character) {
        setFetchLoading(true);
        try {
            const res = await fetch(character.episode[0]);
            if (!res.ok) {
                setFetchError("HTTP Error fetching characters's first appearance");
                return character;
            }
            const data = await res.json();
            const episodeName = data.name;
            return { ...character, first_appearance: episodeName };
        } catch (error) {
            setFetchError(`HTTP Error fetching character's first episode appearance`);
            return character;
        } finally {
            setFetchLoading(false);
        }
    }

    useEffect(() => {
        async function updateCharacters() {
            const modifiedCharacters = await Promise.all(characters.map(fetchFirstAppearance));
            setUpdatedCharacters(modifiedCharacters);
        }

        if (characters.length > 0) {
            updateCharacters();
        }
    }, [characters]);

    function filterCharacters(query) {
        if (!query) {
            return updatedCharacters;
        }
        const lowercaseQuery = query.toLowerCase();
        return updatedCharacters.filter(character => character.name.toLowerCase().includes(lowercaseQuery));
    }

    function handleSearch(query) {
        setSearchQuery(query);
        setFilteredCharacters(filterCharacters(query));
    }

    useEffect(() => {
        setFilteredCharacters(filterCharacters(searchQuery));
    }, [updatedCharacters, searchQuery]);
    
    return (
        <div className='min-h-screen my-4 mx-4'>
           <div className='sticky mb-1 top-2 w-full z-10'>
                <SearchBar onSearch={handleSearch} />
            </div>
            <InfiniteScroll
                dataLength={filteredCharacters.length} 
                next={fetchMore}
                hasMore={hasMore} 
            >
                <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 mt-4 justify-items-center'>
                    {filteredCharacters.map(character => (
                        <CharacterCard key={character.id} character={character} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default Characters;