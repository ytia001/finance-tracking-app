module.exports = function (config) {
  const isCI = process.env.CI === 'true';

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    reporters: isCI ? ['progress', 'junit', 'coverage'] : ['progress', 'kjhtml'],
    junitReporter: {
      outputDir: 'test-results', // folder
      outputFile: 'junit-results.xml', // file
      useBrowserName: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [isCI ? 'ChromeHeadless' : 'Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
