const vapid = require('./vapid.json');
const urlsafeBase64 = require('urlsafe-base64');

module.exports.getKey = () => {
    return urlsafeBase64.decode(vapid.publicKey);
}