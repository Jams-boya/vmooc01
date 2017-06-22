import mongoose from 'mongoose';

export default {
	//专题
	name: 'courseCollection',

	init() {

		const courseSchema = new mongoose.Schema({
			// 课程编号
			id: { type: String },
			// 课程名称
			name: { type: String },
			// 课程封面
			cover: { type: String },
			// 课程被收藏数
			favoriteCount: { type: Number },
			// 课程简介
			description: { type: String },
			// 课程有效期
			usePeriod: { type: Number },
			// 课程价格
			price: { type: Number },
		});

		const schema = new mongoose.Schema({
			//专题模板
			templet: { type: String },

			// 专题名称
			name: { type: String },

			// 专题链接
			link: { type: String },

			// 专题封面
			cover: { type: String },

			// 专题背景
			background: { type: String },

			// 专题背景色
			backgroundColor: { type: String },

			// 是否是推荐
			isRecommend: { type: Boolean },

			//专题状态 0: 已完成 1: 草稿
			state: { type: Number },

			// 专题章节
			chapter: [{
				// 章节名称
				name: { type: String },
				// 课程信息
				courses: [courseSchema]
			}],

			// 专题推荐讲师
			expert: [{
				//讲师id
				id: { type: String },
				// 讲师姓名
				name: { type: String },
				// 头像路径
				avatar: { type: String },
				// 生活照路径
				lifePhoto: { type: String },
				// 职称
				professionalTitle: { type: String },
				// 简介
				briefDescription: { type: String },
			}],

			// 合辑原价
			totalPrice: { type: Number },

			// 专题打包价格
			collectionPrice: { type: Number },
			//创建人 
			creator: {
				//创建人id
				id: { type: String },
				//创建人姓名
				name: { type: String },
				//创建时间
				create_time: { type: Date }
			},

			//修改人
			ver_his: [{
				//修改人id
				id: { type: String },
				//修改人姓名
				name: { type: String },
				//修改时间
				update_time: { type: Date }
			}],
			// 域名
			domain: { type: String }
		});

		mongoose.model(this.name, schema, 'courseCollection');
	}
}