$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..\..")

if (-not (Test-Path ".venv-build-windows\Scripts\python.exe")) {
  py -3 -m venv .venv-build-windows
}

.\.venv-build-windows\Scripts\python.exe -m pip install pyinstaller
.\.venv-build-windows\Scripts\pyinstaller.exe --clean --noconfirm tools\build\mahjong-vibes.spec

New-Item -ItemType Directory -Force -Path "dist\windows" | Out-Null
Copy-Item "dist\Mahjong Vibes.exe" "dist\windows\Mahjong Vibes.exe" -Force

Write-Host "Windows exe built at: dist\windows\Mahjong Vibes.exe"
