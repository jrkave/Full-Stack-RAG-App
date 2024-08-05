import { useState, useEffect } from 'react';
import { FaHeart, FaStar, FaPerson, FaPencil } from 'react-icons/fa6';
import InlineEdit from '../components/InlineEdit';
import { useAlert } from 'react-alert'
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import Modal from 'react-modal';
import api from '../api';

Modal.setAppElement(document.getElementById('root'));

function Profile() {
    const [profile, setProfile] = useState({
        avatar_url: '/images/default_avatar.jpeg',
        avatar_name: 'None',
        first_name: '',
        last_name: '',
        username: '',
        cards_collected: 0,
        average_episode_rating: 0.0,
        average_character_rating: 0.0,
    });
    const [isHorizontalCard, setIsHorizontalCard] = useState(window.innerWidth >= 840);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const alert = useAlert();

    const toggleModal = () => setModalIsOpen(!modalIsOpen);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'transparent',
            border: '0',
            overflowY: 'scroll',
            maxHeight: '40rem'
        },
    };

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            try { 
                const res = await api.get('/api/profile/');
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('HTTP Error fetching profile');
                }
                setProfile(res.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        getProfile();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsHorizontalCard(window.innerWidth >= 840);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    async function postAvatar(url, name) {
        try {
            // Post new avatar 
            const res = await api.post('/api/profile/', {
                avatar_url: url,
                avatar_name: name
            });

            if (res.status < 200 || res.status >= 300) {
                throw new Error('HTTP Error updating avatar');
            }

            // Update profile state
            setProfile(prevProfile => ({
                ...prevProfile,
                avatar_url: url,
                avatar_name: name
            }));
            alert.success(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCheckCircle className='mr-1'/>Avatar updated successfully.</div>);
        } catch (error) {
            setError(error);
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCheckCircle className='mr-1'/>Oops! Something went wrong.</div>);
        }
    }

    async function postName(name, type) {
        try {
            if (type === 'first') {
                const res = await api.post('api/profile/', {
                    first_name: name
                });

                if (res.status < 200 || res.status >= 300) {
                    throw new Error('HTTP Error updating first name');
                }

                setProfile(prevProfile => ({
                    ...prevProfile,
                    first_name: name,
                }));
                alert.success(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCheckCircle className='mr-1'/>Profile successfully updated.</div>);
            }

            if (type === 'last') {
                const res = await api.post('api/profile/', {
                    last_name: name
                });

                if (res.status < 200 || res.status >= 300) {
                    throw new Error('HTTP Error updating first name');
                }

                setProfile(prevProfile => ({
                    ...prevProfile,
                    last_name: name,
                }));
                alert.success(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCheckCircle className='mr-1'/>Profile successfully updated.</div>);
            }
        } catch (error) {
            setError(error.message);
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCheckCircle className='mr-1'/>Oops! Something went wrong.</div>);
        }
    }

    return (
        <div className='min-h-screen bg-livingroom bg-cover bg-fixed'>
            <Modal 
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                contentLabel='Set Your Avatar'
                style={customStyles}
            >
                <div className='flex flex-col items-center bg-white dark:bg-lighter rounded-xl dark:text-zinc-200 text-gray-700 font-semibold p-4 border-2 dark:border-darker'>
                    <h2 className='mb-4'>Select An Avatar</h2>
                    <div>
                        <p onClick={() => postAvatar('/images/default_avatar.jpeg', 'None')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='/images/default_avatar.jpeg' alt='Default Avatar (no characters)'/>None</p>
                        <p onClick={() => postAvatar('https:rickandmortyapi.com/api/character/avatar/1.jpeg', 'Rick Sanchez')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='https:rickandmortyapi.com/api/character/avatar/1.jpeg' alt='Rick Sanchez'/>Rick Sanchez</p>
                        <p onClick={() => postAvatar('https:rickandmortyapi.com/api/character/avatar/2.jpeg', 'Morty Smith')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='https:rickandmortyapi.com/api/character/avatar/2.jpeg' alt='Morty Smith'/>Morty Smith</p>
                        <p onClick={() => postAvatar('https:rickandmortyapi.com/api/character/avatar/3.jpeg', 'Summer Smith')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='https:rickandmortyapi.com/api/character/avatar/3.jpeg' alt='Summer Smith'/>Summer Smith</p>
                        <p onClick={() => postAvatar('https:rickandmortyapi.com/api/character/avatar/4.jpeg', 'Beth Smith')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='https:rickandmortyapi.com/api/character/avatar/4.jpeg' alt='Beth Smith'/>Beth Smith</p>
                        <p onClick={() => postAvatar('https:rickandmortyapi.com/api/character/avatar/5.jpeg', 'Jerry Smith')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='https:rickandmortyapi.com/api/character/avatar/5.jpeg' alt='Jerry Smith'/>Jerry Smith</p>
                        <p onClick={() => postAvatar('https:rickandmortyapi.com/api/character/avatar/118.jpeg', 'Evil Morty')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='https:rickandmortyapi.com/api/character/avatar/118.jpeg' alt='Evil Morty'/>Evil Morty</p>
                        <p onClick={() => postAvatar('https:rickandmortyapi.com/api/character/avatar/380.jpeg', 'Rick Prime')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='https:rickandmortyapi.com/api/character/avatar/380.jpeg' alt='Rick Prime'/>Rick Prime</p>
                        <p onClick={() => postAvatar('https:rickandmortyapi.com/api/character/avatar/347.jpeg', 'President Curtis')} className='p-1 rounded-xl border-2 border-transparent hover:border-2 hover:border-blue-500'><img className='inline mr-4 h-12 w-12 rounded-2xl' src='https:rickandmortyapi.com/api/character/avatar/347.jpeg' alt='President Curtis'/>President Curtis</p>
                    </div>
                </div>
                </Modal>
            { isHorizontalCard ? (
                <div className='min-h-screen min-w-screen bg-gray-300 bg-opacity-50 dark:bg-darker dark:bg-opacity-70 flex justify-center'>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-gray-700 dark:text-zinc-200 text-center text-4xl font-extrabold pt-2 pb-2 font-mono'>Profile Card</h1>
                        <div className='bg-white w-200 rounded-xl dark:bg-lighter shadow-2xl shadow-gray-600 dark:shadow-black mb-16'>
                            <div className='flex p-20'>
                                <div className='relative'>
                                    <img className='max-h-80 max-w-80 rounded-2xl' src={profile.avatar_url}/>
                                    <FaPencil type='button' onClick={toggleModal} className='absolute bottom-6 right-2 text-2xl bg-zinc-100 rounded-md p-1 text-gray-600 hover:text-blue-500'/>
                                </div>
                                <div className='flex flex-col mx-10 rounded-xl'>
                                    <p className='mb-5 text-3xl font-bold text-gray-700 dark:text-zinc-200'>{profile.username}</p>
                                    <p className='mb-5 font-semibold text-gray-700 dark:text-zinc-400'>First Name: <InlineEdit value={profile.first_name} setValue={(newValue) => postName(newValue, 'first')}/></p>
                                    <p className='mb-5 font-semibold text-gray-700 dark:text-zinc-400'>Last Name: <InlineEdit value={profile.last_name} setValue={(newValue) => postName(newValue, 'last')}/></p>
                                    <p className='mb-5 font-semibold text-gray-700 dark:text-zinc-400'>Cards Collected: <span className='text-gray-700 dark:text-zinc-200 font-normal'>{profile.cards_collected}</span></p>
                                    <p className='mb-5 font-semibold text-gray-700 dark:text-zinc-400'><FaStar className='inline-block mb-1 text-amber-400'/> Average Episode Rating: <span className='text-gray-700 dark:text-zinc-200 font-normal'>{profile.average_episode_rating}</span></p>
                                    <p className='mb-5 font-semibold text-gray-700 dark:text-zinc-400'><FaHeart className='inline-block mb-1 text-red-400' /> Average Character Rating: <span className='text-gray-700 dark:text-zinc-200 font-normal'>{profile.average_character_rating}</span></p>
                                    <p className='font-semibold text-gray-700 dark:text-zinc-400'><FaPerson className='inline-block mb-1 text-blue-500 dark:text-blue-400'/> Avatar: <span className='text-gray-700 dark:text-zinc-200 font-normal'>{profile.avatar_name}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                ) : ( 
                <div className='min-h-screen min-w-screen bg-gray-300 bg-opacity-70 dark:bg-darker dark:bg-opacity-70 flex justify-center'>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-gray-700 dark:text-zinc-200 text-center text-4xl font-extrabold pt-2 pb-2 font-mono mt-10'>Profile Card</h1>
                        <div className='bg-white w-100 mb-20 rounded-xl dark:bg-lighter shadow-2xl shadow-gray-600 dark:shadow-black'>
                            <div className='flex flex-col py-10'>
                                <div className='relative self-center'>
                                    <img className='max-h-80 max-w-80 rounded-2xl' src={profile.avatar_url}/>
                                    <FaPencil type='button' onClick={toggleModal} className='absolute bottom-2 right-2 text-2xl bg-zinc-100 rounded-md p-1 text-gray-600 hover:text-blue-500'/>
                                </div>
                                <div className='flex flex-col mx-10 rounded-xl pt-1 pl-2'>
                                    <p className='mb-2 text-3xl font-bold text-gray-700 dark:text-zinc-200'>{profile.username}</p>
                                    <p className='mb-3 font-semibold text-gray-700 dark:text-zinc-400'>First Name: <InlineEdit value={profile.first_name} setValue={(newValue) => postName(newValue, 'first')}/></p>
                                    <p className='mb-3 font-semibold text-gray-700 dark:text-zinc-400'>Last Name: <InlineEdit value={profile.last_name} setValue={(newValue) => postName(newValue, 'last')}/></p>
                                    <p className='mb-3 font-semibold text-gray-700 dark:text-zinc-400'>Cards Collected: <span className='text-gray-700 dark:text-zinc-200 font-normal'>{profile.cards_collected}</span></p>
                                    <p className='mb-3 font-semibold text-gray-700 dark:text-zinc-400'><FaStar className='inline-block mb-1 text-amber-400'/> Average Episode Rating: <span className='text-gray-700 dark:text-zinc-200 font-normal'>{profile.average_episode_rating}</span></p>
                                    <p className='mb-3 font-semibold text-gray-700 dark:text-zinc-400'><FaHeart className='inline-block mb-1 text-red-400' /> Average Character Rating: <span className='text-gray-700 dark:text-zinc-200 font-normal'>{profile.average_character_rating}</span></p>
                                    <p className='font-semibold text-gray-700 dark:text-zinc-400'><FaPerson className='inline-block mb-1 text-blue-500 dark:text-blue-400'/> Avatar: <span className='text-gray-700 dark:text-zinc-200 font-normal'>{profile.avatar_name}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
                )
            }
        </div>
    );
}

export default Profile;