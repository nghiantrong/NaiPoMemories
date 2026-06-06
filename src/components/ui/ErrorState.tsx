import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  style,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          label={retryLabel}
          variant="outline"
          size="sm"
          onPress={onRetry}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenPaddingHorizontal,
    gap: spacing.md,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    ...typography.headlineSm,
    color: colors.onSurface,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.sm,
  },
});
