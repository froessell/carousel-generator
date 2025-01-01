'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmail, signInWithPassword, signUpWithPassword } from '@/lib/supabase';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Magic Link State
  const [magicLinkEmail, setMagicLinkEmail] = useState('');

  // Email/Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicLinkEmail) return;

    setIsLoading(true);
    try {
      const { error } = await signInWithEmail(magicLinkEmail);
      if (error) throw error;
      toast.success('Check your email for the login link!');
      setMagicLinkEmail('');
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast.error(error.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      console.log('Attempting to', isSignUp ? 'sign up' : 'sign in');
      
      if (isSignUp) {
        const { data, error } = await signUpWithPassword(email, password);
        console.log('Sign up response:', { data, error });
        
        if (error) throw error;
        toast.success('Account created! Please sign in.');
        setIsSignUp(false);
      } else {
        const { data, error } = await signInWithPassword(email, password);
        console.log('Sign in response:', { data, error });
        
        if (error) throw error;
        toast.success('Signed in successfully!');
        router.push('/'); // Redirect to home page
        router.refresh(); // Refresh the page to update auth state
      }
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || (isSignUp ? 'Failed to create account' : 'Failed to sign in'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="email-password" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email-password">Email & Password</TabsTrigger>
        <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
      </TabsList>

      <TabsContent value="email-password">
        <form onSubmit={handleEmailPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!email || !password || isLoading}
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="magic-link">
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="magic-link-email">Email</Label>
            <Input
              id="magic-link-email"
              type="email"
              placeholder="Enter your email"
              value={magicLinkEmail}
              onChange={(e) => setMagicLinkEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!magicLinkEmail || isLoading}
          >
            {isLoading ? 'Sending link...' : 'Send Magic Link'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            We'll send you a magic link to sign in
          </p>
        </form>
      </TabsContent>
    </Tabs>
  );
} 