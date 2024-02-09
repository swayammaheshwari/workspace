const ngrok = require('ngrok');
(async function() {
  let token = "2Km1yiCAlx3k1Gcnk8rpqD2CRIB_5SUbuai7Dj4rps2vsx52c"
  await ngrok.authtoken(token);
  const url = await ngrok.connect();
  console.log(url)
})();