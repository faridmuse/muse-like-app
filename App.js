import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import Composer from './components/Composer';
import TabBar from './components/TabBar';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), text: trimmed }]);
  };

  return (
    <View style={styles.root}>
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
