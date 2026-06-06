import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth.store';
import { useAuthState } from '@/features/auth/hooks/useAuthState';
import { Loader } from '@/components/ui/Loader';
import { colors } from '@/theme/colors';

// Create a single QueryClient instance for the lifetime of the app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

function RootLayoutNav() {
  // Bootstrap Firebase auth listener
  useAuthState();

  const { isInitializing } = useAuthStore();

  if (isInitializing) {
    return <Loader fullScreen label="Loading..." />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
