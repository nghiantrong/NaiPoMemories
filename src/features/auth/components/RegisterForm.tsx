import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../hooks/useRegister';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự.')
      .max(50, 'Tên hiển thị không được quá 50 ký tự.'),
    email: z.string().email('Vui lòng nhập email hợp lệ.'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
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

  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top}
    >
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
    >
      {/* ── Top section ── */}
      <View style={styles.topSection}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>✨</Text>
        </View>
        <Text style={styles.appName}>NaiPoMemories</Text>
        <Text style={styles.tagline}>Ghi lại từng khoảnh khắc đáng nhớ</Text>
      </View>

      {/* ── Glass Panel ── */}
      <View style={styles.glassWrapper}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.glassContent}>
          <View style={styles.headingGroup}>
            <Text style={styles.heading}>Tạo tài khoản ✨</Text>
            <Text style={styles.subheading}>
              Tham gia cùng bạn bè trên NaiPoMemories
            </Text>
          </View>

          <View style={styles.fields}>
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Tên hiển thị"
                  placeholder="Tên của bạn"
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
                  label="Mật khẩu"
                  placeholder="Tối thiểu 6 ký tự"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  rightIcon={
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                  }
                  onRightIconPress={() => setShowPassword((p) => !p)}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
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
            label="Tạo tài khoản"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            fullWidth
            size="lg"
          />

          <Pressable onPress={onNavigateToLogin} style={styles.loginRow}>
            <Text style={styles.loginText}>
              Đã có tài khoản?{' '}
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Decorative blobs */}
      <View style={styles.blobBottomLeft} />
      <View style={styles.blobTopRight} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },

  // Top branding
  topSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  tagline: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },

  // Glass panel
  glassWrapper: {
    marginHorizontal: spacing.screenPaddingHorizontal,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    ...shadows.lg,
  },
  glassContent: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headingGroup: {
    gap: spacing.xs,
  },
  heading: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  subheading: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  fields: {
    gap: spacing.md,
  },
  serverError: {
    ...typography.bodyMd,
    color: colors.error,
    textAlign: 'center',
  },
  eyeIcon: { fontSize: 16 },

  loginRow: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loginText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Decorative blobs
  blobBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: colors.primaryContainer,
    opacity: 0.15,
  },
  blobTopRight: {
    position: 'absolute',
    top: -40,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.secondaryContainer,
    opacity: 0.2,
  },
});
