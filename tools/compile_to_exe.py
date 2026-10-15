#!/usr/bin/env python3
"""
compile_to_exe.py

Automates building the frontend and packaging the Node server into a Windows executable using `pkg`.

Usage:
  python3 tools/compile_to_exe.py

What this script does (best-effort automation):
  1. Verifies Node.js, npm, and npx are available.
  2. Runs `npm install` to ensure dependencies are present.
  3. Runs `npm run build` to produce the frontend `dist/` (Vite).
  4. Uses `npx pkg` to compile `server/src/index.js` into a Windows exe.
  5. Copies the frontend `dist/` next to the generated exe and creates a zip bundle in `build/`.

Notes and limitations:
  - Native Node modules (e.g., sqlite3) frequently do NOT work correctly when bundled with pkg without additional build steps. If your server depends on native addons, prefer shipping node_modules alongside the exe or use a platform-specific packaging approach (electron, Docker, NSIS installer, or a native build pipeline).
  - This script targets a Windows x64 executable by default (node18-win-x64). Change `PKG_TARGETS` if you need different targets.
  - `pkg` must be available via npx or installed globally (`npm i -g pkg`).
  - Always inspect the produced bundle and test on a clean Windows machine or VM.

Security:
  - This script does NOT embed secrets. Keep any production secrets out of the repository and set them via environment variables on the target machine.

"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD_DIR = ROOT / 'build_exe'
PKG_TARGETS = 'node18-win-x64'
SERVER_ENTRY = Path('server/src/index.js')


def check_executable(name):
    try:
        subprocess.run([name, '--version'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except Exception:
        return False


def run(cmd, cwd=ROOT):
    print('> ' + ' '.join(cmd))
    subprocess.run(cmd, cwd=str(cwd), check=True)


def main():
    print('GOBLOX - Build and package automation')

    # 1. prerequisites
    for prog in ('node', 'npm', 'npx'):
        if not check_executable(prog):
            print(f"Error: required program '{prog}' not found in PATH. Please install it and retry.")
            sys.exit(1)

    # 2. install dependencies
    try:
        run(['npm', 'install'])
    except subprocess.CalledProcessError:
        print('npm install failed. Check npm output for details.')
        sys.exit(1)

    # 3. frontend build
    try:
        run(['npm', 'run', 'build'])
    except subprocess.CalledProcessError:
        print('Frontend build failed. Ensure Vite build script is configured and working.')
        sys.exit(1)

    # 4. prepare build dir
    if BUILD_DIR.exists():
        shutil.rmtree(BUILD_DIR)
    BUILD_DIR.mkdir(parents=True, exist_ok=True)

    # 5. use pkg to create exe
    if not SERVER_ENTRY.exists():
        print(f'Expected server entry file not found: {SERVER_ENTRY}')
        sys.exit(1)

    exe_output = BUILD_DIR / 'goblox-server.exe'
    try:
        # Use npx to run pkg so the user doesn't need it globally installed
        run(['npx', 'pkg', str(SERVER_ENTRY), '--targets', PKG_TARGETS, '--output', str(exe_output)])
    except subprocess.CalledProcessError:
        print('pkg failed to produce an executable. See pkg docs: https://github.com/vercel/pkg')
        print('If sqlite3 or other native modules are used, consider shipping node_modules alongside the server or using electron-builder.')
        sys.exit(1)

    # 6. copy frontend dist
    dist_src = ROOT / 'dist'
    if dist_src.exists():
        shutil.copytree(dist_src, BUILD_DIR / 'dist')
    else:
        print('Warning: frontend dist/ not found. The build step may have failed earlier.')

    # 7. create zip bundle
    zip_path = ROOT / 'goblox-windows.zip'
    if zip_path.exists():
        zip_path.unlink()
    shutil.make_archive(str(zip_path.with_suffix('')), 'zip', BUILD_DIR)

    print('\nPackaging complete.')
    print(f' - Executable (approx): {exe_output}')
    print(f' - Bundle archive: {zip_path}')
    print('\nIMPORTANT: Test the produced executable on a Windows machine. Native modules such as sqlite3 may need special handling.\n')


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as e:
        print('Command failed:', e)
        sys.exit(1)
