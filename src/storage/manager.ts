import { decrypt, encrypt } from './crypto.js';

type JSONRecord = Record<string, unknown>;
type FlatRecord = Record<string, string>;

const FILE_NAME = 'storage.json';
const DIR_NAME = 'key-value';
const STORAGE_PATH = [DIR_NAME, FILE_NAME];

class StorageManager {
  private data: JSONRecord = {};

  private isLoaded = false;

  /**
   * Load data file
   */
  async load(): Promise<void> {
    if (!this.isLoaded) {
      if (await runium.storage.isExists(STORAGE_PATH)) {
        try {
          this.data = await runium.storage.readJson(STORAGE_PATH);
        } catch (error) {
          runium.output.error('Failed to read key-value store file.');
        }
      }
      this.isLoaded = true;
    }
  }

  /**
   * Save data file
   */
  async save(): Promise<void> {
    await runium.storage.ensureDirExists(DIR_NAME);
    await runium.storage.writeJson(STORAGE_PATH, this.data);
  }

  /**
   * Clear data file
   */
  async clear(): Promise<void> {
    this.data = {};
  }

  /**
   * Get value by key
   * @param key
   */
  get(key: string): string | undefined {
    const raw = this.data[key];
    return raw ? decrypt(raw as string) : undefined;
  }

  /**
   * Get multiple key-value pairs
   * @param prefix
   */
  getMultiple(prefix: string): FlatRecord {
    const result: FlatRecord = {};
    for (const [key, value] of Object.entries(this.data)) {
      if (key.startsWith(prefix)) {
        result[key] = value ? decrypt(value as string) : '';
      }
    }
    return result;
  }

  /**
   * Remove value by key
   * @param key
   */
  remove(key: string): boolean {
    if (Object.hasOwn(this.data, key)) {
      delete this.data[key];
      return true;
    }
    return false;
  }

  /**
   * Set value by key
   * @param key
   * @param value
   */
  set(key: string, value: string): void {
    this.data[key] = encrypt(value);
  }
}

export const manager = new StorageManager();
