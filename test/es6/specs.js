/*global describe:true, before:true, beforeEach:true, afterEach:true,
  it:true, after:true */

import 'traceur/bin/traceur-runtime';
import '../../lib/es5/wrapper';
import 'should';
import Q from 'q';

async function sleep (ms) {
  let start = Date.now();
  var p = new Promise((resolve) => {
    setTimeout(function () {
      let end = Date.now();
      if ((end - start) < ms) {
        setTimeout(function () {
          resolve();
        }, end - start);
      } else {
        resolve();
      }
    }, ms);
  });
  await p;
}

async function slowDouble (x) {
  await sleep(10);
  return x * 2;
}

async function slowConcat (str, extra) {
  await sleep(20);
  return str + extra;
}

describe('mochawait tests', function () {
  let myInt = 2
    , myStr = ''
    , testsRun = 0;

  before(async function () {
    let start = Date.now();
    myStr.should.equal('');
    myStr = await slowConcat(myStr, 'foo');
    (Date.now() - start).should.be.above(19);
  });

  beforeEach(async function () {
    let start = Date.now();
    myInt = await slowDouble(myInt);
    (Date.now() - start).should.be.above(9);
  });

  after(async function () {
    let start = Date.now();
    myInt = await slowDouble(myInt);
    (Date.now() - start).should.be.above(9);
    myInt.should.equal(32);
  });

  afterEach(async function () {
    let start = Date.now();
    await sleep(50);
    if (testsRun === 1) {
      myStr.should.equal('foobar');
    } else {
      myStr.should.equal('foobarbaz');
    }
    (Date.now() - start).should.be.above(49);
  });

  it('should work like mocha', async function () {
    myStr.should.equal('foo');
    myInt.should.equal(4);
    let start = Date.now();
    myInt = await slowDouble(myInt);
    let then = Date.now();
    (then - start).should.be.above(9);
    myStr = await slowConcat(myStr, 'bar');
    (Date.now() - start).should.be.above(19);
    testsRun++;
  });

  it('should work like mocha some more', async function () {
    myStr.should.equal('foobar');
    myInt.should.equal(16);
    let start = Date.now();
    myStr = await slowConcat(myStr, 'baz');
    (Date.now() - start).should.be.above(19);
    testsRun++;
  });
});
