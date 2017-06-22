// import installDal from '../dal/installDal'
import formidable   from 'formidable';
import fs           from 'fs';
import mkdirp       from 'mkdirp';
import path         from 'path';
import eventproxy from 'eventproxy';
import ffmpeg from 'fluent-ffmpeg';

export default {
  testModelExport(req, res, next) {
    // installDal.initDb(function (err, data) {
    //    res.json(err);
    // });
  },

  testUpload(req, res, next) {
  	console.log("---------------upload----------------")

  	const folder = `upload/video`;
    const ep = new eventproxy();

    ep.on('folder_exist', () => {
    	console.log("formidable");
      let form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.uploadDir = folder;
      form.keepExtensions = true;
      form.parse(req, function (err, fields, files) {
        if (err) {
        	console.log("uploadERER", err);
          return next(err);
        }
        //视频转换2
				let proc = new ffmpeg({ source: files.file.path })
				.withSize('1280x720')
				.withVideoCodec('mjpeg')
				.toFormat('mp4')
				.saveToFile('upload/video/mp4/EVE.mp4', function (retcode, error) {

				console.log('file has been converted succesfully');

				});
        console.log("-------------success---------------");
      });
    });

    fs.exists(folder, (exists) => {
      if (exists) {
      	console.log("exists");
        return ep.emit('folder_exist');
      }
      mkdirp(folder, (err) => {
        if (err) {
        	console.log("err", err);
          return next(err);
        }
        console.log("mkdir");
        ep.emit('folder_exist');
      });
    });
  }
}

