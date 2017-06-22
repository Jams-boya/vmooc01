import mongodb from 'mongodb';
import config from '../server/config';
import eventproxy from 'eventproxy';

const host = "localhost";
const server = mongodb.Server(host, 27017, { auto_reconnect: true });
const db = new mongodb.Db("vmooc", server, { safe: true });

let base = ['account', 'answer', 'course', 'courseCollection',
    'expert', 'focuspicture', 'laundrylist', 'like', 'myCourse',
    'orders', 'peeker', 'question', 'recommend', 'teacherapply', 'withdraw'];
db.open(function (err, db) {
    let ep = new eventproxy();
    ep.after('end', base.length, (end) => {
        db.close();
    });
    for (let i = 0; i < base.length; i++) {
        db.collection(base[i], function (err, collection) {
            if (err) {
                console.log('21 err', err);
            }
            collection.remove({}, function (err1, employee) {
                if (err1) {
                    console.log('25 err1', err1);
                }
                ep.emit('end', employee);
            });
        });
    }
});