module.exports = function(api) {
    api.cache(true);

    return {
        presets: [["babel-preset-expo", {
            jsxImportSource: "nativewind"
        }], "nativewind/babel"],

        plugins: [["module-resolver", {
            root: ["./"],

            alias: {
                "@": "./",
                "tailwind.config": "./tailwind.config.js"
            }
        }],

        // Must be listed last
        "react-native-reanimated/plugin"]
    };
};