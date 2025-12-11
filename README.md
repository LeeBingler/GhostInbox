# GhostInbox

## About GhostInbox

GhostInbox is a chrome extension that help you generate disposable email address :

**Easily**. In 2 click, you make a disposable email address, receive the message that you want and never see it again.

**Without browsing to get your address**. It's an extension ready to use, always open on your google chrome.

**Free, anonymous and temporary**. It use a free API to manage all the email address. 

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build
```

## Project Structure

- `src/serviceWorker/` - Extension background
- `src/content/` - Content scripts
- `src/hooks/` - React hooks use in content
- `src/utils` - Script in Javascript that is utils
- `manifest.config.js` - Chrome extension manifest configuration

## Technical details

- React with modern syntax
- Vite build tool
- CRXJS Vite plugin integration
- Chrome extension manifest configuration
- API Mail.tm to generate and manage disposable email address

## Documentation

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [CRXJS Documentation](https://crxjs.dev/vite-plugin)
- [API.Mail.tm Documentation](https://docs.mail.tm/)

## License
This project is released under the MIT License. You are free to use, modify, and distribute it as you wish.