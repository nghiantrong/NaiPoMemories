import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { FeedList } from '@/features/posts/components/FeedList';
import { useAuthStore } from '@/store/auth.store';

export default function FeedScreen() {
  const { user } = useAuthStore();

  return (
    <ScreenContainer padded={false} edges={['top']}>
      <Header title="NaiPoMemories" />
      <FeedList userId={user?.uid ?? ''} />
    </ScreenContainer>
  );
}
