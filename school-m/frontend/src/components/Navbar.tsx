'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, SquareMenu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';

const Navbar = () => {
  const { setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow z-50 px-4 py-2 flex items-center justify-between">
      {/* Left: Sidebar + Logo */}
      <div className="flex items-center justify-center gap-3">
        <SidebarTrigger />
        <Link
          href="/"
          className="hidden sm:flex border border-red-500 h-9 w-20 hover:text-sky-700 hover:border-sky-700 transition-colors text-center rounded flex items-center justify-center"
        >
          Home
        </Link>
      </div>

      {/* Centered right items */}
      <div className="flex items-center justify-center gap-3">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Sun className="h-5 w-5 transition-all dark:hidden" />
              <Moon className="absolute h-5 w-5 hidden dark:block" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden sm:flex items-center justify-center">
              <SquareMenu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Dashboard</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/students">Student Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/Dashbord">Admin Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/Staff_Dashbord">Staff Dashboard</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Hamburger */}
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <SquareMenu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md sm:hidden p-4 flex flex-col items-center space-y-3">
          <Link href="/" className="block py-2 hover:text-sky-600">
            Home
          </Link>
          <Link href="/students" className="block py-2 hover:text-sky-600">
            Student Dashboard
          </Link>
          <Link href="/Dashbord" className="block py-2 hover:text-sky-600">
            Admin Dashboard
          </Link>
          <Link href="/Staff_Dashbord" className="block py-2 hover:text-sky-600">
            Staff Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
