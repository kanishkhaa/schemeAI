import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2 } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, how can I help you with government schemes today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        isBot: false
      };

      setMessages(prev => [...prev, newMessage]);
      setInputValue('');

      try {
        const response = await fetch('http://localhost:3000/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputValue }),
          credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
          const botResponse = {
            id: messages.length + 2,
            text: data.response,
            isBot: true
          };
          setMessages(prev => [...prev, botResponse]);
        } else {
          const errorResponse = {
            id: messages.length + 2,
            text: 'Sorry, something went wrong. Please try again.',
            isBot: true
          };
          setMessages(prev => [...prev, errorResponse]);
        }
      } catch (error) {
        const errorResponse = {
          id: messages.length + 2,
          text: 'Error connecting to the server. Please check your connection.',
          isBot: true
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 flex flex-col ${
        isMinimized ? 'w-80 h-16' : 'w-[480px] h-[680px]'
      }`}>
        <div className="bg-blue-50 border-b border-gray-200 p-4 rounded-t-lg flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Government Schemes Assistant</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
            >
              <Minimize2 size={18} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.length === 1 ? (
                <div className="text-center text-gray-500 space-y-3">
                  <p className="text-sm">Start by asking about a scheme:</p>
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => setInputValue('Tell me about the Prime Minister’s Special Scholarship Scheme') && handleSend()}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Tell me about the Prime Minister’s Special Scholarship Scheme
                    </button>
                    <button
                      onClick={() => setInputValue('What are the benefits of Swami Vivekananda Single Girl Child Fellowship?') && handleSend()}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      What are the benefits of Swami Vivekananda Single Girl Child Fellowship?
                    </button>
                    <button
                      onClick={() => setInputValue('How do I apply for the Scheme for OBC Students of Andaman and Nicobar Islands?') && handleSend()}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      How do I apply for the Scheme for OBC Students of Andaman and Nicobar Islands?
                    </button>
                    <button
                      onClick={() => setInputValue('What are the eligibility criteria for CBSE Merit Scholarship?') && handleSend()}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      What are the eligibility criteria for CBSE Merit Scholarship?
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-sm px-4 py-3 rounded-lg whitespace-pre-wrap ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800 rounded-bl-sm'
                          : 'bg-blue-600 text-white rounded-br-sm'
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: message.text
                          .replace(/^##+\s?/gm, '')
                          .replace(/🎓\s?Scheme Name: (.*)/g, '<span class="block text-base font-semibold text-blue-800 mb-1">🎓 Scheme Name: $1</span>')
                          .replace(/(🎯\s?Objectives)/g, '<span class="block font-semibold text-gray-800 mt-3 mb-1">$1</span>')
                          .replace(/(💰\s?Benefits)/g, '<span class="block font-semibold text-gray-800 mt-3 mb-1">$1</span>')
                          .replace(/(✅\s?Eligibility Criteria)/g, '<span class="block font-semibold text-gray-800 mt-3 mb-1">$1</span>')
                          .replace(/(📝\s?Application Process)/g, '<span class="block font-semibold text-gray-800 mt-3 mb-1">$1</span>')
                          .replace(/(📄\s?Documents Required)/g, '<span class="block font-semibold text-gray-800 mt-3 mb-1">$1</span>')
                          .replace(/(🔗\s?Official Links)/g, '<span class="block font-semibold text-gray-800 mt-3 mb-1">$1</span>')
                          .replace(/👉\s?(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-600 underline">$1</a>')
                          .replace(/^-\s?(.*)/gm, '<li class="list-disc list-inside text-sm text-gray-700">$1</li>')
                          .replace(/<br>/g, '<br class="mb-1" />')
                      }}
                    />
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 flex-shrink-0">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about government schemes..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
