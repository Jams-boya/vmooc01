/** 消息提示 */
import React from 'react';
import { Button, notification } from 'antd';

export default {
  /** 系统消息提示(带点击) */
  MessageHasUrl(title, message, url) {
    const key = `open${Date.now()}`;

    const btnClick = function () {
      notification.close(key);
      window.open(url);
    };

    const close = function () {
      console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
    };

    /** 点击按钮 */
    const btn = (
      <Button type="primary" size="small" onClick={btnClick}>
        查看详情
      </Button>
    );

    /** 描述信息 */
    const description = (
      <span>
        {message}
      </span>
      );

    notification.open({
      message: title,
      description: description,
      btn,
      key,
      onClose: close,
      duration: 0
    });
  }

}