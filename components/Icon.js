import { Text } from 'react-native';

// Feather glyphs rendered as plain Text, bypassing @expo/vector-icons'
// Feather component on purpose. That component gates rendering on
// expo-font loadAsync, which can never succeed in this app: the APK ships
// no res/raw or res/font, so the native asset lookup fails, and the
// failure is swallowed (no catch, no retry) — the component then renders
// an empty Text forever. React Native's own font fallback resolves this
// family straight from assets/fonts/<family>.ttf, which the build does
// ship (Metro flattens the node_modules asset path into the filename).
const FEATHER_FAMILY =
  'node_modules_expo_vectoricons_build_vendor_reactnativevectoricons_fonts_feather';

// Codepoints from @expo/vector-icons' Feather glyph map. Feather has no
// lightbulb glyph, so the Ide tab uses zap as its stand-in.
const GLYPHS = {
  menu: 61852,
  'message-circle': 61853,
  'file-text': 61804,
  zap: 61979,
  'check-square': 61741,
  grid: 61821,
  archive: 61707,
  settings: 61907,
  search: 61904,
  edit: 61791,
  camera: 61736,
  image: 61829,
  file: 61801,
  plus: 61888,
  'arrow-up': 61716,
  mic: 61855,
};

export default function Icon({ name, size = 24, color = '#fff', style }) {
  const code = GLYPHS[name];
  if (code == null) return null;
  return (
    <Text style={[{ fontFamily: FEATHER_FAMILY, fontSize: size, color }, style]}>
      {String.fromCharCode(code)}
    </Text>
  );
}
