import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  displayName?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: spacing.avatarSm,
  md: spacing.avatarMd,
  lg: spacing.avatarLg,
  xl: spacing.avatarXl,
};

const fontSizeMap: Record<AvatarSize, number> = {
  sm: 12,
  md: 18,
  lg: 28,
  xl: 38,
};

/** Returns the first letter of a display name for the fallback placeholder */
function getInitials(name?: string): string {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
}

export function Avatar({ uri, displayName, size = 'md', style }: AvatarProps) {
  const dimension = sizeMap[size];

  return (
    <View
      style={[
        styles.container,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius: dimension / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize: fontSizeMap[size] }]}>
          {getInitials(displayName)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
