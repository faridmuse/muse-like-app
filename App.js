import { useCallback, useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Animated, Easing, Keyboard, LayoutAnimation, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';
import Sidebar, { SIDEBAR_WIDTH } from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import Composer from './components/Composer';
import TabBar from './components/TabBar';

// Keep the native splash up until JS explicitly hides it, so a slow first
// frame can never leave the splash on screen forever. The timeout below is
// a fallback: even if layout is delayed, the splash hides within 3s of JS
// running. (If JS never runs at all — e.g. a missing bundle — no JS-side
// call can help; the build workflow now fails loudly instead of shipping
// a bundle-less APK.)
// LayoutAnimation on Android needs the experimental flag; without it the
// keyboard-driven layout shift below would jump instead of animating.
UIManager.setLayoutAnimationEnabledExperimental?.(true);

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const splashHidden = useRef(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Keyboard mimic (Muse behavior): the composer moves up with the keyboard,
  // the TabBar stays at the screen bottom behind the keyboard.
  // windowSoftInputMode=adjustNothing (app.json) means the window never
  // resizes/pans, so this JS state is the only thing that moves the composer.
  // Content padding is max(tabBarHeight, keyboardHeight): TabBar height when
  // the keyboard is closed (composer above TabBar), keyboard height when open
  // (composer directly above the keyboard, TabBar behind it, no gap).
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), text: trimmed }]);
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SIDEBAR_WIDTH],
  });

  return (
    <SafeAreaProvider>
      <View style={styles.root} onLayout={hideSplash}>
      <StatusBar style="light" />
      <Sidebar />
      <Animated.View style={[styles.main, { transform: [{ translateX }] }]}>
        <View style={[styles.content, { paddingBottom: Math.max(tabBarHeight, keyboardHeight) }]}>
          <ChatHeader onMenuPress={() => setSidebarOpen((v) => !v)} />
          <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
            {messages.map((m) => (
              <View key={m.id} style={styles.bubble}>
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>
          <Composer onSend={handleSend} />
        </View>
        <TabBar onTabBarHeight={setTabBarHeight} />
      </Animated.View>
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  main: { flex: 1, backgroundColor: '#000', zIndex: 1 },
  content: { flex: 1 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  bubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#262626',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    maxWidth: '85%',
  },
  bubbleText: { color: '#fff', fontSize: 16, fontFamily: 'OptimisticApp' },
});
