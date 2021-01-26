/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900',
        '--crash-dumps-dir=/tmp',
        '--disable-gpu'
      ].filter(Boolean)
    }
  }
};
/* eslint-enable */
