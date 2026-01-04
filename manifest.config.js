import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    24: 'icons/icon24.png',
    48: 'icons/icon48.png',
    96: 'icons/icon96.png',
    128: 'icons/icon128.png'
  },
  permissions: [
    "storage"
  ],
  action: {
    default_icon: {
      24: 'icons/icon24.png',
      48: 'icons/icon48.png',
      96: 'icons/icon96.png',
      128: 'icons/icon128.png'
    },
  },
  content_scripts: [{
    js: ['src/content/main.jsx'],
    matches: ['<all_urls>'],
  }],
  background: {
    service_worker: 'src/serviceWorker/main.js',
    type: "module"
  }
})
