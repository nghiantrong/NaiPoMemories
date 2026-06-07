import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { borderRadius, spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  style,
  onPress,
  disabled,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 350 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 350 });
  };

  const isDisabled = disabled ?? isLoading;

  const loaderColor =
    variant === 'primary'
      ? colors.onPrimaryContainer
      : variant === 'danger'
      ? colors.onError
      : colors.primary;

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          styles.base,
          styles[variant],
          styles[`size_${size}`],
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
        {...rest}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={loaderColor} />
        ) : (
          <>
            {leftIcon}
            <Text
              style={[
                textStyles.label,
                textStyles[`labelVariant_${variant}`],
                textStyles[`labelSize_${size}`],
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  } as ViewStyle,
  fullWidth: {
    width: '100%',
  } as ViewStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,

  // Variants — primary uses primaryLight (#a4c639) per Stitch "primary-container" button
  primary: {
    backgroundColor: colors.primaryLight,
    ...shadows.md,
  } as ViewStyle,
  secondary: {
    backgroundColor: colors.secondaryContainer,
  } as ViewStyle,
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary,
  } as ViewStyle,
  ghost: {
    backgroundColor: colors.transparent,
  } as ViewStyle,
  danger: {
    backgroundColor: colors.error,
    ...shadows.md,
  } as ViewStyle,

  // Sizes
  size_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  } as ViewStyle,
  size_md: {
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    minHeight: 52,
  } as ViewStyle,
  size_lg: {
    paddingVertical: spacing[4] + 2,
    paddingHorizontal: spacing.xl,
    minHeight: 58,
  } as ViewStyle,
});

const textStyles = StyleSheet.create({
  label: { ...typography.button } as TextStyle,
  // primary text = onPrimaryContainer (dark green #3e5000) per Stitch
  labelVariant_primary: { color: colors.onPrimaryContainer } as TextStyle,
  labelVariant_secondary: { color: colors.primary } as TextStyle,
  labelVariant_outline: { color: colors.primary } as TextStyle,
  labelVariant_ghost: { color: colors.primary } as TextStyle,
  labelVariant_danger: { color: colors.onError } as TextStyle,
  labelSize_sm: { fontSize: 14 } as TextStyle,
  labelSize_md: { fontSize: 16 } as TextStyle,
  labelSize_lg: { fontSize: 18 } as TextStyle,
});
