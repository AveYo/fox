@(set "0=%~f0"^)#) & powershell -nop -c iex([io.file]::ReadAllText($env:0)) & exit/b
#:: double-click to run or just copy-paste into powershell - it's a standalone hybrid script
#::
$_Paste_in_Powershell = { $info = 'Remove Edge - by AveYo'

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
$setup = @(); "LocalApplicationData","ProgramFilesX86","ProgramFiles" |% {
  $setup += dir $([Environment]::GetFolderPath($_) +'\Microsoft\Edge*\setup.exe') -rec -ea 0
}

## compute ChrEdge uninstall arguments
$arg = @(); $u = '--uninstall'; $v = ' --verbose-logging --force-uninstall --delete-profile'
foreach ($l in '',' --system-level'){ foreach ($m in ' --msedge',''){ if ($m -eq ''){$arg += $u + $l + $v} else {
  '-beta','-dev','-internal','-sxs','webview','' |% {$arg += $u + $l + $m + $_ + $v} } }
}

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

$vbs = @'
' ChrEdgeFkOff - make start menu web search or widgets links open in your chosen default browser - by AveYo  
Dim C, A: For Each i in WScript.Arguments: A = A&" """&i&"""": Next
Set W = CreateObject("WScript.Shell"): Set E = W.Environment( "Process" ): E("CL") = A : C = ""
C = C & "$U = get-itemproperty 'HKCU:\SOFTWARE\Microsoft\Windows\Shell\Associations\UrlAssociations\https\UserChoice' 'ProgID';"
C = C & "$C = get-itemproperty -lit $('Registry::HKCR\' + $U.ProgID + '\shell\open\command') '(Default)' -ea 0;"
C = C & "$UserChoice = ($C.'(Default)'-split [char]34,3)[1]; $MSE = $env:CL -replace '\\Microsoft\\Edge', '\Microsoft\ChrEdge';"
C = C & "if ($UserChoice -like '*Microsoft\Edge\Application\msedge.exe*') {iex('&'+$MSE); return 2};"
C = C & "if ($env:CL -notlike '*microsoft-edge:*') {iex('&'+$MSE); return 1};"
C = C & "start $UserChoice $([uri]::unescapedatastring(($env:CL-split'(?=http[s]?)')[1] -replace [char]34)+' '); return 0"
W.Run "powershell -nop -c " & C, 0, False
'@ 
$DATA = [Environment]::GetFolderPath('CommonApplicationData'); $file = join-path $DATA "ChrEdgeFkOff.vbs"
$PROF = [Environment]::GetFolderPath('ProgramFiles'+('x86','')[![Environment]::Is64BitOperatingSystem])
$EDGE = join-path $PROF 'Microsoft\Edge\'; $CHREDGE = join-path $PROF 'Microsoft\ChrEdge\'
$IFEO = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\msedge.exe'
new-item "$IFEO\0" -force -ea 0 >''; remove-itemproperty $IFEO 'Debugger' -force -ea 0 >'' 
#[io.file]::WriteAllText($file,$vbs)>''; start -nonew cmd "/d/x/r mklink /J ""$CHREDGE"" ""$EDGE"">nul"
set-itemproperty $IFEO 'UseFilter' 1 -type dword -force -ea 0
set-itemproperty "$IFEO\0" 'FilterFullPath' $(join-path $PROF 'Microsoft\Edge\Application\msedge.exe') -force -ea 0 
set-itemproperty "$IFEO\0" 'Debugger' "wscript $file //B //T:5" -force -ea 0 

$IFEO = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\msedge.exe'
$cmd ='powershell.exe -win 1 -nop -c function ChrEdgeFkOff {$f=[uri]::unescapedatastring(([environment]::get_CommandLine()'
$cmd+='-join'' ''-split''&url[=]'')[1].Trim([char]34)); [diagnostics.process]::start($f)} ; ChrEdgeFkOff --%'
ni $IFEO -Force -ea 0 >''; sp $IFEO "Debugger" $cmd -Force -ea 0

## refresh explorer
kill -name 'sihost'

echo " IF YOU NEED TO SETUP ANOTHER BROWSER, ENTER: `n"
write-host -fore green @'
 $ffsetup='https://download.mozilla.org/?product=firefox-latest&os=win';
 $firefox="$([Environment]::GetFolderPath('Desktop'))\FirefoxSetup.exe";
 (new-object System.Net.WebClient).DownloadFile($ffsetup,$firefox); start $firefox
'@;''  

} ; start -verb runas powershell -args "-nop -noe -c & {`n`n$($_Paste_in_Powershell-replace'"','\"')}"
$_Press_Enter
#::

