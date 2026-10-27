import { useCallback, useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Sidebar from './components/Sidebar';
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

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), text: trimmed }]);
  };

  return (
    <View style={styles.root} onLayout={hideSplash}>
      <StatusBar style="light" />
      <View style={styles.row}>
        <Sidebar open={sidebarOpen} />
        <View style={styles.main}>
          <ChatHeader onMenuPress={() => setSidebarOpen((v) => !v)} />
          <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
            {messages.map((m) => (
              <View key={m.id} style={styles.bubble}>
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>
          <Composer onSend={handleSend} />
          <TabBar />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  row: { flex: 1, flexDirection: 'row' },
  main: { flex: 1, backgroundColor: '#000' },
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
  bubbleText: { color: '#fff', fontSize: 16 },
});
