const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const plugins = [
  new VueLoaderPlugin(),
];
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: 'little',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      { test: /\.css$/, use: 'css-loader' },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      { test: /\.vue$/, use: 'vue-loader' }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: [".js", ".vue"]
  },
  plugins,
  externals: {
    'vue': 'vue',
    'element-ui': 'element-ui',
  },
};