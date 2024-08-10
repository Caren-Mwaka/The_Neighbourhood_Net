import React, { useState } from 'react';
import './Forum.css';
import user1Image from './images/profile.jpeg';
import user2Image from './images/profile.jpeg';
import user3Image from './images/profile.jpeg';
import logoImage from './images/logo.jpeg';

const Forum = () => {
  const users = [
    { name: 'Main', image: user1Image },
    { name: 'Dr. Catherine', image: user2Image },
    { name: 'Ian Thiong’o', image: user3Image },
  ];
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [threads, setThreads] = useState({
    'Main': [{ id: 1, user: 'Lydia', text: 'Hello everyone! 👋', image: user1Image }],
    'Dr. Catherine': [{ id: 2, user: 'Dr. Catherine', text: 'Hello, Lydia 👋 I hope you and your family are well and healthy', image: user2Image }],
    'Ian Thiong’o': [],
  });
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      const newThread = [...(threads[selectedUser.name] || []), { id: Date.now(), user: 'Current User', text: newMessage, image: user1Image }];
      setThreads({ ...threads, [selectedUser.name]: newThread });
      setNewMessage('');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="forum">
      <nav className="navbar">
        <img src={logoImage} alt="Logo" className="navbar-logo" />
        <div className="navbar-title">Neighbourhood Net Forum</div>
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </nav>
      <div className="main-content">
        <div className="sidebar">
          <h2>Direct Messages</h2>
          <ul>
            {users.map((user) => (
              <li key={user.name} onClick={() => handleUserSelect(user)} className={selectedUser === user ? 'selected' : ''}>
                <img src={user.image} alt={user.name} className="user-image" />
                {user.name}
              </li>
            ))}
          </ul>
          <button className="notifications">Notifications</button>
        </div>
        <div className="chat-window">
          <div className="chat-header">
            {selectedUser.name === 'Anonymous' ? (
              <h2>Main Chat Box</h2>
            ) : (
              <h2>Chat with {selectedUser.name}</h2>
            )}
          </div>
          <div className="messages">
            {(threads[selectedUser.name] || [])
              .filter((message) => message.text.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((message) => (
                <div key={message.id} className="message">
                  <img src={message.image} alt={message.user} className="user-image" />
                  <strong>{message.user}</strong>: {message.text}
                </div>
              ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
