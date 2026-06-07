import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { styles } from './ScreenContainer.styles';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollViewProps?: Omit<ScrollViewProps, 'children'>;
  /** Add safe area padding at top (set false for screens with custom headers) */
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export function ScreenContainer({
  children,
  scrollable = false,
  padded = true,
  style,
  contentStyle,
  scrollViewProps,
  edges = ['top', 'bottom'],
}: ScreenContainerProps) {
  const paddingStyle = padded && styles.padded;

  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={edges}>
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[paddingStyle, styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, paddingStyle, contentStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
