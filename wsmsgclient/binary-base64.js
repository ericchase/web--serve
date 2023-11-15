const binToB64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const b64ToBin = new Map([...binToB64].map((c, i) => [c, i]));

/**
 * @param {Uint8Array} u8
 * @return {string}
 */
export function bytesToBase64(u8) {
  let b64 = '';
  let i = 0;
  while (i + 3 <= u8.length) {
    for (const byte of new Uint8Array([
      ((0b11111100 & u8[i]) >> 2) | 0, //
      ((0b00000011 & u8[i]) << 4) | ((0b11110000 & u8[i + 1]) >> 4),
      /*                         */ ((0b00001111 & u8[i + 1]) << 2) | ((0b11000000 & u8[i + 2]) >> 6),
      /*                                                            */ (0b00111111 & u8[i + 2]) | 0,
    ])) {
      b64 += binToB64[byte];
    }
    i += 3;
  }
  switch (u8.length - i) {
    case 2: {
      for (const byte of new Uint8Array([
        ((0b11111100 & u8[i]) >> 2) | 0, //
        ((0b00000011 & u8[i]) << 4) | ((0b11110000 & u8[i + 1]) >> 4),
        /*                         */ ((0b00001111 & u8[i + 1]) << 2) | 0,
      ])) {
        b64 += binToB64[byte];
      }
      b64 += '=';
      break;
    }
    case 1: {
      for (const byte of new Uint8Array([
        ((0b11111100 & u8[i]) >> 2) | 0, //
        ((0b00000011 & u8[i]) << 4) | 0,
      ])) {
        b64 += binToB64[byte];
      }
      b64 += '==';
      break;
    }
  }
  return b64;
}

const tin = new Uint8Array([
  246, 15, 106, 55, 89, 255, 174, 162, 138, 163, 61, 120, 221, 74, 243, 62, 32, 52, 82, 248, 103, 89, 217, 113, 227, 216, 151, 237, 18, 87, 241, 217,
]);
bytesToBase64(tin);

/**
 * @param {string} b64
 * @return {Uint8Array}
 */
export function base64ToBytes(b64) {
  if (b64.length % 4 === 0) {
    const padding = (b64[b64.length - 1] === '=' ? 1 : 0) + (b64[b64.length - 2] === '=' ? 1 : 0);
    const b64u8 = new Uint8Array(b64.length - padding);
    for (let i = 0; i < b64u8.byteLength; ++i) {
      b64u8[i] = b64ToBin.get(b64[i]) ?? 0;
    }
    const u8 = new Uint8Array((b64.length / 4) * 3 - padding);
    let offset = 0;
    let i = 0;
    while (i + 4 <= b64u8.length) {
      for (const byte of new Uint8Array([
        ((0b00111111 & b64u8[i]) << 2) | ((0b00110000 & b64u8[i + 1]) >> 4), //
        /*                            */ ((0b00001111 & b64u8[i + 1]) << 4) | ((0b00111100 & b64u8[i + 2]) >> 2),
        /*                                                                 */ ((0b00000011 & b64u8[i + 2]) << 6) | (0b00111111 & b64u8[i + 3]),
      ])) {
        u8[offset] = byte;
        ++offset;
      }
      i += 4;
    }
    switch (u8.length - offset) {
      case 2: {
        for (const byte of new Uint8Array([
          ((0b00111111 & b64u8[i]) << 2) | ((0b00110000 & b64u8[i + 1]) >> 4), //
          /*                            */ ((0b00001111 & b64u8[i + 1]) << 4) | ((0b00111100 & b64u8[i + 2]) >> 2),
        ])) {
          u8[offset] = byte;
          ++offset;
        }
        break;
      }
      case 1: {
        for (const byte of new Uint8Array([
          ((0b00111111 & b64u8[i]) << 2) | ((0b00110000 & b64u8[i + 1]) >> 4), //
        ])) {
          u8[offset] = byte;
          ++offset;
        }
        break;
      }
    }
    return u8;
  }
  return new Uint8Array(0);
}
