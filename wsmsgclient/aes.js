// import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { base64ToBytes, bytesToBase64 } from './binary-base64.js';

const encryptionType = 'AES-CBC'; // 'aes-256-cbc';
// const encryptionEncoding = 'base64';
// const bufferEncryption = 'utf-8';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * @return {Promise<[CryptoKey, Uint8Array, string]>} [ key, iv, base64 string ]
 */
export async function generateKeyIv() {
  const key = await getRandomAesKey();
  const iv = getRandomAesIV();
  const b64 = await base64FromKeyIv(key, iv);
  return [key, iv, b64];
}

/**
 * @param {string} plaintext
 * @param {CryptoKey} key
 * @param {Uint8Array} iv
 * @returns {Promise<string>} base64String
 */
export async function encrypt(plaintext, key, iv) {
  // const cipher = createCipheriv(encryptionType, key, iv);
  // return cipher.update(plaintext, bufferEncryption, encryptionEncoding) + cipher.final(encryptionEncoding);
  const plaintext_bytes = encoder.encode(plaintext);
  const encrypted_bytes = new Uint8Array(await window.crypto.subtle.encrypt({ name: encryptionType, iv }, key, plaintext_bytes));
  return bytesToBase64(encrypted_bytes);
}

/**
 * @param {string} base64String
 * @param {CryptoKey} key
 * @param {Uint8Array} iv
 * @returns {Promise<string>}
 */
export async function decrypt(base64String, key, iv) {
  // const decipher = createDecipheriv(encryptionType, key, iv);
  // const buffer = Buffer.from(base64String, encryptionEncoding);
  // return decipher.update(buffer).toString() + decipher.final().toString();
  const decrypted_bytes = await window.crypto.subtle.decrypt({ name: encryptionType, iv }, key, base64ToBytes(base64String));
  return decoder.decode(decrypted_bytes);
}

// helpers

/**
 * @returns {Promise<CryptoKey>}
 */
export async function getRandomAesKey() {
  // return randomBytes(32);
  // return Buffer.from(window.crypto.getRandomValues(new Uint8Array(32)));
  return await window.crypto.subtle.generateKey({ name: encryptionType, length: 256 }, true, ['encrypt', 'decrypt']);
}
/**
 * @return {Uint8Array}
 */
export function getRandomAesIV() {
  // return randomBytes(16);
  return window.crypto.getRandomValues(new Uint8Array(16));
}

/**
 * @param {Uint8Array} buffer1
 * @param {Uint8Array} buffer2
 */
export function concat(buffer1, buffer2) {
  const u8out = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  let offset = 0;
  for (let i = 0; i < buffer1.byteLength; ++i) {
    u8out[offset] = buffer1[i];
    ++offset;
  }
  for (let i = 0; i < buffer2.byteLength; ++i) {
    u8out[offset] = buffer2[i];
    ++offset;
  }
  return u8out;
}

/**
 * @param {CryptoKey} key
 * @param {Uint8Array} iv
 * @returns {Promise<string>}
 */
export async function base64FromKeyIv(key, iv) {
  return bytesToBase64(concat(new Uint8Array(await window.crypto.subtle.exportKey('raw', key)), iv));
}

/**
 * @param {string} b64
 * @returns {Promise<[CryptoKey, Uint8Array]>} [key, iv]
 */
export async function base64ToKeyIv(b64) {
  const keyiv = base64ToBytes(b64);
  if (keyiv.byteLength === 32 + 16) {
    const bkey = new Uint8Array(32);
    for (let i = 0; i < 32; ++i) {
      bkey[i] = keyiv[i];
    }
    const iv = new Uint8Array(16);
    for (let i = 0; i < 16; ++i) {
      iv[i] = keyiv[i + 32];
    }
    const key = await window.crypto.subtle.importKey('raw', bkey, { name: encryptionType, length: 256 }, true, ['encrypt', 'decrypt']);
    return [key, iv];
  }
  throw 'Invalid Base64 string for key/iv pair.';
}
