import React, { Component } from 'react';
import Webuploader from 'webuploader';
import './uploader.css';

class ImgUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      option: {
        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        swf: '/js/Uploader.swf',

        // 文件接收服务端。
        server: '/special/upload',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',

        // 只允许选择图片文件。
        accept: {
          title: 'Images',
          extensions: 'gif,jpg,jpeg,bmp,png',
          mimeTypes: 'image/*'
        }
      },
    };
    this.uploader = null;
  }
  
  reload() {
    this.uploader = Webuploader.create(this.state.option);

    // 当有文件添加进来的时候
    this.uploader.on('fileQueued', function (file) {
      console.log('file', file);
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    this.uploader.on('uploadSuccess', function (file, res) {
      let url = res.path;
      this.state.url = '..\\' + url;
      this.refs.bgShow.src = '..\\' + url;
      $('.webuploader-pick').html('编辑图片');
    }.bind(this));
  }

  componentDidMount() {
    this.uploader = Webuploader.create(this.state.option);

    // 当有文件添加进来的时候
    this.uploader.on('fileQueued', function (file) {
      console.log('file', file);
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    this.uploader.on('uploadSuccess', function (file, res) {
      let url = res.path;
      this.state.url = '..\\' + url;
      this.refs.bgShow.src = '..\\' + url;
      $('.webuploader-pick').html('编辑图片');
    }.bind(this));
  }

  render() {
    let btnName = '';
    if (this.state.url != '') {
      btnName = '编辑图片';
    } else {
      btnName = '上传图片';
    }
    return (
      <div>
        <div className="uploadBtn">
          <div id="uploader-demo">
            <div id="fileList" className="uploader-list"></div>
            <div id="filePicker">{btnName}</div>
          </div>
        </div>
        <div>
          <img className="upImg" ref="bgShow" />
        </div>
      </div>
    );
  };
}
export default ImgUpload;