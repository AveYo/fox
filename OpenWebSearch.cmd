@(set '(=)||' <# lean and mean cmd / powershell hybrid #> @'

::# OpenWebSearch V2 - open desktop & start menu web search, widgets links or help in your chosen default browser - by AveYo
::# if Edge is already removed, try installing Edge Stable, then remove it via Edge_Removal.bat

@echo off & title OpenWebSearch || AveYo 2022.10.03                                   yes, this is a rebrand of ChrEdgeFkOff

::# elevate with native shell by AveYo
>nul reg add hkcu\software\classes\.Admin\shell\runas\command /f /ve /d "cmd /x /d /r set \"f0=%%2\"& call \"%%2\" %%3"& set _= %*
>nul fltmc|| if "%f0%" neq "%~f0" (cd.>"%temp%\runas.Admin" & start "%~n0" /high "%temp%\runas.Admin" "%~f0" "%_:"=""%" & exit /b)

::# lean xp+ color macros by AveYo:  %<%:af " hello "%>>%  &  %<%:cf " w\"or\"ld "%>%   for single \ / " use .%|%\  .%|%/  \"%|%\"
for /f "delims=:" %%s in ('echo;prompt $h$s$h:^|cmd /d') do set "|=%%s"&set ">>=\..\c nul&set /p s=%%s%%s%%s%%s%%s%%s%%s<nul&popd"
set "<=pushd "%appdata%"&2>nul findstr /c:\ /a" &set ">=%>>%&echo;" &set "|=%|:~0,1%" &set /p s=\<nul>"%appdata%\c"

::# toggle when launched without arguments, else jump to arguments: "install" or "remove"
set CLI=%*&(set IFEO=HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options&set MSE=&set BHO=&set ProgID=)
call :reg_var "HKCR\MSEdgeMHT\shell\open\command" "" ProgID
for %%. in (%ProgID%) do if not defined MSE set "MSE=%%~."& set "MSEPath=%%~dp."
set "PF=(x86)" & if "%PROCESSOR_ARCHITECTURE:~-2%" equ "86" if not defined PROCESSOR_ARCHITEW6432 set "PF="
if not defined MSEPath call set "MSEPath=%%ProgramFiles%PF%%%\Microsoft\Edge\Application\"
if not defined MSE set "MSE=%MSEPath%msedge.exe"
if /i "%CLI%"=="" reg query "%IFEO%\ie_to_edge_stub.exe\0" /v Debugger >nul 2>nul && goto remove || goto install
if /i "%~1"=="install" (goto install) else if /i "%~1"=="remove" goto remove

:install
if defined MSEPath for /f "delims=" %%W in ('dir /o:D /b /s "%MSEPath%*ie_to_edge_stub.exe" 2^>nul') do set "BHO=%%~fW"
if not exist "%MSEPath%edge.exe" if exist "%MSE%" mklink /h "%MSEPath%edge.exe" "%MSE%" >nul
if defined BHO copy /y "%BHO%" "%Public%\ie_to_edge_stub.exe" >nul 2>nul
call :export OpenWebSearch_cmd > "%Public%\OpenWebSearch.cmd"
set W=--headless& for /f "tokens=6 delims=[]. " %%b in ('ver') do if %%b gtr 25179 set W=--width 1 --height 1 cmd /d /c start /min
set CMD=%systemroot%\system32\conhost.exe %W%& rem AveYo: see Terminal issue #13914
reg add "HKCR\microsoft-edge" /f /ve /d URL:microsoft-edge >nul
reg add "HKCR\microsoft-edge" /f /v "URL Protocol" /d "" >nul
reg add "HKCR\microsoft-edge" /f /v "NoOpenWith" /d "" >nul
reg add "HKCR\microsoft-edge\shell\open\command" /f /ve /d "\"%Public%\ie_to_edge_stub.exe\" %%1" >nul
reg add "HKCR\MSEdgeHTM" /f /v "NoOpenWith" /d "" >nul
reg add "HKCR\MSEdgeHTM\shell\open\command" /f /ve /d "\"%Public%\ie_to_edge_stub.exe\" %%1" >nul
reg add "%IFEO%\ie_to_edge_stub.exe" /f /v UseFilter /d 1 /t reg_dword >nul >nul
reg add "%IFEO%\ie_to_edge_stub.exe\0" /f /v FilterFullPath /d "%Public%\ie_to_edge_stub.exe" >nul
reg add "%IFEO%\ie_to_edge_stub.exe\0" /f /v Debugger /d "%CMD% \"%Public%\OpenWebSearch.cmd\"" >nul
reg add "%IFEO%\msedge.exe" /f /v UseFilter /d 1 /t reg_dword >nul
reg add "%IFEO%\msedge.exe\0" /f /v FilterFullPath /d "%MSE%" >nul
reg add "%IFEO%\msedge.exe\0" /f /v Debugger /d "%CMD% \"%Public%\OpenWebSearch.cmd\"" >nul
if "%CLI%" neq "" exit /b
echo;& %<%:f0 " OpenWebSearch V2 "%>>% & %<%:2f " INSTALLED "%>>% & %<%:f0 " run again to remove "%>%
timeout /t 7
exit /b

:remove
del /f /q "%Public%\OpenWebSearch.*" "%MSEPath%edge.exe" "%ProgramData%\ChrEdgeFkOff.*" "%MSEPath%chredge.exe" >nul 2>nul
rem del /f /q "%ProgramData%\ie_to_edge_stub.exe"
reg delete HKCR\microsoft-edge /f /v "NoOpenWith" >nul 2>nul
reg add HKCR\microsoft-edge\shell\open\command /f /ve /d "\"%MSE%\" --single-argument %%1" >nul
reg delete HKCR\MSEdgeHTM /f /v "NoOpenWith" >nul 2>nul
reg add HKCR\MSEdgeHTM\shell\open\command /f /ve /d "\"%MSE%\" --single-argument %%1" >nul
reg delete "%IFEO%\ie_to_edge_stub.exe" /f >nul 2>nul
reg delete "%IFEO%\msedge.exe" /f >nul 2>nul
if "%CLI%" neq "" exit /b
echo;& %<%:f0 " OpenWebSearch V2 "%>>% & %<%:df " REMOVED "%>>% & %<%:f0 " run again to install "%>%
timeout /t 7
exit /b

:export: [USAGE] call :export NAME
setlocal enabledelayedexpansion || Prints all text between lines starting with :NAME:[ and :NAME:] - A pure batch snippet by AveYo
set [=&for /f "delims=:" %%s in ('findstr /nbrc:":%~1:\[" /c:":%~1:\]" "%~f0"')do if defined [ (set /a ]=%%s-3)else set /a [=%%s-1
<"%~f0" ((for /l %%i in (0 1 %[%) do set /p =)&for /l %%i in (%[% 1 %]%) do (set txt=&set /p txt=&echo(!txt!)) &endlocal &exit /b

:OpenWebSearch_cmd:[
@title OpenWebSearch V1 & echo off & set ?= open start menu web search, widgets links or help in your chosen browser - by AveYo
call :reg_var "HKCU\SOFTWARE\Microsoft\Windows\Shell\Associations\UrlAssociations\https\UserChoice" ProgID ProgID
if /i "%ProgID%" equ "MSEdgeHTM" echo;Default browser is set to Edge! Change it or remove OpenWebSearch script. & pause & exit /b
call :reg_var "HKCR\%ProgID%\shell\open\command" "" Browser
set Choice=& for %%. in (%Browser%) do if not defined Choice set "Choice=%%~."
call :reg_var "HKCR\MSEdgeMHT\shell\open\command" "" FallBack
set "Edge=" & for %%. in (%FallBack%) do if not defined Edge set "Edge=%%~."
set "URI=" & set "URL=" & set "NOOP=" & set "PassTrough=%Edge:msedge=edge%"
set "CLI=%CMDCMDLINE:"=``% "
if defined CLI set "CLI=%CLI:*ie_to_edge_stub.exe`` =%"
if defined CLI set "CLI=%CLI:*ie_to_edge_stub.exe =%"
if defined CLI set "CLI=%CLI:*msedge.exe`` =%"
if defined CLI set "CLI=%CLI:*msedge.exe =%"
set "FIX=%CLI:~-1%"
if defined CLI if "%FIX%"==" " set "CLI=%CLI:~0,-1%"
if defined CLI set "RED=%CLI:microsoft-edge=%"
if defined CLI set "URL=%CLI:http=%"
if defined CLI set "ARG=%CLI:``="%"
if "%CLI%" equ "%RED%" (set NOOP=1) else if "%CLI%" equ "%URL%" (set NOOP=1)
if defined NOOP if exist "%PassTrough%" start "" "%PassTrough%" %ARG%
if defined NOOP exit /b
set "URL=%CLI:*microsoft-edge=%"
set "URL=http%URL:*http=%"
set "FIX=%URL:~-2%"
if defined URL if "%FIX%"=="``" set "URL=%URL:~0,-2%"
call :dec_url
start "" "%Choice%" "%URL%"
exit

:reg_var [USAGE] call :reg_var "HKCU\Volatile Environment" value-or-"" variable [extra options]
set {var}=& set {reg}=reg query "%~1" /v %2 /z /se "," /f /e& if %2=="" set {reg}=reg query "%~1" /ve /z /se "," /f /e
for /f "skip=2 tokens=* delims=" %%V in ('%{reg}% %4 %5 %6 %7 %8 %9 2^>nul') do if not defined {var} set "{var}=%%V"
if not defined {var} (set {reg}=& set "%~3="& exit /b) else if %2=="" set "{var}=%{var}:*)    =%"& rem AveYo: v3
if not defined {var} (set {reg}=& set "%~3="& exit /b) else set {reg}=& set "%~3=%{var}:*)    =%"& set {var}=& exit /b

:dec_url brute url percent decoding by AveYo
set ".=%URL:!=}%"&setlocal enabledelayedexpansion& rem brute url percent decoding
set ".=!.:%%={!" &set ".=!.:{3A=:!" &set ".=!.:{2F=/!" &set ".=!.:{3F=?!" &set ".=!.:{23=#!" &set ".=!.:{5B=[!" &set ".=!.:{5D=]!"
set ".=!.:{40=@!"&set ".=!.:{21=}!" &set ".=!.:{24=$!" &set ".=!.:{26=&!" &set ".=!.:{27='!" &set ".=!.:{28=(!" &set ".=!.:{29=)!"
set ".=!.:{2A=*!"&set ".=!.:{2B=+!" &set ".=!.:{2C=,!" &set ".=!.:{3B=;!" &set ".=!.:{3D==!" &set ".=!.:{25=%%!"&set ".=!.:{20= !"
set ".=!.:{=%%!" &rem set ",=!.:%%=!" & if "!,!" neq "!.!" endlocal& set "URL=%.:}=!%" & call :dec_url
endlocal& set "URL=%.:}=!%" & exit /b
rem done
:OpenWebSearch_cmd:]

:dec_url64 brute url 64 decoding by AveYo - revised for speed
setlocal enabledelayedexpansion& pushd "%Public%"& rem inspired by Aacini's string to hex and pizza's decode vbs
set asc=& <nul set /p "=%URL%" >~h1.tmp& for %%. in (~h1.tmp) do fsutil file createnew ~h2.tmp %%~Z. >nul
for /f "skip=1 tokens=2" %%. in ('fc /b ~h1.tmp ~h2.tmp') do set z=-1& set /a h=0x%%.& if !h! gtr 32 if !h! lss 127 (
  (if !h! gtr 64 if !h! lss 92 set /a z=h-65) & (if !h! gtr 96 if !h! lss 124 set /a z=h-71)
  (if !h! gtr 47 if !h! lss 59 set /a z=h +4) & (if !h! equ 45 set /a z=62) & (if !h! equ 47 set /a z=63) & set "asc=!asc! !z!" )
set dec=&set URL=&set /a o=0& set /a b=0& set /a i=0& set hl=0123456789ABCDEF& set /a n=0& set ff=forfiles /m OpenWebSearch.cmd /c
for %%c in (%asc%) do ( if %%c neq -1 ( ( if !o! equ 0 ( set /a i=%%c*4& set /a b=6 ) else (
  if !o! equ 2 ( set /a i+=%%c   & set /a x=i%%256& set /a H=!x!/16& set /a L=!x!%%16& set /a n+=4
    call set H=%%hl:~!H!,1%%& call set L=%%hl:~!L!,1%%& set "dec=!dec!0x!h!!l!"& set /a b=0 ) else (
  if !o! equ 4 ( set /a i+=%%c/4 & set /a x=i%%256& set /a H=!x!/16& set /a L=!x!%%16& set /a n+=4
    call set H=%%hl:~!H!,1%%& call set L=%%hl:~!L!,1%%& set "dec=!dec!0x!h!!l!"& set /a i=%%c*64& set /a b=2 ) else (
  set /a i+=%%c/16& set /a x=i%%256& set /a H=!x!/16& set /a L=!x!%%16& set /a n+=4
    call set H=%%hl:~!H!,1%%& call set L=%%hl:~!L!,1%%& set "dec=!dec!0x!h!!l!"& set /a i=%%c*16& set /a b=4 ))) ) & set /a o=b )
  if !n! gtr 224 for /f "tokens=* delims=" %%. in ('%ff% "cmd /d /c echo;!dec!"') do set "URL=!URL!%%." & set dec=& set /a n=0 )
if defined dec for /f "tokens=* delims=" %%. in ('%ff% "cmd /d /c echo;!dec!"') do set "URL=!URL!%%."
del /f /q ~h?.tmp >nul 2>nul& popd& endlocal& set "URL=%URL%"& exit /b
REM NO LONGER USED, KEPT HERE JUST IN CASE
set "DIRECT=%URL:WS/redirect/=%"
if "%URL%" equ "%DIRECT%" start "" "%Choice%" "%URL%" & exit /b
set "REDIRECT=%URL:*&url=%"
set "REDIRECT=%REDIRECT:~1%"
set "REDIRECT="%REDIRECT:&=" %"
set URL=& for %%. in (%REDIRECT%) do if not defined URL set "URL=%%~." & call :dec_url64
start "" "%Choice%" "%URL%" & exit /b

'@); $0 = "$env:temp\OpenWebSearch.cmd"; ${(=)||} -split "\r?\n" | out-file $0 -encoding default -force; & $0
# press enter
