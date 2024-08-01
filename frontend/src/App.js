import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './Components/Search';
import ChatDisplay from './Components/ChatDisplay';
import './App.css';
import Navbar from './Components/Navbar';
import { Infra } from './Components/Infra';
import toast, { Toaster } from 'react-hot-toast';
import { themeChange } from 'theme-change';

function App() {
  const [messages, setMessages] = useState([]);
  const [latestResponse, setLatestResponse] = useState({});
  
  useEffect(() => {
    themeChange(false)
    const newMessage = {
      id: messages.length + 1,
      sender: 'bot',
      text: "Hello I am Jarvis AI 👋",
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    
  }, [])

  const handleSend = async (text) => {

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);

    try {
      const response = await fetch('http://localhost:3001/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
        credentials: 'include',
      });
      console.log("response", response);

      const data = JSON.parse(await response.json());
      console.log("data", data);

      setLatestResponse({
        dockerfile: data.dockerfile,
        build_command: data.build_command,
        run_command: data.run_command,
      });

      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: data.reply + "\n" + data.dockerfile,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApply = async () => {

    if (Object.keys(latestResponse).length === 0) {
      toast.error('Please create a container first',
          {
              icon: '🚨'
          }
      );
      return;
  }

    await fetch("https://kt7cw99yu6.execute-api.ap-south-1.amazonaws.com/prod", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(latestResponse)
    })

    toast('Successfully Created Container',
      {
          icon: '🥳'
      }
  );


  }

  return (
    <>
      <Router>
      <div><Toaster
          position="top-center"
          reverseOrder={false}
        /></div>
      <Navbar />
        <Routes>
          <Route path="/infra" Component={Infra} />
          <Route
            path="/"
            element={
              <div className="chat-container">
                <ChatDisplay messages={messages} />
                <Search onSend={handleSend} onApply={handleApply} />
              </div>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
