import * as CryptoJS from "crypto-js";

const SECRET = process.env.ENCRYPTION_SECRET as string;

export const decrypt = (cipher: string): string => {
  return CryptoJS.AES.decrypt(cipher, SECRET).toString(CryptoJS.enc.Utf8);
};
