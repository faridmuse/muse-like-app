import { useCallback, useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
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
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const splashHidden = useRef(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
    // Feather icons render blank in this standalone build unless preloaded:
    // createIconSet only loads the font on mount, and that path evidently
    // fails here even though Feather.ttf ships in the APK. Feather.font is
    // the set's own map ({ feather: asset }), verified in v15.1.1 source.
    ...Feather.font,
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

  // TEST ONLY: layar tes ikon — jalur muat font SAMA PERSIS dengan aplikasi
  // utama (import Feather + useFonts ...Feather.font di atas tidak diubah).
  // Yang diganti hanya apa yang dirender: lima ikon Feather besar di latar
  // putih dengan label, tanpa layout/sidebar/tabbar, supaya tidak ada
  // perancu warna/ukuran/layout. Dikembalikan ke UI asli setelah hasil tes.
  return (
    <ScrollView style={testStyles.root} contentContainerStyle={testStyles.content} onLayout={hideSplash}>
      <StatusBar style="dark" />
      <Text style={testStyles.title}>TES IKON FEATHER</Text>
      <Text style={testStyles.note}>Import + useFonts sama persis dengan aplikasi utama. Ikon hitam besar di latar putih.</Text>
      {[
        { name: 'menu', label: 'menu 61852' },
        { name: 'archive', label: 'archive 61707' },
        { name: 'send', label: 'send 61905' },
        { name: 'camera', label: 'camera 61736' },
        { name: 'plus', label: 'plus 61888' },
      ].map((it) => (
        <View key={it.name} style={testStyles.row}>
          <Feather name={it.name} size={64} color="#000" />
          <Text style={testStyles.label}>{it.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  main: { flex: 1, backgroundColor: '#000', zIndex: 1 },
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

// TEST ONLY: gaya layar tes ikon (lihat return di atas).
const testStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  title: { color: '#000', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  note: { color: '#333', fontSize: 14, marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  label: { color: '#000', fontSize: 18, marginLeft: 16 },
});
