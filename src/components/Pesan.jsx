import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend, FiPaperclip, FiChevronLeft } from 'react-icons/fi';
import { IoDocumentText } from 'react-icons/io5';
import { format } from 'date-fns';

function Pesan() {
  // State untuk pesan dan percakapan
  const [conversations, setConversations] = useState([
    { 
      id: 1,
      user: { 
        id: 1, 
        name: 'Maxwell', 
        avatar: 'https://via.placeholder.com/40',
        lastMessage: 'Y'
      },
      messages: [
        { 
          id: 1, 
          sender: 'Maxwell', 
          content: 'Y', 
          timestamp: '10:12 pm', 
          isMe: false 
        }
      ]
    },
    { 
      id: 2,
      user: { 
        id: 2, 
        name: 'Ayu', 
        avatar: 'https://via.placeholder.com/40',
        lastMessage: 'Berikut saya lampirkan SPK untuk proyek website...'
      },
      messages: [
        { 
          id: 2, 
          sender: 'Ayu', 
          content: 'Berikut saya lampirkan SPK untuk proyek website', 
          timestamp: '09:45 am',
          attachment: { 
            name: 'SPK_Website_Project.pdf', 
            type: 'pdf' 
          },
          isMe: false 
        }
      ]
    }
  ]);
  
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle selecting a conversation
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    if (activeConversation) {
      const newMessage = {
        id: Date.now(),
        sender: 'Admin',
        content: message,
        timestamp: format(new Date(), 'hh:mm a'),
        attachments: attachments.length > 0 ? [...attachments] : null,
        isMe: true
      };
      
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage]
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      setActiveConversation({
        ...activeConversation,
        messages: [...activeConversation.messages, newMessage]
      });
      
      setMessage('');
      setAttachments([]);
      setTimeout(scrollToBottom, 100);
    }
  };
  
  // Handle file attachment
  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newAttachments = files.map(file => ({
        name: file.name,
        type: file.type.split('/')[1],
        url: URL.createObjectURL(file),
        file
      }));
      
      setAttachments([...attachments, ...newAttachments]);
    }
  };
  
  // Handle enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversation List */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Pesan Saya</h2>
        </div>
        
        <div className="divide-y">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 ${
                activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <img 
                src={conversation.user.avatar} 
                alt={conversation.user.name}
                className="w-10 h-10 rounded-full mr-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/40?text=' + conversation.user.name.charAt(0);
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{conversation.user.name}</h3>
                  <span className="text-xs text-gray-500">{conversation.id}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.user.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white p-4 shadow-sm flex items-center">
            <button className="mr-2 md:hidden">
              <FiChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">{activeConversation.user.name}</h2>
          </div>
          
          {/* Messages */}
          <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
            {activeConversation.messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex mb-4 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    msg.isMe 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.attachment && (
                    <div className="mb-2 bg-white bg-opacity-20 p-2 rounded flex items-center">
                      <IoDocumentText className="mr-2" />
                      <span className="text-sm truncate">{msg.attachment.name}</span>
                    </div>
                  )}
                  <p>{msg.content}</p>
                  <span className={`text-xs block text-right mt-1 ${
                    msg.isMe ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="bg-gray-50 p-2 flex flex-wrap">
              {attachments.map((file, index) => (
                <div key={index} className="m-1 p-2 bg-white rounded-lg shadow-sm flex items-center">
                  <IoDocumentText className="text-blue-500 mr-2" />
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
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
          <div className="bg-white p-4 flex items-center">
            <button 
              className="p-2 text-gray-500 hover:text-blue-500"
              onClick={() => fileInputRef.current.click()}
            >
              <FiPaperclip size={20} />
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
              onClick={handleSendMessage}
            >
              <div className="flex items-center px-2">
                <span className="mr-1">Send</span>
                <FiSend />
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <p>Pilih percakapan untuk memulai chat</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pesan;