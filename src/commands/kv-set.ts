import { manager } from '../storage/manager.js';

/**
 * KV set command
 */
export class KVSetCommand extends runium.class.RuniumCommand {
  /**
   * Config command
   */
  protected config(): void {
    this.command
      .name('set')
      .description('set a key-value pair')
      .argument('<key>', 'key')
      .argument('<value>', 'value');
  }

  /**
   * Handle command
   * @param key
   * @param value
   */
  protected async handle(key: string, value: string): Promise<void> {
    await manager.load();
    manager.set(key, value);
    await manager.save();
    runium.output.success(`Key "${key}" set.`);
  }
}
