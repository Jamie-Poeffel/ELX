@echo off
:: Überprüfen, ob die Batch-Datei mit Administratorrechten ausgeführt wird
net session >nul 2>&1
if not %errorlevel%==0 (
    echo Administratorrechte erforderlich. Starte die Batch-Datei mit Administratorrechten neu...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"%~f0\"' -Verb RunAs"
    exit /b
)

:: Überprüfen, ob die Datei 'elx.bat' im Unterordner 'elx' existiert
if not exist "%~dp0elx\elx.bat" (
    echo Fehler: Die Datei 'elx.bat' wurde im Verzeichnis 'elx' nicht gefunden.
    pause
    exit /b
)

:: Überprüfen, ob das Zielverzeichnis 'C:\Windows\System32' existiert
if not exist "C:\Windows\System32" (
    echo Fehler: Zielverzeichnis 'C:\Windows\System32' existiert nicht.
    pause
    exit /b
)

:: Verschiebe die Datei 'elx.bat' in das Verzeichnis 'C:\Windows\System32'
echo Verschiebe 'elx.bat' nach 'C:\Windows\System32'...
move "%~dp0elx\elx.bat" "C:\Windows\System32\"

:: Überprüfen, ob die Datei erfolgreich verschoben wurde
if exist "C:\Windows\System32\elx.bat" (
    echo Die Datei 'elx.bat' wurde erfolgreich nach 'C:\Windows\System32' verschoben!
) else (
    echo Fehler beim Verschieben der Datei 'elx.bat'.
)

@echo off
:: Überprüfen, ob die Batch-Datei mit Administratorrechten ausgeführt wird
net session >nul 2>&1
if not %errorlevel%==0 (
    echo Administratorrechte erforderlich. Starte die Batch-Datei mit Administratorrechten neu...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"%~f0\"' -Verb RunAs"
    exit /b
)

:: Setzt das Quellverzeichnis, wo die Dateien im Ordner 'program' liegen
set "source=C:\Users\jamie\OneDrive - sluz\Desktop\ELWProgramm\program"

:: Setzt das Zielverzeichnis, wo die Dateien hinverschoben werden sollen
set "destination=C:\Windows\System32\ELW"

:: Überprüfen, ob das Quellverzeichnis existiert
if not exist "%source%" (
    echo Fehler: Quellverzeichnis '%source%' existiert nicht.
    pause
    exit /b
)

:: Überprüfen, ob das Zielverzeichnis existiert, wenn nicht, wird es erstellt
if not exist "%destination%" (
    echo Erstelle den Ordner '%destination%'...
    mkdir "%destination%"
    if errorlevel 1 (
        echo Fehler: Zugriff verweigert. Bitte fuehre die Batch-Datei als Administrator aus.
        pause
        exit /b
    )
)

:: Verschiebe alle Dateien aus dem Quellverzeichnis in das Zielverzeichnis
echo Verschiebe alle Dateien von '%source%' nach '%destination%'...
move "%source%\*" "%destination%\"

:: Überprüfen, ob Dateien erfolgreich verschoben wurden
if errorlevel 1 (
    echo Fehler beim Verschieben der Dateien. Bitte ueberpruefe die Pfade und Administratorrechte.
) else (
    echo Alle Dateien wurden erfolgreich verschoben!
)

:: Ruft die move.bat auf
call "%~dp0move.bat"

pause
