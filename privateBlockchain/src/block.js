/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform,
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 *  All the exposed methods should return a Promise to allow all the methods
 *  run asynchronous.
 */

const SHA256 = require("crypto-js/sha256");
const hex2ascii = require("hex2ascii");

class Block {
  // Constructor - argument data will be the object containing the transaction data
  constructor(data) {
    this.hash = null; // Hash of the block
    this.height = 0; // Block Height (consecutive number of each block)
    //implement JSON object
    this.body = Buffer.from(JSON.stringify(data)).toString("hex"); // Will contain the transactions stored in the block, by default it will encode the data
    this.time = 0; // Timestamp for the Block creation
    this.previousBlockHash = null; // Reference to the previous Block Hash
  }

  /**
   *  validate() method will validate if the block has been tampered or not.
   *  Been tampered means that someone from outside the application tried to change
   *  values in the block data as a consecuence the hash of the block should be different.
   *  Steps:
   *  1. Return a new promise to allow the method be called asynchronous.
   *  2. Save the in auxiliary variable the current hash of the block (`this` represent the block object)
   *  3. Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
   *  4. Compare if the auxiliary hash value is different from the calculated one.
   *  5. Resolve true or false depending if it is valid or not.
   *  Note: to access the class values inside a Promise code you need to create an auxiliary value `let self = this;`
   */
  validate() {
    let self = this;
    return new Promise((resolve, reject) => {
      // Save in auxiliary variable the current block hash & clear
      const currentHash = self.hash;
      self.hash = null;
      // Recalculate the hash of the Block
      // Comparing if the hashes changed
      let encryptedHash = SHA256(JSON.stringify(self)).toString();
      // Returning the Block is not valid
      self.hash = currentHash;
      // Returning the Block is valid
      if (currentHash != encryptedHash) {
        reject(Error("Incorrect hash"));
      } else {
        resolve(true);
      }
    });
  }

  /**
   *  Auxiliary Method to return the block body (decoding the data)
   *  Steps:
   *
   *  1. Use hex2ascii module to decode the data
   *  2. Because data is a javascript object use JSON.parse(string) to get the Javascript Object
   *  3. Resolve with the data and make sure that you don't need to return the data for the `genesis block`
   *     or Reject with an error.
   */
  getBData() {
    //get encoded block data
    let block = this;
    return new Promise((resolve, reject) => {
      //check for genesis block
      if (block.height == 0) {
        resolve("Genesis Block");
      }
      //decode block data - Udacity technical mentor help change to block.body
      let decodedData = hex2ascii(block.body);
      //parse decoded retriever object
      let parsedData = JSON.parse(decodedData);
      //save data to block
      if (parsedData) {
        resolve(parsedData);
      } else {
        reject(error("Add data - block.js line 83"));
      }
    });
  }
}

module.exports.Block = Block; // Exposing the Block class as a module
