import   mongoose  from  'mongoose';
import   config    from  '../config';
import   right  from  '../models/right.js';

mongoose.connect(config.db, {server:{poolSize:20}} ,err =>{

	if (err) {
		console.log('connect to % s error: ', config.db, err.message);
		process.exit(1);
		return;
	} 
	mongoose.set('debug', config.mongoose_debug);
	right.init();

	let Right = mongoose.model(right.name);

  //Right.distinct(['moduleCode', 'moduleName'], (err, data) => {
    //console.log('data=', data);
  //});
  Right.aggregate([
    {"$group": { "_id": { code: "$moduleCode", name: "$moduleName" } } }
  ]).exec((err, data) => {console.log('data=', data);});
}) 

