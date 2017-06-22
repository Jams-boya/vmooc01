import path from 'path';

export default {
  getImgPath(mainPath, width, height) {
    let arr      = path.basename(mainPath).split('.');
    let newname  = `${arr[0]}_${width}x${height}.${arr[1]}`;
    return path.join(path.dirname(mainPath), newname);
  },
}