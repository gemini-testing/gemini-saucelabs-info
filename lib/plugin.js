'use strict';

var _ = require('lodash');

module.exports = function (gemini, opts) {
    if (!_.isObject(opts)) {
        return;
    }

    collectBuildInfo(opts);

    if (opts.jobNumber && opts.buildNumber) {
        addCapabilities(gemini, opts);
    }
};

function collectBuildInfo(opts) {
    opts.jobNumber = opts.jobNumber || process.env.TRAVIS_JOB_NUMBER;
    opts.buildNumber = opts.buildNumber || process.env.TRAVIS_BUILD_NUMBER;
}

function addCapabilities(gemini, opts) {
    gemini.on('startRunner', function () {
        gemini.config.getBrowserIds().forEach(function (browserId) {
            var browserConfig = gemini.config.forBrowser(browserId),
                gridUrl = browserConfig.gridUrl;

            browserConfig.desiredCapabilities = browserConfig.desiredCapabilities || {};

            if (gridUrl && gridUrl.indexOf('saucelabs.com') > -1) {
                var desiredCapabilities = browserConfig.desiredCapabilities;
                desiredCapabilities['tunnel-identifier'] = opts.jobNumber;
                desiredCapabilities.build = opts.buildNumber;
            }
        });
    });
}
