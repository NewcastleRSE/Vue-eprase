const path = require("path")
const webpack = require("webpack")
const { VueLoaderPlugin } = require("vue-loader")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const TerserPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
//const HtmlWebpackRootPlugin = require('html-webpack-root-plugin'); Last modified in 2018...

module.exports = {
  mode: "development",
  // mode: 'production',
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "build.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "ePRaSE",
      favicon: "favicon.ico",
      template: "public/index.html",
    }),
    new VueLoaderPlugin(),
    // to remove warn in browser console: runtime-core.esm-bundler.js:3607 Feature flags __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__ etc are not explicitly defined...
    // See https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
    }),
    //new HtmlWebpackRootPlugin('app'),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            // inject CSS to page
            loader: "vue-style-loader",
          },
          {
            // translates CSS into CommonJS modules
            loader: "css-loader",
            options: {
              url: false,
            }
          },
          {
            // Run postcss actions
            loader: "postcss-loader",
            options: {
              // `postcssOptions` is needed for postcss 8.x;
              // if you use postcss 7.x skip the key
              postcssOptions: {
                // postcss plugins, can be exported to postcss.config.js
                plugins: function () {
                  return [require("autoprefixer")]
                },
              },
            },
          },
          {
            loader: "resolve-url-loader", options: {
              sourceMap: true
            }
          },
          // Option here necessary to suppress spurious warnings in bootstrap files after swapping node-sass for Dart sass - David 05/08/2024
          { loader: "sass-loader", options: { sassOptions: { quietDeps: true } } }
        ],
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {},
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]",
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue: "@vue/runtime-dom",
    },
    extensions: ["*", ".js", ".vue", ".json"],
  },
  devServer: {
    historyApiFallback: true,
    //noInfo: true,
    client: {
      overlay: true,
    },
  },
  performance: {
    hints: false,
  },
  devtool: "eval-source-map",
}

if (process.env.NODE_ENV === "production") {
  let baseURL = '"http://localhost:6001/api/"'
  let sentryENV = "development"

  if (process.env.TARGET === "staging") {
    baseURL = '"https://eprase.ncldata.dev/api/"'
    sentryENV = "staging"
  } else if (process.env.TARGET === "production") {
    baseURL = '"https://eprase.nhs.uk/api/"'
    sentryENV = "production"
  }

  module.exports.devtool = "source-map"
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"',
        BASE_URL: baseURL,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ])
} else {
  // development
  module.exports.devtool = "source-map"
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"development"',
        BASE_URL: '"http://localhost:6001/api/"',
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ])
}
