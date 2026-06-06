"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Settings, Moon, Sun, Flag, Info, LogOut } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { signOutUser } from '@/services/auth/authService';

export function SettingsMenu() {
  const { data: session } = useSession();
  const [isDark, setIsDark] = useState(false);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toast.success(`Switched to ${newIsDark ? 'dark' : 'light'} mode`);
  };

  const handleReportIssue = () => {
    if (!issueDescription.trim()) {
      toast.error('Please describe the issue');
      return;
    }
    
    // Simulate issue submission
    toast.success('Issue reported successfully. Thank you for your feedback!');
    setIssueDescription('');
    setShowIssueDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={toggleTheme}>
            {isDark ? (
              <>
                <Sun className="size-4 mr-2" />
                Switch to Light Mode
              </>
            ) : (
              <>
                <Moon className="size-4 mr-2" />
                Switch to Dark Mode
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />

          {session?.user?.email && (
            <>
              <DropdownMenuItem onClick={() => signOutUser()}>
                <LogOut className="size-4 mr-2" />
                Sign out
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={() => setShowIssueDialog(true)}>
            <Flag className="size-4 mr-2" />
            Report an Issue
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/about">
              <Info className="size-4 mr-2" />
              About
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Issue Report Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>
              Let us know if you've encountered any problems or have suggestions for improvement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issue">Describe the issue</Label>
              <Textarea
                id="issue"
                placeholder="Please provide details about the issue you're experiencing..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowIssueDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReportIssue}>
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
