import { View, StyleSheet } from 'react-native';
import { FeedList } from '@/features/posts/components/FeedList';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme/colors';

export default function FeedScreen() {
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      <FeedList userId={user?.uid ?? ''} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
