import { manager } from '../storage/manager.js';

/**
 * KV remove command
 */
export class KVRemoveCommand extends runium.class.RuniumCommand {
  /**
   * Config command
   */
  protected config(): void {
    this.command
      .name('remove')
      .description('remove a key-value pair')
      .argument('<key>', 'key');
  }

  /**
   * Handle command
   * @param key
   */
  protected async handle(key: string): Promise<void> {
    await manager.load();

    const removed = manager.remove(key);
    if (removed) {
      await manager.save();
      runium.output.success(`Key "${key}" removed.`);
    } else {
      runium.output.warn(`Key "${String(key)}" not found.`);
    }
  }
}
