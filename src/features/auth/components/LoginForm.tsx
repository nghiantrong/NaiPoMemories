import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../hooks/useLogin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HERO_HEIGHT = SCREEN_HEIGHT * 0.35;

const loginSchema = z.object({
  email: z.string().email('Vui lòng nhập email hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
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
    await login(data).catch(() => {});
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
      {/* ── Hero Header ── */}
      <View style={[styles.heroContainer, { height: HERO_HEIGHT }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', colors.background]}
          style={StyleSheet.absoluteFill}
        />

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>🍃</Text>
          </View>
          <Text style={styles.appName}>NaiPoMemories</Text>
        </View>
      </View>

      {/* ── Glass Panel ── */}
      <View style={styles.glassWrapper}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.glassContent}>
          <View style={styles.headingGroup}>
            <Text style={styles.heading}>Chào mừng bạn! 👋</Text>
            <Text style={styles.subheading}>
              Hãy cùng chia sẻ những khoảnh khắc chân thực nhất.
            </Text>
          </View>

          {/* Form */}
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
                  label="Mật khẩu"
                  placeholder="Tối thiểu 6 ký tự"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
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
          </View>

          {error && <Text style={styles.serverError}>{error}</Text>}

          <Button
            label="Đăng nhập"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            fullWidth
            size="lg"
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Chưa có tài khoản?</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable onPress={onNavigateToRegister} style={styles.signupBtn}>
            <Text style={styles.signupText}>Tạo tài khoản mới</Text>
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
  },

  // Hero
  heroContainer: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '3deg' }],
    ...shadows.shutterGlow,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    ...typography.headlineLg,
    color: colors.primary,
    letterSpacing: -0.5,
  },

  // Glass panel
  glassWrapper: {
    marginHorizontal: spacing.screenPaddingHorizontal,
    marginTop: -spacing.xl,
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
  eyeIcon: {
    fontSize: 16,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  dividerText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },

  // Sign up link as button
  signupBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  signupText: {
    ...typography.button,
    color: colors.primary,
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
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.secondaryContainer,
    opacity: 0.25,
  },
});
