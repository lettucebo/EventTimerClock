# Copilot Instructions for EventTimerClock

## Screenshot Capture Requirements

When capturing screenshots for this application that include Traditional Chinese (繁體中文) text:

1. **Install CJK fonts before capturing screenshots**: The headless browser environment needs Chinese font support to properly render Traditional Chinese characters. Install `fonts-noto-cjk` package:
   ```bash
   sudo apt-get install -y fonts-noto-cjk
   fc-cache -fv
   ```

2. **Why this is necessary**: Without CJK (Chinese, Japanese, Korean) fonts installed, Chinese characters will render as empty boxes (tofu □□□) in screenshots taken with headless browsers like Playwright or Puppeteer.

3. **Verify font installation**: After installing, refresh the font cache with `fc-cache -fv` before launching the browser.

## Multi-language Support

This application supports:
- Traditional Chinese (zh-TW)
- English (en)

When creating screenshots for documentation, capture both language versions to ensure complete coverage.
