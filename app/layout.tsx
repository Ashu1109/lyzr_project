import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI Workspace - Visual Discovery',
  description: 'Explore and connect with AI tools in a visual way.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
          <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-between items-center gap-4">
                {/* Logo Area */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.65 0-5.789 2.738-5.789 5.57 0 1.103.425 2.286.956 2.929.105.128.12.24.089.372-.098.403-.319 1.287-.363 1.466-.057.232-.185.281-.426.169-1.587-.741-2.576-3.057-2.576-4.922 0-4.007 2.908-7.684 8.388-7.684 4.405 0 7.828 3.14 7.828 7.334 0 4.376-2.759 7.896-6.591 7.896-1.288 0-2.498-.669-2.913-1.458 0 0-.698 2.656-.868 3.309-.314 1.208-1.164 2.722-1.734 3.633 1.303.385 2.686.595 4.114.595 6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                    </svg>
                  </div>
                  <span className="hidden md:block text-lg font-bold tracking-tight text-foreground">
                    Lyzr
                  </span>
                </div>

                {/* Search Bar Placeholder - Centered */}
                <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-11 pr-4 py-3 bg-secondary/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all hover:bg-secondary placeholder:text-muted-foreground"
                      placeholder="Search for agents, tools, and workflows..."
                    />
                  </div>
                </div>

                {/* Auth & Actions */}
                <div className="flex items-center gap-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary rounded-full transition-colors">
                        Log in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-4 py-2 text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full transition-colors">
                        Sign up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors" aria-label="Notifications">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </button>
                      <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors" aria-label="Messages">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </button>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8"
                          }
                        }}
                      />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          <main className="pt-20 min-h-screen">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}