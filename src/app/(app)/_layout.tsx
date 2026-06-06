import { Tabs, Redirect } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { routes } from '@/constants/routes';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/**
 * App group layout — authenticated tab navigator.
 * If user is NOT authenticated, redirect to login.
 */
export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href={routes.auth.login} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="feed/index"
        options={{ title: 'Feed', tabBarIcon: () => <Text style={styles.tabIcon}>🏠</Text> }}
      />
      <Tabs.Screen
        name="camera/index"
        options={{ title: 'Camera', tabBarIcon: () => <Text style={styles.tabIcon}>📸</Text> }}
      />
      <Tabs.Screen
        name="friends/index"
        options={{ title: 'Friends', tabBarIcon: () => <Text style={styles.tabIcon}>👥</Text> }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{ title: 'Profile', tabBarIcon: () => <Text style={styles.tabIcon}>👤</Text> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    height: spacing.tabBarHeight,
    ...shadows.tabBar,
  },
  tabLabel: {
    ...typography.labelSm,
  },
  tabItem: {
    paddingTop: spacing.xs,
  },
  tabIcon: {
    fontSize: 22,
  },
});
