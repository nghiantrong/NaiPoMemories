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
import { styles } from './LoginForm.styles';

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
          source={{ uri: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', colors.background]}
          style={StyleSheet.absoluteFill}
        />

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida/AP1WRLt_5nkeclwwXSRcLfjbMMXCpUh6WTFaYLMbycaKYqKhHwGkl9ysc0Js6CyWzzIMi65LooPXqNfW5ltX3VzWIUgq6AmuZYucdVReiYUXLI7KnmKPShN56O15cXQFeY-DjSJdJOQ0iVWQI8cWe2sp06_O1SGmC150B2wLN3ZBhujpm_TUo6eq4Rt8-Rjpj05bC80u9zsAuwfq5UyedX8qH7-2CWVpjmwRDexW5YJ4qDdMK6XmwFeTNqB74p56' }}
              style={styles.logoImage}
            />
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
