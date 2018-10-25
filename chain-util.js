const crypto = require('crypto');
const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1');

const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }

  static hash(data) {
    const SHA256 = crypto.createHash('sha256');
    SHA256.update(JSON.stringify(data)).toString();
    return SHA256.digest('hex');
  }

  static verifySignature(publicKey, signature, dataHash) {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}

module.exports = ChainUtil;
