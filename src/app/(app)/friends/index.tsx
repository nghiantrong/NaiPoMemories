import React from 'react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Header } from '@/components/layout/Header';
import { FriendsScreen as FriendsContent } from '@/features/friends/components/FriendsScreen';

export default function FriendsScreen() {
  return (
    <ScreenContainer padded={false} edges={['top']}>
      <Header title="Friends" />
      <FriendsContent />
    </ScreenContainer>
  );
}
