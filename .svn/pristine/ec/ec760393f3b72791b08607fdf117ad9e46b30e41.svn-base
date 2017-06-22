import _ from 'lodash';
import eventproxy from 'eventproxy';
import log4js from 'log4js';
import mongoose from 'mongoose';
import validator from 'validator';

import { Menu } from '../models';

export default {

    /**
     * -- {查询菜单} --
     * callback:
     * - err, 数据库异常
     * - result, 操作结果
     * @param {String} name 模块名称
     * @param {Function} callback 回调函数
     * @author:ls
     */
    findOne(name, isInstructor, callback) {
        Menu.findOne({ moduleName: name }).lean().exec((err, data) => {
            if (err) {
                callback(err, []);
            }

            if (isInstructor) {
                _.remove(data.nav, (n) => {
                    return n.name === "讲师申请";
                });
            }
            callback(null, data);
        });
    }
}

