import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: colors.primaryContainer, // #ccf05f — soft glow border
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    ...typography.headlineMd,
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },
});
