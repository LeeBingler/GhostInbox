import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    24: 'icons/icon24.ico',
    48: 'icons/icon48.ico',
    96: 'icons/icon96.ico',
  },
  permissions: [
    "tabs",
    "activeTab",
    "scripting",
    "sidePanel",
    "contentSettings"
  ],
  action: {
    default_icon: {
      24: 'icons/icon24.ico',
      48: 'icons/icon48.ico',
      96: 'icons/icon96.ico',
    },
  },
  content_scripts: [{
    js: ['src/content/main.jsx'],
    matches: ['https://*/*'],
  }],
  background: {
    service_worker: 'src/serviceWorker/main.js',
    type: "module"
  }
})
