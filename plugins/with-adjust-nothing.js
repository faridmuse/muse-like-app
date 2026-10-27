const { withAndroidManifest } = require('@expo/config-plugins');

// Force MainActivity windowSoftInputMode to adjustNothing.
// app.json's android.windowSoftInputMode is ignored by prebuild in SDK 58
// (manifest came out adjustResize), which broke the JS keyboard-height
// logic: the window shrank AND the content padding grew, so the composer
// never sat cleanly above the keyboard. This plugin sets the manifest
// attribute directly during prebuild, so the JS logic (composer up via
// padding, TabBar absolute behind keyboard) works as designed.
module.exports = function withAdjustNothing(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application[0];
    const activity = application.activity.find(
      (a) => a.$['android:name'] === '.MainActivity'
    );
    if (activity) {
      activity.$['android:windowSoftInputMode'] = 'adjustNothing';
    }
    return config;
  });
};
