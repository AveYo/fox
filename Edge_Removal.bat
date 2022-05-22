@(set "0=%~f0"^)#) & powershell -nop -c iex([io.file]::ReadAllText($env:0)) & exit/b
#:: double-click to run or just copy-paste into powershell - it's a standalone hybrid script
#::
$_Paste_in_Powershell = { $host.ui.RawUI.WindowTitle = 'Edge Removal - AveYo, 2022.05.22'

$also_remove_webview = 0 

## RIP Edge legacy app first
$edges = (get-appxpackage -allusers *MicrosoftEdge*).PackageFullName
$bloat = (get-appxprovisionedpackage -online |? {$_.PackageName -like '*MicrosoftEdge*'}).PackageName
$users = ([wmi]"win32_userAccount.Domain='$env:userdomain',Name='$env:username'").SID,'S-1-5-18'
$eoled = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Appx\AppxAllUserStore\EndOfLife'
foreach ($legacy in $bloat) {
  foreach ($user in $users) { ni "$eoled\$user\$legacy" -Force -ea 0 >'' }
  powershell -nop -c remove-appxprovisionedpackage -online -packagename $legacy 2>&1 >''
}
foreach ($legacy in $edges) {
  foreach ($user in $users) { ni "$eoled\$user\$legacy" -Force -ea 0 >'' }
  powershell -nop -c remove-appxpackage -allusers -package $legacy 2>&1 >''
}

## remove ChrEdge lame uninstall block
$uninstall = '\Microsoft\Windows\CurrentVersion\Uninstall\Microsoft Edge'
foreach ($wow in '','\Wow6432Node') {'HKCU:','HKLM:' |% { rp $($_ + $wow + $uninstall) NoRemove -Force -ea 0 } }

## find all ChrEdge setup.exe
$setup = @(); $bho = @(); "LocalApplicationData","ProgramFilesX86","ProgramFiles" |% {
  $setup += dir $([Environment]::GetFolderPath($_) +'\Microsoft\Edge*\setup.exe') -rec -ea 0
  $bho += dir $([Environment]::GetFolderPath($_) +'\Microsoft\Edge*\ie_to_edge_stub.exe') -rec -ea 0
}

## export ChrEdgeFkOff innovative redirector
foreach ($b in $bho){ if (test-path $b) {copy $b "$env:ProgramData\ie_to_edge_stub.exe" -Force -ea 0; break} }

## compute ChrEdge uninstall arguments
$arg = @(); $u = '--uninstall'; $v = ' --verbose-logging --force-uninstall --delete-profile'
$channel = '-beta','-dev','-internal','-sxs',''; if ($also_remove_webview -ne 0) {$channel += 'webview'}
foreach ($l in '',' --system-level'){ foreach ($m in ' --msedge',''){ 
if ($m -eq ''){$arg += $u + $l + $v} else {$channel |% {$arg += $u + $l + $m + $_ + $v} } } }

## brute-run found ChrEdge setup.exe with uninstall args
foreach ($ChrEdge in $setup){ foreach ($purge in $arg) { powershell -nop -c "start '$ChrEdge' -args '$purge'" 2>&1 >'' } }

## remove leftover shortcuts
$IELaunch = '\Microsoft\Internet Explorer\Quick Launch'
del $([Environment]::GetFolderPath('Desktop') + '\Microsoft Edge*.lnk') -Force -ea 0 >''
del $([Environment]::GetFolderPath('ApplicationData') + $IELaunch + '\Microsoft Edge*.lnk') -Force -ea 0 >''
del $($env:SystemRoot+'\System32\config\systemprofile\AppData\Roaming' + $IELaunch + '\Microsoft Edge*.lnk') -Force -ea 0 >''

## prevent reinstall via windows updates - ms will probably "accidentally" break this often
ni "HKLM:\SOFTWARE\Microsoft\EdgeUpdate" -Force -ea 0 >''
sp "HKLM:\SOFTWARE\Microsoft\EdgeUpdate" DoNotUpdateToEdgeWithChromium 1 -Type Dword -ea 0

## add ChrEdgeFkOff to redirect microsoft-edge: anti-competitive links to the default browser 
$ChrEdgeFkOff = @'
@echo off
::# toggle when launched without arguments, else jump to arguments: "install" or "remove"
set CLI=%*& set IFEO=HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options& set MSE=& set BHO=&;
if /i "%CLI%"=="" reg query "%IFEO%\ie_to_edge_stub.exe\0" /v Debugger >nul 2>nul && goto remove || goto install
if /i "%~1"=="install" (goto install) else if /i "%~1"=="remove" goto remove

:install
for /f "tokens=2*" %%V in ('reg query "HKCR\MSEdgeMHT\shell\open\command" /ve 2^>nul') do set "ProgID=%%W"
for %%W in (%ProgID%) do if not defined MSE set MSE=%%W& set "MSEPath=%%~dpW"
if defined MSEPath for /f "delims=" %%W in ('dir /o:D /b /s "%MSEPath%\*ie_to_edge_stub.exe"') do set "BHO=%%~fW" 
if defined BHO copy /y "%BHO%" "%ProgramData%\\" >nul 2>nul
call :export ChrEdgeFkOff.vbs > "%ProgramData%\ChrEdgeFkOff.vbs"
reg add HKCR\microsoft-edge /f /ve /d URL:microsoft-edge >nul
reg add HKCR\microsoft-edge /f /v "URL Protocol" /d "" >nul
reg add HKCR\microsoft-edge /f /v "NoOpenWith" /d "" >nul 
reg add HKCR\microsoft-edge\shell\open\command /f /ve /d "\\"%ProgramData%\ie_to_edge_stub.exe\\" \\"%%1\\"" >nul
reg add HKCR\MSEdgeHTM /f /v "NoOpenWith" /d "" >nul
reg add HKCR\MSEdgeHTM\shell\open\command /f /ve /d "\\"%ProgramData%\ie_to_edge_stub.exe\\" \\"%%1\\"" >nul
reg add "%IFEO%\ie_to_edge_stub.exe" /f /v UseFilter /d 1 /t reg_dword >nul >nul
reg add "%IFEO%\ie_to_edge_stub.exe\0" /f /v FilterFullPath /d "%ProgramData%\ie_to_edge_stub.exe" >nul
reg add "%IFEO%\ie_to_edge_stub.exe\0" /f /v Debugger /d "wscript.exe \\"%ProgramData%\ChrEdgeFkOff.vbs\\" //B //T:60" >nul
reg delete "%IFEO%\msedge.exe" /f >nul 2>nul
exit /b

:remove
del /f /q "%ProgramData%\ChrEdgeFkOff.vbs" >nul 2>nul 
rem del /f /q "%ProgramData%\ie_to_edge_stub.exe"
reg delete HKCR\microsoft-edge /f /v "NoOpenWith" >nul 2>nul
reg add HKCR\microsoft-edge\shell\open\command /f /ve /d "\\"%MSE%\\" --single-argument %%1" >nul
reg delete HKCR\MSEdgeHTM /f /v "NoOpenWith" >nul 2>nul
reg add HKCR\MSEdgeHTM\shell\open\command /f /ve /d "\\"%MSE%\\" --single-argument %%1" >nul
reg delete "%IFEO%\ie_to_edge_stub.exe" /f >nul 2>nul
reg delete "%IFEO%\msedge.exe" /f >nul 2>nul
exit /b 

:export: [USAGE] call :export NAME
setlocal enabledelayedexpansion || Prints all text between lines starting with :NAME:[ and :NAME:] - A pure batch snippet by AveYo
set [=&for /f "delims=:" %%s in ('findstr /nbrc:":%~1:\[" /c:":%~1:\]" "%~f0"')do if defined [ (set /a ]=%%s-3)else set /a [=%%s-1 
<"%~f0" ((for /l %%i in (0 1 %[%) do set /p =)&for /l %%i in (%[% 1 %]%) do (set txt=&set /p txt=&echo(!txt!)) &endlocal &exit /b

:ChrEdgeFkOff_vbs:[
' ChrEdgeFkOff v4u - make start menu web search, widgets links or help open in your chosen default browser - by AveYo  
Dim F,URL,decode,utf8,char,u,u1,u2,u3 : URL = "": Set W = CreateObject("WScript.Shell") 
For Each i in WScript.Arguments: If InStr(1, i, "microsoft-edge:", 1) Then: URL = i: End If: Next

decode = Split(URL,"%"): u = 0: Do While u <= UBound(decode): If u <> 0 Then
char = Left(decode(u),2): If "&H" & Left(char,2) >= 128 Then
decode(u) = "": u = u + 1: char = char & Left(decode(u),2): If "&H" & Left(char,2) < 224 Then
u1 = Cint("&H" & Left(char,2)) Mod 32: u2 = Cint("&H" & Mid(char,3,2)) Mod 64: utf8 = ChrW(u2 + u1 * 64)
Else: decode(u) = "": u = u + 1: char = char & Left(decode(u),4): u1 = Cint("&H" & Left(char,2)) Mod 16
u2 = Cint("&H" & Mid(char,3,2)) Mod 32: u3 = Cint("&H" & Mid(char,5,2)) Mod 64: utf8 = ChrW(u3 + (u2 + u1 * 64) * 64): End If
Else: utf8 = Chr("&H" & char): End If: decode(u) = utf8 & Mid(decode(u),3)
End If: u = u + 1: Loop: URL = Trim(Join(decode,"")) ' stackoverflow . com /questions/17880395

F = Split(URL,"://",2,1): If UBound(F) > 0 Then URL = F(1): W.Run """https://" & URL & """", 1, False
' done
:ChrEdgeFkOff_vbs:]

'@
[io.file]::WriteAllText("$env:Temp\ChrEdgeFkOff.cmd",$ChrEdgeFkOff) >''
& "$env:Temp\ChrEdgeFkOff.cmd" install

## refresh explorer
kill -name 'sihost'

echo " EDGE REMOVED! IF YOU NEED TO SETUP ANOTHER BROWSER, ENTER: `n"
write-host -fore green @'
 $ffsetup='https://download.mozilla.org/?product=firefox-latest&os=win';
 $firefox="$([Environment]::GetFolderPath('Desktop'))\FirefoxSetup.exe";
 (new-object System.Net.WebClient).DownloadFile($ffsetup,$firefox); start $firefox
'@;''  

} ; start -verb runas powershell -args "-nop -noe -c & {`n`n$($_Paste_in_Powershell-replace'"','\"')}"
$_Press_Enter
#::
