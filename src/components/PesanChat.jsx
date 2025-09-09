import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { FiSend, FiUsers } from 'react-icons/fi';
import { format } from 'date-fns';
import Header from './Headeradmin';
import profileMessage from '../assets/profile-message.png';

function Pesan() {
  // State untuk socket dan chat
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Initialize socket and get admin info
  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('user'));
    if (adminData && adminData.isAdmin) {
      setCurrentUser(adminData);

      // Initialize socket connection
      const newSocket = io(apiUrl, {
        cors: {
          origin: 'http://localhost:5173',
          methods: ['GET', 'POST'],
        },
      });

      setSocket(newSocket);

      // Handle socket events
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
      });

      newSocket.on('receive_message', messageData => {
        console.log('Received message:', messageData);
        if (
          selectedUser &&
          ((messageData.senderId == selectedUser.id &&
            messageData.receiverId == adminData.id) ||
            (messageData.senderId == adminData.id &&
              messageData.receiverId == selectedUser.id))
        ) {
          setMessages(prev => [...prev, messageData]);
        }
      });

      newSocket.on('user_typing', data => {
        if (data.userType === 'user' && selectedUser) {
          setIsTyping(data.isTyping);
        }
      });

      // Check for direct user selection from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const customerName = urlParams.get('customerName');

      if (userId && customerName) {
        // Auto-select user from pesanan page
        const userFromParams = {
          id: parseInt(userId),
          firstName: decodeURIComponent(customerName).split(' ')[0],
          lastName: decodeURIComponent(customerName)
            .split(' ')
            .slice(1)
            .join(' '),
          email: `user${userId}@example.com`, // Placeholder
        };
        setSelectedUser(userFromParams);
        fetchChatHistory(parseInt(userId), adminData.id);
      }

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  // Fetch chat users for admin
  useEffect(() => {
    if (currentUser) {
      fetchChatUsers();
    }
  }, [currentUser]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join room when user is selected
  useEffect(() => {
    if (socket && selectedUser && currentUser) {
      const roomData = {
        userId: selectedUser.id,
        adminId: currentUser.id,
        userType: 'admin',
      };
      socket.emit('join_room', roomData);
      console.log('Joined room:', roomData);
    }
  }, [socket, selectedUser, currentUser]);

  const fetchChatUsers = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/chat/rooms/admin/${currentUser.id}`,
      );
      if (response.data.success) {
        setChatUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching chat users:', error);
    }
  };

  const fetchChatHistory = async (userId, adminId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/chat/history/${userId}/${adminId}`,
      );
      if (response.data.success) {
        setMessages(response.data.chats);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket && selectedUser && currentUser) {
      const messageData = {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        message: newMessage.trim(),
        userType: 'admin',
      };

      socket.emit('send_message', messageData);
      setNewMessage('');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = () => {
    if (socket && selectedUser && currentUser) {
      socket.emit('typing', {
        roomId: `user_${selectedUser.id}_admin_${currentUser.id}`,
        userType: 'admin',
        isTyping: true,
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          roomId: `user_${selectedUser.id}_admin_${currentUser.id}`,
          userType: 'admin',
          isTyping: false,
        });
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectUser = user => {
    setSelectedUser(user);
    if (currentUser) {
      fetchChatHistory(user.id, currentUser.id);
    }
  };

  const formatTime = timestamp => {
    return format(new Date(timestamp), 'HH:mm');
  };

  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Akses ditolak. Anda harus login sebagai admin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header title="Pesan" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - User List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Header Sidebar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <FiUsers className="text-gray-600" />
              <h2 className="text-lg font-semibold">Pengguna</h2>
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto">
            {chatUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>Belum ada percakapan</p>
                <p className="text-sm">
                  User akan muncul setelah melakukan chat pertama
                </p>
              </div>
            ) : (
              chatUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => selectUser(user)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedUser && selectedUser.id === user.id
                      ? 'bg-blue-50 border-blue-200'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.profilePhoto || profileMessage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {`${user.firstName} ${user.lastName}`}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {user.lastMessage || 'Tidak ada pesan'}
                      </p>
                    </div>
                    {user.lastMessageTime && (
                      <div className="text-xs text-gray-400">
                        {formatTime(user.lastMessageTime)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedUser.profilePhoto || profileMessage}
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {`${selectedUser.firstName} ${selectedUser.lastName}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Memuat pesan...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">
                      Belum ada pesan. Mulai percakapan!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === currentUser.id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === currentUser.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === currentUser.id
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                          <p className="text-sm text-gray-500">
                            sedang mengetik...
                          </p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // No user selected
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Pilih Pengguna untuk Memulai Chat
                </h3>
                <p className="text-gray-500">
                  Pilih pengguna dari sidebar untuk memulai percakapan
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pesan;
