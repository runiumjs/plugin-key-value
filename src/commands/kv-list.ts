import { manager } from '../storage/manager.js';

/**
 * KV list command
 */
export class KVListCommand extends runium.class.RuniumCommand {
  /**
   * Config command
   */
  protected config(): void {
    this.command.name('list').description('list all key-value pairs');
  }

  /**
   * Handle command
   */
  protected async handle(): Promise<void> {
    await manager.load();
    const pairs = manager.getMultiple('');
    const entries = Object.entries(pairs);

    if (entries.length === 0) {
      runium.output.warn('No key-value pairs stored.');
      return;
    }

    runium.output.table(
      entries.map(([key, value]) => ({ key, value })),
      ['key', 'value']
    );
  }
}
