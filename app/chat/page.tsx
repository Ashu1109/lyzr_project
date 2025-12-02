'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Send, Loader2, Bot, User as UserIcon, Sparkles, Paperclip, Image as ImageIcon, MoreHorizontal, Plus, MessageSquare, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function ChatPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history on load
  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/history?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched sessions:', data);
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const loadSession = async (sessionId: string) => {
    if (!sessionId || sessionId === 'undefined') {
      console.error('Invalid session ID:', sessionId);
      return;
    }
    try {
      setIsLoading(true);
      setCurrentSessionId(sessionId);
      const res = await fetch(`/api/history/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages.map((m: any) => ({
          id: Date.now().toString() + Math.random(),
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp)
        })));
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          session_id: currentSessionId 
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              setIsLoading(false);
              // Refresh history to show new chat or updated timestamp
              fetchHistory();
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage.content += parsed.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { ...assistantMessage };
                  return newMessages;
                });
              }
              if (parsed.session_id && parsed.session_id !== 'undefined') {
                setCurrentSessionId(parsed.session_id);
              }
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { label: 'Summarize emails', icon: '📧', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' },
    { label: 'Find Drive files', icon: '📁', color: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' },
    { label: 'Check Slack', icon: '💬', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400' },
    { label: 'Draft response', icon: '✍️', color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400' },
  ];

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-background text-foreground overflow-hidden">
      {/* Sidebar - Desktop & Mobile */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-[60] w-80 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col md:z-40 md:top-20 md:h-[calc(100vh-5rem)]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-sidebar-border/50">
          <button 
            onClick={startNewChat}
            className="group flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-xl p-3 font-semibold shadow-md hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-3 px-3">Recent Chats</h3>
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session._id}
                  onClick={() => loadSession(session._id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 group relative overflow-hidden",
                    currentSessionId === session._id 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                      : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                    currentSessionId === session._id ? "bg-primary/10 text-primary" : "bg-sidebar-accent/50 text-muted-foreground group-hover:bg-sidebar-accent group-hover:text-foreground"
                  )}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="truncate flex-1">{session.title}</span>
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 px-4 text-muted-foreground/40 text-sm italic">
                  No recent chats
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full w-full md:pl-80 transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 hover:bg-secondary rounded-full"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Lyzr Assistant</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online & Ready
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && (
              <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Hello, {user?.firstName || 'there'}!</h2>
                <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
                  I can help you find files, summarize conversations, and manage your workspace.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(s.label)}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer border border-transparent hover:border-border/50",
                        s.color
                      )}
                    >
                      <span className="text-2xl mb-3">{s.icon}</span>
                      <span className="font-medium text-sm">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-3xl px-6 py-4 shadow-sm",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground rounded-tr-sm [&_*]:text-primary-foreground"
                      : "bg-secondary text-secondary-foreground rounded-tl-sm [&_*]:text-secondary-foreground"
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <div className={cn(
                    "text-[10px] mt-2 opacity-70 font-medium",
                    message.role === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-3xl rounded-tl-sm px-6 py-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-background border-t border-border/50 p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-2 z-10">
                <button type="button" className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Lyzr Assistant..."
                disabled={isLoading}
                className="w-full bg-secondary/50 hover:bg-secondary focus:bg-secondary border border-transparent focus:border-primary/20 rounded-3xl py-4 pl-14 pr-14 outline-none transition-all text-foreground placeholder:text-muted-foreground text-base"
              />
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200 flex items-center justify-center",
                    input.trim() && !isLoading
                      ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                      : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-muted-foreground/60 mt-3">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
