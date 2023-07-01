import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import contentManagementPlugin from './packages/core/src/cms'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [react(), ssr(), contentManagementPlugin()]
}

export default config
