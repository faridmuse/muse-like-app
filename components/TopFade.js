import { StyleSheet, View } from 'react-native';

// Top fade over the chat area: dark at the very top, fading to clear.
// Stepped strips, no gradient library needed. pointerEvents="none" so it
// never blocks scrolling or taps on messages underneath.
export default function TopFade({ height = 84 }) {
  const strip = height / 7;
  return (
    <View style={[styles.fade, { height }]} pointerEvents="none">
      {[1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.1].map((o, i) => (
        <View key={i} style={{ height: strip, backgroundColor: `rgba(0,0,0,${o})` }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fade: { position: 'absolute', top: 0, left: 0, right: 0 },
});
