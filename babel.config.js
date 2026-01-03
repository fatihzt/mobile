module.exports = function(api) {
  api.cache(true);
  const isWeb = api.caller((caller) => caller?.platform === 'web');
  
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          web: { useTransformReactJSXExperimental: true },
        },
      ],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@/features": "./features",
            "@/shared": "./shared",
            "@/config": "./config",
          },
        },
      ],
      // react-native-reanimated plugin'ini sadece native için ekle
      !isWeb && "react-native-reanimated/plugin",
    ].filter(Boolean),
  };
};

