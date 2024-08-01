import React, { useEffect, useRef } from 'react';

function ChatDisplay({ messages }) {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-display">
            {/* {messages.map((msg, index) => (
                <div key={index}>
                    <p style={{ textAlign: (msg.sender === 'user') ? 'right' : 'left' }}>{(msg.sender === 'user') ? 'you' : 'bot' }</p>
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.sender === 'user' ? (
                            <p>{msg.text}</p>
                        ): (
                            <pre>{msg.text}</pre>
                        )}
                    </div>
                </div>
            ))} */}

            {messages.map((msg, index) => (
                msg.sender === 'user' ? ( <div key = {index} class="chat chat-end">
                    <div class="chat-bubble">{msg.text}</div>
                </div>) : (<div key={index} class="chat chat-start">
                <div class="chat-bubble">
                   {msg.text}
                </div>
            </div>)
            ))}
            

           

            <div ref={chatEndRef} />
        </div>
    );
}

export default ChatDisplay;
