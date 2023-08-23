import { Plugin } from 'vite';
import arkhiCMS from './cms';
import { arkhiCleanExports } from './clean-export';

export function arkhiPlugin(): Plugin[] {
    return [arkhiCMS(), arkhiCleanExports()];
}
