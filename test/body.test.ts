import request from 'supertest';
import app from './express/app';
import sinon from 'sinon';
import {logger} from './logger';

describe('Response bodies should pass through custom logger', () => {
  const sandbox = sinon.createSandbox();
  afterEach(function() {
    sandbox.restore();
  });

  it('should log text/plain', (done) => {
    const spy = sandbox.spy(logger, 'log');
    request(app)
        .get('/text')
        .expect(200)
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .end(function(err, _res) {
          if (err) throw err;
          expect(
              spy.calledOnceWithExactly('this is the response body with text/plain MIME type'),
          ).toBe(true);
          done();
        });
  });

  it('should log application/json', (done) => {
    const spy = sandbox.spy(logger, 'log');
    request(app)
        .get('/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, _res) {
          if (err) throw err;
          expect(
              spy.calledOnceWithExactly(
                  JSON.stringify(
                      {info: 'this is the response body with application/json MIME type'},
                  ),
              ),
          ).toBe(true);
          done();
        });
  });

  it('should log compressed response', (done) => {
    const spy = sandbox.spy(logger, 'log');
    request(app)
        .get('/compressed')
        .expect(200)
        .expect('Content-Encoding', 'gzip')
        .end(function(err, _res) {
          if (err) throw err;
          expect(spy.calledOnceWithExactly('compressed'.repeat(1000))).toBe(true);
          done();
        });
  });
});
