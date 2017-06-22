import mongoose from 'mongoose';

export default {

  // 菜单
  name: 'Menu',

  init() {
    // 子菜单
    const childSchema = new mongoose.Schema({
        name: {type: String},
        url: {type: String}
    });
    // 菜单
    const schema = new mongoose.Schema({
        nav: [{
            name: {type: String},
            url: {type: String},
            subMenu: [childSchema]
        }],
        moduleName:{type: String}
    });

    schema.index({moduleName: 1});
    

    mongoose.model(this.name, schema, 'menu');
  }
}







