import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LiaRobotSolid } from 'react-icons/lia';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { useAlert } from 'react-alert'
import { FaCircleXmark } from 'react-icons/fa6';
import api from '../api';

function Chat() {
    const alert = useAlert();
    const location = useLocation();
    const { selectedCharacter } = location.state;
    const { character, image } = selectedCharacter;
    const isCharacter = Boolean(character);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    async function submitChat(query) {
        try {
            const newMessage = { text: query, sender: 'user'};
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            const res = await api.post('/chatbot/chat/', {
                query: query,
                character: character,
                history: messages,
            });

            if (res.status < 200 || res.status >= 300) {
                throw new Error('HTTP Error when fetching response from server.');
            }

            // Add messages to state 
            const botMessage = { text: res.data.response, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            const errorMessage = {text: 'Failed to get a response from server. Try again later.', sender: 'bot'};
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
            // Show alert pop-up
            alert.error(
                <div className='flex items-center' style={{ textTransform: 'initial' }}>
                    <FaCircleXmark className='mr-1' />Could not connect to server.
                </div>
            )
        }
    }

    return (
        <div className='min-h-screen bg-garage-side bg-cover bg-fixed'>
            <div className='min-h-screen bg-gray-300 bg-opacity-20 dark:bg-darker dark:bg-opacity-50 flex justify-center'>
                <div className='flex flex-col relative bg-white dark:bg-lighter my-6 rounded-2xl w-11/12 max-h-[95vh]'>
                    <div className='flex justify-center mt-2 pb-4 border-b-2 dark:border-b-lightest'>
                        {isCharacter ? (
                            <div className='flex flex-col items-center w-full'>
                                <img src={image} alt='Character Selected' className='h-20 w-20 rounded-full mt-4 mb-1 dark:border-2'/>
                                <p className='font-bold text-xl text-gray-700 dark:text-zinc-200'>{character}</p>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center'>
                                <LiaRobotSolid className='text-5xl text-green-600 dark:text-green-500 mt-4 mb-1'/>
                                <p className='font-bold text-xl text-gray-700 dark:text-zinc-200'>RickBot</p>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col overflow-y-auto mb-20 mt-2' style={{ maxHeight: 'calc(100% - 56px)' }}>
                        {messages.map((message, index) => (
                            <div className='w-full'><ChatMessage key={index} message={message} /></div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className='absolute w-full bottom-5'><ChatInput onSubmit={submitChat}/></div>
                </div>
            </div>
        </div> 
    );
}

export default Chat;