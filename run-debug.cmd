@echo off
taskkill /IM nw.exe 2> NUL
taskkill /IM bubblot.exe 2> NUL
taskkill /IM VirtualHub.exe 2> NUL
start /MIN virtualhub\VirtualHub.exe 
start /B nw\nw.exe .
start /B bubblot.exe
timeout 5
wmic process where name="bubblot.exe" CALL setpriority "high priority"