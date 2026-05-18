import { manager } from '../storage/manager.js';

/**
 * KV get command
 */
export class KVGetCommand extends runium.class.RuniumCommand {
  /**
   * Config command
   */
  protected config(): void {
    this.command
      .name('get')
      .description('get a value by key')
      .argument('<key>', 'key');
  }

  /**
   * Handle command
   * @param key
   */
  protected async handle(key: string): Promise<void> {
    await manager.load();
    const value = manager.get(key);
    if (value === undefined) {
      runium.output.warn(`Key "${String(key)}" not found.`);
    } else {
      runium.output.log(value);
    }
  }
}
