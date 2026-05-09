'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREDEFINED_QUESTIONS = [
  "Paano kumuha ng Barangay Clearance?",
  "Ano ang requirements para sa Barangay ID?",
  "Saan pwede mag-report ng emergency?",
  "Ano ang schedule ng garbage collection?"
];

/**
 * A sleek, premium chat modal for interacting with the Barangay Bot.
 */
export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'msg-0',
          sender: 'bot',
          text: 'Magandang araw! Ako si Kap, ang inyong Barangay Bot. Paano ko kayo matutulungan ngayon?'
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Add user message
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text };
    
    // We snapshot the history to send to the API *before* adding the current message
    // but the UI will show the new message immediately.
    const currentHistory = [...messages.filter(m => m.id !== 'msg-0')];

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: currentHistory
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.response
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: error.message === 'Failed to fetch response' 
          ? 'Paumanhin, hindi ako makakonekta ngayon. Pakisubukan muli.'
          : (error.message || 'Error occurred.')
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden p-4 pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg h-[600px] max-h-[85vh] flex flex-col bg-white rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Kapitan Bot</h2>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors active:scale-95"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                
                {/* Bubble */}
                <div className={`p-3.5 rounded-2xl shadow-sm text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] gap-2 flex-row">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mt-auto">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-bl-sm shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Predefined Questions */}
        <div className="px-4 py-3 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex gap-2">
            {PREDEFINED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-colors active:scale-95 shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors active:scale-95"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
