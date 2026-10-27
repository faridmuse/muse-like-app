import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SIDEBAR_WIDTH = Math.round(Dimensions.get('window').width * 0.78);

const TABS = [
  { icon: 'message-circle', label: 'Obrolan utama', active: true },
  { icon: 'file-text', label: 'Kabar', active: false },
  { icon: 'lightbulb', label: 'Ide', active: false },
  { icon: 'check-square', label: 'Sasaran', active: false },
  { icon: 'grid', label: 'Perpustakaan', active: false },
];

export default function Sidebar({ open }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: open ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [open, widthAnim]);

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SIDEBAR_WIDTH],
  });

  return (
    <Animated.View style={[styles.sidebar, { width }]}>
      <View style={styles.inner}>
        <Text style={styles.title}>Ai-Chan</Text>
        <Text style={styles.sectionTitle}>TAB</Text>
        <Text style={styles.hint}>Anda bisa mengurutkan ulang dengan menekan lama</Text>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.label} activeOpacity={0.7} style={[styles.tabRow, tab.active && styles.tabRowActive]}>
            <Feather name={tab.icon} size={20} color={tab.active ? '#fff' : '#aaa'} style={styles.tabIcon} />
            <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.sideHeader}>
          <Text style={styles.sectionTitle}>OBROLAN SELINGAN</Text>
          <Feather name="archive" size={18} color="#aaa" />
        </View>
        <Text style={styles.emptyText}>Akan muncul di sini jika Anda memulai.</Text>
        <View style={{ flex: 1 }} />
        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.7} style={styles.bottomCircle}>
            <Feather name="settings" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.searchPill}>
            <Feather name="search" size={18} color="#fff" style={styles.searchIcon} />
            <Text style={styles.searchLabel}>Cari</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.bottomCircle}>
            <Feather name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: { backgroundColor: '#000', overflow: 'hidden' },
  inner: { width: SIDEBAR_WIDTH, flex: 1, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 24 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  sectionTitle: { color: '#888', fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },
  hint: { color: '#888', fontSize: 13, marginTop: 6, marginBottom: 12 },
  tabRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12 },
  tabRowActive: { backgroundColor: '#262626' },
  tabIcon: { marginRight: 12 },
  tabLabel: { color: '#aaa', fontSize: 16 },
  tabLabelActive: { color: '#fff' },
  sideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 8 },
  emptyText: { color: '#888', fontSize: 14 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bottomCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center' },
  searchPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#262626', borderRadius: 24, paddingHorizontal: 20, height: 48, flex: 1, marginHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchLabel: { color: '#fff', fontSize: 16 },
});
