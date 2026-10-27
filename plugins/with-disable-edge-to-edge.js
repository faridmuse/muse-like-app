/**
 * Disable Android edge-to-edge so the phone navigation bar sits BELOW the
 * app (like the Muse app) instead of overlaying it.
 *
 * Why a config plugin, not JS padding: edge-to-edge is a native window mode.
 * When it is on, the app draws behind the system bars and every screen must
 * dodge them with insets. When it is off, the system shrinks the app window
 * above the navigation bar, so no screen needs to dodge anything.
 *
 * Two levers, because Expo SDK 58 removed the old app.json field:
 *  1) Gradle property `edgeToEdgeEnabled=false` — tells React Native not to
 *     call EdgeToEdge.enable() in the activity.
 *  2) Theme attribute `android:windowOptOutEdgeToEdgeEnforcement=true` —
 *     Android's own opt-out for apps targeting API 35.
 *
 * Hard limit (Android docs): on Android 16 devices, for apps targeting API
 * 36, the opt-out is disabled and edge-to-edge is enforced. There the
 * safe-area inset fallback in TabBar.js is what keeps the buttons above the
 * bar — and when edge-to-edge is off, that inset reads 0, so it never
 * double-pads. Either way the buttons end up above the navbar.
 *
 * This runs during `npx expo prebuild` (including CI). It never hand-edits
 * android/ — prebuild regenerates that directory from here.
 */
const {
  withGradleProperties,
  withAndroidStyles,
} = require('@expo/config-plugins');

function withDisableEdgeToEdge(config) {
  config = withGradleProperties(config, (config) => {
    const props = config.modResults;
    const setProp = (key, value) => {
      const existing = props.find((p) => p.key === key);
      if (existing) {
        existing.value = value;
      } else {
        props.push({ key, value, type: 'property' });
      }
    };
    setProp('edgeToEdgeEnabled', 'false');
    setProp('expo.edgeToEdgeEnabled', 'false');
    return config;
  });

  config = withAndroidStyles(config, (config) => {
    const styles = (config.modResults.resources || {}).style || [];
    const appTheme = styles.find((s) => s.$ && s.$.name === 'AppTheme');
    if (appTheme) {
      appTheme.item = appTheme.item || [];
      const hasOptOut = appTheme.item.some(
        (it) => it.$ && it.$.name === 'android:windowOptOutEdgeToEdgeEnforcement'
      );
      if (!hasOptOut) {
        appTheme.item.push({
          $: { name: 'android:windowOptOutEdgeToEdgeEnforcement' },
          _: 'true',
        });
      }
    }
    return config;
  });

  return config;
}

module.exports = withDisableEdgeToEdge;
