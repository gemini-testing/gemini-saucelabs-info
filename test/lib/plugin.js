var plugin = require('../../lib/plugin'),
    events = require('events');

describe('plugin', function () {
    var sandbox = sinon.sandbox.create(),
        gemini;

    beforeEach(function () {
        gemini = new events.EventEmitter();
        gemini.config = {
            getBrowserIds: sinon.stub().returns(['some-default-browser']),
            forBrowser: sinon.stub()
        };
        sandbox.spy(gemini, 'on');
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('options', function () {
        it('should do nothing if opts is not an object', function () {
            var opts = 'string';

            plugin(gemini, opts);

            expect(gemini.on).to.be.not.called;
        });

        it('should be applied if opts is an appropriate object', function () {
            var opts = {
                    jobNumber: '123',
                    buildNumber: '666'
                };

            plugin(gemini, opts);

            expect(gemini.on).to.be.called;
        });
    });

    describe('process.env options', function () {
        afterEach(function () {
            delete process.env.TRAVIS_JOB_NUMBER;
            delete process.env.TRAVIS_BUILD_NUMBER;
        });

        it('should be ignored if plugin options are set', function () {
            var initialOpts = {
                    jobNumber: '123',
                    buildNumber: '666'
                },
                opts = {
                    jobNumber: initialOpts.jobNumber,
                    buildNumber: initialOpts.buildNumber
                };
            process.env.TRAVIS_JOB_NUMBER = '999';
            process.env.TRAVIS_BUILD_NUMBER = '73264';

            plugin(gemini, opts);

            expect(opts).to.deep.equal(initialOpts);
        });

        it('should set job and build numbers if plugin options are missing', function () {
            var opts = {},
                envOpts = {
                    jobNumber: '123',
                    buildNumber: '666'
                };
            process.env.TRAVIS_JOB_NUMBER = envOpts.jobNumber;
            process.env.TRAVIS_BUILD_NUMBER = envOpts.buildNumber;

            plugin(gemini, opts);

            expect(opts).to.deep.equal(envOpts);
        });

        it('should do nothing if process.env.TRAVIS_JOB_NUMBER is missing', function () {
            var opts = {},
                envOpts = {
                    jobNumber: '123',
                    buildNumber: '666'
                };
            process.env.TRAVIS_BUILD_NUMBER = envOpts.buildNumber;

            plugin(gemini, opts);

            expect(gemini.on).to.be.not.called;
        });

        it('should do nothing if process.env.TRAVIS_BUILD_NUMBER is missing', function () {
            var opts = {},
                envOpts = {
                    jobNumber: '123',
                    buildNumber: '666'
                };
            process.env.TRAVIS_JOB_NUMBER = envOpts.jobNumber;

            plugin(gemini, opts);

            expect(gemini.on).to.be.not.called;
        });
    });

    describe('gemini events', function () {
        it('should subscribe for startRunner event', function () {
            plugin(gemini, {
                jobNumber: '123',
                buildNumber: '666'
            });

            expect(gemini.on).to.be.calledWith('startRunner');
        });

        it('should add "tunnel-identifier" and "build" in provided desiredCapabilities', function () {
            var config = {
                desiredCapabilities: { cap: 'value' },
                gridUrl: 'http://user:key@ondemand.saucelabs.com/wd/hub'
            };
            gemini.config.forBrowser.returns(config);

            plugin(gemini, {
                jobNumber: '123',
                buildNumber: '666'
            });

            gemini.emit('startRunner');

            expect(config.desiredCapabilities).to.deep.equal({
                'tunnel-identifier': '123',
                build: '666',
                cap: 'value'
            });
        });

        it('should not add "tunnel-identifier" and "build" if gridUrl is not saucelabs.com', function () {
            var config = {
                desiredCapabilities: {},
                gridUrl: 'http://localhost:4444/wd/hub'
            };
            gemini.config.forBrowser.returns(config);

            plugin(gemini, {
                jobNumber: '123',
                buildNumber: '666'
            });

            gemini.emit('startRunner');

            expect(config.desiredCapabilities).to.deep.equal({});
        });

        it('should add "tunnel-identifier" and "build" if desiredCapabilities object is missing', function () {
            var config = {
                gridUrl: 'http://user:key@ondemand.saucelabs.com/wd/hub'
            };
            gemini.config.forBrowser.returns(config);

            plugin(gemini, {
                jobNumber: '123',
                buildNumber: '666'
            });

            gemini.emit('startRunner');

            expect(config.desiredCapabilities).to.deep.equal({
                'tunnel-identifier': '123',
                build: '666'
            });
        });
    });
});
