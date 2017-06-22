import socketServer from './socket';

export default {
  /** 推送系统消息 */
  sendSystemMessage(sessionId, title, message, url) {
    console.log('sessionId', sessionId);
    socketServer.io.sockets.in(sessionId).emit('systemMessage', {title, message, url});
  },

  /** 全局推送系统消息 */
  sendMessageAllUsers() {
    socketServer.io.sockets.emit('systemMessage', {message: 'aaaaa'});
  },

  /** 推送支付宝付款成功的消息 */
  sendSuccessPaidMessage(sessionId, result) {
    socketServer.io.sockets.in(sessionId).emit('paidSuccess', result);
  }
}