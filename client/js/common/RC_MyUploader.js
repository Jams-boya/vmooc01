import 'webuploader/css/webuploader.css';

import _ from 'lodash';
import ReactDom from 'react-dom';
import WebUploader from 'webuploader';
import React, { Component } from 'react';

class RC_MyUploader extends Component {
  constructor(props) {
    super(props);

    this.uploader = null;
    this.state = this.getInitState();
  }

  getInitState() {
    return {
      model: this.props.model || null,
      imgPath: this.props.imgPath || null,
      data: this.props.data || null,
      field: this.props.field || null,
      fileType: this.props.type || null,
    }
  }
  componentWillReceiveProps(nextProps) {
    const {field} = this.state;
    const {initData} = nextProps;
    if (initData) {
      let path = initData[field];
      this.setState({ imgPath: path });
    }
  }

  componentDidMount() {
    let {fileType} = this.state;

    let creactObj = {
      auto: true,
      swf: 'webuploader/dist/Uploader.swf',
      server: '/upload/' + this.state.model,
      pick: '#uploader',
    };

    if (fileType === "image") {
      creactObj.accept = [{
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
      }];
    } else if (fileType === "video") {
      creactObj.accept = [{
        title: 'video',
        extensions: 'mp4,3gp,flv,avi',
        mimeTypes: 'video/*'
      }];
    }
    this.uploader = WebUploader.create(creactObj);

    this.uploader.on('uploadSuccess', (files, res) => {
      this.setState({ imgPath: res.path });
    });
    this.uploader.on('uploadError', (file, reason) => {
    });

    this.uploader.on('uploadBeforeSend', (block, data) => {
      data.id = this.props.id || this.props.initData._id;
    });
  }

  render() {

    let uploadedImg = this.state.imgPath;
    let describe = this.props.describe || null;
    let describelabel;
    let src = `/view/${uploadedImg}`;
    let img;
    let imgStyle = {
      width: '350px',
      height: '350px'
    };
    let {className, display} = this.props;

    if (uploadedImg) {
      img = <img src={src} style={imgStyle} />;
    } else {
      img = null;
    }
    if (describe) {
      describelabel = <label className="">{describe}</label>
    } else {
      describelabel = null;
    }


    return (
      <div className="form-group col-md-9 col-sm-9 col-xs-12">
        <label className="control-label col-md-2 col-sm-2 col-xs-12 text-center">
          {describelabel}
        </label>
        <div className="col-md-10 col-sm-10 col-xs-12">
          <div id="uploader-demo">
            <div id="fileList" className="uploader-list">
              {img}
            </div>
            <div id="uploader" style={{ display: display }}>选择图片</div>

          </div>
        </div>
      </div>
    );
  }
}
export default RC_MyUploader;

