@(set '(=)||' <# lean and mean cmd / powershell hybrid #> @'

::# ChrEdgeFkOff - make desktop & start menu web search, widgets links or help open in your chosen default browser - by AveYo
::# v4 innovative redirect even if Edge is uninstalled! v3 powershell-less active part; parse "install" or "remove" arguments
::# if Edge is already removed, try installing Edge Stable, then remove it via Edge_Removal.bat

@echo off & title ChrEdgeFkOff || AveYo 2022.07.17

::# elevate with native shell by AveYo
>nul reg add hkcu\software\classes\.Admin\shell\runas\command /f /ve /d "cmd /x /d /r set \"f0=%%2\"& call \"%%2\" %%3"& set _= %*
>nul fltmc|| if "%f0%" neq "%~f0" (cd.>"%temp%\runas.Admin" & start "%~n0" /high "%temp%\runas.Admin" "%~f0" "%_:"=""%" & exit /b)

::# lean xp+ color macros by AveYo:  %<%:af " hello "%>>%  &  %<%:cf " w\"or\"ld "%>%   for single \ / " use .%|%\  .%|%/  \"%|%\"
for /f "delims=:" %%s in ('echo;prompt $h$s$h:^|cmd /d') do set "|=%%s"&set ">>=\..\c nul&set /p s=%%s%%s%%s%%s%%s%%s%%s<nul&popd"
set "<=pushd "%appdata%"&2>nul findstr /c:\ /a" &set ">=%>>%&echo;" &set "|=%|:~0,1%" &set /p s=\<nul>"%appdata%\c"

::# toggle when launched without arguments, else jump to arguments: "install" or "remove"
set CLI=%*&(set IFEO=HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options&set MSE=&set BHO=&set ProgID=)
for /f "tokens=* delims=" %%. in ('reg query "HKCR\MSEdgeMHT\shell\open\command" /ve /z 2^>nul') do set "ProgID=%%."
if defined ProgID set "ProgID=%ProgID:*)    =%"
if defined ProgID set "ProgID=%ProgID:*)    =%"
for %%. in (%ProgID%) do if not defined MSE set "MSE=%%~."& set "MSEPath=%%~dp."
if /i "%CLI%"=="" reg query "%IFEO%\ie_to_edge_stub.exe\0" /v Debugger >nul 2>nul && goto remove || goto install
if /i "%~1"=="install" (goto install) else if /i "%~1"=="remove" goto remove

:install
if defined MSEPath for /f "delims=" %%W in ('dir /o:D /b /s "%MSEPath%\*ie_to_edge_stub.exe"') do set "BHO=%%~fW"
if not exist "%MSEPath%chredge.exe" if exist "%MSE%" mklink /h "%MSEPath%chredge.exe" "%MSE%" >nul
if defined BHO copy /y "%BHO%" "%ProgramData%\" >nul 2>nul
call :export ChrEdgeFkOff.vbs > "%ProgramData%\ChrEdgeFkOff.vbs"
reg add HKCR\microsoft-edge /f /ve /d URL:microsoft-edge >nul
reg add HKCR\microsoft-edge /f /v "URL Protocol" /d "" >nul
reg add HKCR\microsoft-edge /f /v "NoOpenWith" /d "" >nul
reg add HKCR\microsoft-edge\shell\open\command /f /ve /d "\"%ProgramData%\ie_to_edge_stub.exe\" %%1" >nul
reg add HKCR\MSEdgeHTM /f /v "NoOpenWith" /d "" >nul
reg add HKCR\MSEdgeHTM\shell\open\command /f /ve /d "\"%ProgramData%\ie_to_edge_stub.exe\" %%1" >nul
reg add "%IFEO%\ie_to_edge_stub.exe" /f /v UseFilter /d 1 /t reg_dword >nul >nul
reg add "%IFEO%\ie_to_edge_stub.exe\0" /f /v FilterFullPath /d "%ProgramData%\ie_to_edge_stub.exe" >nul
reg add "%IFEO%\ie_to_edge_stub.exe\0" /f /v Debugger /d "wscript.exe \"%ProgramData%\ChrEdgeFkOff.vbs\" //B //T:60" >nul
reg add "%IFEO%\msedge.exe" /f /v UseFilter /d 1 /t reg_dword >nul
reg add "%IFEO%\msedge.exe\0" /f /v FilterFullPath /d "%MSE%" >nul
reg add "%IFEO%\msedge.exe\0" /f /v Debugger /d "wscript.exe \"%ProgramData%\ChrEdgeFkOff.vbs\" //B //T:60" >nul
if "%CLI%" neq "" exit /b
%<%:f0 " ChrEdgeFkOff V4 "%>>% & %<%:2f " INSTALLED "%>>% & %<%:f0 " run again to remove "%>%
timeout /t 7
exit /b

:remove
del /f /q "%ProgramData%\ChrEdgeFkOff.vbs" "%MSEPath%chredge.exe" >nul 2>nul
rem del /f /q "%ProgramData%\ie_to_edge_stub.exe"
reg delete HKCR\microsoft-edge /f /v "NoOpenWith" >nul 2>nul
reg add HKCR\microsoft-edge\shell\open\command /f /ve /d "\"%MSE%\" --single-argument %%1" >nul
reg delete HKCR\MSEdgeHTM /f /v "NoOpenWith" >nul 2>nul
reg add HKCR\MSEdgeHTM\shell\open\command /f /ve /d "\"%MSE%\" --single-argument %%1" >nul
reg delete "%IFEO%\ie_to_edge_stub.exe" /f >nul 2>nul
reg delete "%IFEO%\msedge.exe" /f >nul 2>nul
if "%CLI%" neq "" exit /b
%<%:f0 " ChrEdgeFkOff V4 "%>>% & %<%:df " REMOVED "%>>% & %<%:f0 " run again to install "%>%
timeout /t 7
exit /b

:export: [USAGE] call :export NAME
setlocal enabledelayedexpansion || Prints all text between lines starting with :NAME:[ and :NAME:] - A pure batch snippet by AveYo
set [=&for /f "delims=:" %%s in ('findstr /nbrc:":%~1:\[" /c:":%~1:\]" "%~f0"')do if defined [ (set /a ]=%%s-3)else set /a [=%%s-1
<"%~f0" ((for /l %%i in (0 1 %[%) do set /p =)&for /l %%i in (%[% 1 %]%) do (set txt=&set /p txt=&echo(!txt!)) &endlocal &exit /b

:ChrEdgeFkOff_vbs:[
' ChrEdgeFkOff v4 - make start menu web search, widgets links or help open in your chosen default browser - by AveYo
Dim A,F,CLI,URL,decode,utf8,char,u,u1,u2,u3,ProgID,Choice : CLI = "": URL = "": For i = 1 to WScript.Arguments.Count - 1
A = WScript.Arguments(i): CLI = CLI & " " & A: If InStr(1, A, "microsoft-edge:", 1) Then: URL = A: End If: Next

decode = Split(URL,"%"): u = 0: Do While u <= UBound(decode): If u <> 0 Then
char = Left(decode(u),2): If "&H" & Left(char,2) >= 128 Then
decode(u) = "": u = u + 1: char = char & Left(decode(u),2): If "&H" & Left(char,2) < 224 Then
u1 = Cint("&H" & Left(char,2)) Mod 32: u2 = Cint("&H" & Mid(char,3,2)) Mod 64: utf8 = ChrW(u2 + u1 * 64)
Else: decode(u) = "": u = u + 1: char = char & Left(decode(u),4): u1 = Cint("&H" & Left(char,2)) Mod 16
u2 = Cint("&H" & Mid(char,3,2)) Mod 32: u3 = Cint("&H" & Mid(char,5,2)) Mod 64: utf8 = ChrW(u3 + (u2 + u1 * 64) * 64): End If
Else: utf8 = Chr("&H" & char): End If: decode(u) = utf8 & Mid(decode(u),3)
End If: u = u + 1: Loop: URL = Trim(Join(decode,"")) ' stackoverflow . com /questions/17880395

On error resume next
Set W = CreateObject("WScript.Shell"): F = Split(URL,"://",2,1): If UBound(F) > 0 Then URL = F(1)
ProgID = W.RegRead("HKCU\SOFTWARE\Microsoft\Windows\Shell\Associations\UrlAssociations\https\UserChoice\ProgID")
Choice = W.RegRead("HKCR\" & ProgID & "\shell\open\command\"): ProgID = W.RegRead("HKCR\MSEdgeMHT\shell\open\command\")
If Instr(1,ProgID,Chr(34),1) Then ProgID = Split(ProgID,Chr(34))(1) Else ProgID = Split(ProgID,Chr(32))(1)
If Instr(1,Choice,ProgID,1) Then URL = "": End If: ProgID = Replace(ProgID,"msedge.exe","chredge.exe")
If URL = "" Then W.Run """" & ProgID & """ " & Trim(CLI), 1, False Else W.Run """https://" & URL & """", 1, False
' done
:ChrEdgeFkOff_vbs:]

'@); $0 = "$env:temp\ChrEdgeFkOff.cmd"; ${(=)||} | out-file $0 -encoding default -force; & $0
# press enter
