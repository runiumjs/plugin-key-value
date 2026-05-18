import { manager } from './storage/manager.js';

/**
 * Macro set value by key
 * @param key
 * @param defaultValue
 */
export function keyValueMacro(key: string, defaultValue?: string): string {
  return manager.get(key) ?? defaultValue ?? '';
}
