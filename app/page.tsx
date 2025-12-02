import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ArrowRight, Zap, Shield, Sparkles, Database, MessageSquare, Github, Inbox, Search, Brain, Layers, Command, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { MasonryGrid } from '@/components/MasonryGrid';
import { cn } from '@/lib/utils';

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/connections');
  }

  const features = [
    {
      title: 'Unified Integrations',
      description: 'Connect Google Drive, Slack, GitHub, Gmail, and Google Chat seamlessly.',
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-950/30',
      height: 'h-64',
    },
    {
      title: 'AI-Powered Chat',
      description: 'Chat with an intelligent agent that understands your workspace context.',
      icon: Sparkles,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      darkBgColor: 'dark:bg-pink-950/30',
      height: 'h-80',
    },
    {
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We only access what you explicitly authorize.',
      icon: Shield,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-950/30',
      height: 'h-56',
    },
    {
      title: 'Smart Search',
      description: 'Find files, messages, and code across all your platforms instantly.',
      icon: Search,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      darkBgColor: 'dark:bg-orange-950/30',
      height: 'h-72',
    },
    {
      title: 'Context Aware',
      description: 'The agent understands the relationships between your different work items.',
      icon: Brain,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-950/30',
      height: 'h-60',
    },
  ];

  const useCases = [
    {
      title: "Project Catch-up",
      description: "Summarize all Slack messages and GitHub PRs for a specific project from the last week.",
      icon: Layers,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      darkBgColor: "dark:bg-indigo-950/30",
    },
    {
      title: "Cross-Platform Search",
      description: "Find that one design document that might be in Drive, Slack, or an email attachment.",
      icon: Search,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      darkBgColor: "dark:bg-rose-950/30",
    },
    {
      title: "Meeting Prep",
      description: "Get a briefing on a client including recent emails, chat history, and shared docs.",
      icon: Command,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      darkBgColor: "dark:bg-amber-950/30",
    },
  ];

  const faqs = [
    {
      question: "Is my data secure?",
      answer: "Yes, absolutely. We use industry-standard encryption and OAuth 2.0. We never store your raw passwords and only access data you explicitly authorize."
    },
    {
      question: "Which platforms do you support?",
      answer: "Currently we support Google Drive, Slack, GitHub, Gmail, and Google Chat. We are constantly adding more integrations."
    },
    {
      question: "Can I disconnect tools later?",
      answer: "Yes, you have full control. You can disconnect any tool at any time from your settings dashboard."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! You can get started for free and connect up to 3 tools to try out the power of unified workspace search."
    }
  ];

  const integrations = [
    { icon: Database, label: 'Google Drive', color: 'text-blue-500' },
    { icon: MessageSquare, label: 'Slack', color: 'text-purple-500' },
    { icon: Github, label: 'GitHub', color: 'text-gray-700' },
    { icon: Inbox, label: 'Gmail', color: 'text-red-500' },
    { icon: MessageSquare, label: 'Google Chat', color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <SignedOut>
          {/* Hero Section */}
          <div className="text-center mb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm font-medium mb-8 text-muted-foreground border border-border/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The new way to work</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
              Get your next <br />
              <span className="text-primary relative inline-block">
                work breakthrough
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect your tools, explore your data, and let AI help you find what you need across your entire workspace.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <SignUpButton mode="modal">
                <button className="bg-primary text-primary-foreground rounded-full font-bold text-lg px-10 py-5 hover:opacity-90 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="bg-secondary text-secondary-foreground rounded-full font-bold text-lg px-10 py-5 hover:bg-secondary/80 transition-all hover:scale-105">
                  View Demo
                </button>
              </SignInButton>
            </div>
          </div>

          {/* Masonry Feature Grid */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
              <p className="text-muted-foreground">Powerful features to supercharge your productivity</p>
            </div>
            <MasonryGrid>
              {/* Promo Card - Gradient */}
              <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-8 text-white h-96 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">All your tools.</h3>
                  <h3 className="text-3xl font-bold text-white/80">One interface.</h3>
                </div>
                <div className="flex gap-2">
                  {integrations.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                  ))}
                </div>
              </div>

              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "group relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default border border-border/50 bg-card hover:border-primary/20",
                    feature.height
                  )}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors", feature.bgColor, feature.darkBgColor)}>
                      <feature.icon className={cn("w-6 h-6", feature.color)} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </MasonryGrid>
          </div>

          {/* How It Works Section */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">How it works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to unify your workspace and boost your productivity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  step: "01", 
                  title: "Connect", 
                  desc: "Securely link your favorite tools like Slack, Drive, and GitHub.", 
                  icon: Zap,
                  color: "text-blue-500",
                  bgColor: "bg-blue-50/50",
                  borderColor: "border-blue-100"
                },
                { 
                  step: "02", 
                  title: "Analyze", 
                  desc: "Our AI indexes your data to understand context and relationships.", 
                  icon: Brain,
                  color: "text-purple-500",
                  bgColor: "bg-purple-50/50",
                  borderColor: "border-purple-100"
                },
                { 
                  step: "03", 
                  title: "Chat", 
                  desc: "Ask questions and get answers from across your entire workspace.", 
                  icon: MessageSquare,
                  color: "text-pink-500",
                  bgColor: "bg-pink-50/50",
                  borderColor: "border-pink-100"
                }
              ].map((item, i) => (
                <div key={i} className={cn(
                  "relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group",
                  item.bgColor,
                  item.borderColor
                )}>
                  <div className={cn("text-6xl font-bold mb-6 opacity-20 transition-opacity group-hover:opacity-100", item.color)}>{item.step}</div>
                  <div className={cn("absolute top-8 right-8 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-white dark:bg-card transition-transform group-hover:scale-110", item.color)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mb-32">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-4">Built for your workflow</h2>
                <p className="text-xl text-muted-foreground">See how others are using Lyzr to save time.</p>
              </div>
              <SignUpButton mode="modal">
                <button className="text-primary font-bold hover:underline flex items-center gap-2">
                  View all use cases <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {useCases.map((useCase, i) => (
                <div key={i} className={cn("p-8 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-border/50", useCase.bgColor, useCase.darkBgColor)}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-background/50 backdrop-blur-sm", useCase.color)}>
                    <useCase.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-32 max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about the product and billing.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{faq.question}</h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mb-24">
            <div className="bg-primary text-primary-foreground rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to transform your workflow?</h2>
                <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 leading-relaxed">
                  Join thousands of teams who are already working smarter with Lyzr.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <SignUpButton mode="modal">
                    <button className="bg-background text-foreground rounded-full font-bold text-lg px-10 py-5 hover:scale-105 transition-transform shadow-xl">
                      Get Started for Free
                    </button>
                  </SignUpButton>
                </div>
                <p className="mt-8 text-sm text-primary-foreground/60 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> No credit card required
                  <span className="mx-2">•</span>
                  <CheckCircle2 className="w-4 h-4" /> 14-day free trial
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border py-12 text-center text-muted-foreground">
            <div className="flex justify-center gap-8 mb-8">
              <Github className="w-6 h-6 hover:text-foreground transition-colors cursor-pointer" />
              <div className="w-6 h-6 hover:text-foreground transition-colors cursor-pointer font-bold">𝕏</div>
              <MessageSquare className="w-6 h-6 hover:text-foreground transition-colors cursor-pointer" />
            </div>
            <p>&copy; {new Date().getFullYear()} Lyzr AI. All rights reserved.</p>
          </footer>
        </SignedOut>

        <SignedIn>
          <div className="text-center flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-semibold">Redirecting to your workspace...</p>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
