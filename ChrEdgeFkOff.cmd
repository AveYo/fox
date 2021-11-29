@(set "0=%~f0"^)#) & powershell -nop -c iex([io.file]::ReadAllText($env:0)) & exit/b
#:: double-click to run or just copy-paste into powershell - it's a standalone hybrid script
#::
#:: ChrEdgeFkOff - make start menu web search or widgets links open in your chosen default browser - by AveYo
#:: this will obviously block standard msedge.exe while installed, but you can use Beta / Dev / Canary instead
#:: v1.3 standard edge icon opens chosen default browser; prevent IFEO loop - thanks rcmaehl for the heads-up   
#:: 
$_Paste_in_Powershell = {
$key = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\msedge.exe'; $vbs = @'
' ChrEdgeFkOff - make start menu web search or widgets links open in your chosen default browser - by AveYo  
Dim C, A: For Each i in WScript.Arguments: A = A&" """&i&"""": Next
Set W = CreateObject("WScript.Shell"): Set E = W.Environment( "Process" ): E("CL") = A
C = "$U=get-itemproperty 'HKCU:\SOFTWARE\Microsoft\Windows\Shell\Associations\UrlAssociations\https\UserChoice' 'ProgID';"
C = C & "$C=get-itemproperty -lit ""Registry::HKCR\$($U.ProgID)\shell\open\command"" '(Default)' -ea 0;"
C = C & "$UserChoice=($C.'(Default)'-split [char]34,3)[1];"
C = C & "$undo='-c del ''HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\msedge.exe\0'' -force';"
C = C & "if ($UserChoice -like '*Microsoft\Edge\Application\msedge.exe*') {start powershell $undo -verb runas} "
C = C & "else {start $UserChoice $([uri]::unescapedatastring(($env:CL-split'&url[=]',2)[1]).Trim([char]34)+' ')}"
W.Run "powershell -nop -c " & C, 0, False
'@; $file = join-path ([Environment]::GetFolderPath('CommonApplicationData')) "ChrEdgeFkOff.vbs"; $cmd = "wscript $file //B //T:5"
if (test-path "$key\0") {
  remove-item "$key\0" -rec -force -ea 0 >''; remove-itemproperty $key 'Debugger' -force -ea 0 >''; del $file -force -ea 0 >''
  write-host -fore 0xf -back 0xd "`n ChrEdgeFkOff v1.3 [REMOVED] run again to install "
} else {                              
  new-item "$key\0" -force -ea 0 >''; remove-itemproperty $key 'Debugger' -force -ea 0 >''; [io.file]::WriteAllText($file, $vbs)
  $P = 'ProgramFiles'; if ([Environment]::Is64BitOperatingSystem) {$P+='x86'}
  $E = join-path ([Environment]::GetFolderPath($P)) 'Microsoft\Edge\Application\msedge.exe'
  set-itemproperty "$key\0" 'FilterFullPath' $E -force -ea 0; set-itemproperty $key 'UseFilter' 1 -type dword -force -ea 0
  set-itemproperty "$key\0" 'Debugger' $cmd -force -ea 0 
  write-host -fore 0xf -back 0x2 "`n ChrEdgeFkOff v1.3 [INSTALLED] run again to remove " } ; timeout /t 5
} ; start -verb runas powershell -args "-nop -c & {`n`n$($_Paste_in_Powershell-replace'"','\"')}"
$_Press_Enter
#::
