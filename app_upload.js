var farmer = require("./farmer");
var fs = require("fs");
var path = require("path");
var keys = require("./keys");


var farmer = farmer(keys.serverEnd,keys);

async function upload(){
  var resp = await farmer.createTarget({
    type: "ImageTarget",
    size: "50",
    name: 'test',
    allowSimilar: "1",
    image: fs.readFileSync('./images/test_target_image.jpg').toString("base64"),
  });
  console.log(`result: ${resp.result.targetId}`);
}

upload();

