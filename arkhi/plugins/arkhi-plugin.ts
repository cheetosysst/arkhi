import { Plugin } from 'vite';
import { arkhiCMS } from './cms';
import { arkhiCleanExports } from './cean-exports';

export function arkhiPlugin(): Plugin[] {
    return [arkhiCMS(), arkhiCleanExports()];
}
