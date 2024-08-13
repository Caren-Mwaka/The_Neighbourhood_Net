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
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [creatingThread, setCreatingThread] = useState(false);

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

  // Fetch messages when a thread is selected
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
      setMessages([]); // Clear messages if no thread is selected
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

  // Removed handleThreadDelete function

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
    setMessages([]); // Clear messages when a new thread is selected
  };

  const handleContextMenu = (event, item, type) => {
    event.preventDefault();

    // Show context menu only for messages
    if (type === "threads") return;

    // Check if the logged-in user is the creator
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

    // Hide context menu after deletion
    setContextMenuVisible(false);
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
            <button
              className="notifications"
              onClick={() => setCreatingThread(true)}
            >
              + New Thread
            </button>
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
                  onContextMenu={(e) =>
                    handleContextMenu(e, thread, "threads")
                  }
                >
                  {thread.title}
                </li>
              ))}
          </ul>
        </div>
        {selectedThread ? (
          <div className="chat-window">
            <div className="chat-header">{selectedThread.title}</div>
            <div className="messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="message"
                  onContextMenu={(e) =>
                    handleContextMenu(e, message, "messages")
                  }
                >
                  <div className="message-author">
                    {getUsernameById(message.creator_id)}:
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        ) : (
          <div className="chat-window">
            <div className="chat-header">Select a thread to start chatting</div>
          </div>
        )}
      </div>
      {contextMenuVisible && (
        <div
          className="context-menu"
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
          }}
        >
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Forum;
