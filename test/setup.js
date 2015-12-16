global.chai = require('chai');
global.expect = require('chai').expect;
global.sinon = require('sinon');

chai.should();
chai
    .use(require('sinon-chai'))
    .use(require('chai-as-promised'));
