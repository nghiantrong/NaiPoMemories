import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ProfileContent } from '@/features/profile/components/ProfileContent';

export default function ProfileScreen() {
  return (
    <ScreenContainer padded={false} edges={['top']}>
      <Header title="Profile" />
      <ProfileContent />
    </ScreenContainer>
  );
}
