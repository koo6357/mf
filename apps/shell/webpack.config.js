const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ProvidePlugin } = require("webpack");
const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies } = require("./package.json");

module.exports = (env, argv) => {
  const isProductionMode = env.phase === "production";

  return {
    entry: "./index.js",
    mode: "development",
    devServer: {
      historyApiFallback: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
      alias: {},
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "esbuild-loader",
              options: {
                minify: isProductionMode,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                // Prefer `dart-sass`
                implementation: require.resolve("sass"),
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          use: ["file-loader"],
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack", "file-loader"],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
        {
          test: /\.[jt](s|sx)$/,
          loader: "esbuild-loader",
          exclude(modulePath) {
            return (
              /node_modules/.test(modulePath) &&
              !/node_modules\/pdfjs-dist/.test(modulePath)
            );
          },
          options: {
            loader: "jsx",
            target: "es2015",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
      }),
      new ProvidePlugin({
        React: "react",
      }),
      new ModuleFederationPlugin({
        name: "fruit_shell",
        filename: "remoteEntry.js",

        // shell 로 import 할 모듈
        remotes: {
          fruit_apple: "fruit_apple@http://localhost:3001/remoteEntry.js",
          fruit_banana: "fruit_banana@http://localhost:3002/remoteEntry.js",
        },

        // shell 에서 export 할 모듈
        exposes: {
          // "./App": "./src/App"
        },

        // 공통으로 사용할 모듈
        shared: {
          react: {
            singleton: true,
            requiredVersion: dependencies.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: dependencies["react-router-dom"],
          },
          // "react-query": {
          //   singleton: true,
          //   requiredVersion: dependencies["react-query"],
          // },
        },
      }),
    ],
  };
};
