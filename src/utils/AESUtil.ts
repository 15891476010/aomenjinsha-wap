// @ts-expect-error: crypto-js 没有类型声明或类型声明不完整，需忽略类型检查
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;

const isSecret = import.meta.env.VITE_APP_ENCRYPTION === "true";

export function encrypt(data: any): any {
  const str = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(str),
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return isSecret ? encrypted.toString() : data;
}

export function decrypt(ciphertext: any): any {
  try {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    return isSecret ? JSON.parse(decryptedStr) : ciphertext;
  } catch {
    // 解密失败，返回 null
    return null;
  }
}
