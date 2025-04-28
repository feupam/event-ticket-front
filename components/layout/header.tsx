"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, Ticket, Sun, Moon } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/eventos' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();
  
  useEffect(() => {
    // Verifica o tema salvo no localStorage ou a preferência do sistema
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">EventFlow</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground/80"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-foreground/80 hover:text-primary transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
          
          <Link
            href="/account"
            className="text-sm font-medium text-foreground/80 hover:text-primary"
          >
            My Account
          </Link>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Ticket className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg text-foreground">EventFlow</span>
                  </Link>
                  <button
                    type="button"
                    className="p-2 rounded-md text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-6 flow-root">
                  <div className="flex flex-col gap-6 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "text-base font-medium transition-colors hover:text-primary",
                          pathname === item.href ? "text-primary" : "text-foreground/80"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6 flex items-center justify-between">
                    <button
                      onClick={() => {
                        toggleTheme();
                        setMobileMenuOpen(false);
                      }}
                      className="text-base font-medium text-foreground/80 hover:text-primary flex items-center gap-2"
                    >
                      {theme === 'light' ? (
                        <>
                          <Moon className="h-5 w-5" />
                          <span>Dark Mode</span>
                        </>
                      ) : (
                        <>
                          <Sun className="h-5 w-5" />
                          <span>Light Mode</span>
                        </>
                      )}
                    </button>
                    
                    <Link
                      href="/account"
                      className="text-base font-medium text-foreground/80 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}