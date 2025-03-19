// more efficient than large file
const fs = require('fs');

const rs = fs.createReadStream('./abc/gists.txt',{encodeing:'utf8'});

const ws  = fs.createWriteStream('./abc/newgists.txt');

// rs.on('data',(dataChunk)=>{
//     ws.write(dataChunk);
// })

/*OR*/

rs.pipe(ws);