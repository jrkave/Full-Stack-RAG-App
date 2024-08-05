import { useEffect, useState } from 'react';

function useFetch(baseUrl) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nextPage, setNextPage] = useState(baseUrl);

    async function fetchPage(nextPage) {
        if (!nextPage) return;

        setLoading(true);
        try { 
            const res = await fetch(nextPage);
            if (!res.ok) {
                throw new Error('HTTP Error fetching page');
            }
            const data = await res.json();
            return data;
        } catch (error) {
            setError(`HTTP Error '${error.message}' when fetching page`);
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function loadMoreData() {
        const data = await fetchPage(nextPage);
        if (data) {
            const newData = data.results;
            setData((prevData) => [ ...prevData, ...newData]);
            setNextPage(data.info.next);
        }
    }

    useEffect(() => {
        async function initialFetch() {
            const data = await fetchPage(baseUrl);
            if (data) {
                setData(data.results);
                setNextPage(data.info.next);
            }
        };

        initialFetch();
    }, []);

    return { data, setData, loading, error, fetchPage, fetchMore: loadMoreData, hasMore: !!nextPage }
}

export default useFetch;