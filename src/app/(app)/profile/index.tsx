import { View, StyleSheet } from 'react-native';
import { ProfileContent } from '@/features/profile/components/ProfileContent';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ProfileContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
