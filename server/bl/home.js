import mongoose from 'mongoose';
import fs from 'fs';
import eventproxy from 'eventproxy';
import formidable from 'formidable';
import config from '../config';
import tools from '../middlewares/tools';
import {myRender} from './common';
import CourseDal from '../dal/courseDal';
import expertDal from '../dal/expertDal';
import cmsDal from '../dal/cmsDal';
import collectionDal from '../dal/courseCollectionDal';
import hbhelper from './hbhelper';

export default {
  /**
   * 课程首页入口
   * @bs
   */
  entry(req, res, next) {
  	let ep = new eventproxy();
 		ep.all('getCourse', 'getExperts', 'getCollections', 'getPics', (courses, experts, collections, pics) => {

 			myRender(
 				req,
 				res,
 				'home',
 			  {
 			  	title: config.name + '-首页',
 			  	home: true,
 			  	courses: courses.splice(0,6),
 			  	experts: experts.splice(0,4),
          collections: collections,
          pics: pics
 			  }
 			);
 		});

    cmsDal.getfocuspic(req.session.domain, (err, pics) => {
      if (err) {
        return next(err);
      }
      if (!pics)
        return ep.emit('getPics',[]);
      ep.emit('getPics', pics.pics || []);
    });
    CourseDal.popCourse(req.session.domain, 'home', (err,courses) => {
      if (err) {
        return next(err);
      }
      ep.emit('getCourse', courses);
    });

    expertDal.getExpert(req.session.domain, (err, experts) => {
    	if (err) {
        return next(err);
      }
      ep.emit('getExperts', experts);
    });

    collectionDal.getCollections(req.session.domain, (err, collections) => {
      if (err) {
        return next(err);
      }
      ep.emit('getCollections', collections);
    });

  },
};
