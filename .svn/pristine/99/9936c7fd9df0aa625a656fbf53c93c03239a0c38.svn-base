import express           from 'express';
import expressHandlebars from 'express-handlebars';
import session           from 'express-session';
import path              from 'path';
import favicon           from 'serve-favicon';
import cookieParser      from 'cookie-parser';
import connectRedis      from 'connect-redis';
import bodyParser        from 'body-parser';
import log4js            from 'log4js'; 
import config            from './config';
import redis             from 'redis';
import models            from './models'; 
import auth              from './middlewares/auth';
import http              from 'http';
import routers           from './routers';
import mylog, {logger}   from './middlewares/mylog';
import socketServer from './socket.js';
import fs from 'fs';
import keywordFilter from './keywordFilter';

import cookie from 'cookie';
import events from 'events';
import client from './middlewares/redis';
let sio = require('socket.io')({ transports: ['websocket', 'polling'] });
var emitter = new events.EventEmitter();
let redisAdapter = require('socket.io-redis');
// var storeMemory = new express.session.MemoryStore();

// if (config.use_redis) {
//   var client = redis.createClient(config.redis_port, config.redis_host);
// }

mylog.init();

let isDev = config.isDev;
let app   = express();
let server = http.createServer(app);


// set favicon
app.use(favicon(path.join(__dirname, '../views/favicon.ico')));

// set views folder
app.set('views', path.join(__dirname, '../views'));

// for parsing application/json 
app.use(bodyParser.json({limit:'10mb'})); 
// for parsing application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({extended: true, limit:'10mb', parameterLimit:12000})); 
// cookie parser
app.use(cookieParser(config.session_serect));

// set handlebars engine
const handlebars = expressHandlebars.create({ 
  extname: '.html',
  layoutsDir: path.join(__dirname, '../views/layouts'),
  defaultLayout: 'public_layout',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});


app.engine('html', handlebars.engine);
app.set('view engine', 'html');

if (!isDev) {
  app.set('view cache', true);
}

app.disable('x-powered-by');

if (!config.use_redis) {
    app.use(session());
} else {
    const RedisStore = connectRedis(session);
    app.use(session({
        secret: config.session_secret,
        store: new RedisStore({
            port : config.redis_port,
            host : config.redis_host,
        }),
        resave: true,
        saveUninitialized: true,
    }));
}

app.locals.env = process.env.NODE_ENV || 'dev';

if (isDev) {
  app.use(express.static(path.join(__dirname, '../client'))); 
} else {
  app.use(express.static(path.join(__dirname, '../dist')));
}

app.use(auth.authUser);
app.use(mylog.logAccess);

app.use('/', routers);

// http 404 handler
app.use((req, res, next) => {
  logger.error('404:', req.url);
  res.status(404).render('404', {layout: null});
});

// http 500 handler
app.use((err, req, res, next) => {
  logger.error('500', err.stack);
  res.status(500).send('500 status');
});

server.listen(config.port, function () {
    logger.info(`App (production) is now running on port ${config.port}!`);
  });
/**** socket server start *****/
socketServer["io"] = sio.listen(server);
socketServer['io'].adapter(redisAdapter({ host: '127.0.0.1', port: 6379 }));

// /** 配置socket */
if (config.use_redis) {
  socketServer["io"].use((socket, next) => {
    cookieParser(config.session_serect)(socket.request, null, function(err) {
      if (err) {
        console.log("err parse");
        return next(new Error("cookie err"));
      }
      //获得sessionId
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      const sessionId = cookieParser.signedCookie(cookies['connect.sid'], config.session_serect);
      //从redis读取JavaScript(JSON)对象
      client.get(`sess:${sessionId}`, function(err, session) {
        if (err)
          return next(new Error(err));
        socket.session = JSON.parse(session);
        next();
      })
    });
  });
}

/** socket 连接处理 */
function socketConnectionHandle(socket) {

  if (!socket || !socket.session || !socket.session.user)
    return false;

  const session = socket.session.user._id;
  socket.join(session);
  socket.emit('connectSuccess', 'success');
  /** 断开来连接 */
  socket.on('disconnect', function () {
    socket.leave(session);
  });
}

/******** socket 监听连接 ********/
socketServer.io.on('connection', socketConnectionHandle);

process.on('uncaughtException', function (err) {
  const logger = log4js.getLogger('errors');
  logger.error('uncaughtException:', err);

  try {
      
  } catch (e) {
    logger.error('error when exit', e.stack);
  }
});
process.setMaxListeners(0);

logger.info('ready for service ...');

