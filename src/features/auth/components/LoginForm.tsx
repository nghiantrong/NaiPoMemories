import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../hooks/useLogin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginSchema = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export function LoginForm({ onNavigateToRegister }: LoginFormProps) {
  const { login, isLoading, error, reset } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginSchema) => {
    reset();
    await login(data).catch(() => {
      // Error is handled in the hook and surfaced via `error`
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back 👋</Text>
      <Text style={styles.subtitle}>Sign in to NaiPoMemories</Text>

      <View style={styles.fields}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="••••••"
              secureTextEntry={!showPassword}
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              rightIcon={
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              }
              onRightIconPress={() => setShowPassword((prev) => !prev)}
            />
          )}
        />
      </View>

      {error && <Text style={styles.serverError}>{error}</Text>}

      <Button
        label="Sign In"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        fullWidth
      />

      <Pressable onPress={onNavigateToRegister} style={styles.linkRow}>
        <Text style={styles.linkText}>
          Don't have an account?{' '}
          <Text style={styles.link}>Sign up</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  title: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: -spacing.md,
  },
  fields: {
    gap: spacing.md,
  },
  serverError: {
    ...typography.bodyMd,
    color: colors.error,
    textAlign: 'center',
  },
  eyeIcon: {
    fontSize: 16,
  },
  linkRow: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});
