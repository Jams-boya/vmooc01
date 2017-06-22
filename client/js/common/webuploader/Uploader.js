
import './Uploader.css';
import 'webuploader/dist/webuploader.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import config from '../../../../server/config';

import _ from 'lodash';
import MyNotify from 'js/common/MyNotify';

import WebUploader from 'webuploader';
import React, { Component } from 'react';

class Uploader extends Component {
    constructor(props) {
        super(props);
        this.uploader = null;
        this.fileCount = 0;
        this.fileSize = 0;
        this.percentages = {};
        let ratio = window.devicePixelRatio || 1;
        this.$wrap = null;
        this.$queue = null;
        this.$statusBar = null;
        this.$info = null;
        this.$upload = null;
        this.$uploadCancel = null;
        this.$placeHolder = null;
        this.$progress = null;
        this.$state = 'pedding';
        this.thumbnailWidth = 110 * ratio;
        this.thumbnailHeight = 110 * ratio;
        this.supportTransition = (function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })();
        this.state = {
            model: this.props.model || null,
            data: this.props.data,
            uploadFiles: this.props.uploadFiles,
            cidx: this.props.cidx,
            index: this.props.index
        };
    }
    componentDidMount() {
        // console.log(config.videoUrl);
        let Url = `${config.videoUrl}/videoUpload`;
        let testUrl = 'http://localhost:3000/videoUpload';
        this.$wrap = $('#videoUploader');
        this.$queue = $('<ul class="filelist"></ul>').appendTo(this.$wrap.find('.queueList'));
        this.$statusBar = this.$wrap.find('.statusBar');
        this.$info = this.$statusBar.find('.info');
        this.$upload = this.$wrap.find('.uploadBtn');
        this.$cancel = this.$wrap.find('.cancelBtn');
        this.$placeHolder = this.$wrap.find('.placeholder');
        this.$progress = this.$statusBar.find('.progress');
        let Options = {
            swf: 'webuploader/dist/Uploader.swf',
            server: Url,
            disableGlobalDnd: true,// 禁掉全局的拖拽功能。这样不会出现视频拖进页面的时候，把视频打开。
            dnd: '#dndArea',
            fileSizeLimit: 2048 * 2048 * 2048,
            method: 'post',
            fileNumLimit: 1,
            pick: {
                id: '#filePicker',
                label: '选择视频'
            },
            accept: [{
                title: 'video',
                extensions: 'mp4,3gp,flv,avi,3gpp,wmv,mkv,rmvb,rm'
            }]
        };
        console.log(Options);
        // 组件初始化
        this.uploader = WebUploader.create(Options);


        // 文件加入是触发
        this.uploader.on('fileQueued', (file) => {
            console.log("file", file);
            if (this.fileCount === 1) {
                return false;
            }
            this.fileCount++;
            this.fileSize += file.size;
            console.log('this.filiCount', this.fileCount);
            if (this.fileCount === 1) {
                this.$placeHolder.addClass('element-invisible');
                this.$statusBar.show();
            }

            this.addFile(file);
            this.updateTotalProgress();
            this.$placeHolder.addClass('element-invisible');
            $('#filePicker2').removeClass('element-invisible');
            this.$queue.show();
            this.$statusBar.removeClass('element-invisible');
            this.uploader.refresh();
        });

        // 当文件拖拽进组件的时候触发
        this.uploader.on('dndAccept', function (items) {
            var denied = false,
                len = items.length,
                i = 0,
                // 修改js类型
                unAllowed = 'text/plain;application/javascript ';

            for (; i < len; i++) {
                // 如果在列表里面
                if (~unAllowed.indexOf(items[i].type)) {
                    denied = true;
                    break;
                }
            }
            return !denied;
        });

        // 文件移除的时候触发
        this.uploader.on('fileDequeued', (file) => {
            this.fileCount--;
            this.fileSize -= file.size;

            this.removeFile(file);
            this.updateTotalProgress();
            this.$placeHolder.removeClass('element-invisible');
            this.$queue.hide();
            this.$statusBar.addClass('element-invisible');
            this.uploader.refresh();
        });

        // 错误触发
        this.uploader.on('error', (err) => {
            if (err === "Q_EXCEED_SIZE_LIMIT") {
                return MyNotify.warn("文件超出限制大小");
            }
            if (err === "Q_TYPE_DENIED") {
                return MyNotify.warn("请上传正常视频文件");
            }
        });

        this.uploader.on('uploadProgress', (file, percentage) => {
            this.$progress.css('display', 'show');
            $(".text").text(Math.round(percentage * 100) + '%');
            $(".width").css('width', Math.round(percentage * 100) + '%');
        });


        //上传成功时触发
        this.uploader.on('uploadSuccess', function (file, response) {
            let toc = this.state.data;
            this.updateStatus();
            let stats = this.uploader.getStats();
            if (stats.successNum === 1) {
                $('#modal-id').modal('hide');
            }

            if (!toc || toc.length == 0) {
                toc = [{
                    chapter: '0',
                    clazz: [{
                        title: "123",
                        videoPath: "",
                        rawPath: response.files.file.path,
                        isFree: false,
                        transCoding: true,
                        name: file.name
                    }]
                }];
            }
            let fileName = response.files.file.path.split('/')[2];
            let uploadFile = {
                cidx: this.state.cidx,
                index: this.state.index,
                file: response.files.file,
                fileName: fileName,
                name: file.name
            }
            this.state.uploadFiles.push(uploadFile);

            toc[this.state.cidx].clazz[this.state.index].videoPath = "";
            toc[this.state.cidx].clazz[this.state.index].transCoding = true;
            toc[this.state.cidx].clazz[this.state.index].rawPath = response.files.file.path;
            toc[this.state.cidx].clazz[this.state.index].name = file.name;
            this.props.setToc(toc, this.state.uploadFiles);
        }.bind(this));


        // 点击开始上传的时候触发
        this.$upload.on('click', () => {
            
            if ($(this).hasClass('disabled')) {
                return false;
            }
            this.$cancel.show();
            this.$upload.hide();
            this.uploader.upload();
        });

        this.$cancel.on('click', () => {
            this.uploader.stop();
            let fileid = this.uploader.getFiles()[0].id;
            this.uploader.cancelFile(fileid);
            this.$cancel.hide();
            this.$upload.show();
        });
    }
    addFile(file) {
        var text = "";
        let $li = $('<li id="' + file.id + '" style="margin:0">' +
            '<p class="title">' + file.name + '</p>' +
            '<p class="imgWrap"></p>' +
            '<p class="progress"><span></span></p>' +
            '</li>'),
            $btns = $('<div class="file-panel">' +
                '<span class="cancel" idx="0">删除</span>' +
                '<span class="rotateRight" idx="1">向右旋转</span>' +
                '<span class="rotateLeft" idx="2">向左旋转</span></div>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function (code) {
                switch (code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text(text).appendTo($li);
            };

        if (file.getStatus() === 'invalid') {
            showError(file.statusText);
        } else {
            // @todo lazyload
            $wrap.text('预览中');
            this.uploader.makeThumb(file, (error, src) => {
                var img;

                if (error) {
                    $wrap.text('不能预览');
                    return;
                }

                if (isSupportBase64) {
                    img = $('<img src="' + src + '">');
                    $wrap.empty().append(img);
                } else {
                    $.ajax('../../server/preview.php', {
                        method: 'POST',
                        data: src,
                        dataType: 'json'
                    }).done(function (response) {
                        if (response.result) {
                            img = $('<img src="' + response.result + '">');
                            $wrap.empty().append(img);
                        } else {
                            $wrap.text("预览出错");
                        }
                    });
                }
            }, this.thumbnailWidth, this.thumbnailHeight);

            this.percentages[file.id] = [file.size, 0];
            file.rotation = 0;
        }

        var Rthis = this;
        file.on('statuschange', function (cur, prev) {
            if (prev === 'progress') {
                $prgress.hide().width(0);
            } else if (prev === 'queued') {
                $li.off('mouseenter mouseleave');
                $btns.remove();
            }

            // 成功
            if (cur === 'error' || cur === 'invalid') {
                showError(file.statusText);
                Rthis.updateTotalProgress();
            } else if (cur === 'interrupt') {
                showError('interrupt');
            } else if (cur === 'queued') {
                $info.remove();
                $prgress.css('display', 'block');
            } else if (cur === 'progress') {
                $info.remove();
                $prgress.css('display', 'block');
            } else if (cur === 'complete') {
                $prgress.hide().width(0);
                $li.append('<span class="success"></span>');
            }

            $li.removeClass('state-' + prev).addClass('state-' + cur);
        });

        $li.on('mouseenter', function () {
            $btns.stop().animate({ height: 30 });
        });

        $li.on('mouseleave', function () {
            $btns.stop().animate({ height: 0 });
        });

        $btns.on('click', 'span', (e) => {

            let index = $(e.target).index(),
                deg;

            switch (index) {
                case 0:
                    this.uploader.removeFile(file);
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if (this.supportTransition) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
            }

        });
        $li.appendTo(this.$queue);
    }

    updateStatus() {
        
        let text = '', stats, state = this.$state;
        stats = this.uploader.getStats();
console.log(stats);
        if (stats.successNum == 1) {
            MyNotify.info('上传成功');
        }
        text = '共' + this.fileCount + '个（' +
            WebUploader.formatSize(this.fileSize) +
            '），已上传' + stats.successNum + '个';

        if (stats.uploadFailNum) {
            text += '，失败' + stats.uploadFailNum + '个';
        }

        this.$info.html(text);
    }

    updateTotalProgress() {
        let loaded = 0,
            total = 0,
            spans = this.$progress.children(),
            percent;
        $.each(this.percentages, function (k, v) {
            total += v[0];
            loaded += v[0] * v[1];
        });

        percent = total ? loaded / total : 0;


        spans.eq(0).text(Math.round(percent * 100) + '%');
        spans.eq(1).css('width', Math.round(percent * 100) + '%');
        this.updateStatus();
    }

    removeFile(file) {
        var $li = $('#' + file.id);
        delete this.percentages[file.id];
        this.updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    render() {
        return (
            <div id="wrapper">
                <div id="container">
                    <div id="videoUploader" className="wu-example">
                        <div className="queueList">
                            <div id="dndArea" className="placeholder">
                                <div id="filePicker" className="webuploader-container"></div>
                                <p> 或将视频拖到这里，单次只能上一个视频,支持格式(mp4,flv,avi,wmv,3gp等格式),最大不能超过1GB</p>
                            </div>
                        </div>
                        <div className="statusBar" style={{ display: 'none' }}>
                            <div className="progress" >
                                <span className="text"> 0%</span>
                                <span className="percentage width" ></span>
                            </div>
                            <div className="info"></div>
                            <div className="btns">
                                <div id="filePicker2" className="webuploader-container"></div>

                                <div className="uploadBtn state-pedding">开始上传</div>
                                <div className="cancelBtn state-pedding" style={{ display: 'none' }}>取消上传</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Uploader;
