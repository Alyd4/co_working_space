import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { FiSend, FiChevronLeft, FiUsers, FiPlus } from 'react-icons/fi';
import { IoDocumentText } from 'react-icons/io5';
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
  const [attachments, setAttachments] = useState([]);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Initialize socket and get admin info
  useEffect(() => {
    console.log('=== INITIALIZING ADMIN CHAT ===');

    // Try to get admin data from localStorage
    let adminDataString = localStorage.getItem('user');
    console.log('Raw localStorage data:', adminDataString);

    let adminData = null;
    try {
      adminData = adminDataString ? JSON.parse(adminDataString) : null;
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }

    console.log('Parsed admin data:', adminData);

    let currentAdminData;
    if (adminData && adminData.isAdmin && adminData.id) {
      console.log('✅ Valid admin found in localStorage:', adminData);
      currentAdminData = adminData;
      setCurrentUser(adminData);
    } else {
      console.warn('❌ No valid admin data found. Please login again.');
      alert('Data admin tidak valid. Silakan login ulang.');
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    // Initialize socket connection
    console.log('🔌 Initializing socket connection to:', apiUrl);
    const newSocket = io(apiUrl, {
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    setSocket(newSocket);

    // Handle socket events
    newSocket.on('connect', () => {
      console.log('✅ Connected to socket server, Socket ID:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
    });

    newSocket.on('connect_error', error => {
      console.error('❌ Socket connection error:', error);
    });

    newSocket.on('room_joined', data => {
      console.log('✅ Joined room successfully:', data);
    });

    newSocket.on('receive_message', messageData => {
      console.log('📨 Received message:', messageData);

      setMessages(prev => {
        console.log('Current messages before processing:', prev.length);

        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(
          msg =>
            (msg.id && messageData.id && msg.id === messageData.id) ||
            (msg.tempId &&
              messageData.tempId &&
              msg.tempId === messageData.tempId) ||
            (msg.message === messageData.message &&
              msg.senderId === messageData.senderId &&
              Math.abs(
                new Date(msg.createdAt) - new Date(messageData.createdAt),
              ) < 2000),
        );

        if (messageExists) {
          console.log('Message already exists, skipping duplicate');
          return prev;
        }

        // Check if this replaces an optimistic message
        const optimisticIndex = prev.findIndex(
          msg =>
            msg.tempId &&
            msg.senderId === messageData.senderId &&
            msg.message === messageData.message,
        );

        if (optimisticIndex !== -1) {
          console.log(
            'Replacing optimistic message at index:',
            optimisticIndex,
          );
          // Replace optimistic message with real message
          const updatedMessages = [...prev];
          updatedMessages[optimisticIndex] = {
            ...messageData,
            tempId: undefined, // Remove tempId to mark as confirmed
          };
          console.log(
            'Updated messages after replacement:',
            updatedMessages.length,
          );
          return updatedMessages;
        }

        // Add new message
        console.log('Adding new message to list');
        const newMessages = [...prev, messageData];
        console.log('Total messages after adding:', newMessages.length);
        return newMessages;
      });
    });

    newSocket.on('message_error', error => {
      console.error('❌ Message error:', error);
      alert('Gagal mengirim pesan: ' + error.error);
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
    const email = urlParams.get('email');

    console.log('=== URL PARAMETER PARSING ===');
    console.log('Current URL:', window.location.href);
    console.log('URL Parameters:', { userId, customerName, email });
    console.log('userId type:', typeof userId);
    console.log('userId !== "undefined":', userId !== 'undefined');

    // Enhanced validation for userId
    const parsedUserId = userId ? parseInt(userId) : null;
    const isValidUserId =
      parsedUserId && !isNaN(parsedUserId) && parsedUserId > 0;

    console.log('Parsed userId:', parsedUserId);
    console.log('Is valid userId:', isValidUserId);

    if (
      isValidUserId &&
      customerName &&
      userId !== 'undefined' &&
      userId !== 'null'
    ) {
      // Auto-select user from pesanan page
      const userFromParams = {
        id: parsedUserId,
        firstName: decodeURIComponent(customerName).split(' ')[0],
        lastName: decodeURIComponent(customerName)
          .split(' ')
          .slice(1)
          .join(' '),
        email: email
          ? decodeURIComponent(email)
          : `user${parsedUserId}@example.com`,
      };
      console.log('✅ Auto-selecting user from URL:', userFromParams);
      setSelectedUser(userFromParams);

      // Use setTimeout to ensure currentAdminData is available
      setTimeout(() => {
        if (currentAdminData && currentAdminData.id) {
          console.log(
            '🔄 Fetching chat history with admin ID:',
            currentAdminData.id,
          );
          fetchChatHistory(parsedUserId, currentAdminData.id);
        }
      }, 100);
    } else {
      console.log('❌ Invalid URL parameters or no user to select');
      if (!isValidUserId) {
        console.error('Invalid userId in URL:', userId);
      }
    }
    return () => {
      newSocket.disconnect();
    };
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
      console.log('Admin joining room with data:', roomData);
      socket.emit('join_room', roomData);
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
    console.log('=== SEND MESSAGE ATTEMPT ===');
    console.log('Current states:', {
      hasMessage: !!newMessage.trim(),
      messageLength: newMessage.trim().length,
      hasSocket: !!socket,
      socketConnected: socket?.connected,
      hasSelectedUser: !!selectedUser,
      selectedUser: selectedUser,
      hasCurrentUser: !!currentUser,
      currentUser: currentUser,
    });

    // Enhanced validation
    if (!newMessage.trim()) {
      console.log('❌ No message to send');
      alert('Silakan ketik pesan terlebih dahulu');
      return;
    }

    if (!socket) {
      console.log('❌ Socket not available');
      alert('Koneksi socket tidak tersedia. Refresh halaman.');
      return;
    }

    if (!socket.connected) {
      console.log('❌ Socket not connected');
      alert('Socket tidak terhubung. Refresh halaman.');
      return;
    }

    if (!selectedUser) {
      console.log('❌ No user selected');
      alert('Pilih user terlebih dahulu untuk mengirim pesan');
      return;
    }

    if (!currentUser) {
      console.log('❌ No current user (admin) data');
      alert('Data admin tidak valid. Silakan login ulang.');
      return;
    }

    if (!currentUser.id) {
      console.log('❌ Current user has no ID');
      alert('Admin ID tidak valid. Silakan login ulang.');
      return;
    }

    if (!selectedUser.id) {
      console.log('❌ Selected user has no ID');
      alert('User ID tidak valid. Silakan pilih user lain.');
      return;
    }

    // Prepare message data
    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const messageData = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      message: newMessage.trim(),
      userType: 'admin',
      tempId: tempId,
      createdAt: new Date().toISOString(),
    };

    // Add optimistic message to UI immediately
    const optimisticMessage = {
      ...messageData,
      id: null, // Will be replaced when real message comes back
      tempId: tempId,
    };

    console.log('Adding optimistic message:', optimisticMessage);
    setMessages(prev => {
      console.log('Current messages before adding optimistic:', prev.length);
      const newMessages = [...prev, optimisticMessage];
      console.log('Messages after adding optimistic:', newMessages.length);
      return newMessages;
    });

    console.log('✅ Sending message with data:', messageData);
    console.log('Socket ID:', socket.id);
    console.log('Socket connected:', socket.connected);

    try {
      socket.emit('send_message', messageData);
      console.log('✅ Message sent successfully');
      setNewMessage('');
      setAttachments([]);

      // Scroll to bottom after sending
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error('❌ Error sending message:', error);

      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileAttachment = e => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newAttachments = files.map(file => ({
        name: file.name,
        type: file.type.split('/')[1],
        url: URL.createObjectURL(file),
        file,
      }));

      setAttachments([...attachments, ...newAttachments]);
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
    <div className="flex flex-col bg-white">
      {/* Header dengan Search Bar dan Logout */}
      <div className="w-full bg-black mb-6">
        <Header />
      </div>

      <div className="h-screen bg-white flex">
        {/* Conversation List */}
        <div className="w-80 bg-white border-r overflow-y-auto shadow-lg drop-shadow-md border border-gray-100">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Pesan Saya</h2>
          </div>

          <div className="divide-y">
            {chatUsers.map(user => (
              <div
                key={user.id}
                className={`p-4 flex items-center cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => selectUser(user)}
              >
                <img
                  src={profileMessage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full mr-3"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://via.placeholder.com/40?text=' +
                      user.firstName.charAt(0);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3
                      className="font-medium truncate"
                      style={{ color: '#1565C0' }}
                    >
                      {user.firstName} {user.lastName}
                    </h3>
                    <span
                      className="text-xs flex items-center justify-center rounded-full"
                      style={{
                        color: '#1565C0',
                        backgroundColor: '#F7F7FC',
                        width: '27px',
                        height: '27px',
                      }}
                    >
                      {user.id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedUser ? (
          <div
            className="flex-1 flex flex-col shadow-lg drop-shadow-md border border-gray-100 rounded-lg mx-4"
            style={{ backgroundColor: '#F7F7FC' }}
          >
            {/* Chat Header */}
            <div
              className="p-4 shadow-sm flex items-center rounded-t-lg"
              style={{ backgroundColor: '#F7F7FC' }}
            >
              <button
                className="mr-3"
                style={{
                  color: '#202224',
                  opacity: '0.8',
                }}
              >
                <FiChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-semibold">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
            </div>

            {/* Messages */}
            <div
              className="flex-1 p-4 overflow-y-auto"
              style={{ backgroundColor: '#F7F7FC' }}
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading messages...</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={
                      msg.id || msg.tempId || `msg-${index}-${msg.createdAt}`
                    }
                    className={`flex mb-4 ${
                      msg.senderId === currentUser.id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 ${
                        msg.senderId === currentUser.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800'
                      } ${msg.tempId ? 'opacity-75' : ''}`}
                      style={{ borderRadius: '14px' }}
                    >
                      <p>{msg.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs ${
                            msg.senderId === currentUser.id
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </span>
                        {msg.tempId && (
                          <span
                            className={`text-xs ml-2 ${
                              msg.senderId === currentUser.id
                                ? 'text-blue-200'
                                : 'text-gray-400'
                            }`}
                          >
                            Mengirim...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex mb-4 justify-start">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg">
                    <p className="text-gray-600">Sedang mengetik...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="bg-gray-50 p-2 flex flex-wrap">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="m-1 p-2 bg-white rounded-lg shadow-sm flex items-center"
                  >
                    <IoDocumentText className="text-blue-500 mr-2" />
                    <span className="text-sm truncate max-w-xs">
                      {file.name}
                    </span>
                    <button
                      className="ml-2 text-red-500 text-xs"
                      onClick={() => {
                        const newAttachments = [...attachments];
                        newAttachments.splice(index, 1);
                        setAttachments(newAttachments);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Message Input */}
            <div
              className="p-4 flex items-center rounded-b-lg"
              style={{ backgroundColor: '#F7F7FC' }}
            >
              <button
                className="p-2 text-gray-500 hover:text-blue-500"
                onClick={() => fileInputRef.current.click()}
              >
                <FiPlus size={20} />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileAttachment}
                />
              </button>
              <textarea
                className="flex-1 border rounded-l-full rounded-r-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write message..."
                rows="1"
                value={newMessage}
                onChange={e => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyPress}
              />
              <button
                className="ml-2 bg-blue-500 text-white p-2 hover:bg-blue-600"
                style={{ borderRadius: '6px' }}
                onClick={sendMessage}
              >
                <div className="flex items-center px-2">
                  <span className="mr-1">Send</span>
                  <FiSend />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white mx-4">
            <div className="text-center text-gray-500 shadow-lg drop-shadow-md border border-gray-100 bg-white rounded-lg p-8">
              <p>Pilih percakapan untuk memulai chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pesan;
