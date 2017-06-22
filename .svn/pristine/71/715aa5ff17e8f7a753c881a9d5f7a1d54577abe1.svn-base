import mongoose from 'mongoose';

export default {
  /**
  * 课程冗余
  * @ courseCollection表（专题表）
  * @ ……
  */
  // 课程
  name: 'Course',

  init() {
    const schema = new mongoose.Schema({
      // 课程名称
      name: { type: String },
      // 价格
      price: { type: Number },
      // 购买人数
      purchaseCount: { type: Number, default: 0 },
      // 课程目录 Table of Content
      toc: [{
        // 章节
        chapter: { type: String },
        // 是否免费
        isFree: { type: Boolean, default: false },
        // 课时
        clazz: [{
          // 关联课时题库(讲师)
          examTplId: { type: mongoose.Schema.Types.ObjectId},
          // 课时标题
          title: { type: String },
          //视频名称
          name: { type: String },
          // 课时描述
          description: { type: String },
          // 转码后视频路径
          videoPath: { type: String },
          // 源视频在硬盘上实际路径
          rawPath: { type: String },
          // 创建时间
          createAt: { type: Number },
          // 转码状态
          transCoding: { type: Boolean, default: true },
          // 文件大小
          fileSize: { type: Number },
          // 是否免费
          isFree: { type: Boolean, default: false },
          // 是否有试题
          isHasExam: { type: Boolean, default: false },
          // 课时时长 (新增)
          time: { type: Number },
        }]
      }],
      // 是否免费
      isFree: { type: Boolean, default: false },
      // 收藏数量
      favoriteCount: { type: Number, default: 0 },
      // 课程被点击数，每一次点击算一次;
      clickCount: { type: Number },
      // 是否是草稿
      isDraft: { type: Boolean, default: false },
      // 使用期限
      usePeriod: { type: Number, default: 12 },
      // 是否是微课程
      isMicroCourse: { type: Boolean, default: false },
      // 微课程视频地址
      microVideoPath: { type: String },
      // 课程截图
      coursePicturePath: { type: String },
      // 课程状态 -1=建设中(视频转码中) 0=建设中 1=售卖中 2=违规下架 3=违规待审核 5=已删除
      state: { type: Number, default: 0 },
      //违规下架理由
      soldOutReason: { type: String },
      // 课程分类
      classify: { type: String },
      // 课程方向(学习方向)
      direction: { type: String },
      // 课程封面
      cover: { type: String },
      // 讲师姓名
      teacherName: { type: String },
      // 讲师Id
      teacherId: { type: String },
      // 课程简介
      description: { type: String },
      // 适合人群
      suitableCrowd: { type: String },
      // 预备能力
      preliminary: { type: String },
      // 授课目标
      target: { type: String },
      // 总课时
      clazzNumber: { type: String },
      // 创建时间
      createAt: { type: Date },
      // 是否是推荐
      isRecommend: { type: Boolean },
      // 上传视频信息
      uploadFile: [{
        type: mongoose.Schema.Types.Mixed,
      }],
      // 创建者姓名
      //creactName: {type: String},
      // 更新者Id
      //updateId: {type: String},
      // 更新者姓名
      //updateName: {type: String},
      // 更新时间
      updateAt: { type: String },
      // 域名
      domain: { type: String },
      // 优惠码
      promoCode: [{
        // 优惠码号
        code: { type: String },
        // 剩余次数
        remainCount: { type: Number },
        // 实际发布次数(讲师发布的次数)
        totalCount: { type: Number },
        // 生成时间
        createAt: { type: Number },
        // 最后更新时间
        lastUpdateAt: {type: Number},
      }],
    });

    // TODO add index
    schema.index({ userId: 1 });
    mongoose.model(this.name, schema, 'course');
  }
}
