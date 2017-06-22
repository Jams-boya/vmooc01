import fs            from 'fs';
import path          from 'path';
import KeywordFilter from 'keyword-filter';


let keywords = [];

/** 关键字文件 */
let keywordPath = path.join(__dirname, '../keyword/keywords.txt');
let data = fs.readFileSync(keywordPath, {encoding: 'utf-8'});
keywords = data.split(/\r?\n/);

/** 初始化过滤器 */
let filter = new KeywordFilter();
filter.init(keywords);

export default {
  /** 验证是否包含关键字 */
  hasKeyword(content) {
    return filter.hasKeyword(content);
  },

  /** 替换 */
  replaceKeywords(content, field) {
    return filter.replaceKeywords(content, field);
  }
};