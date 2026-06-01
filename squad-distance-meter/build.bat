@echo off
echo === Squad Distance Meter - Build ===
pip install -r requirements.txt
pyinstaller --onefile --noconsole --name SquadDistanceMeter squad_distance_meter.py
echo.
echo Done! EXE is in: dist\SquadDistanceMeter.exe
pause
