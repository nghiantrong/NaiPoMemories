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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const isDisabled = disabled ?? isLoading;

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
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? colors.onPrimary : colors.primary}
          />
        ) : (
          <>
            {leftIcon}
            <Text style={[textStyles.label, textStyles[`labelVariant_${variant}`], textStyles[`labelSize_${size}`]]}>
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
    ...shadows.md,
  } as ViewStyle,
  fullWidth: {
    width: '100%',
  } as ViewStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,

  // Variants
  primary: { backgroundColor: colors.primary } as ViewStyle,
  secondary: { backgroundColor: colors.secondaryContainer } as ViewStyle,
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.none,
  } as ViewStyle,
  ghost: { backgroundColor: colors.transparent, ...shadows.none } as ViewStyle,
  danger: { backgroundColor: colors.error } as ViewStyle,

  // Sizes
  size_sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, minHeight: 36 } as ViewStyle,
  size_md: { paddingVertical: spacing.buttonPaddingVertical, paddingHorizontal: spacing.buttonPaddingHorizontal, minHeight: 52 } as ViewStyle,
  size_lg: { paddingVertical: spacing[4] + 2, paddingHorizontal: spacing.xl, minHeight: 58 } as ViewStyle,
});

const textStyles = StyleSheet.create({
  label: { ...typography.button } as TextStyle,
  labelVariant_primary: { color: colors.onPrimary } as TextStyle,
  labelVariant_secondary: { color: colors.primary } as TextStyle,
  labelVariant_outline: { color: colors.primary } as TextStyle,
  labelVariant_ghost: { color: colors.primary } as TextStyle,
  labelVariant_danger: { color: colors.onError } as TextStyle,
  labelSize_sm: { fontSize: 14 } as TextStyle,
  labelSize_md: { fontSize: 16 } as TextStyle,
  labelSize_lg: { fontSize: 18 } as TextStyle,
});

