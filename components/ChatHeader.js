import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from './Icon';

export default function ChatHeader({ onMenuPress, status }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress} activeOpacity={0.7} style={styles.sideButton}>
        <Icon name="menu" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.center}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View style={styles.namePill}>
          <Text style={styles.name}>Ai-Chan</Text>
          {status ? <Text style={styles.status}>{status}</Text> : null}
        </View>
      </View>
      <View style={styles.sideSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: (StatusBar.currentHeight || 0) + 12, paddingBottom: 8 },
  sideButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center' },
  sideSpacer: { width: 44 },
  center: { flex: 1, alignItems: 'center' },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#f9a8d4', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#000', fontSize: 28, fontFamily: 'OptimisticApp-Bold' },
  namePill: { backgroundColor: '#262626', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginTop: -12, alignItems: 'center' },
  name: { color: '#fff', fontSize: 14, fontFamily: 'OptimisticApp-Bold' },
  status: { color: '#888', fontSize: 12, fontFamily: 'OptimisticApp', marginTop: 2 },
});
