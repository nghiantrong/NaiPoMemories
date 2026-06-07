import { View, StyleSheet } from 'react-native';
import { ProfileContent } from '@/features/profile/components/ProfileContent';
import { colors } from '@/theme/colors';
import { styles } from './index.styles';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ProfileContent />
    </View>
  );
}
