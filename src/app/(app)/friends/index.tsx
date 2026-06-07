import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FriendsScreen as FriendsContent } from '@/features/friends/components/FriendsScreen';
import { colors } from '@/theme/colors';
import { styles } from './index.styles';

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      <FriendsContent />
    </View>
  );
}
