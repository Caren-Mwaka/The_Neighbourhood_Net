import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Forum.css";
import logoImage from "../assets/neighbourhood-net-logo.png";
import EmojiPicker from "emoji-picker-react";

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
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [creatingThread, setCreatingThread] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch user info
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

  // Fetch users
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

  // Fetch threads
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
    if (selectedThread) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:5555/threads/${selectedThread.id}/messages`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          if (!Array.isArray(data)) {
            throw new Error("Expected an array of messages");
          }
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };

      fetchMessages();
    } else {
      setMessages([]);
    }
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

  const handleMessageDelete = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:5555/threads/${selectedThread.id}/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete message");
      }

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
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
        setThreads((prevThreads) => [...prevThreads, data]);
        setNewThreadTitle("");
        setCreatingThread(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    setMessages([]); 
  };

  const handleContextMenu = (event, item, type) => {
    event.preventDefault();

    
    if (type === "threads") return;

   
    if (type === "messages" && item.creator_id !== loggedInUserId) return;

    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setItemToDelete({ item, type });
    setContextMenuVisible(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    const { item, type } = itemToDelete;

    if (type === "messages") {
      await handleMessageDelete(item.id);
    }

    setContextMenuVisible(false);
  };

  const handleCancel = () => {
    setContextMenuVisible(false);
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    setNewMessage(newMessage + emoji);
    setEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  const handleLogoClick = () => {
    navigate("/home"); 
  };

  const handleNotificationsClick = () => {
    navigate("/notifications"); 
  };

  return (
    <div className="forum">
      <nav className="navbar">
        <img
          src={logoImage}
          alt="Logo"
          className="navbar-logo"
          onClick={handleLogoClick} 
        />
        <div className="navbar-title">Neighbourhood Net Forum</div>
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </nav>
      <div className="main-content">
        <div className="sidebar">
          <h2>Threads</h2>
          {creatingThread ? (
            <div className="create-thread">
              <input
                type="text"
                placeholder="Enter new thread title..."
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
              />
              <button onClick={handleCreateThread}>Create</button>
              <button onClick={() => setCreatingThread(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <button
                className="notifications"
                onClick={() => setCreatingThread(true)}
              >
                + New Thread
              </button>
              <button
                className="notifications"
                onClick={handleNotificationsClick} 
              >
                Go to Notifications
              </button>
            </>
          )}
          <ul>
            {threads
              .filter((thread) =>
                thread.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((thread) => (
                <li
                  key={thread.id}
                  onClick={() => handleThreadSelect(thread)}
                  onContextMenu={(e) => handleContextMenu(e, thread, "threads")}
                >
                  {thread.title}
                </li>
              ))}
          </ul>
        </div>
        <div className="chat-window">
          {selectedThread ? (
            <>
              <div className="chat-header">{selectedThread.title}</div>
              <div className="messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="message"
                    onContextMenu={(e) => handleContextMenu(e, message, "messages")}
                  >
                    <strong>{getUsernameById(message.creator_id)}</strong>
                    <p>{message.text}</p>
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
                <button onClick={toggleEmojiPicker}>😊</button>
                <button onClick={handleSend}>Send</button>
              </div>
              {emojiPickerVisible && (
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  height={350}
                />
              )}
            </>
          ) : (
            <p>Select a thread to view messages</p>
          )}
        </div>
      </div>
      {contextMenuVisible && (
        <div
          className="context-menu"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Forum;
