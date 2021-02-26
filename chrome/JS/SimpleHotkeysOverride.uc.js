// ==UserScript==
// @name            SimpleHotkeysOverride v2
// @author          AveYo
// @description     see Firefox-Install-Directory/browser/omni.ja/chrome/browser/content/browser/browser.xhtml - 'mainKeyset'
// @include         main
// @onlyonce
// ==/UserScript==

if (typeof UC === 'undefined') UC = {};

UC.SimpleHotkeysOverride = {
  init: function() {
    let hotkeys = function (id, modifiers, key, cmd, oncmd) {
      const k = window.document.createXULElement("key"); k.id = id;
      if (!key.startsWith("VK_")) {k.setAttribute("key", key);} else {k.setAttribute("keycode", key); k.setAttribute("event", "keydown");}
      k.setAttribute("modifiers", modifiers); if (cmd) k.setAttribute("command", cmd); if (oncmd) k.setAttribute("oncommand", oncmd);
      window.document.getElementById("mainKeyset").appendChild(k);
    };
    // Example 1: Ctrl+Shift+B for Library (set either command or oncommand like in browser.xhtml - here, command set, oncommand empty)
    hotkeys("hot_library", "accel,shift", "VK_B", "Browser:ShowAllBookmarks", "");
    // Example 2: B to toggle Bookmarks toolbar (set either command or oncommand like in browser.xhtml - here, command empty, oncommand set)
    hotkeys("hot_bookmtb", "", "B", "", "BookmarkingUI.toggleBookmarksToolbar('shortcut');");
    // Example 3: Ctrl+Alt+Q instead of Ctrl+Shift+Q to prevent accidental quit
    let key_quit = document.getElementById("key_quitApplication"); if (key_quit) key_quit.setAttribute("modifiers", "accel,alt");
    // Example 4: remove quit application built-in shortcut
    let key_quit_rem = document.getElementById("key_quitApplication"); if (key_quit_rem) key_quit.remove();
    console.info('\u2713 SimpleHotkeysOverride');
  }
};

UC.SimpleHotkeysOverride.init(); 
