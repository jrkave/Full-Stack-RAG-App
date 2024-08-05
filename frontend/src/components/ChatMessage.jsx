function ChatMessage({ message }) {
    const { text, sender } = message;
    const isUser = (sender === 'user');
    const style = (isUser ? 'justify-end' : 'justify-start');

    return (
            <div className={`w-full my-2 flex px-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-xs p-2 rounded-3xl ${
                        isUser
                            ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                            : 'bg-gray-200 dark:bg-darker dark:text-zinc-200 text-gray-700'
                    }`}
                >
                    {text}
                </div>
            </div>
        );
}

export default ChatMessage;