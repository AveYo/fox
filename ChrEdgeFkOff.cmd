@(set "0=%~f0"^)#) & powershell -nop -c iex([io.file]::ReadAllText($env:0)) & exit/b
#:: double-click to run or just copy-paste into powershell - it's a standalone hybrid script
#::
#:: ChrEdgeFkOff - make start menu web search, widgets links or help open in your chosen default browser - by AveYo
#:: v2.2 fix chredge update; v2.1 fix help urls; v2.0 only redirects microsoft-edge: links, no longer blocks msedge.exe     
#:: 
$_Paste_in_Powershell = {
$vbs = @'
' ChrEdgeFkOff - make start menu web search, widgets links or help open in your chosen default browser - by AveYo  
Dim C, A: For Each i in WScript.Arguments: A = A&" """&i&"""": Next '
Set W = CreateObject("WScript.Shell"): Set E = W.Environment( "Process" ): E("CL") = A : C = ""
C = C & "$U = get-itemproperty 'HKCU:\SOFTWARE\Microsoft\Windows\Shell\Associations\UrlAssociations\https\UserChoice' 'ProgID';"
C = C & "$C = get-itemproperty -lit $('Registry::HKCR\' + $U.ProgID + '\shell\open\command') '(Default)' -ea 0; $q=[char]34;"
C = C & "$UserChoice = ($C.'(Default)'-split [char]34,3)[1]; $MSE = $env:CL -replace '\\msedge.exe', '\chredge.exe';"
C = C & "if ($UserChoice -like '*Microsoft\Edge\Application\msedge.exe*') {iex('&'+$MSE); return 2};"
C = C & "if ($env:CL -notlike '*microsoft-edge:*') {iex('&'+$MSE); return 1};"
C = C & "start $UserChoice $($q+ ([uri]::unescapedatastring(($env:CL -split'(?=http[s]?)',2)[1]) -replace $q) +$q); return 0"
W.Run "powershell -nop -c " & C, 0, False
'@ 
$PROF = [Environment]::GetFolderPath('ProgramFiles'+('x86','')[![Environment]::Is64BitOperatingSystem])
$ROOT = join-path $PROF 'Microsoft\Edge\Application\'; $DATA = join-path $PROF 'Microsoft\ChrEdge\'
$EDGE = join-path $ROOT 'msedge.exe'; $CHREDGE = join-path $ROOT 'chredge.exe'; $script = join-path $ROOT "ChrEdgeFkOff.vbs"
$IFEO = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\msedge.exe'
if (test-path "$IFEO\0") {
  del $script -force -ea 0 >''; del $CHREDGE -force -ea 0 >''; rmdir $DATA -rec -force -ea 0 >''
  remove-itemproperty $IFEO 'Debugger' -force -ea 0 >''; remove-itemproperty $IFEO 'UseFilter' -force -ea 0 >'' 
  remove-item "$IFEO\0" -rec -force -ea 0 >'' 
  write-host -fore 0xf -back 0xd "`n ChrEdgeFkOff v2.2 [REMOVED] run again to install "
} else {                              
  if (-not (test-path $ROOT)) {write-host -fore 0xf -back 0x4 "`n ERROR! missing $ROOT "; timeout /t -1; return}
  [io.file]::WriteAllText($script, $vbs) >''; cmd /d /x /c "mklink /H ""$CHREDGE"" ""$EDGE"" >nul 2>nul"
  remove-itemproperty $IFEO 'Debugger' -force -ea 0 >''; set-itemproperty $IFEO 'UseFilter' 1 -type dword -force -ea 0
  new-item "$IFEO\0" -force -ea 0 >''  
  set-itemproperty "$IFEO\0" 'FilterFullPath' $EDGE -force -ea 0
  set-itemproperty "$IFEO\0" 'Debugger' "wscript ""$script"" //B //T:5" -force -ea 0 
  write-host -fore 0xf -back 0x2 "`n ChrEdgeFkOff v2.2 [INSTALLED] run again to remove " } ; timeout /t 5
} ; start -verb runas powershell -args "-nop -c & {`n`n$($_Paste_in_Powershell-replace'"','\"')}"
$_Press_Enter
#::
