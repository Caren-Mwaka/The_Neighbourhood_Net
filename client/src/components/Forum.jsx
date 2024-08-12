import React, { useState, useEffect } from "react";
import "./Forum.css";
import logoImage from "../assets/neighbourhood-net-logo.png";

const Forum = () => {
  const [users, setUsers] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:5555/user-info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setLoggedInUserId(data.id);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5555/users");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch("http://localhost:5555/threads");
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedThread) {
        try {
          const response = await fetch(
            `http://localhost:5555/threads/${selectedThread.id}/messages`
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    fetchMessages();
  }, [selectedThread]);

  const getUsernameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Unknown User";
  };

  const handleSend = async () => {
    if (newMessage.trim() && selectedThread) {
      try {
        const response = await fetch(
          `http://localhost:5555/threads/${selectedThread.id}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              text: newMessage,
              creator_id: loggedInUserId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send message");
        }

        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage("");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleThreadDelete = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:5555/threads/${threadId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete thread");
      }
  
      setThreads(threads.filter((thread) => thread.id !== threadId));
      setSelectedThread(null);
      setMessages([]);
      setContextMenuVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleMessageDelete = async (messageId) => {
    try {
      // Make sure `selectedThreadId` is correctly set
      const response = await fetch(`http://localhost:5555/threads/${selectedThreadId}/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete message");
      }
  
      setMessages(messages.filter((message) => message.id !== messageId));
      setContextMenuVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  

  const handleCreateThread = async () => {
    if (newThreadTitle.trim()) {
      try {
        const response = await fetch("http://localhost:5555/threads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: newThreadTitle,
            creator_id: loggedInUserId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create thread");
        }

        const data = await response.json();
        setThreads([...threads, data]);
        setNewThreadTitle("");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
  };

  const handleThreadClick = (thread) => {
    if (thread.creator_id !== loggedInUserId) {
      handleThreadSelect(thread);
    }
  };

  const handleMessageClick = (message) => {
    if (message.creator_id !== loggedInUserId) {
      return;
    }
    setContextMenuPosition({ x: 0, y: 0 });
    setItemToDelete({ item: message, type: 'messages' });
    setContextMenuVisible(true);
  };

  const handleContextMenu = (event, item, type) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setItemToDelete({ item, type });
    setContextMenuVisible(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
  
    const { item, type } = itemToDelete;
    try {
      const response = await fetch(
        `http://localhost:5555/${type}/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id: item.id }), // Include the ID in the request body
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete ${type}`);
      }
  
      if (type === 'threads') {
        setThreads(threads.filter((thread) => thread.id !== item.id));
        setSelectedThread(null);
        setMessages([]);
      } else if (type === 'messages') {
        setMessages(messages.filter((message) => message.id !== item.id));
      }
  
      setContextMenuVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleCancel = () => {
    setContextMenuVisible(false);
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
          <h2>Threads</h2>
          <ul>
            {threads
              .filter((thread) =>
                thread.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((thread) => (
                <li
                  key={thread.id}
                  onClick={() => handleThreadClick(thread)}
                  onContextMenu={(event) =>
                    handleContextMenu(event, thread, 'threads')
                  }
                >
                  {thread.title}
                </li>
              ))}
          </ul>
          <input
            type="text"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            placeholder="New thread title"
          />
          <button onClick={handleCreateThread}>Create Thread</button>
        </div>
        <div className="chat-window">
          <div className="chat-header">
            {selectedThread ? selectedThread.title : "Select a thread"}
          </div>
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className="message"
                onContextMenu={(event) =>
                  handleContextMenu(event, message, 'messages')
                }
              >
                <strong>{getUsernameById(message.creator_id)}</strong>: {message.text}
              </div>
            ))}
          </div>
          {selectedThread && (
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message"
              />
              <button onClick={handleSend}>Send</button>
            </div>
          )}
        </div>
      </div>
      {contextMenuVisible && (
        <div
          className="context-menu"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <ul>
            <li onClick={handleDelete}>Delete {itemToDelete?.type.slice(0, -1)}</li>
            <li onClick={handleCancel}>Cancel</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Forum;
