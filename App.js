import { useCallback, useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardProvider, useKeyboardHandler } from 'react-native-keyboard-controller';
import Reanimated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Sidebar, { SIDEBAR_WIDTH } from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import Composer from './components/Composer';
import TabBar from './components/TabBar';
import ChatBubble from './components/ChatBubble';
import ReplyMessage from './components/ReplyMessage';
import TypingIndicator from './components/TypingIndicator';
import ScrollToBottomButton from './components/ScrollToBottomButton';
import TopFade from './components/TopFade';
import { getGroupFlags } from './components/messageGrouping';
import { PLACEHOLDER_MESSAGES } from './components/placeholderChat';

// Keep the native splash up until JS explicitly hides it, so a slow first
// frame can never leave the splash on screen forever. The timeout below is
// a fallback: even if layout is delayed, the splash hides within 3s of JS
// running. (If JS never runs at all — e.g. a missing bundle — no JS-side
// call can help; the build workflow now fails loudly instead of shipping
// a bundle-less APK.)
SplashScreen.preventAutoHideAsync().catch(() => {});

function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState(PLACEHOLDER_MESSAGES);
  const [replyTo, setReplyTo] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const scrollRef = useRef(null);
  const splashHidden = useRef(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Keyboard mimic (Muse behavior): composer moves up with the keyboard,
  // TabBar is covered by the keyboard while typing, back when it closes.
  // Muse mechanism (proven from its APK + observed close behavior): the
  // bottom bar is always mounted, never hidden by code — the keyboard
  // (system window) simply covers it while open and uncovers it as it
  // slides down. The composer stops at the TabBar top, never goes to
  // the screen bottom, so it never feels pushed up. NOT a grace period:
  // delaying the TabBar show would still let the input hit the bottom
  // first, then jump up — just later. Fix: keep TabBar always mounted
  // below the top part, and pad the top part by max(0, K - T) only.
  // While K >= T, padding = K - T, composer sits at the keyboard top.
  // Once K drops below T, padding = 0, composer stays at the TabBar top
  // while the keyboard slides down and uncovers the TabBar from above.
  // T is measured once via onLayout (it varies with the nav bar inset),
  // never guessed, and never changes during a keyboard animation.
  const keyboardHeight = useSharedValue(0);
  const tabBarHeight = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet';
        keyboardHeight.value = Math.max(e.height, 0);
      },
    },
    [],
  );

  const animatedTopStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(0, keyboardHeight.value - tabBarHeight.value),
  }));

  const hideSplash = useCallback(async () => {
    if (splashHidden.current) return;
    splashHidden.current = true;
    try {
      await SplashScreen.hideAsync();
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(hideSplash, 3000);
    return () => clearTimeout(t);
  }, [hideSplash]);

  // Load UI fonts (Optimistic, extracted from the Muse APK). If loading
  // fails, the splash still hides via the fallbacks and text falls back
  // to the system font — a missing font must never block the app.
  const [fontsLoaded, fontError] = Font.useFonts({
    'OptimisticApp': require('./assets/fonts/OptimisticApp-Regular.ttf'),
    'OptimisticApp-Medium': require('./assets/fonts/OptimisticApp-Medium.ttf'),
    'OptimisticApp-Bold': require('./assets/fonts/OptimisticApp-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) hideSplash();
  }, [fontsLoaded, fontError, hideSplash]);

  // Push animation, done properly: the whole main page TRANSLATES right by
  // the sidebar width, keeping its full width — it does NOT shrink. This
  // matches the Muse behaviour (page slides intact, composer and bottom
  // bar included) instead of the old width-interpolation layout that
  // squeezed main to 22% and shortened the input.
  // NOTE: duration/curve are approximations — Muse's exact spring/tween
  // parameters were not extracted from the APK (no dex decompiler on this VM).
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen, slideAnim]);

  const handleScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distance = contentSize.height - (layoutMeasurement.height + contentOffset.y);
    setShowScrollButton(distance > 80);
  };

  const handleReply = (target) => {
    setReplyTo(target);
  };

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: 'user', text: trimmed, ...(replyTo ? { replyTo } : {}) },
    ]);
    setReplyTo(null);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SIDEBAR_WIDTH],
  });

  const renderMessage = (m, index, list) => {
    if (m.replyTo) {
      return <ReplyMessage key={m.id} message={m} onReply={handleReply} />;
    }
    const { isFirst, isLast } = getGroupFlags(list, index);
    return (
      <View key={m.id} style={{ marginBottom: isLast ? 12 : 4 }}>
        <ChatBubble role={m.role} text={m.text} isFirst={isFirst} isLast={isLast} onReply={handleReply} />
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <View style={styles.root} onLayout={hideSplash}>
      <StatusBar style="light" />
      <Sidebar />
      <Animated.View style={[styles.main, { transform: [{ translateX }] }]}>
        <Reanimated.View style={[styles.topPart, animatedTopStyle]}>
          <ChatHeader onMenuPress={() => setSidebarOpen((v) => !v)} status="Installing preview build" />
          <View style={styles.messagesWrap}>
            <ScrollView
              ref={scrollRef}
              style={styles.messages}
              contentContainerStyle={styles.messagesContent}
              onScroll={handleScroll}
              scrollEventThrottle={16}>
              {messages.map((m, i, list) => renderMessage(m, i, list))}
              <TypingIndicator />
            </ScrollView>
            <ScrollToBottomButton
              visible={showScrollButton}
              onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
            />
            <TopFade />
          </View>
          <Composer onSend={handleSend} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
        </Reanimated.View>
        <View onLayout={(e) => { tabBarHeight.value = e.nativeEvent.layout.height; }}>
          <TabBar />
        </View>
      </Animated.View>
    </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <KeyboardProvider preload={false}>
      <Main />
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  main: { flex: 1, backgroundColor: '#000', zIndex: 1 },
  topPart: { flex: 1 },
  messagesWrap: { flex: 1 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
});
