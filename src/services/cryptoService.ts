import CryptoJS from 'crypto-js';

// In production, derive this from user's auth or a master key
const getEncryptionKey = (): string => {
  return import.meta.env.VITE_ENCRYPTION_KEY || 'vaultlink-default-key-change-me';
};

export const cryptoService = {
  encrypt: (value: string): string => {
    return CryptoJS.AES.encrypt(value, getEncryptionKey()).toString();
  },
  decrypt: (ciphertext: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, getEncryptionKey());
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '••••••••';
    }
  },
  generatePassword: (length = 16): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }
    return password;
  },
};
