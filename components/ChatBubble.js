import { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

const USER_PINK = '#f02b9b';
const AI_GREY = '#262626';

// Drag-to-reply bubble, matching Muse: drag the bubble sideways and let
// go, it snaps back, and the composer shows the reply preview. Drag
// direction is inward: AI bubbles (left) drag right, user bubbles (right)
// drag left. A horizontal drag wins over the ScrollView's vertical scroll;
// a vertical drag stays with the ScrollView.
export default function ChatBubble({ role, text, isFirst, isLast, onReply }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const dxRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gesture) =>
        Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
      onPanResponderMove: (evt, gesture) => {
        dxRef.current = gesture.dx;
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (evt, gesture) => {
        const passed = role === 'ai' ? gesture.dx > 60 : gesture.dx < -60;
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        if (passed && onReply) {
          onReply({ author: role === 'ai' ? 'Ai-Chan' : 'Anda', text });
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  ).current;

  const radii =
    role === 'user'
      ? {
          borderTopLeftRadius: 24,
          borderTopRightRadius: isFirst ? 24 : 6,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: isLast ? 24 : 6,
        }
      : {
          borderTopLeftRadius: isFirst ? 24 : 6,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: isLast ? 24 : 6,
          borderBottomRightRadius: 24,
        };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.bubble,
        role === 'user' ? styles.user : styles.ai,
        radii,
        { transform: [{ translateX }] },
      ]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: { paddingHorizontal: 14, paddingVertical: 10, maxWidth: '85%' },
  user: { alignSelf: 'flex-end', backgroundColor: USER_PINK },
  ai: { alignSelf: 'flex-start', backgroundColor: AI_GREY },
  text: { color: '#fff', fontSize: 16, fontFamily: 'OptimisticApp' },
});
