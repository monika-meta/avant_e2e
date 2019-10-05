// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/login.e2e-spec.ts',
    // './src/**/profile.e2e-spec.ts',
    // './src/**/home.e2e-spec.ts',
    './src/**/conversation.e2e-spec.ts',
    // './src/**/file.e2e-spec.ts',
    // './src/**/status.e2e-spec.ts',
    // './src/**/member.e2e-spec.ts',
    // './src/**/file-manager.e2e-spec.ts',
    // './src/**/tags.e2e-spec.ts',
  ],
  capabilities: {
    chromeOptions: {
      'args': [
        '--no-sandbox',
        '--disable-gpu',
        '--disable-browser-side-navigation'
      ]
    },
    'browserName': 'chrome'
  },

  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 200000,
    print: function () { }
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};