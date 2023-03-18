import config from '@src/config/config';
import crypto from 'crypto';

const {
  encrypt: { secretKey, iv: encryptIv },
} = config;

//Using AES encryption
// aes-256-cbc securre? https://www.n-able.com/blog/aes-256-encryption-algorithm
const algorithm = 'aes-256-cbc';

// hashes of secret key and initialization vector
// sha512 is a one way hashing function
const key = crypto.createHash('sha512').update(secretKey).digest('hex').substring(0, 32);
const iv = crypto.createHash('sha512').update(encryptIv).digest('hex').substring(0, 16);

/**
 * For encrypting strings that we want to securely store
 * @param data | string we want to encrypt
 * @returns hash of encrypted string
 */
export function encryptData(data: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // Encrypts data and converts to hex and base64
  return Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64');
}

/**
 * For decrypting encrypted hashes
 * @param encryptedData | hash of ecrypted data
 * @returns string before it was encrypted
 */
export function decryptData(encryptedData: string) {
  const buff = Buffer.from(encryptedData, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  // Decrypts data and converts to utf8
  return decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8');
}
