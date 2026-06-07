import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { borderRadius, spacing } from '@/theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, leftIcon, rightIcon, onRightIconPress, containerStyle, onFocus, onBlur, ...rest },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);
  const borderWidth = useSharedValue<number>(0);
  const bgColor = useSharedValue<string>(colors.surfaceContainerLow);

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
    borderColor: error ? colors.error : colors.primary,
    backgroundColor: bgColor.value,
  }));

  const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    setIsFocused(true);
    borderWidth.value = withSpring(2, { damping: 20, stiffness: 300 });
    bgColor.value = colors.white;
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
    setIsFocused(false);
    borderWidth.value = withSpring(error ? 1.5 : 0, { damping: 20, stiffness: 300 });
    bgColor.value = colors.surfaceContainerLow;
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputWrapper,
          error && !isFocused && styles.inputError,
          animatedWrapperStyle,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          style={[styles.input, leftIcon ? styles.inputWithLeftIcon : undefined]}
          placeholderTextColor={colors.onSurfaceVariant}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {rightIcon && (
          <Pressable style={styles.iconRight} onPress={onRightIconPress}>
            {rightIcon}
          </Pressable>
        )}
      </Animated.View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.labelLg,
    color: colors.secondary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    overflow: 'hidden',
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSurface,
    paddingHorizontal: spacing.inputPaddingHorizontal,
    paddingVertical: spacing.inputPaddingVertical,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  iconLeft: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  iconRight: {
    paddingRight: spacing.md,
    paddingLeft: spacing.sm,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
    marginLeft: 4,
  },
  hintText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
});
