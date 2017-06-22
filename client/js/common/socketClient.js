import messageNote from 'js/common/messageNote/messageNote.js';

(() => {

  /** 断开连接 */
  socket.on('disconnect', function() {
    socket.emit('disconnect', 'sss');
  });

  /** 接受系统消息 */
  socket.on('systemMessage', function(note) {
    const title   = note.title || '消息提示';
    const message = note.message || '';
    const url     = note.url || '';
    messageNote.MessageHasUrl(title, message, url);
  });

  /** 连接成功的回调 */
  socket.on("connectSuccess", (note) => {
    console.log(note);
  });

})()