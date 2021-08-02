module.exports = {
  presets: [
    [
      "@babel/preset-typescript"
    ],
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: [
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Safari versions",
            "last 2 iOS versions",
            "last 1 Android version",
            "last 1 ChromeAndroid version",
            "ie 11"
          ]
        }
      }
    ],
    [
      "@babel/preset-react",
      {
        pragma: "wp.element.createElement"
      }
    ]
  ],
  plugins: [
    "dynamic-import-node",
    "@babel/plugin-transform-runtime",
    [
      "@babel/plugin-transform-react-jsx",
      {
        pragma: "wp.element.createElement"
      }
    ],
    "@babel/plugin-proposal-class-properties",
  ]
};
