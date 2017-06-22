/** redis 客户端 */

import redis from 'redis';
import config from '../config';

var client = '';
if (config.use_redis) {
  var client = redis.createClient(config.redis_port, config.redis_host);
}

export default client;