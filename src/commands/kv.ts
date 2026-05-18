import { KVSetCommand } from './kv-set.js';
import { KVGetCommand } from './kv-get.js';
import { KVRemoveCommand } from './kv-remove.js';
import { KVListCommand } from './kv-list.js';
import { KVClearCommand } from './kv-clear.js';

/**
 * Key-value group command
 */
export class KVCommand extends runium.class.RuniumCommand {
  /**
   * Subcommands
   */
  subcommands = [
    KVSetCommand,
    KVGetCommand,
    KVRemoveCommand,
    KVListCommand,
    KVClearCommand,
  ];

  /**
   * Config command
   */
  protected config(): void {
    this.command.name('kv').description('manage key-value pairs');
  }

  /**
   * Handle command
   */
  protected async handle(): Promise<void> {
    this.command.help();
  }
}
