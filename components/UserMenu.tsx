'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogoutButton } from './LogoutButton';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import Link from 'next/link';

export function UserMenu() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.photoURL || undefined} />
          <AvatarFallback>
            {user.displayName?.charAt(0) || user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex flex-col items-start gap-1">
          <span className="font-medium">{user.displayName}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/perfil" className="cursor-pointer">
            Meu Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 