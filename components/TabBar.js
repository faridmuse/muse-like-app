import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from './Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  { icon: 'message-circle', active: true },
  { icon: 'file-text', active: false },
  { icon: 'zap', active: false },
  { icon: 'check-square', active: false },
  { icon: 'grid', active: false },
];

export default function TabBar({ onTabBarHeight }) {
  const insets = useSafeAreaInsets();
  return (
    <View onLayout={(e) => onTabBarHeight?.(e.nativeEvent.layout.height)} style={[styles.bar, { paddingBottom: 12 + insets.bottom }, styles.absolute]}>
      {TABS.map((tab, i) => (
        <TouchableOpacity key={i} activeOpacity={0.7} style={styles.tab}>
          <Icon name={tab.icon} size={24} color={tab.active ? '#fff' : '#888'} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12 },
  // Absolute at the screen bottom: the TabBar never moves with the keyboard.
  // When the keyboard opens it sits behind it (the composer above moves up
  // via the content padding in App.js); when closed it sits above nothing.
  absolute: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  tab: { padding: 6 },
});
