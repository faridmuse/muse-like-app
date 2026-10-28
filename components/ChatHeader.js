import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderButton from './HeaderButton';

// Header + fade as ONE component, floating over the chat (Muse's
// fadeUnderFloatingOccluder pattern, verified in the Muse APK: the
// chrome floats, content scrolls under it, and the fade is applied
// under that floating chrome, not as a separate bar below the header).
// This component is position:absolute over the messages area; the
// messages ScrollView pads its top by this component's measured height,
// so messages start below it at rest, then scroll up behind it: first
// through the 28px fade at the bottom of this component, then behind
// the opaque pills, exactly as in Muse. pointerEvents on the fade is
// none, so it never blocks scrolling or taps.
export default function ChatHeader({ onMenuPress, status, onLayout }) {
  return (
    <View style={styles.header} onLayout={onLayout}>
      <View style={styles.row}>
        <HeaderButton icon="menu" onPress={onMenuPress} />
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
      <LinearGradient
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fade}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: (StatusBar.currentHeight || 0) + 12, paddingBottom: 8 },
  center: { flex: 1, alignItems: 'center' },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#f9a8d4', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#000', fontSize: 28, fontFamily: 'OptimisticApp-Bold' },
  namePill: { backgroundColor: '#262626', borderRadius: 24, paddingHorizontal: 12, paddingVertical: 6, marginTop: -12, alignItems: 'center' },
  name: { color: '#fff', fontSize: 14, fontFamily: 'OptimisticApp-Bold' },
  status: { color: '#888', fontSize: 12, fontFamily: 'OptimisticApp', marginTop: 2 },
  sideSpacer: { width: 44 },
  fade: { height: 28 },
});
