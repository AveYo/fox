@(set "0=%~f0"^)#) & powershell -nop -c iex([io.file]::ReadAllText($env:0)) & exit/b
#:: double-click to run or just copy-paste into powershell - it's a standalone hybrid script
#::
$_Paste_in_Powershell = { $host.ui.RawUI.WindowTitle = 'Edge Removal - AveYo, 2022.06.20'

$also_remove_webview = 1 

## targets
$remove_win32 = @("Microsoft Edge","Microsoft Edge Update"); $remove_appx = @("MicrosoftEdge")
if ($also_remove_webview -eq 1) {$remove_win32 += "Microsoft EdgeWebView"; $remove_appx += "Win32WebViewHost"}
## enable admin privileges 
$D1=[uri].module.gettype('System.Diagnostics.Process')."GetM`ethods"(42) |where {$_.Name -eq 'SetPrivilege'} #`:no-ev-warn
'SeSecurityPrivilege','SeTakeOwnershipPrivilege','SeBackupPrivilege','SeRestorePrivilege'|foreach {$D1.Invoke($null, @("$_",2))}
## set useless policies
foreach ($p in 'HKLM\SOFTWARE\Policies','HKLM\SOFTWARE') {
  reg add "$p\Microsoft\EdgeUpdate" /f /v InstallDefault /d 0 /t reg_dword >''
  reg add "$p\Microsoft\EdgeUpdate" /f /v "Install{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}" /d 0 /t reg_dword >''
  reg add "$p\Microsoft\EdgeUpdate" /f /v DoNotUpdateToEdgeWithChromium /d 1 /t reg_dword >''
}
## clear win32 uninstall block
foreach ($hk in 'HKCU','HKLM') {foreach ($wow in '','\Wow6432Node') {foreach ($i in $remove_win32) {
  reg delete "$hk\SOFTWARE${wow}\Microsoft\Windows\CurrentVersion\Uninstall\$i" /f /v NoRemove 2>&1 >''
}}}  
## find all Edge setup.exe
$setup = @(); $bho = @(); "LocalApplicationData","ProgramFilesX86","ProgramFiles" |foreach {
  $setup += dir $($([Environment]::GetFolderPath($_)) + '\Microsoft\Edge*\setup.exe') -rec -ea 0
  $bho += dir $($([Environment]::GetFolderPath($_)) + '\Microsoft\Edge*\ie_to_edge_stub.exe') -rec -ea 0
}
## export ChrEdgeFkOff innovative redirector
foreach ($b in $bho) { if (test-path $b) { copy $b "$env:ProgramData\ie_to_edge_stub.exe" -force -ea 0; break } }
## shut edge down
foreach ($p in 'MicrosoftEdgeUpdate','chredge','msedge','msedgewebview2','Widgets') { kill -name $p -force -ea 0 }
## clear appx uninstall block and remove
$provisioned = get-appxprovisionedpackage -online; $appxpackage = get-appxpackage -allusers
$store = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Appx\AppxAllUserStore'; $store_reg = $store.replace(':','')
$users = @('S-1-5-18'); if (test-path $store) {$users += $((dir $store |where {$_ -like '*S-1-5-21*'}).PSChildName)}
foreach ($choice in $remove_appx) { if ('' -eq $choice.Trim()) {continue}
  foreach ($appx in $($provisioned |where {$_.PackageName -like "*$choice*"})) {
    $PackageFamilyName = ($appxpackage |where {$_.Name -eq $appx.DisplayName}).PackageFamilyName; $PackageFamilyName
    reg add "$store_reg\Deprovisioned\$PackageFamilyName" /f 2>&1 >'' 
    dism /online /remove-provisionedappxpackage /packagename:$($appx.PackageName) 2>&1 >''
    #powershell -nop -c remove-appxprovisionedpackage -packagename "'$($appx.PackageName)'" -online 2>&1 >'' 
  }
  foreach ($appx in $($appxpackage |where {$_.PackageFullName -like "*$choice*"})) {
    $inbox = (gp "$store\InboxApplications\*$($appx.Name)*" Path).PSChildName
    $PackageFamilyName = $appx.PackageFamilyName; $PackageFullName = $appx.PackageFullName; $PackageFullName
    foreach ($app in $inbox) {reg delete "$store_reg\InboxApplications\$app" /f 2>&1 >'' }
    reg add "$store_reg\Deprovisioned\$PackageFamilyName" /f 2>&1 >''
    foreach ($sid in $users) {reg add "$store_reg\EndOfLife\$sid\$PackageFullName" /f 2>&1 >''}
    dism /online /set-nonremovableapppolicy /packagefamily:$PackageFamilyName /nonremovable:0 2>&1 >''
    powershell -nop -c remove-appxpackage -package "'$PackageFullName'" -AllUsers 2>&1 >''
    foreach ($sid in $users) {reg delete "$store_reg\EndOfLife\$sid\$PackageFullName" /f 2>&1 >''}
  }
}
## shut edge down, again
foreach ($p in 'MicrosoftEdgeUpdate','chredge','msedge','msedgewebview2','Widgets') { kill -name $p -force -ea 0 }
## brute-run found Edge setup.exe with uninstall args
$purge = '--uninstall --system-level --force-uninstall'
if ($also_remove_webview -eq 1) { foreach ($s in $setup) { try{ start -wait $s -args "--msedgewebview $purge" } catch{} } }
foreach ($s in $setup) { try{ start -wait $s -args "--msedge $purge" } catch{} }
## prevent latest cumulative update (LCU) failing due to non-matching EndOfLife Edge entries
foreach ($i in $remove_appx) {
  dir "$store\EndOfLife" -rec -ea 0 |where {$_ -like "*${i}*"} |foreach {reg delete "$($_.Name)" /f 2>&1 >''}
  dir "$store\Deleted\EndOfLife" -rec -ea 0 |where {$_ -like "*${i}*"} |foreach {reg delete "$($_.Name)" /f 2>&1 >''}
}

## add ChrEdgeFkOff to redirect microsoft-edge: anti-competitive links to the default browser 
##################################################################################################################################
$ChrEdgeFkOff = @'
@echo off
::# toggle when launched without arguments, else jump to arguments: "install" or "remove"
set CLI=%*& set IFEO=HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options& set MSE=& set BHO=&;
for /f "tokens=2*" %%V in ('reg query "HKCR\MSEdgeMHT\shell\open\command" /ve 2^>nul') do set "ProgID=%%W"
for %%W in (%ProgID%) do if not defined MSE set "MSE=%%~W"& set "MSEPath=%%~dpW"
if /i "%CLI%"=="" reg query "%IFEO%\ie_to_edge_stub.exe\0" /v Debugger >nul 2>nul && goto remove || goto install
if /i "%~1"=="install" (goto install) else if /i "%~1"=="remove" goto remove

:install
if defined MSEPath for /f "delims=" %%W in ('dir /o:D /b /s "%MSEPath%\*ie_to_edge_stub.exe" 2^>nul') do set "BHO=%%~fW" 
if not exist "%MSEPath%chredge.exe" if exist "%MSE%" mklink /h "%MSEPath%chredge.exe" "%MSE%" >nul
if defined BHO copy /y "%BHO%" "%ProgramData%\\" >nul 2>nul
call :export ChrEdgeFkOff.vbs > "%ProgramData%\ChrEdgeFkOff.vbs"
reg add HKCR\microsoft-edge /f /ve /d URL:microsoft-edge >nul
reg add HKCR\microsoft-edge /f /v "URL Protocol" /d "" >nul
reg add HKCR\microsoft-edge /f /v "NoOpenWith" /d "" >nul 
reg add HKCR\microsoft-edge\shell\open\command /f /ve /d "\\"%ProgramData%\ie_to_edge_stub.exe\\" %%1" >nul
reg add HKCR\MSEdgeHTM /f /v "NoOpenWith" /d "" >nul
reg add HKCR\MSEdgeHTM\shell\open\command /f /ve /d "\\"%ProgramData%\ie_to_edge_stub.exe\\" %%1" >nul
reg add "%IFEO%\ie_to_edge_stub.exe" /f /v UseFilter /d 1 /t reg_dword >nul >nul
reg add "%IFEO%\ie_to_edge_stub.exe\0" /f /v FilterFullPath /d "%ProgramData%\ie_to_edge_stub.exe" >nul
reg add "%IFEO%\ie_to_edge_stub.exe\0" /f /v Debugger /d "wscript.exe \\"%ProgramData%\ChrEdgeFkOff.vbs\\" //B //T:60" >nul
reg add "%IFEO%\msedge.exe" /f /v UseFilter /d 1 /t reg_dword >nul
reg add "%IFEO%\msedge.exe\0" /f /v FilterFullPath /d "%MSE%" >nul
reg add "%IFEO%\msedge.exe\0" /f /v Debugger /d "wscript.exe \\"%ProgramData%\ChrEdgeFkOff.vbs\\" //B //T:60" >nul
exit /b 

:remove
del /f /q "%ProgramData%\ChrEdgeFkOff.vbs" "%MSEPath%chredge.exe" >nul 2>nul 
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
Choice = W.RegRead("HKCR\\" & ProgID & "\shell\open\command\\"): ProgID = W.RegRead("HKCR\MSEdgeMHT\shell\open\command\\")
If Instr(1,ProgID,Chr(34),1) Then ProgID = Split(ProgID,Chr(34))(1) Else ProgID = Split(ProgID,Chr(32))(1)
If Instr(1,Choice,ProgID,1) Then URL = "": End If: ProgID = Replace(ProgID,"msedge.exe","chredge.exe")
If URL = "" Then W.Run """" & ProgID & """ " & Trim(CLI), 1, False Else W.Run """https://" & URL & """", 1, False
' done
:ChrEdgeFkOff_vbs:]

'@
[io.file]::WriteAllText("$env:Temp\ChrEdgeFkOff.cmd",$ChrEdgeFkOff) >''
& "$env:Temp\ChrEdgeFkOff.cmd" install
##################################################################################################################################

## refresh explorer
kill -name 'sihost' -force

echo "`n EDGE REMOVED! IF YOU NEED TO SETUP ANOTHER BROWSER, ENTER: `n"
write-host -fore green @'
 $ffsetup='https://download.mozilla.org/?product=firefox-latest&os=win';
 $firefox="$([Environment]::GetFolderPath('Desktop'))\FirefoxSetup.exe";
 (new-object System.Net.WebClient).DownloadFile($ffsetup,$firefox); start $firefox
'@;''  

} ; start -verb runas powershell -args "-nop -noe -c & {`n`n$($_Paste_in_Powershell-replace'"','\"')}"
$_Press_Enter
#::
