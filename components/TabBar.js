import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const TABS = [
  { icon: 'message-circle', active: true },
  { icon: 'file-text', active: false },
  { icon: 'lightbulb', active: false },
  { icon: 'check-square', active: false },
  { icon: 'grid', active: false },
];

export default function TabBar() {
  return (
    <View style={styles.bar}>
      {TABS.map((tab, i) => (
        <TouchableOpacity key={i} activeOpacity={0.7} style={styles.tab}>
          <Feather name={tab.icon} size={24} color={tab.active ? '#fff' : '#888'} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12 },
  tab: { padding: 6 },
});
