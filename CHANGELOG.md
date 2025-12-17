# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-12-17

### Changed
- Redesigned light mode theme with warm orange color scheme
  - Primary color changed to warm orange (#ea580c)
  - Background updated to warm cream (#fffbf5) with peach accents (#fef3e2)
  - Text colors updated to warm brown tones (#431407, #78350f, #a16207)
  - Button colors updated to match warm theme (orange/amber tones)
  - Cohesive warm shadows and border styling

### Added
- Light mode and dark mode screenshots to all README files
- Screenshots for both zh-TW and en locales
- Copilot instructions for CJK font requirements in documentation

### Fixed
- Chinese character rendering in light mode screenshots with proper CJK font support

## [1.0.1] - 2025-12-14

### Added
- Language-specific screenshots for Traditional Chinese (zh-TW) and English (en) locales
- Individual README files for each supported language
  - `README.zh-TW.md` for Traditional Chinese
  - `README.en.md` for English
- "Copy & Edit" button for built-in preset templates

### Fixed
- Default template selection no longer switches to edit mode automatically
- Template selection now stays in preset mode as expected
- Only clicking "Copy & Edit" explicitly switches to custom mode

## [1.0.0] - 2025-12-14

### Added
- Initial release of Event Timer Clock
- Stopwatch-style timer with forward counting from 00:00:00
- Large display format suitable for projection (HH:MM:SS or MM:SS)
- Real-time updates using requestAnimationFrame
- Control functions: Start, Pause, Reset, and Fullscreen toggle
- Time-based alarm system with configurable beep counts (1-5 beeps)
- Web Audio API sound implementation with visual flash effects
- Preset templates:
  - Speech Mode (15 minutes) with 3 alarm points
  - Presentation Mode (10 minutes) with 3 alarm points
- Custom alarm settings with add/edit/delete functionality
- Template saving to localStorage with persistence across sessions
- Internationalization (i18n) support
  - Traditional Chinese (zh-TW)
  - English (en)
- Automatic language detection based on browser settings
- Manual language selection with localStorage persistence
- Light/dark theme system
  - Three theme modes: Light, Dark, and Auto (system tracking)
  - Theme persistence via localStorage
  - System theme detection with real-time updates
- Responsive design for mobile and desktop
- Dark mode optimized for projection environments
- GitHub Actions CI/CD pipeline
  - Automatic build and type checking on pull requests
  - Deployment to GitHub Pages on tagged commits
  - Manual deployment option via workflow dispatch

### Technical Stack
- Vue 3 with Composition API and `<script setup>`
- Vite as build tool
- TypeScript with strict mode
- CSS with CSS Variables for theming
- Vue I18n for internationalization

[1.0.2]: https://github.com/lettucebo/EventTimerClock/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/lettucebo/EventTimerClock/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/lettucebo/EventTimerClock/releases/tag/1.0.0
