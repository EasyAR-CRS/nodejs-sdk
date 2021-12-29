var farmer = require("./farmer");
var fs = require("fs");
var path = require("path");
var keys = require("./keys");
var fileHelper = require("./filehelper");
var farmer = farmer(keys.serverEnd,keys);


async function uploadProducts(productName, dir) {
  var a = fileHelper();
  var images = a.getImageFiles(dir);
  console.log(`读取总图片数${images.length}`);

  for (var i = 0; i < images.length; i++) {
    var imagePath = images[i];
    for (var retry = 0; retry < 3; retry++) {
      try {
        console.log(`开始上传${i + 1}/${images.length} }`);
        console.log(`${path.basename(imagePath)}`);

        var resp = await farmer.createTarget({
          type: "ImageTarget",
          size: "50",
          name: productName,
          allowSimilar: "1",
          image: fs.readFileSync(imagePath).toString("base64"),
        });
        console.log(`result: ${resp.result.targetId}`);
        logIds(path.join(dir,'log.txt'),resp.result.targetId)
        break;
      } catch (e) {
        console.error(`上传失败${imagePath}`, e);
      }
    }
    console.log(`结束上传${i + 1}/${images.length} `);
  }
}

function logIds(filename, id) {
  try {
    fs.appendFileSync(filename, id + '\n');
  } catch (error) {
    console.log(error);
  }
}

async function uploadAll() {
  await uploadProducts("testanr", "./images/");
  console.log("开始上传眼霜");
  await uploadProducts("eyetest", "./images/");
}

uploadAll();
//  async  function deleteImage(){
//     await farmer.deleteTarget('f8fce8f6-89e2-4fc1-8385-46a1ebb2f3b9')
//     console.log('delete 1')
//     await farmer.deleteTarget('1d3cc4c3-a61d-4fd0-b745-10d06ae041b1')
//     console.log('delete 2')
//     await farmer.deleteTarget('48adeb88-f804-417e-93c5-d9dc978f6adb')
//     console.log('delete 3')
// }
// deleteImage()
