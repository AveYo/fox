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

For MacOS the file paths are `/Applications/Firefox.app/Contents/Resources/UserChrome.js` and `/Applications/Firefox.app/Contents/Resources/defaults/pref/enable-UserChrome.js` [ref](https://github.com/mozilla/policy-templates/blob/master/README.md)
