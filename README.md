### Edge Removal 2023 
[Edge_Removal.bat](Edge_Removal.bat)  
`$also_remove_webview = 1`  
*why also remove webview? because it is 2 copies of edge, not a slimmed down CEF, and is driving bloated web apps*  
`$also_remove_widgets = 1`  
*why also remove widgets? because it is a webview glorified ad portal on msn and bing news cathering to stupid people*  
`$also_remove_xsocial = 1`  
*why also remove xsocial? because it starts webview setup every boot - xbox gamebar still works without the social crap*  

after removal can enter into console: `firefox` to quickly install it, or `edge` / `webview` / `xsocial` to reinstall them  
*there's some soft-blocking involved in the latest version, so if you want to reinstall edge / webview, do it via above cmds*  
hybrid script, can just copy-paste into powershell  
already includes OpenWebSearch  

---

### OpenWebSearch 2023 - redirect microsoft-edge: urls to your default browser  
[OpenWebSearch.cmd](OpenWebSearch.cmd)  
**since v4 works even with Edge fully uninstalled!**  
_if Edge is already removed, install Edge Stable, then remove it via Edge_Removal.bat (to preserve a small stub)_  
2023.09.13: *~one year since last update (it's that stable), add even more resilience to feature updates / upgrades,  
using a task to restore the needed hard-link if edge got reinstalled by windows and it does not open anymore*  
supports command line parameters: `install` or `remove`  
since v6 generate a pure batch script to prevent lame AVs false-positives    
hybrid script, can just copy-paste into powershell    
yes, a rebranded ChrEdgeFkOff  

---

### NATURAL SMOOTH SCROLLING V4 "SHARP" - AveYo, 2020-2022   
_probably the best smooth scrolling preset for mousewheel_  

copy into firefox / librewolf profile as [user.js](Natural%20Smooth%20Scrolling%20for%20user.js), add to your existing user.js, or set in about:config  

---

### UserChrome.js stand-alone snippet loader by AveYo  
featured snippets (**Addressbar** = _Open input as URL on Enter - press Tab to Search instead_ & **OneClickSearch**)  
also available for other popular js loaders in the [chrome/JS folder](https://github.com/AveYo/fox/tree/main/chrome/JS)

#### ELI5 request: sorry, [age restricted](https://www.reddit.com/r/firefox/comments/ls0ffy/oneoffsrefresh_redux_single_click_search_icons_in/gotqkg5/)  

1. in firefox, open **about:support** and take note of _Application Binary_  
    - for example: `C:\Program Files\Mozilla Firefox\firefox.exe`  

2. open a Command Prompt (Admin) or Windows PowerShell (Admin) window  
    - *press Win+X on windows 10*  
    - write `notepad` and press Enter  
    - the following steps are done in the Notepad window that just opened   

3. File - New  
    - [copy-paste the UserChrome.js content](UserChrome.js)  

4. File - Save As  `C:\Program Files\Mozilla Firefox\UserChrome.js`  
    - browse in the dialog to the path noted at step 1  
    - write at File name: _UserChrome.js_  
    - select Save as type: _All Files_  
    - select Encoding: _ANSI_ or _UTF-8_  

5. File - New  
    - [copy-paste the defaults/pref/enable-UserChrome.js content](defaults/pref/enable-UserChrome.js)  

6. File - Save As `C:\Program Files\Mozilla Firefox\defaults\pref\enable-UserChrome.js`
    - browse in the dialog to the path noted at step 1, and further to **defaults** **/** **pref** subfolder  
    - write at File name: _enable-UserChrome.js_  
    - select Save as type: _All Files_  
    - select Encoding: _ANSI_ or _UTF-8_  

_steps for linux and macOS are similar, using Terminal and sudo nano/gedit/TextEdit_  

For MacOS the file paths are `/Applications/Firefox.app/Contents/Resources/UserChrome.js`  
and `/Applications/Firefox.app/Contents/Resources/defaults/pref/enable-UserChrome.js` [ref](https://github.com/mozilla/policy-templates/blob/master/README.md)
