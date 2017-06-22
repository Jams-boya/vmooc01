import orderDal from '../dal/orderDal';
import eventproxy from 'eventproxy';
import accountDal from '../dal/accountDal';
import laundryDal from '../dal/laundryListDal';
import _ from 'lodash';

export default {
  /** 提交课程支付流水 */
  commitCourseLaundry(laundry, callback) {
    const ep = new eventproxy();
    const changes = laundry.changes; //待提交的流水

    ep.after('commintted', changes.length, (result) => {
      if (_.indexOf(result, 'fail') !== -1)
        return callback(null, {warn: '有账户转账未成功'});

      laundryDal.committedlaundry(laundry._id, (err, result) => {
        return  callback(err, {commitState: 'success'});
      });
    });

    changes.map(change => {
      if (change.type === 'alipay') 
        return ep.emit('commintted', 'success');

      //查询账户
      accountDal.queryAccountBalance(change.userId, change.isPlatform, (err, account) => {
        // 无账号操作
        if (!account) {
          accountDal.coursePayNoActive(change.userId, laundry._id, change.amt, (err, result) => {
            if (err)
              return ep.emit("commintted", 'fail');
            return ep.emit("commintted", 'success');
          });
        }

        // 有账号操作
        if (account) {
          if (change.isPlatform) {
            // 平台的账户资金变动
            accountDal.platformAccountEdit(account._id, laundry._id, change.amt, change.cashPooling, (err, result) => {
              if (err) {
                console.log('errr', err);
                return ep.emit("commintted", 'fail');
              }

              return ep.emit("commintted", 'success');
            });
          } else {
            accountDal.coursePay(account._id, laundry._id, change.amt, (err, result) => {
              if (err)
                return ep.emit("commintted", 'fail');
              return ep.emit("commintted", 'success');
            });
          }
        }

      });
    });
  },

  /** 提交提现流水 */
  committedWithdrawLaundry(oldlaundry, laundry, step, callback) {
    const ep = new eventproxy();
    const changes = laundry.changes;

    ep.after('commintted', changes.length, (result) => {
      if (_.indexOf(result, 'fail') !== -1)
        return callback(null, {warn: 'loading'});

      if (_.indexOf(result, 'loading') !== -1)
        return callback(null, {result: 'loading'});
      
      laundryDal.committedWithdrawlaundry(oldlaundry._id, laundry._id, (err, result) => {
        return  callback(err, {commitState: 'success'});
      });
    });

    changes.map(change => {
      /*** 点击提现时的流水提交 **/
      if (step === 1) {
        accountDal.withdrawPay(change.userId, laundry._id, change.amt, (err, result) => {
          if (err)
            return ep.emit("commintted", 'fail');
          return ep.emit("commintted", 'loading');
        });
      } else {
        /*** 提现确认的流水提交(平台的账户流转) ***/
        if(change.isPlatform === true) {
          accountDal.withdrawPayPlatform(laundry._id, change.cashPooling, (err, result) => {
            if (err)
              return ep.emit("commintted", 'fail');
            return ep.emit("commintted", 'success');
          });
        } else {
          return ep.emit("commintted", 'success');
        }
      }
    });
  },

  /** 问答流水提交 */
  committedQALaundry(oldlaundry, laundry, step, callback) {
    const ep = new eventproxy();
    const changes = laundry.changes;

    ep.after('commintted', changes.length, (result) => {
      if (_.indexOf(result, 'fail') !== -1)
        return callback(null, {warn: 'loading'});

      if (_.indexOf(result, 'loading') !== -1)
        return callback(null, {result: 'loading'});
      
      let laundrys = [oldlaundry._id, laundry._id];
      laundryDal.committedLaundrys(laundrys, (err, result) => {
        return  callback(err, {commitState: 'success'});
      });
    });

    changes.map(change => {

      if (change.type === 'alipay' && !change.isPlatform) 
        return ep.emit('commintted', 'success');

      /***** get account info *****/
      accountDal.queryAccountBalance(change.userId, change.isPlatform, (err, account) => {
        let note = step === 1? 'loading': 'success';
        if (change.isPlatform) {
          // 平台的账户资金变动
          accountDal.platformAccountEdit(account._id, laundry._id, change.amt, change.cashPooling, (err, result) => {
            if (err) {
              console.log('errr', err);
              return ep.emit("commintted", 'fail');
            }
            return ep.emit("commintted", note);
          });
        } else {
          // 无账号操作
          if (!account) {
            accountDal.coursePayNoActive(change.userId, laundry._id, change.amt, (err, result) => {
              if (err)
                return ep.emit("commintted", 'fail');
              return ep.emit("commintted", note);
            });
          } else {
            accountDal.coursePay(account._id, laundry._id, change.amt, (err, result) => {
              if (err)
                return ep.emit("commintted", 'fail');
              return ep.emit("commintted", note);
            });
          }
          
        }

      });
    });
  }
}