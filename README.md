[![Build Status](https://app.travis-ci.com/edoardomistretta/express-body-response-middleware.svg?token=VSCxk92ZQeMCCgpCbqvb&branch=master)](https://app.travis-ci.com/edoardomistretta/express-body-response-middleware)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)


# Express Body Response Middleware
This library exports a middleware to append to your [expressjs](https://www.npmjs.com/package/express) app.
The exported middleware allows you to get response body in an easy way.

### Main points
- the library is **agnostic** from any dependency (except, of course, expressjs). The middleware can be plugged into your express middlewares chain (e.g. you don't have to install [morgan](https://www.npmjs.com/package/morgan) in your app)
- the middleware can be used both **synchronously** and **asynchronously**
- the middleware works even if the body response is compressed with [compression](https://www.npmjs.com/package/compression) library

```typescript
import bodyResponseMiddleware from 'express-body-response-middleware';

const app = express();

const onSuccess = (body: string) => console.log(body);
const onError = (err: Error) => { throw err };

app.use(bodyResponseMiddleware(onSuccess, onError));
```

## Install
This is a Node.js module available through the npm registry. Installation is done using the `npm install` command
```sh
npm install --save express-body-response-middleware
```

## Usage
In your `app.ts` file you have to define `onSuccess` and `onError` functions, then append the middleware to you expressjs app.

### Examples
#### Print body response to stdout 
```typescript
import bodyResponseMiddleware from 'express-body-response-middleware';

const app = express();

const onSuccess = (body: string) => console.log(body);
const onError = (err: Error) => { throw err };

app.use(bodyResponseMiddleware(onSuccess, onError));
```
#### Write body response to filesystem 
```typescript
import bodyResponseMiddleware from 'express-body-response-middleware';
import fs from "fs";

const app = express();

const onSuccess = (body: string) => fs.writeFileSync("body-response.log", body);
const onError = (err: Error) => { throw err };

app.use(bodyResponseMiddleware(onSuccess, onError));
```
## License
MIT
