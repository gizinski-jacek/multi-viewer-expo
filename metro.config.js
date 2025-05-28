// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [
	...config.resolver.sourceExts,
	'web.tsx',
	'native.tsx',
];

module.exports = withNativeWind(config, { input: './src/app/global.css' });
