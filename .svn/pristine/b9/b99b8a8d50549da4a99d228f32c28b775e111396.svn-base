import mongoose from 'mongoose';

export default {

  name: 'Role',

  init() {
    const schema = new mongoose.Schema({
      // 合作方域名
      partnerDomain: {type: String},
      // 角色名称
      name: {type: String},
      // 角色包含的权限集合
      right: [{
        // 权限所在组
        group: {type: String},
        // 权限代码
        codes: [[{type: String}]]
      }],
      defaultRight: [{type: String}],
      // 创建时间
      createAt: {type: Number, default: Date.now()},
      // 更新时间
      updateAt: {type: Number, default: Date.now()},
    });

    schema.index({companyId: 1, name: 1}, {unique: true});

    mongoose.model(this.name, schema, 'role');
  }
}

