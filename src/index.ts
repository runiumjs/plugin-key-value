import { Plugin } from '@runium/types-plugin';
import { KVCommand } from './commands/kv.js';
import { keyValueMacro } from './macros.js';
import { manager } from './storage/manager.js';

export default function (): Plugin {
  return {
    name: 'key-value',
    app: {
      commands: [KVCommand],
    },
    project: {
      macros: {
        kv: keyValueMacro,
      },
    },
    hooks: {
      project: {
        beforeConfigRead: async () => {
          await manager.load();
        },
      },
    },
  } as Plugin;
}
