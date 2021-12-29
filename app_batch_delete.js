var farmer = require("./farmer");
var fs = require("fs");
const readline = require("readline");
var path = require("path");
var keys = require("./keys");
var farmer = farmer(keys.serverEnd,keys);

async function deleteImages() {
  const fileStream = fs.createReadStream("delete_ids_input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const id of rl) {
    
    try{
      await farmer.deleteTarget(id);
      console.log(`delete success: ${id}`);
    }
    catch(e){
      console.log(`delete failed: ${id}`,e.result);
      
    }
    
  }
}
deleteImages();
