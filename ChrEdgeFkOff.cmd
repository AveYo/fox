@(set '(=)||' <# lean and mean cmd / powershell hybrid #> @'

::# ChrEdgeFkOff - make start menu web search, widgets links or help open in your chosen default browser - by AveYo
::# v3 improved handling; powershell-less active part; parse "install" or "remove" arguments     

@echo off & title ChrEdgeFkOff || AveYo 2022.05.20

::# elevate with native shell by AveYo
>nul reg add hkcu\software\classes\.Admin\shell\runas\command /f /ve /d "cmd /x /d /r set \"f0=%%2\"& call \"%%2\" %%3"& set _= %*
>nul fltmc|| if "%f0%" neq "%~f0" (cd.>"%temp%\runas.Admin" & start "%~n0" /high "%temp%\runas.Admin" "%~f0" "%_:"=""%" & exit /b)

::# lean xp+ color macros by AveYo:  %<%:af " hello "%>>%  &  %<%:cf " w\"or\"ld "%>%   for single \ / " use .%|%\  .%|%/  \"%|%\"
for /f "delims=:" %%s in ('echo;prompt $h$s$h:^|cmd /d') do set "|=%%s"&set ">>=\..\c nul&set /p s=%%s%%s%%s%%s%%s%%s%%s<nul&popd"
set "<=pushd "%appdata%"&2>nul findstr /c:\ /a" &set ">=%>>%&echo;" &set "|=%|:~0,1%" &set /p s=\<nul>"%appdata%\c"

::# toggle when launched without arguments, else jump to arguments: "install" or "remove"
set CLI=%*& set IFEO=HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options& set Filter=&;
call :reg_var "HKCR\MSEdgeHTM\shell\open\command" /ve ProgID
for %%W in (%ProgID%) do if not defined Filter set Filter=%%W& set "FilterPath=%%~dpW"
if /i "%CLI%"=="" reg query "%IFEO%\msedge.exe\0" /v Debugger >nul 2>nul && goto remove || goto install
if /i "%~1"=="install" (goto install) else if /i "%~1"=="remove" goto remove

:install
call :export ChrEdgeFkOff.vbs > "%ProgramData%\ChrEdgeFkOff.vbs"
if not exist "%FilterPath%chredge.exe" mklink /h "%FilterPath%chredge.exe" %Filter% >nul
reg add "%IFEO%\msedge.exe" /f /v UseFilter /d 1 /t reg_dword >nul
reg add "%IFEO%\msedge.exe\0" /f /v FilterFullPath /d %Filter% >nul
reg add "%IFEO%\msedge.exe\0" /f /v Debugger /d "wscript.exe \"%ProgramData%\ChrEdgeFkOff.vbs\" //B //T:60" >nul
%<%:f0 " ChrEdgeFkOff V3 "%>>% & %<%:2f " INSTALLED "%>>% & %<%:f0 " run again to remove "%>%
if /i "%CLI%"=="" timeout /t 7
exit /b

:remove
del /f /q "%ProgramData%\ChrEdgeFkOff.vbs" "%FilterPath%chredge.exe" >nul 2>nul 
reg delete "%IFEO%\msedge.exe" /f >nul 2>nul
%<%:f0 " ChrEdgeFkOff V3 "%>>% & %<%:df " REMOVED "%>>% & %<%:f0 " run again to install "%>%
if /i "%CLI%"=="" timeout /t 7
exit /b 

:reg_var: [USAGE] call :reg_var "HKCU\Volatile Environment" Value variable
if /i "%~2"=="/ve" (set _val=/ve) else set _val=/v "%~2"
(for /f "tokens=2*" %%R in ('reg query "%~1" %_val% /se "|" %4 2^>nul') do set "%~3=%%S") & exit /b

:export: [USAGE] call :export NAME
setlocal enabledelayedexpansion || Prints all text between lines starting with :NAME:[ and :NAME:] - A pure batch snippet by AveYo
set [=&for /f "delims=:" %%s in ('findstr /nbrc:":%~1:\[" /c:":%~1:\]" "%~f0"')do if defined [ (set /a ]=%%s-3)else set /a [=%%s-1 
<"%~f0" ((for /l %%i in (0 1 %[%) do set /p =)&for /l %%i in (%[% 1 %]%) do (set txt=&set /p txt=&echo(!txt!)) &endlocal &exit /b

:ChrEdgeFkOff_vbs:[
' ChrEdgeFkOff v3 - make start menu web search, widgets links or help open in your chosen default browser - by AveYo  
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

Set W = CreateObject("WScript.Shell"): F = Split(URL,"://",2,1): If UBound(F) > 0 Then URL = F(1)
ProgID = W.RegRead("HKCU\SOFTWARE\Microsoft\Windows\Shell\Associations\UrlAssociations\https\UserChoice\ProgID")
Choice = W.RegRead("HKCR\" & ProgID & "\shell\open\command\"): MSEdge = W.RegRead("HKCR\MSEdgeHTM\shell\open\command\")
If Instr(1,MSEdge,Chr(34),1) Then MSEdge = Split(MSEdge,Chr(34))(1) Else MSEdge = Split(MSEdge,Chr(32))(1)
If Instr(1,Choice,MSEdge,1) Then URL = "": End If: MSEdge = Replace(MSEdge,"msedge.exe","chredge.exe")
If URL = "" Then W.Run """" & MSEdge & """ " & Trim(CLI), 1, False Else W.Run "https://" & URL, 1, False
' done
:ChrEdgeFkOff_vbs:]

'@); $0 = "$env:temp\ChrEdgeFkOff.cmd"; ${(=)||} | out-file $0 -encoding default -force; & $0
# press enter
