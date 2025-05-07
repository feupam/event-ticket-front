'use client';

import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilePage() {
  const { profile, loading, error } = useUserProfile();
  const router = useRouter();

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex min-h-screen items-center justify-center">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-red-600">Erro ao carregar perfil</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button onClick={() => router.refresh()} className="mt-4">
              Tentar novamente
            </Button>
          </Card>
        </div>
      ) : (
        <div className="container py-10">
          <ProfileForm initialData={profile} />
        </div>
      )}
    </ProtectedRoute>
  );
} 