import mongoose from 'mongoose';
import account from './account';
import answer from './answer';
import config from '../config';
import course from './course';
import enumCode from './enumCode';
import expert from './expert';
import menu from './menu';
import myCourse from './myCourse';
import question from './question';
import recommend from './recommend';
import teacherApply   from './teacherApply';
import courseCollection from './courseCollection';
import cmsmodule from './cmsmodule';
import role from './role';
import peeker from './peeker';
import focuspicture from './focuspicture';
import autoIncrement from './autoincrement';
import order from './orders';
import commissionlevel from './commissionLevel';
import laundrylist from './laundryList';
import withdraw from './withdraw';
import like from './like';
import message from './message';
import enshrine from './enshrine';
import partner from './partner';
import navigation from './navigation';
import examTpl from './examTpl';
import studentExam from './studentExam';
const _models = [
  course,
  teacherApply,
  enumCode,
  expert,
  myCourse,
  answer,
  question,
  recommend,
  menu,
  courseCollection,
  cmsmodule,
  role,
  peeker,
  focuspicture,
  autoIncrement,
  order,
  account,
  commissionlevel,
  laundrylist,
  withdraw,
  like,
  message,
  enshrine,
  partner,
  navigation,
  examTpl,
  studentExam
];

const _export = {};
mongoose.Promise = global.Promise;  
mongoose.connect(config.db, {server: {poolSize: 20}},
  err => {
    if (err) {
      console.error('connect to %s error: ', config.db, err.message);
      process.exit(1);
    }
});

mongoose.set('debug', config.mongoose_debug);

_models.map(model => {
  model.init();
  _export[model.name] = mongoose.model(model.name);
});

module.exports = _export;
