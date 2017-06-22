import {myRender} from './common';
import CourseDal from '../dal/courseDal';

export default {
  /**
   * 课程列表页--入口
   */
  courseListEntry(req, res, next) {
      CourseDal.courseList(
        {},
        {"purchaseCount" : -1},
        1,
        (err, courses) => {
          if (err) {
            return next(err);
          }
          res.setHeader('Cache-Control','no-Cache');
          res.json(courses);
        }
      );
    },
  /**
   * 课程列表页--根据条件获取课程
   * @author bs
   */
  courseList(req, res, next) {
    let sort_sel = req.query.sortBy;
    let sortBy = {};
    let classify = {};
    let page = 1;
    if (req.query.classify && req.query.classify != '')
      classify = {"classify" : req.query.classify};

    if (sort_sel == "price") {
      sortBy = {"price" : 1};
    } else if (sort_sel == "time") {
      sortBy = {"createAt" : -1};
    } else {
      sortBy = {"purchaseCount" : -1}
    }

    if(req.query.page && !isNaN(req.query.page)) {
      page = req.query.page;
    }

    CourseDal.courseList(
      classify,
      sortBy,
      page,
      (err, courses) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control','no-Cache');
        res.json(courses);
      }
    );
  },
}