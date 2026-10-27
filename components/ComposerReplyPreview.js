import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Reply UI inside the composer, shown after a drag-to-reply snap:
// "Membalas <author>" + quoted text + X to cancel. Rendered by Composer
// only when replyTo is set; returns null otherwise.
export default function ComposerReplyPreview({ replyTo, onCancel }) {
  if (!replyTo) return null;
  return (
    <View style={styles.preview}>
      <View style={styles.text}>
        <Text style={styles.label}>Membalas {replyTo.author}</Text>
        <Text style={styles.quote} numberOfLines={1}>
          {replyTo.text}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} style={styles.cancel} onPress={onCancel}>
        <Text style={styles.cancelText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1c1c1c', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  text: { flex: 1, marginRight: 8 },
  label: { color: '#fff', fontSize: 14, fontFamily: 'OptimisticApp-Bold' },
  quote: { color: '#888', fontSize: 14, fontFamily: 'OptimisticApp', marginTop: 2 },
  cancel: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#fff', fontSize: 22 },
});
