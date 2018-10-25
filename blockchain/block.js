const { DIFFICULTY, MINE_RATE } = require('./../config');
const ChainUtil = require('./../chain-util');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Lash Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}`;
  }

  static genesis() {
    return new this('Genesis Time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;

    let hash;
    let ts;
    let nonce = 0;
    let { difficulty } = lastBlock;

    do {
      nonce += 1;
      ts = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, ts);
      hash = Block.hash(ts, lastHash, data, nonce, difficulty);
    } while (hash.slice(0, difficulty) !== '0'.repeat(difficulty));

    return new this(ts, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, timestamp) {
    let { difficulty } = lastBlock;
    difficulty = (lastBlock.timestamp + MINE_RATE) > timestamp ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;
