import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { styles } from './Avatar.styles';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  displayName?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  showBorder?: boolean;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: spacing.avatarSm,   // 32
  md: spacing.avatarMd,   // 48
  lg: spacing.avatarLg,   // 72
  xl: spacing.avatarXl,   // 100
};

const fontSizeMap: Record<AvatarSize, number> = {
  sm: 12,
  md: 18,
  lg: 28,
  xl: 38,
};

const borderWidthMap: Record<AvatarSize, number> = {
  sm: 2,
  md: 2,
  lg: 3,
  xl: 3,
};

/** Returns the first letter of a display name for the fallback placeholder */
function getInitials(name?: string): string {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
}

export function Avatar({ uri, displayName, size = 'md', style, showBorder = true }: AvatarProps) {
  const dimension = sizeMap[size];
  const bw = borderWidthMap[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          borderWidth: showBorder ? bw : 0,
        },
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
