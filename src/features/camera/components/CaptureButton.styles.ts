import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  glowRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    opacity: 0.2,
  },
  outerRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.background,
    borderWidth: 8,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.shutterGlow,
  },
  button: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight, // #a4c639 matcha green
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.shutterGlow,
  },
  buttonRecording: {
    backgroundColor: colors.error,
  },
  icon: {
    fontSize: 32,
  },
  stopIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: colors.onError,
  },
});
