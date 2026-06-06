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
  const borderColor = useSharedValue<string>(colors.outlineVariant);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    setIsFocused(true);
    borderColor.value = withSpring(colors.primary as string, { damping: 15 });
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
    setIsFocused(false);
    borderColor.value = withSpring((error ? colors.error : colors.outlineVariant) as string, { damping: 15 });
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputWrapper,
          animatedBorderStyle,
          error && styles.inputError,
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
    color: colors.onSurface,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    minHeight: 52,
    overflow: 'hidden',
  },
  inputError: {
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
    paddingLeft: 0,
  },
  iconLeft: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  iconRight: {
    paddingRight: spacing.md,
    paddingLeft: spacing.sm,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
  },
  hintText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
