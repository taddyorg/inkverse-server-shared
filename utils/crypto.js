const crypto = require("crypto");

async function generateRandomString(length){
  return await crypto.randomBytes(length/2) //Each byte is 8 bits. each hex is 4 bits.
    .toString('hex')
    .slice(0,length);
}

function getHashSHA512(secret, salt){
  var hash = crypto.createHmac('sha512', salt)
    .update(secret);
  var hashedSecret = hash.digest('hex');
  return [salt, hashedSecret];
};

module.exports = {
  generateRandomString,
  getHashSHA512,
}