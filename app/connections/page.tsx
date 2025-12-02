'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Github, Mail, Database, Check, Loader2, MessageSquare, Inbox, Sparkles, ArrowRight, Search } from 'lucide-react';
import { MasonryGrid } from '@/components/MasonryGrid';
import { cn } from '@/lib/utils';

interface Connection {
  connected: boolean;
  connectedAt?: string;
}

interface UserConnections {
  googleDrive?: Connection;
  slack?: Connection;
  github?: Connection;
  gmail?: Connection;
  googleChat?: Connection;
}

export default function ConnectionsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [connections, setConnections] = useState<UserConnections>({});
  const [loading, setLoading] = useState(true);
  const [connectingService, setConnectingService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (isLoaded && user) {
      fetchConnections();
    }
  }, [isLoaded, user]);

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/connections');
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || {});
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (service: 'googleDrive' | 'slack' | 'github' | 'gmail' | 'googleChat') => {
    setConnectingService(service);

    try {
      const response = await fetch(`/api/auth/${service}`);
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error(`Error connecting to ${service}:`, error);
      setConnectingService(null);
    }
  };

  const handleContinue = () => {
    router.push('/chat');
  };

  const allConnected = connections.googleDrive?.connected &&
                       connections.slack?.connected &&
                       connections.github?.connected &&
                       connections.gmail?.connected &&
                       connections.googleChat?.connected;

  const services = [
    {
      service: 'googleDrive' as const,
      name: 'Google Drive',
      description: 'Access and manage your documents',
      icon: Database,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-950/30',
      category: 'Storage',
    },
    {
      service: 'slack' as const,
      name: 'Slack',
      description: 'Connect your team communication',
      icon: Mail,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-950/30',
      category: 'Communication',
    },
    {
      service: 'github' as const,
      name: 'GitHub',
      description: 'Access your repositories and code',
      icon: Github,
      color: 'text-gray-700',
      bgColor: 'bg-gray-50',
      darkBgColor: 'dark:bg-gray-800/30',
      category: 'Developer',
    },
    {
      service: 'gmail' as const,
      name: 'Gmail',
      description: 'Access your emails and threads',
      icon: Inbox,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      darkBgColor: 'dark:bg-red-950/30',
      category: 'Communication',
    },
    {
      service: 'googleChat' as const,
      name: 'Google Chat',
      description: 'Connect your spaces and messages',
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-950/30',
      category: 'Communication',
    },
  ];

  const categories = ['All', 'Communication', 'Storage', 'Developer'];

  const filteredServices = services.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Connect Your Workspace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Link your tools to unlock the full power of AI-assisted productivity
        </p>
      </div>

      {/* Search Filter (Local) */}
      <div className="max-w-md mx-auto mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-3 bg-secondary/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all hover:bg-secondary placeholder:text-muted-foreground"
          placeholder="Filter connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Pills */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:scale-105"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <MasonryGrid className="mb-16">
        {filteredServices.map((item, index) => (
          <div
            key={item.service}
            className="group relative bg-card hover:bg-secondary/40 border border-border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden cursor-default"
          >
            <div className="flex flex-col gap-4">
              {/* Icon Header */}
              <div className="flex justify-between items-start">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.bgColor, item.darkBgColor)}>
                  <item.icon className={cn("w-7 h-7", item.color)} />
                </div>
                {connections[item.service]?.connected && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Connected
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleConnect(item.service)}
                disabled={connections[item.service]?.connected || connectingService === item.service}
                className={cn(
                  "w-full mt-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
                  connections[item.service]?.connected
                    ? "bg-secondary text-muted-foreground cursor-default"
                    : "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg"
                )}
              >
                {connectingService === item.service ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : connections[item.service]?.connected ? (
                  "Manage"
                ) : (
                  "Connect"
                )}
              </button>
            </div>
          </div>
        ))}
      </MasonryGrid>

      {/* Continue Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={handleContinue}
            disabled={!allConnected}
            className={cn(
              "px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl flex items-center gap-3",
              allConnected
                ? "bg-primary text-primary-foreground hover:scale-105 hover:shadow-primary/25"
                : "bg-secondary text-muted-foreground opacity-0 translate-y-10"
            )}
          >
            <span>Continue to Chat</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
