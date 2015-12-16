# gemini-saucelabs-info

Plugin for providing Travis build information in SauceLabs test run.

## Installation

`npm gemini-saucelabs-info`

## Configuration

Specify __both__ parameters: 
- __jobNumber__ Travis job number.
- __buildNumber__ Travis build number.

If any of the parameters are missing, the plugin looks in `process.env.TRAVIS_JOB_NUMBER` and `process.env.TRAVIS_BUILD_NUMBER`.

Set the configuration to your `.gemini.yml`

```yml
system:
  plugins:
    gemini-saucelabs-info:
      jobNumber: 666
      buildNumber: 1234
```

If passed config is not an object the plugin does nothing.
