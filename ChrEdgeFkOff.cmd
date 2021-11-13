@(set "0=%~f0"^)#) & powershell -nop -c iex([io.file]::ReadAllText($env:0)) & exit/b
#:: double-click to run or just copy-paste into powershell - it's a standalone hybrid script
#::
#:: ChrEdgeFkOff - make start menu web search or widgets links open in your chosen default browser - by AveYo
#:: this will obviously block msedge.exe while installed, but you can easily revert it with this toggle script when needed
#:: 
$_Paste_in_Powershell = {
$key = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\msedge.exe'; $vbs = @'
''>''; <# ChrEdgeFkOff - make start menu web search or widgets links open in your chosen default browser - by AveYo  
Dim A: For Each i in WScript.Arguments: A = A&" """&i&"""": Next
Set W = CreateObject("WScript.Shell"): Set E = W.Environment( "Process" ): E("CL") = A
W.Run "powershell -win 1 -nop -c [diagnostics.process]::start([uri]::unescapedatastring(($env:CL-split'&url[=]')[1]))>''",0,False
''>''; to undo, "delete HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\msedge.exe" via regedit #> 
'@; $file = join-path $([environment]::SystemDirectory) "ChrEdgeFkOff.vbs"; $cmd = "wscript $file //B //T:5"
if (test-path $file) {
  remove-itemproperty $key 'Debugger' -force -ea 0 >''; del $file -force -ea 0 
  write-host -fore 0xf -back 0xd "`n ChrEdgeFkOff v1 [REMOVED] run again to install " } else {
  new-item $key -force -ea 0 >''; set-itemproperty $key 'Debugger' $cmd -force -ea 0; [io.file]::WriteAllText($file, $vbs)
  write-host -fore 0xf -back 0x2 "`n ChrEdgeFkOff v1 [INSTALLED] run again to remove " } ; timeout /t 5
} ; start -verb runas powershell -args "-nop -c & {`n`n$($_Paste_in_Powershell-replace'"','\"')}"
$_Press_Enter
#::
