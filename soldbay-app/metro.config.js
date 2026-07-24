const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const wrapped = withNativeWind(config, { input: "./src/app/global.css" });

// Disable package exports to fix resolution of expo-image-picker subpath imports
wrapped.resolver.unstable_enablePackageExports = false;

module.exports = wrapped;
