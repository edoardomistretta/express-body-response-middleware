import {NextFunction, Request, Response} from 'express';
import zlib from 'zlib';

const joinChunks = (response: Response): Promise<string> => {
  const previousWrite = response.write;
  const previousEnd = response.end;
  const chunks: Buffer[] = [];
  return new Promise((resolve, rej) => {
    response.write = function(chunk, ...rest) {
      chunks.push(Buffer.from(chunk));
      return previousWrite.apply(response, [chunk, ...rest] as any);
    };
    // @ts-ignore
    response.end = function(...rest) {
      const chunk = rest[0];
      if (typeof chunk !== 'function' && typeof chunk !== 'undefined') {
        chunks.push(Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);
      const contentEncoding = response.getHeader('Content-Encoding');
      if (contentEncoding && contentEncoding.toString().indexOf('gzip') >= 0) {
        zlib.gunzip(buffer, (err, unzippedBuffer) => {
          if (err) {
            rej(err);
          } else {
            resolve(unzippedBuffer.toString('utf8'));
          }
        });
      } else {
        resolve(buffer.toString('utf8'));
      }
      previousEnd.apply(response, rest as any);
    };
  });
};

export default (onSuccess: (body: string) => void, onFailure: (err: Error) => void) =>
  (_req: Request, res: Response, next: NextFunction) => {
    joinChunks(res)
        .then(onSuccess)
        .catch(onFailure);
    next();
  };
