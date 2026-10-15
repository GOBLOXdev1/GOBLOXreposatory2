# Building a Windows executable (notes)

This document explains how the helper script tools/compile_to_exe.py works and important limitations.

Prerequisites
- Node.js 18+ and npm
- npx (bundled with npm)
- On Windows: test the produced executable in a clean environment

Quick steps (manual)
1. npm install
2. npm run build
3. npx pkg server/src/index.js --targets node18-win-x64 --output build_exe/goblox-server.exe
4. copy dist/ next to the exe and test: run goblox-server.exe and open the frontend served by the exe (see server behavior)

Limitations & caveats
- Native modules: sqlite3 and other native addons are not guaranteed to work when bundled by pkg. You may need to ship node_modules and native binaries alongside the exe or use platform-specific packaging like electron-builder.
- The script is a convenience tool for development/testing; it is not a production installer.
- Do not embed secrets. Set environment variables on target machines.

If you plan to produce cross-platform installers or a richer desktop experience, consider using Electron + electron-builder or a CI pipeline that builds artifacts per-platform and runs integration tests.
