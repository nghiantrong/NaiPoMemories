import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export function Header({
  title,
  showBack = false,
  rightAction,
  transparent = false,
  style,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.container, transparent ? styles.transparent : styles.solid, style]}>
      <View style={styles.left}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.right}>
        {rightAction ?? <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
  },
  solid: {
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  transparent: {
    backgroundColor: colors.transparent,
  },
  left: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  right: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  title: {
    ...typography.headlineSm,
    color: colors.onSurface,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 22,
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
});
