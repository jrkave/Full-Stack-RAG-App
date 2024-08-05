import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LiaRobotSolid } from 'react-icons/lia';
import { Switch, FormGroup, FormControlLabel } from '@mui/material';
import { useAlert } from 'react-alert'
import { FaCircleXmark } from 'react-icons/fa6';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthProvider';

Modal.setAppElement(document.getElementById('root'));

function ChatBotLanding() {
    const navigate = useNavigate();
    const { isAuthorized } = useAuth();
    const alert = useAlert();
    const [selectedCharacter, setSelectedCharacter] = useState({
        'character': '',
        'image': '',
    });
    const images = {
        'Rick Sanchez': 'https:rickandmortyapi.com/api/character/avatar/1.jpeg',
        'Morty Smith': 'https:rickandmortyapi.com/api/character/avatar/2.jpeg',
        'Summer Smith': 'https:rickandmortyapi.com/api/character/avatar/3.jpeg',
        'Beth Smith': 'https:rickandmortyapi.com/api/character/avatar/4.jpeg',
        'Jerry Smith': 'https:rickandmortyapi.com/api/character/avatar/5.jpeg',
    }

    function handleSwitchChange(character) {
        return function(event) {
            if (event.target.checked) {
                setSelectedCharacter({
                    character: character,
                    image: images[character]
                });
            } else {
                setSelectedCharacter({});
            }
        };
    }

    function handleRedirect() {
        if (!isAuthorized) {
            alert.error(
                <div className='flex items-center' style={{ textTransform: 'initial' }}>
                    <FaCircleXmark className='mr-1' />You must be logged in to use the chat.
                </div>
            );
            return;
        }
        navigate('/chat/start', { state: { selectedCharacter } });
    }

    return (
        <div className='min-h-screen bg-garage-side bg-cover bg-fixed'>
            <div className='min-h-screen bg-gray-300 bg-opacity-20 dark:bg-darker dark:bg-opacity-50 flex justify-center'>
                <div className='bg-white dark:bg-lighter rounded-xl text-white flex flex-col items-center my-10 px-20 max-w-120 sm:max-w-150'>
                <LiaRobotSolid className='text-4xl text-green-600 dark:text-green-500 mt-12 mb-2'/>
                    <h1 className='text-gray-700 dark:text-zinc-200 text-3xl font-extrabold mb-5 inline'>RickBot</h1>
                    <p className='text-gray-700 dark:text-zinc-200 text-sm mb-4 max-w-80'><span className='font-semibold text-indigo-500 dark:text-indigo-300'>Optional: </span>Toggle a character to speak with them! If no selection is made, no character will be selected.</p>
                    <FormGroup className='mb-5 border-2 dark:border-lightest rounded-xl text-gray-700 dark:text-zinc-200 bg-gray-100 dark:bg-darker'>
                        <p className='border-b-2 dark:border-lightest rounded-xl dark:bg-darker'><img src={images['Rick Sanchez']} className='h-14 w-14 rounded-xl m-2 mr-4 inline'/><FormControlLabel labelPlacement='start' control={<Switch className='mr-4' checked={selectedCharacter.character === 'Rick Sanchez'} onChange={handleSwitchChange('Rick Sanchez')} disabled={selectedCharacter.character && selectedCharacter.character !== 'Rick Sanchez'}/>} label={<span className='block w-36'>Rick Sanchez</span>}/></p>
                        <p className='border-b-2 dark:border-lightest rounded-xl dark:bg-darker'><img src={images['Morty Smith']} className='h-14 w-14 rounded-xl m-2 mr-4 inline'/><FormControlLabel labelPlacement='start' control={<Switch className='mr-4' checked={selectedCharacter.character === 'Morty Smith'} onChange={handleSwitchChange('Morty Smith')} disabled={selectedCharacter.character && selectedCharacter.character !== 'Morty Smith'}/>} label={<span className='block w-36'>Morty Smith</span>}/></p>
                        <p className='border-b-2 dark:border-lightest rounded-xl dark:bg-darker'><img src={images['Summer Smith']} className='h-14 w-14 rounded-xl m-2 mr-4 inline'/><FormControlLabel labelPlacement='start' control={<Switch className='mr-4' checked={selectedCharacter.character === 'Summer Smith'} onChange={handleSwitchChange('Summer Smith')} disabled={selectedCharacter.character && selectedCharacter.character !== 'Summer Smith'}/>} label={<span className='block w-36'>Summer Smith</span>}/></p>
                        <p className='border-b-2 dark:border-lightest rounded-xl dark:bg-darker'><img src={images['Beth Smith']} className='h-14 w-14 rounded-xl m-2 mr-4 inline'/><FormControlLabel labelPlacement='start' control={<Switch className='mr-4' checked={selectedCharacter.character === 'Beth Smith'} onChange={handleSwitchChange('Beth Smith')} disabled={selectedCharacter.character && selectedCharacter.character !== 'Beth Smith'}/>} label={<span className='block w-36'>Beth Smith</span>}/></p>
                        <p className='rounded-xl dark:bg-darker'><img src={images['Jerry Smith']} className='h-14 w-14 rounded-xl m-2 mr-4 inline'/><FormControlLabel labelPlacement='start' control={<Switch className='mr-4' checked={selectedCharacter.character === 'Jerry Smith'} onChange={handleSwitchChange('Jerry Smith')} disabled={selectedCharacter.character && selectedCharacter.character !== 'Jerry Smith'} />} label={<span className='block w-36'>Jerry Smith</span>}/></p>
                    </FormGroup>
                    <button onClick={handleRedirect} type='button' className='h-10 bg-green-600 hover:bg-opacity-80 px-4 font-bold rounded-3xl text-zinc-100'>
                        Start Chat
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatBotLanding;