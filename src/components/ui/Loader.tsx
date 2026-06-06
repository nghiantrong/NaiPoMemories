import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  /** Optional label shown below the spinner */
  label?: string;
  fullScreen?: boolean;
}

export function Loader({
  size = 'large',
  color = colors.primary,
  style,
  label,
  fullScreen = false,
}: LoaderProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
});
