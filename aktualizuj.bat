@echo off
REM EduCore: aktualizuje naglowek, stopke, meta tagi i dane z site.config.json we wszystkich plikach HTML.
node "%~dp0tools\sync-layout.mjs"
pause
