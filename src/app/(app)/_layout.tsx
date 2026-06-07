import { Tabs, Redirect } from 'expo-router';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { routes } from '@/constants/routes';
import { colors } from '@/theme/colors';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// ─── Shutter Camera Button (elevated, matches Stitch exactly) ────────────────
function ShutterTabButton({ onPress, focused }: { onPress: () => void; focused: boolean }) {
  const pingAnim = useRef(new Animated.Value(1)).current;
  const pingOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pingAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
          Animated.timing(pingOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pingAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(pingOpacity, { toValue: 0.3, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Pressable
      onPress={onPress}
      style={shutterStyles.wrapper}
      hitSlop={8}
    >
      {/* Ping ring */}
      <Animated.View
        style={[
          shutterStyles.pingRing,
          { transform: [{ scale: pingAnim }], opacity: pingOpacity },
        ]}
      />
      {/* White outer ring (Stitch: w-24 h-24, border-3 white/90) */}
      <View style={shutterStyles.outerRing}>
        {/* Matcha inner button (Stitch: w-20 h-20, bg-primary-container, shutter-glow) */}
        <View style={shutterStyles.innerButton}>
          <Text style={shutterStyles.cameraIcon}>📷</Text>
        </View>
      </View>
    </Pressable>
  );
}

const shutterStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32, // float above bar
    width: 96,
    height: 96,
    zIndex: 10,
    elevation: 12,
  },
  pingRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    opacity: 0.2,
  },
  // Stitch: w-24 h-24 border-[3px] border-white/90 shutter-glow
  outerRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.4,
    elevation: 8,
  },
  // Stitch: w-20 h-20 bg-primary-container (matcha green #a4c639)
  innerButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryLight, // #a4c639
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cameraIcon: {
    fontSize: 28,
  },
});

// ─── Custom Tab Bar (matches Stitch nav exactly) ────────────────────────────────
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom + 12, 20);

  const currentIndex = state.index;

  // Navigate to a tab by its index in the state.routes array
  const navigateToIdx = (idx: number) => {
    if (idx < 0) return;
    const route = state.routes[idx];
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  // Find indices for each route
  const feedIdx = state.routes.findIndex((r) => r.name === 'feed/index');
  const friendsIdx = state.routes.findIndex((r) => r.name === 'friends/index');
  const cameraIdx = state.routes.findIndex((r) => r.name === 'camera/index');

  // Hide the tab bar completely on the camera screen
  const currentRouteName = state.routes[currentIndex]?.name;
  if (currentRouteName === 'camera/index') {
    return null;
  }

  return (
    <View style={[tabStyles.container, { bottom }]} pointerEvents="box-none">
      {/* Background with BlurView and rounded corners */}
      <View style={tabStyles.background}>
        <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
      </View>

      {/* Left: Feed (Stitch: auto_awesome_motion) */}
      <Pressable
        onPress={() => navigateToIdx(feedIdx)}
        style={tabStyles.tabItem}
      >
        <View style={[tabStyles.iconCircle, currentIndex === feedIdx && tabStyles.iconCircleActive]}>
          <Text style={tabStyles.emoji}>✨</Text>
        </View>
      </Pressable>

      {/* Center: Elevated Camera Shutter (Stitch: -top-8) */}
      <ShutterTabButton
        onPress={() => navigateToIdx(cameraIdx)}
        focused={currentIndex === cameraIdx}
      />

      {/* Right: Friends */}
      <Pressable
        onPress={() => navigateToIdx(friendsIdx)}
        style={tabStyles.tabItem}
      >
        <View style={[tabStyles.iconCircle, currentIndex === friendsIdx && tabStyles.iconCircleActive]}>
          <Text style={tabStyles.emoji}>👥</Text>
        </View>
      </Pressable>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  // Stitch: fixed bottom-6 left-1/2 w-[calc(100%-48px)] p-2 bg-surface/70 backdrop-blur-md rounded-full
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    overflow: 'visible',
    zIndex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    overflow: 'hidden',
    backgroundColor: 'rgba(248,251,240,0.70)',
    // Matcha shadow: 0px 8px 24px rgba(164,198,57,0.12)
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.12,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  // Stitch: w-12 h-12 rounded-full hover:bg-secondary-container/50
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: colors.primaryContainer, // ccf05f
  },
  emoji: {
    fontSize: 22,
  },
});

// ─── App Layout ───────────────────────────────────────────────────────────────
export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href={routes.auth.login} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="feed/index" />
      <Tabs.Screen name="camera/index" />
      <Tabs.Screen name="friends/index" />
      <Tabs.Screen name="profile/index" options={{ href: null }} />
    </Tabs>
  );
}
