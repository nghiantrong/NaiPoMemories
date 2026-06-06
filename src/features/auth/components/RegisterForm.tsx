import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../hooks/useRegister';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Display name must be at least 2 characters.')
      .max(50, 'Display name must be 50 characters or fewer.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onNavigateToLogin: () => void;
}

export function RegisterForm({ onNavigateToLogin }: RegisterFormProps) {
  const { register, isLoading, error, reset } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterSchema) => {
    reset();
    await register(data).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account ✨</Text>
      <Text style={styles.subtitle}>Join NaiPoMemories</Text>

      <View style={styles.fields}>
        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Display Name"
              placeholder="Your name"
              autoCapitalize="words"
              autoComplete="name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.displayName?.message}
            />
          )}
        />

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
              placeholder="Min. 6 characters"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm Password"
              placeholder="Repeat your password"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />
      </View>

      {error && <Text style={styles.serverError}>{error}</Text>}

      <Button
        label="Create Account"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        fullWidth
      />

      <Pressable onPress={onNavigateToLogin} style={styles.linkRow}>
        <Text style={styles.linkText}>
          Already have an account?{' '}
          <Text style={styles.link}>Sign in</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  title: { ...typography.headlineLg, color: colors.onSurface },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: -spacing.md,
  },
  fields: { gap: spacing.md },
  serverError: {
    ...typography.bodyMd,
    color: colors.error,
    textAlign: 'center',
  },
  eyeIcon: { fontSize: 16 },
  linkRow: { alignItems: 'center', paddingVertical: spacing.sm },
  linkText: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  link: { color: colors.primary, fontWeight: '700' },
});
