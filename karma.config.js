// Karma configuration
// Generated on Sat Dec 12 2015 12:19:51 GMT-0700 (MST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'karma.webpack.config.js'
    ],
    exclude: [
    ],
    preprocessors: {
      'karma.webpack.config.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,
    webpack: {
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [
          {
            loader: 'babel',
            test: /\.js$/,
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js'],
        root: ['src/'],
      },
    },
    webpackServer: {
    }
  })
}
