import eventproxy   from 'eventproxy';
import fs           from 'fs';
import mongoose     from 'mongoose';

import config       from '../config';
import menuDal  from '../dal/menuDal'
import tools        from '../middlewares/tools';
import {myRender}   from './common';

export default {
    // 查询菜单
    findOne(req, res, next) {
        let {name} = req.query;
        let {isInstructor} = req.session.user;
        menuDal.findOne(
            name,
            isInstructor,
            (err, data) => {
                if (err) {
                    return next(err);
                }
                res.setHeader('Cache-Control', 'no-Cache');
                res.json(data);
            }
        )
    }
};


