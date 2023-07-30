import { Plugin } from 'vite';
import { arkhiCMS } from './cms';
import { arkhiCleaneExports } from './cean-exports';

export function arkhiPlugin(): Plugin[] {
    return [arkhiCMS(), arkhiCleaneExports()];
}
