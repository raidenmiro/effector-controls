module.exports = {
  plugins: [['effector/babel-plugin', { factories: ['./src/core/create-control', './src/core/create-form'] }]],
  presets: ['@babel/preset-typescript', '@babel/preset-react'],
}
