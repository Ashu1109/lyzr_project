'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Mail, Database, Check, Loader2, Inbox, ArrowRight, Search, X, AlertTriangle } from 'lucide-react';
import { MasonryGrid } from '@/components/MasonryGrid';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Connection {
  connected: boolean;
  connectedAt?: string;
}

interface UserConnections {
  googleDrive?: Connection;
  slack?: Connection;
  github?: Connection;
  gmail?: Connection;
}

interface ClientConnectionsPageProps {
  initialConnections: UserConnections;
}

export function ClientConnectionsPage({ initialConnections }: ClientConnectionsPageProps) {
  const router = useRouter();
  const [connections, setConnections] = useState<UserConnections>(initialConnections);
  const [connectingService, setConnectingService] = useState<string | null>(null);
  const [disconnectingService, setDisconnectingService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [serviceToDisconnect, setServiceToDisconnect] = useState<{ service: 'googleDrive' | 'slack' | 'github' | 'gmail'; name: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/connections');
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || {});
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const handleConnect = async (service: 'googleDrive' | 'slack' | 'github' | 'gmail') => {
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

  const openDisconnectDialog = (service: 'googleDrive' | 'slack' | 'github' | 'gmail') => {
    const serviceName = services.find(s => s.service === service)?.name || service;
    setServiceToDisconnect({ service, name: serviceName });
    setDisconnectDialogOpen(true);
  };

  const confirmDisconnect = async () => {
    if (!serviceToDisconnect) return;

    const { service } = serviceToDisconnect;
    setDisconnectingService(service);
    setDisconnectDialogOpen(false);

    try {
      const response = await fetch('/api/connections/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchConnections();
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setSuccessMessage(data.error || 'Failed to disconnect');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error);
      setSuccessMessage('Failed to disconnect service');
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setDisconnectingService(null);
      setServiceToDisconnect(null);
    }
  };

  const handleContinue = () => {
    router.push('/chat');
  };

  const anyConnected = connections.googleDrive?.connected ||
                       connections.slack?.connected ||
                       connections.github?.connected ||
                       connections.gmail?.connected;

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
  ];

  const categories = ['All', 'Communication', 'Storage', 'Developer'];

  const filteredServices = services.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                {connections[item.service]?.connected ? (
                  <button
                    onClick={() => openDisconnectDialog(item.service)}
                    disabled={disconnectingService === item.service}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
                      "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20"
                    )}
                  >
                    {disconnectingService === item.service ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Disconnect
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(item.service)}
                    disabled={connectingService === item.service}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
                      "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg"
                    )}
                  >
                    {connectingService === item.service ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </MasonryGrid>

      {/* Continue Button - Shows when at least one service is connected */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={handleContinue}
            disabled={!anyConnected}
            className={cn(
              "px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl flex items-center gap-3",
              anyConnected
                ? "bg-primary text-primary-foreground hover:scale-105 hover:shadow-primary/25"
                : "bg-secondary text-muted-foreground opacity-50 cursor-not-allowed"
            )}
          >
            <span>Continue to Chat</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Helper text */}
      {!anyConnected && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none">
          <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            Connect at least one service to continue
          </p>
        </div>
      )}

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle>Disconnect {serviceToDisconnect?.name}?</DialogTitle>
            </div>
            <DialogDescription className="pt-3">
              Are you sure you want to disconnect {serviceToDisconnect?.name}? You will lose access to data from this service until you reconnect it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setDisconnectDialogOpen(false)}
              className="px-4 py-2 rounded-lg font-medium text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDisconnect}
              className="px-4 py-2 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-background border border-border rounded-lg shadow-lg p-4 max-w-md flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
