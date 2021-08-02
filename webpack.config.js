const autoprefixer = require("autoprefixer");
const copyWebpack = require("copy-webpack-plugin");
const fs = require("fs");
const htmlWebpackPlugin = require("html-webpack-plugin");
const miniCssExtract = require("mini-css-extract-plugin");
const path = require("path");
const sass = require("sass");
const webpack = require("webpack");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");

// Load externals
const externals = require("./scripts/webpack.externals");

/**
 * Path to the current working directory.
 *
 * @type {string}
 */
const WORK_DIR = process.cwd();

/**
 * Configuration for the manifest file.
 * 
 * @param {boolean} isProduction 
 * @returns {*}
 */
const manifestOptions = (isProduction) => ({
  basePath: "",
  publicPath: (isProduction) ? "/" : "",
});

/**
 * Returns an index file for the desired folder, relative to `WORK_DIR`.
 *
 * Searches for files named `index` by default, with the following extensions
 * in priority order:
 * - TSX;
 * - JSX;
 * - TS;
 * - JS;
 *  
 * @param {string} folder
 *     Path to the folder, relative to the repository root
 * @returns {string}
 */
const getEntryPointFile = (folder) => {
  const fileList = fs.readdirSync(
    path.resolve(WORK_DIR, folder)
  );

  const extensions = ["tsx", "jsx", "ts"];

  for (let extension of extensions) {
    if (fileList.includes(`index.${extension}`)) {
      return `index.${extension}`;
    }
  }

  return `index.js`;
};

/**
 * Webpack config function.
 * 
 * @param {*} env
 *     Environment variables
 * @param {*} argv
 *     CLI arguments passed to Webpack
 * @returns {import("webpack").Configuration}
 */
module.exports = (env, argv) => {
  // GENERAL
  // --------------------------------------------------------------------

  /** @type {boolean} */
  const isProduction = (argv.mode === "production");

  const babelOptions = isProduction
    ? require(path.resolve(WORK_DIR, "scripts/babel.production.js"))
    : require(path.resolve(WORK_DIR, "scripts/babel.development.js"));

  /**
   * Generator for asset path `index.html`, to block asset access.
   *
   * @type {*[]}
   */
  const assetPaths = ["", "img", "fonts", "media", "data"].map((item) => (
    new htmlWebpackPlugin({
      inject: false,
      filename: (item.trim() !== "") 
        ? `assets/${item}/index.html` 
        : `assets/index.html`,
      templateContent: `<!doctype html><html>
        <head>
          <title>Not Allowed</title>
          <meta http-equiv="refresh" content="0; url=/">
        </head>
      </html>`,
      hash: true,
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true,
      },
    })
  ));

  /**
   * Lists contains all paths used for module resolution.
   * 
   * @type {Array<string>}
   */
  const resolvePaths = [
    path.resolve(WORK_DIR, "./src"),
  ];

  if (!isProduction) {
    resolvePaths.push(
      path.resolve(WORK_DIR, "./docs")
    );
  }

  // LOADERS
  // --------------------------------------------------------------------

  const cssLoader = {
    loader: "css-loader",
    options: {
      esModule: false, 
      modules: false, 
      importLoaders: 2,
      sourceMap: false,
    },
  };

  const cssModuleLoader = {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: (isProduction)
          ? "[hash:8]"
          : "[name]_[local]_[hash:base64:5]",
        exportLocalsConvention: "camelCase",
      },
      importLoaders: 2,
      sourceMap: false,
    },
  };

  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      sourceMap: false,
      postcssOptions: {
        plugins: [
          autoprefixer({
            flexbox: "no-2009",
          }),
        ],
      },
    },
  };

  const sassLoader = {
    loader: "sass-loader",
    options: {
      implementation: sass,
      sourceMap: false,
      sassOptions: {
        precision: 8,
        outputStyle: "compressed",
        sourceComments: false,
        includePaths: [
          path.resolve(WORK_DIR, "src", "styles"),
        ],
        quietDeps: true,
      },
    },
  };

  const styleLoader = (isProduction) 
    ? miniCssExtract.loader 
    : "style-loader";

  // CONFIGURAÇÕES
  // --------------------------------------------------------------------

  /** @type {import("webpack").Configuration} */
  const config = {};

  config.devtool = false;

  config.entry = {};

  config.mode = (isProduction) ? "production" : "development";

  config.module = {
    rules: [
      {
        test: /\.(jsx?|tsx?|mjs)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            ...babelOptions
          },
        },
      },
      {
        test: /style\.(sa|sc|c)ss$/,
        use: [
          styleLoader,
          cssLoader,
          postcssLoader,
          sassLoader,
        ],
      },
      {
        test: /editor\.(sa|sc|c)ss$/,
        use: [
          styleLoader,
          cssLoader,
          postcssLoader,
          sassLoader,
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[hash:16].[ext]",
            esModule: false,
            outputPath: "assets/img/",
            publicPath: "/wp-content/plugins/blokit/assets/img",
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[hash:16].[ext]",
            esModule: false,
            outputPath: "assets/img/",
            publicPath: "/wp-content/plugins/blokit/assets/img",
          },
        },
      },
      {
        test: /\.(wav|mp3|mp4|avi|mpg|mpeg|mov|ogg|webm)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[hash:16].[ext]",
            esModule: false,
            outputPath: "assets/media/",
            publicPath: "/wp-content/plugins/blokit/assets/media",
          },
        },
      },
      {
        test: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[hash:16].[ext]",
            esModule: false,
            outputPath: "assets/data/",
            publicPath: "/wp-content/plugins/blokit/assets/data",
          },
        },
      },
    ],
  };

  config.optimization = {
    minimize: isProduction,
    splitChunks: {
      cacheGroups: {
        style: {
          name: "style",
          test: /style\.scss$/,
          chunks: "all",
          enforce: true,
          type: "css/mini-extract"
        },
        editor: {
          name: "editor",
          test: /editor\.scss$/,
          chunks: "all",
          enforce: true,
          type: "css/mini-extract"
        },
      },
    },
  };

  config.output = {
    pathinfo: false,
    path: path.resolve(WORK_DIR, "build"),
    filename: "[name].js",
    publicPath: "/",
    clean: true,
  };

  config.plugins = [
    ...assetPaths,

    new miniCssExtract({
      filename: "[name].css", 
    }),

    // !isProduction && new reactRefreshWebpackPlugin()
  ].filter(Boolean);

  config.resolve = {
    modules: [
      ...resolvePaths,
      "node_modules",
    ],
    extensions: [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".mjs",
    ],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "tsconfig.build.json",
      }),
    ],
  };

  config.stats = {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: true,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false,
  };

  config.target = "web";

  // PRODUCTION ONLY
  // --------------------------------------------------------------------
  if (isProduction) {
    // Index is used only for build, to avoid loading it twice
    config.entry.index = {
      import: path.resolve(WORK_DIR, "./src", getEntryPointFile("./src")),
    };

    // Exclude node_modules from the final build
    config.externals = externals;
  }


  // DEVELOPMENT ONLY
  // --------------------------------------------------------------------
  if (!isProduction) {
    config.devServer = {
      hot: true,
      port: 8080,
      historyApiFallback: true,
      publicPath: "/"
    };

    // Add aliases for the development project
    config.resolve.alias = {
      "@docs": path.resolve(WORK_DIR, "./docs"),
      "@blocks": path.resolve(WORK_DIR, "./src"),
    };

    // Add entry point for docs
    config.entry.docs = path.resolve(
      WORK_DIR,
      "./docs",
      getEntryPointFile("./docs")
    );

    // Generates the base HTML and inject JS for development mode.
    config.plugins.push(
      new htmlWebpackPlugin({
        inject: true,
        filename: "index.html",
        template: path.resolve(WORK_DIR, "public", "index.html"),
        hash: true,
        minify: {
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          collapseWhitespace: true,
        },
      })
    );

    // Copies public served test files
    config.plugins.push(
      new copyWebpack({
        patterns: [
          {
            from: "public",
            to: "",
            toType: "dir",
            globOptions: {
              dot: true,
              ignore: [
                "**/*.html",
              ],
            },
          },
        ],
      })
    );

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({})
      })
    );

    config.module.rules.push(
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /(editor|style)\.(sa|sc|c)ss$/,
        use: [
          styleLoader,
          cssLoader,
          postcssLoader,
          sassLoader,
        ],
      }
    );
  }

  config.resolve.fallback = {
    utils: false
  };

  return config;
};
