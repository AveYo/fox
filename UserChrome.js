/// Create in Firefox-Install-Directory/UserChrome.js - a minimal bootstrap to run javascript snippets on Firefox startup - by AveYo
/// Requires: Firefox-Install-Directory/defaults/pref/enable-UserChrome.js
try {
  let { classes: Cc, interfaces: Ci, manager: Cm } = Components;
  const { XPCOMUtils } = Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
  XPCOMUtils.defineLazyModuleGetters(this, { Services: "resource://gre/modules/Services.jsm" });
  function UserChromeJS() { Services.obs.addObserver(this, 'chrome-document-global-created', false); }
  UserChromeJS.prototype = { observe:function(s) {s.addEventListener('DOMContentLoaded', this, {once:true});}, handleEvent:function(evt) {
    let document = evt.originalTarget; let window = document.defaultView; let location = window.location; let console = window.console;
    let skip = /^chrome:(?!\/\/(global\/content\/(commonDialog|alerts\/alert)|browser\/content\/webext-panels)\.x?html)|about:(?!blank)/i;
    if (!window._gBrowser || !skip.test(location.href)) return; window.gBrowser = window._gBrowser;
/***********************************************    PLACE JS SNIPPETS BELOW THIS LINE!    ***********************************************/

// ==UserScript==
// @name            Addressbar redux v2
// @author          AveYo
// @description     Open input as URL on Enter - press Tab to Search instead
// @include         main
// @onlyonce
// ==/UserScript==

if (typeof UC === 'undefined') UC = {};

UC.Addressbar = {
  init: function() {
    XPCOMUtils.defineLazyModuleGetters(this, {
      UrlbarView: "resource:///modules/UrlbarView.jsm",
      UrlbarInput: "resource:///modules/UrlbarInput.jsm",
    });
    this.UrlbarView.prototype.onQueryResults_uc = this.UrlbarView.prototype.onQueryResults;
    this.UrlbarView.prototype.onQueryResults = function (queryContext) {
      this.onQueryResults_uc(queryContext);
      if (this.selectedElementIndex == 0 && !this.input.searchMode && !this.oneOffSearchButtons.selectedButton) {
        let result = this.getResultAtIndex(0);
        if (result?.payload.suggestion || result?.payload.query) {this.clearSelection();}
      }
    }; 
    this.UrlbarInput.prototype.handleCommand = function (event = null) {
      let element = this.view.selectedElement;
      let result = this.view.getResultFromElement(element);
      let btn = this.view.oneOffSearchButtons.selectedButton;

      if (result && result?.payload.keyword) {
        this.pickResult(result, event);
      }
      else if (btn && (event instanceof this.window.MouseEvent === false || event.target == btn)) {
        this.view.oneOffSearchButtons.handleSearchCommand(
          event, {engineName: btn.engine?.name, source: btn.source, entry: "oneoff"}
        );
      }
      else if (this.searchMode || this.view.selectedElementIndex == 0){
        this.handleNavigation({event});
      }
      else if (this.value) {
        let flags = Ci.nsIURIFixup.FIXUP_FLAG_FIX_SCHEME_TYPOS;
        if (this.isPrivate) {flags |= Ci.nsIURIFixup.FIXUP_FLAG_PRIVATE_CONTEXT;}
        let {preferredURI: uri, postData} = Services.uriFixup.getFixupURIInfo(this.value, flags);
        this._loadURL(uri.spec, event, this._whereToOpen(event), {});
      }
    };
    console.info('\u2713 Addressbar');
  }
};

UC.Addressbar.init();

// ==UserScript==
// @name            OneClickSearch redux v3
// @author          AveYo
// @description     see resource:///modules/UrlbarSearchOneOffs.jsm
// @include         main
// @onlyonce
// ==/UserScript==

if (typeof UC === 'undefined') UC = {};

UC.OneClickSearch = {
  init: function() {
    XPCOMUtils.defineLazyModuleGetters(this, {
      UrlbarSearchOneOffs: "resource:///modules/UrlbarSearchOneOffs.jsm",
      UrlbarUtils: "resource:///modules/UrlbarUtils.jsm",
    });
    this.UrlbarSearchOneOffs.prototype.handleSearchCommand = function (event, searchMode) {
      let button = this.selectedButton;
      if (button == this.view.oneOffSearchButtons.settingsButtonCompact) {
        this.input.controller.engagementEvent.discard(); this.selectedButton.doCommand(); return;
      }
      let engine = Services.search.getEngineByName(searchMode.engineName); let { where, params } = this._whereToOpen(event);
      if (engine && !event.shiftKey) {
        this.input.handleNavigation({
          event, oneOffParams: { openWhere: where, openParams: params, engine: this.selectedButton.engine, },
        });
        this.selectedButton = null; return;
      }
      let startQueryParams = {allowAutofill: !searchMode.engineName && searchMode.source != UrlbarUtils.RESULT_SOURCE.SEARCH, event, };
      this.input.searchMode = searchMode; this.input.startQuery(startQueryParams); this.selectedButton = button;
    };
    console.info('\u2713 OneClickSearch');
  }
};
UC.OneClickSearch.init();

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

/***********************************************    PLACE JS SNIPPETS ABOVE THIS LINE!    ***********************************************/
} }; if (!Services.appinfo.inSafeMode) new UserChromeJS(); } catch(fox) {};
/// ^,^
