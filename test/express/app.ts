import compression from 'compression';
import express, {Request, Response} from 'express';
import collectBody from '../../src';
import {logger} from '../logger';

const app = express();
const onSuccess = (body: string) => {
  logger.log(body);
};
const onError = (err: Error) => {
  throw err;
};

app.use(collectBody(onSuccess, onError));
// NOTE: response body with a size below 1024 bytes won't get compressed
app.use(compression({threshold: 1024}));

app.get('/text', (_req: Request, res: Response) => {
  res.contentType('text/plain');
  res.send('this is the response body with text/plain MIME type');
});
app.get('/json', (_req: Request, res: Response) => {
  res.contentType('application/json');
  res.send({info: 'this is the response body with application/json MIME type'});
});
app.get('/compressed', (_req: Request, res: Response) => {
  res.send('compressed'.repeat(1000));
});

export default app;
