var fs = require("fs"); //引用文件系统模块
const path = require('path');
function readFileList(path, filesList) {
  var files = fs.readdirSync(path);
  files.forEach(function (itm, index) {
    var stat = fs.statSync(path + itm);
    if (stat.isDirectory()) {
      //递归读取文件
      readFileList(path + itm + "/", filesList);
    } else {
      var obj = {}; //定义一个对象存放文件的路径和名字
      obj.path = path; //路径
      obj.filename = itm; //名字
      filesList.push(obj);
    }
  });
}
//获取文件夹下的所有文件
function getFileList(path) {
  var filesList = [];
  readFileList(path, filesList);
  return filesList;
}

function getFiles() {
  //获取文件夹下的所有图片
  function getImageFiles(dirname) {
    var imageList = [];

    var files = fs.readdirSync(dirname);
    files.forEach(function (item, index) {
      if (path.extname(item) == ".png" || path.extname(item) == ".png" ){
        var imagePath = `${dirname}${item}`
        imageList.push(imagePath);
      }
    });
    return imageList;
  }

  return {
    getImageFiles: getImageFiles,
  };
}
module.exports = getFiles;
