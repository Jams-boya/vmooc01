import qr from 'qr-image';

export default {
  /** 生成二维码 */
  buildQr(req, res, next) {
    const url = req.query.qrUrl;
    
    let img = qr.image(url,{size :10});
    try {
      res.writeHead(200, {'Content-Type': 'image/png'});
      img.pipe(res);
    } catch (e) {
      res.writeHead(414, {'Content-Type': 'text/html'});
      res.end('<h1>414 Request-URI Too Large</h1>');
    }
    
  }
}