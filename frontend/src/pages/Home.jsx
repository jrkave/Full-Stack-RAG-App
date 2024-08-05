import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import EpisodeCard from '../components/EpisodeCard';
import CharacterCard from '../components/CharacterCard';
import { Carousel } from 'react-responsive-3d-carousel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function Home() {
    const { data: episodes, loading: epLoading, error: epError, fetchMore: epFetchMore, hasMore: epHasMore } = useFetch('https://rickandmortyapi.com/api/episode/?page=1');
    const [isLgScreen, setIsLgScreen] = useState(window.innerWidth >= 1100);
    const selectedEpisodes = episodes.slice(0, 5);
    const navigate = useNavigate();
    const { isAuthorized } = useAuth();

    function handleRedirect(method) {
        if (method === 'login') {
            navigate('/login');
        } else if (method === 'register') {
            navigate('/register');
        } else if (method === 'characters') {
            navigate('/characters');
        } else if (method === 'episodes') {
            navigate('/episodes/all');
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsLgScreen(window.innerWidth >= 1100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    const firstCharacter = {
        'id': '1',
        'name': 'Rick Sanchez',
        'image': 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        'species': 'Human',
        'status': 'Alive',
        'type': '',
        'gender': 'Male',
        'location': {
            'name': 'Citadel of Ricks',
            'url': 'https://rickandmortyapi.com/api/location/3',
        },
        'first_appearance': 'Pilot',
    }

    const secondCharacter = {
        'id': '2',
        'name': 'Morty Smith',
        'image': 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
        'species': 'Human',
        'status': 'Alive',
        'type': '',
        'gender': 'Male',
        'location': {
            'name': 'Citadel of Ricks',
            'url': 'https://rickandmortyapi.com/api/location/3',
        },
        'first_appearance': 'Pilot',
    }

    const thirdCharacter = {
        'id': '239',
        'name': 'Mr. Goldenfold',
        'image': 'https://rickandmortyapi.com/api/character/avatar/239.jpeg',
        'species': 'Cronenberg',
        'status': 'Alive',
        'type': '',
        'gender': 'Male',
        'location': {
            'name': 'Earth (C-137)',
            'url': 'https://rickandmortyapi.com/api/location/1',
        },
        'first_appearance': 'Pilot',
    }

    const fourthCharacter = {
        'id': '180',
        'name': 'Jessica',
        'image': 'https://rickandmortyapi.com/api/character/avatar/180.jpeg',
        'species': 'Human',
        'status': 'Alive',
        'type': 'Time God',
        'gender': 'Female',
        'location': {
            'name': 'Earth (Replacement Dimension)',
            'url': 'https://rickandmortyapi.com/api/location/20',
        },
        'first_appearance': 'Ricksy Business'
    }

    return  (
        <div className='h-screen text-zinc-100 xs:mt-0 sm:mt-10'>
            {isLgScreen ? (
                <div className='flex relative lg:mb-42 xl:mb-52'>
                    <div className='m-20 w-100 xl:w-160 mt-36'>
                        <div className='text-4xl font-bold'>Portal into Rick and Morty's Dimension with <span className='text-green-500'>Rickipedia</span></div>
                        <div className='text-lg mt-3 mr-6'>
                            Build your own Rick and Morty card collection, rate characters and episodes, and use our interactive
                            chatbot to ask questions about the show and chat with select characters.
                        </div>
                        {isAuthorized ? (
                            <>
                                <button type='button' onClick={() => handleRedirect('characters')} className='p-3 mt-6 font-bold rounded-3xl bg-green-700 hover:opacity-90 text-zinc-100 mr-3 w-32'>Characters</button>
                                <button type='button' onClick={() => handleRedirect('episodes')} className='p-3 mt-6 font-bold rounded-3xl bg-green-700 hover:opacity-90 text-zinc-100 w-32'>Episodes</button>
                            </>
                        ) : (
                            <>
                                <button type='button' onClick={() => handleRedirect('register')} className='p-3 mt-6 font-bold rounded-3xl bg-green-700 hover:opacity-90 text-zinc-100 mr-3 w-24'>Register</button>
                                <button type='button' onClick={() => handleRedirect('login')} className='p-3 mt-6 font-bold rounded-3xl bg-green-700 hover:opacity-90 text-zinc-100 w-24'>Login</button>
                            </>
                        )}
                    </div>
                    <div>
                        <div className='z-30 absolute top-16 right-72 shadow-black shadow-2xl rounded-xl'><CharacterCard key={firstCharacter.id} character={firstCharacter}/></div>
                        <div className='z-20 absolute top-16 right-60 mt-2 shadow-black shadow-2xl rounded-xl transition-transform duration-300 transform hover:rotate-12 hover:translate-x-20 hover:translate-y-2'><CharacterCard key={secondCharacter.id} character={secondCharacter}/></div>
                        <div className='z-10 absolute top-16 right-48 mt-4 shadow-black shadow-2xl rounded-xl transition-transform duration-300 transform hover:rotate-12 hover:translate-x-20  hover:translate-y-2'><CharacterCard key={thirdCharacter.id} character={thirdCharacter}/></div>
                        <div className='z-0 absolute top-16 right-36 mt-6 shadow-black shadow-2xl rounded-xl transition-transform duration-300 transform hover:rotate-12 hover:translate-x-20 hover:translate-y-2'><CharacterCard key={fourthCharacter.id} character={fourthCharacter}/></div>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col items-center mb-32'>
                    <div className='m-20 w-140'>
                        <div className='xs:text-3xl sm:text-4xl font-bold ml-4'>Portal into Rick and Morty's Dimension with <span className='text-green-500'>Rickipedia</span></div>
                        <div className='mt-3 mr-5 ml-4'>
                            Build your own Rick and Morty card collection, rate characters and episodes, and use our interactive
                            chatbot to ask questions about the show and chat with select characters.
                        </div>
                        {isAuthorized ? (
                            <>
                                <button type='button' onClick={() => handleRedirect('characters')}  className='xs:p-2 xs:text-sm sm:text-base sm:p-3 mt-6 ml-4 font-bold rounded-3xl bg-green-700 hover:opacity-90 text-zinc-100 w-32'>Characters</button>
                                <button type='button' onClick={() => handleRedirect('episodes')}  className='xs:p-2 xs:text-sm sm:text-base sm:p-3 mt-6 ml-4 font-bold rounded-3xl bg-green-700 hover:opacity-90 text-zinc-100 w-32'>Episodes</button>
                            </>
                        ) : (
                            <>
                                <button type='button' onClick={() => handleRedirect('register')}  className='xs:p-2 xs:text-sm sm:text-base sm:p-3 mt-6 ml-4 font-bold rounded-3xl bg-green-700 hover:opacity-90 text-zinc-100 w-24' >Register</button>
                                <button type='button' onClick={() => handleRedirect('login')}  className='xs:p-2 xs:text-sm sm:text-base sm:p-3 mt-6 ml-4 font-bold rounded-3xl bg-green-700 hover:opacity-90 text-zinc-100 w-24' >Log In</button>
                            </>
                        )}
                    </div>
                    <div className='flex justify-center gap-5'>
                        <div className='shadow-black shadow-2xl rounded-xl transition-transform duration-300 transform hover:-rotate-12 hover:-translate-x-12 hover:translate-y-2'><CharacterCard key={firstCharacter.id} character={firstCharacter}/></div>
                        <div className='shadow-black shadow-2xl rounded-xl transition-transform duration-300 transform hover:rotate-12 hover:translate-x-12 hover:translate-y-2'><CharacterCard key={secondCharacter.id} character={secondCharacter}/></div>
                    </div>
                </div>
                )
            }
            <div className='bg-zinc-200 dark:bg-darker pb-10 flex flex-col items-center'>
                <Carousel isShadow={false} height='400px'>
                    {selectedEpisodes.map(episode => (
                        <EpisodeCard key={episode.id} episode={episode} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}

export default Home;