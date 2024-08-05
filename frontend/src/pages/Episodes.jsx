import { useState, useEffect } from 'react';
import EpisodeCard from '../components/EpisodeCard';

function Episodes({ season }) {
    const [episodes, setEpisodes] = useState([]);
    const [filteredEpisodes, setFilteredEpisodes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllEpisodes();
    }, []);

    useEffect(() => {
        if (episodes.length > 0) {
            setFilteredEpisodes(filterEpisodesBySeason(episodes, season));
        }
    }, [episodes, season])
    
    function filterEpisodesBySeason(episodes, season) {
        if (!season) return episodes;

        const seasonRanges = {
            1: [1, 11],
            2: [12, 21],
            3: [22, 31],
            4: [32, 41],
            5: [42, 51]
        };

        const [start, end] = seasonRanges[season];
        return episodes.filter(episode => (episode.id >= start && episode.id <= end));
    };

    async function fetchPage(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('HTTP Error fetching page');
            }
            const data = await res.json();
            return data.results;
        } catch (error) {
            console.error(`HTTP Error '${error.message}' when fetching page`);
            return null;
        }
    }

    async function fetchAllEpisodes() {
        let allEpisodes = [];
        // Fetch 3 pages of episodes
        for (let i = 1; i < 4; i++) {
            try {
                const url = `https://rickandmortyapi.com/api/episode/?page=${i}`;
                const data = await fetchPage(url);
                if (data) {
                    allEpisodes = [...allEpisodes, ...data];
                } else {
                    throw new Error(`Failed to fetch episodes from page ${i}`);
                }
                setEpisodes(allEpisodes);
            } catch (error) {
                setError(error.message);
            }
        }
    }

    return (
        <div className='grid grid-cols-1 lg-0:grid-cols-2 xl-1:grid-cols-3 gap-x-8 gap-y-2 justify-items-center m-4'>
            {filteredEpisodes.map(episode => (
                <EpisodeCard key={episode.id} episode={episode}></EpisodeCard>
            ))}
        </div>
    )
}

export default Episodes;