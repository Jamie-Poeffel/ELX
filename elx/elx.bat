@echo off
if "%1" == "install" (
    PowerShell -NoProfile -ExecutionPolicy Bypass -File "C:\Windows\System32\ELW\install.ps1"
) else if "%1" == "--help" (
    PowerShell -NoProfile -ExecutionPolicy Bypass -File "C:\Windows\System32\ELW\help.ps1"
)
else (
    echo Ungueltiger Befehl. Fuer hilfe '--help'.
)
