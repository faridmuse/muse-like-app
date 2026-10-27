import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ChatHeader({ onMenuPress }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress} activeOpacity={0.7} style={styles.sideButton}>
        <Feather name="menu" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.center}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View style={styles.namePill}>
          <Text style={styles.name}>Ai-Chan</Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.7} style={styles.inviteButton}>
        <Text style={styles.inviteText}>Undang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: (StatusBar.currentHeight || 0) + 12, paddingBottom: 8 },
  sideButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f9a8d4', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#000', fontSize: 18, fontFamily: 'OptimisticApp-Bold' },
  namePill: { backgroundColor: '#262626', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, marginTop: -12 },
  name: { color: '#fff', fontSize: 14, fontFamily: 'OptimisticApp-Bold' },
  inviteButton: { backgroundColor: '#262626', borderRadius: 20, paddingHorizontal: 16, height: 40, alignItems: 'center', justifyContent: 'center' },
  inviteText: { color: '#fff', fontSize: 15, fontFamily: 'OptimisticApp-Medium' },
});
