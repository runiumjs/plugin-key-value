import * as os from 'node:os';
import * as crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;

const secret = `${os.hostname()}:${os.userInfo().username}`;
const salt = Buffer.from('runium-key-value', 'utf-8');
const encryptionKey = crypto.scryptSync(secret, salt, KEY_LENGTH) as Buffer;

/**
 * Encrypt value
 * @param value
 */
export function encrypt(value: string): string {
  const iv = crypto.randomBytes(IV_LENGTH) as Buffer;
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(value), 'utf-8') as Buffer,
    cipher.final() as Buffer,
  ]);
  const authTag = cipher.getAuthTag() as Buffer;
  // stored format: <iv_hex>:<authTag_hex>:<ciphertext_hex>
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypt value
 * @param value
 */
export function decrypt(value: string): string {
  let result = '';

  const parts = value.split(':');
  if (parts.length !== 3) {
    throwDecryptionError();
  }
  try {
    const [ivHex, authTagHex, ciphertextHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
    decipher.setAuthTag(authTag);
    result =
      (decipher.update(ciphertext) as Buffer).toString('utf-8') +
      (decipher.final() as Buffer).toString('utf-8');
  } catch (ex) {
    throwDecryptionError(ex as Error);
  }

  return result;
}

/**
 * Throw decryption error
 * @param error
 */
function throwDecryptionError(error?: Error): void {
  throw new runium.class.RuniumError(
    'Error decrypting value — the store may be corrupted.',
    'DECRYPTION_ERROR',
    { original: error }
  );
}
