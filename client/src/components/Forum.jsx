import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Forum.css";
import logoImage from "../assets/neighbourhood-net-logo.png";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify"; 

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
  const [messageToEdit, setMessageToEdit] = useState(null);

  const navigate = useNavigate();

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

  // Helper function to validate that the message contains only text and emojis
  const isTextOrEmojiOnly = (message) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return !urlPattern.test(message);
  };

  // Helper function to check if the message can be edited (within 24 hours)
  const canEditMessage = (createdAt) => {
    const messageTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return now - messageTime < twentyFourHours;
  };

  // Update the handleSend function to include validation
  const handleSend = async () => {
    if (newMessage.trim() && selectedThread && isTextOrEmojiOnly(newMessage)) {
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
    } else {
      toast.error("Messages can only contain text and emojis, no links are allowed.");
    }
  };

  // Function to handle message editing
  const handleEditMessage = async (messageId, newText) => {
    if (!isTextOrEmojiOnly(newText)) {
      toast.error("Messages can only contain text and emojis, no links are allowed.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5555/threads/${selectedThread.id}/messages/${messageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            text: newText,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit message");
      }

      const updatedMessage = await response.json();
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId ? updatedMessage : message
        )
      );
      setMessageToEdit(null);
    } catch (error) {
      console.error("Error:", error);
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

    if (type === "messages") {
      if (
        item.creator_id !== loggedInUserId ||
        !canEditMessage(item.created_at)
      ) {
        return;
      }
    }

    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setItemToDelete({ item, type });
    setMessageToEdit(null);
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

  const handleEdit = () => {
    if (!itemToDelete) return;

    const newText = prompt("Edit your message:", itemToDelete.item.text);

    if (newText !== null) {
      handleEditMessage(itemToDelete.item.id, newText);
    }
  };

  const handleCancel = () => {
    setContextMenuVisible(false);
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  return (
    <div className="forum">
      <div className="navbar">
        <img
          src={logoImage}
          alt="Logo"
          className="navbar-logo"
          onClick={handleHomeClick}
        />
        <div className="navbar-title">Forum</div>
        <div className="navbar-buttons">
          <button className="notifications" onClick={handleNotificationsClick}>
            Notifications
          </button>
        </div>
      </div>
      <div className="main-content">
        <div className="sidebar">
          <input
            type="text"
            placeholder="Search threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="notifications"
            onClick={() => setCreatingThread(true)}
          >
            + New Thread
          </button>
          {creatingThread && (
            <div className="create-thread">
              <input
                type="text"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="Thread Title"
              />
              <button onClick={handleCreateThread}>Create</button>
              <button onClick={() => setCreatingThread(false)}>Cancel</button>
            </div>
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
                >
                  {thread.title}
                </li>
              ))}
          </ul>
        </div>
        <div className="chat-window">
          <div className="chat-header">
            {selectedThread ? selectedThread.title : "Select a thread"}
          </div>
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.creator_id === loggedInUserId ? "my-message" : ""
                }`}
                onContextMenu={(e) =>
                  handleContextMenu(e, message, "messages")
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
                placeholder="Type a message..."
              />
              <button onClick={handleSend}>Send</button>
              <button onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
                😊
              </button>
              {emojiPickerVisible && <EmojiPicker onEmojiClick={handleEmojiClick} />}
            </div>
          )}
        </div>
      </div>
      {contextMenuVisible && (
        <div
          className="context-menu"
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
          }}
        >
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Forum;
