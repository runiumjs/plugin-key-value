import { manager } from '../storage/manager.js';

/**
 * KV clear command
 */
export class KVClearCommand extends runium.class.RuniumCommand {
  /**
   * Config command
   */
  protected config(): void {
    this.command.name('clear').description('clear all key-value pairs');
  }

  /**
   * Handle command
   */
  protected async handle(): Promise<void> {
    await manager.load();
    await manager.clear();
    await manager.save();
    runium.output.success('All key-value pairs cleared.');
  }
}
