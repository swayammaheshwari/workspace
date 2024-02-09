const process = require('process');
const http = require('http');
var server = http.createServer(function(req, res) {
   res.write("Success!");
   res.end();
});

server.listen(80, null, null, function() {
   console.log('User ID is:',process.getuid()+', Group ID:',process.getgid());
   drop_root_priviliges();
   console.log('User ID is:',process.getuid()+', Group ID:',process.getgid());
});

// function drop_root_priviliges(){
//     process.setgid(‘unknown’)
//     process.setuid(‘unknown’)
//  }

