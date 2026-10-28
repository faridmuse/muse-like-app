import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderButton from './HeaderButton';
import Icon from './Icon';

// Settings page, matching the Muse Pengaturan screenshot: grouped
// boxes, each row an icon, a label, and a chevron-right, with divider
// lines between rows in a group. Rows are visual only for now, like
// the other placeholder buttons in this app (no action yet).
// Header is the same pattern as chat: a floating header + fade as ONE
// component, content scrolls behind it. The back button reuses the
// same HeaderButton component as the chat hamburger, same place
// (left, 44x44 dark circle), only the icon changes to chevron-left.
const GROUPS = [
  [
    { icon: 'grid', label: 'Konektor' },
    { icon: 'credit-card', label: 'Dompet' },
    { icon: 'shield', label: 'Penyimpanan kredensial aman' },
    { icon: 'user-check', label: 'Izin' },
    { icon: 'message-circle', label: 'Saluran pengiriman pesan' },
    { icon: 'smartphone', label: 'Perangkat' },
  ],
  [
    { icon: 'bell', label: 'Notifikasi' },
    { icon: 'pen-tool', label: 'Tampilan' },
    { icon: 'lock', label: 'Kunci aplikasi' },
    { icon: 'phone', label: 'Atur sebagai asisten default' },
  ],
];

export default function SettingsPage({ onBackPress }) {
  const [headerHeight, setHeaderHeight] = useState(176);
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.content, { paddingTop: headerHeight }]}>
        {GROUPS.map((group, gi) => (
          <View key={gi} style={styles.box}>
            {group.map((row, ri) => (
              <TouchableOpacity
                key={row.label}
                activeOpacity={0.7}
                style={[styles.row, ri < group.length - 1 && styles.rowDivider]}>
                <Icon name={row.icon} size={22} color="#fff" style={styles.rowIcon} />
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Icon name="chevron-right" size={20} color="#888" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <View
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        <View style={styles.headerRow}>
          <HeaderButton icon="chevron-left" onPress={onBackPress} />
          <Text style={styles.title}>Pengaturan</Text>
          <View style={styles.sideSpacer} />
        </View>
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.fade}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  list: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  box: { backgroundColor: '#262626', borderRadius: 24, paddingHorizontal: 16, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#3a3a3a' },
  rowIcon: { marginRight: 16 },
  rowLabel: { flex: 1, color: '#fff', fontSize: 16, fontFamily: 'OptimisticApp' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: (StatusBar.currentHeight || 0) + 12, paddingBottom: 8 },
  title: { color: '#fff', fontSize: 20, fontFamily: 'OptimisticApp-Bold' },
  sideSpacer: { width: 44 },
  fade: { height: 28 },
});
