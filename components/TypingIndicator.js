import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

// 7 — AI typing: three dots pulsing in sequence, left to right, on a
// loop. Best-effort animation, not a claimed copy of Muse's exact
// timing: each dot scales up and brightens in turn, 200ms apart,
// 1.2s total cycle, then repeats.
export default function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeLoop = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ]),
      );
    const loops = [makeLoop(dot1, 0), makeLoop(dot2, 200), makeLoop(dot3, 400)];
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [dot1, dot2, dot3]);

  const dotStyle = (anim) => ({
    transform: [
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] }) },
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
    ],
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
  });

  return (
    <View style={styles.bubble}>
      <Animated.View style={[styles.dot, dotStyle(dot1)]} />
      <Animated.View style={[styles.dot, dotStyle(dot2)]} />
      <Animated.View style={[styles.dot, dotStyle(dot3)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { alignSelf: 'flex-start', backgroundColor: '#262626', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#888', marginHorizontal: 3 },
});
