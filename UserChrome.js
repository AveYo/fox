/// Create in Firefox-Install-Directory/UserChrome.js - a minimal bootstrap to run js snippets on startup - AveYo, 2023.09.14
/// Requires: Firefox-Install-Directory/defaults/pref/enable-UserChrome.js

let { classes: Cc, interfaces: Ci, manager: Cm, utils: Cu } = Components;
const { XPCOMUtils } = Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
const Services = globalThis.Services || Components.utils.import("resource://gre/modules/Services.jsm").Services;
let xP = Services.prefs, xD = xP.getDefaultBranch(null), xZ = void 0, xS = 'string', xN = 'number', xB = 'boolean', xPref = {
 get:function(e,t=!1,r,n=!0){var s=t?xD:xP;try{var o=s.getPrefType(e);return 0==o?null!=r?this.set(e,r,n):xZ:
  32==o?s.getStringPref(e):64==o?s.getIntPref(e):128==o?s.getBoolPref(e):xZ}catch(P){return}}, clear:xP.clearUserPref, old:{},
 set:function(e,t,r=!1){let n=r?xD:xP,s=typeof t;return(xS==s?n.setStringPref:xN==s?n.setIntPref:xB==s?n.setBoolPref:xZ)(e,t)||t},
 lock:function(e,t){this.old[e]=this.get(e,!0),xP.prefIsLocked(e)&&xP.unlockPref(e),this.set(e,t,!0),xP.lockPref(e)},
 unlock:function(e){xP.unlockPref(e);let t=this.old[e];null==t?xP.deleteBranch(e):this.set(e,t,!0)},
 addListener:function(e,t){return this.o=function(e,r,n){return t(xPref.get(n),n)},xP.addObserver(e,this.o),{p:e,o:this.o}},
 removeListener:function(e){xP.removeObserver(e.p,e.o)} }; /// uncomment to use minified xPref.jsm
function UserChromeJS() { Services.obs.addObserver(this, 'chrome-document-global-created', false); } ; UserChromeJS.prototype = {
  observe:function(s) {s.addEventListener('DOMContentLoaded', this, {once:true});}, handleEvent: async function(evt) {
  let browser = evt.originalTarget, document = browser, window = browser.defaultView, console = window.console;
  if (window.gBrowserInit && !window.gBrowserInit.delayedStartupFinished) { await window.delayedStartupPromise; }
  if (!window.gBrowserInit || !window.docShell) { /* console.info(window.location.href); */ return; }
/*******************************************    PLACE UC SNIPPETS BELOW THIS LINE!    *******************************************/

// ==UserScript==
// @name            OneClickSearch redux v3
// @author          AveYo
// @description     Search when clicking the engines icons + navigate to their homepage if no input
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
    console.info('\u2713 OneClickSearch redux v3');
  }
};

UC.OneClickSearch.init();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ==UserScript==
// @name            Addressbar redux v5
// @author          AveYo
// @description     Navigate to input on Enter (if having dot, not having space) - press Tab to Search instead (quotes URLs)
// @include         main
// @onlyonce
// ==/UserScript==

if (typeof UC === 'undefined') UC = {};

UC.Addressbar = {
  init: function() {
  	const lazy = {};
    XPCOMUtils.defineLazyModuleGetters(lazy, {
      UrlbarView: "resource:///modules/UrlbarView.jsm",
      UrlbarInput: "resource:///modules/UrlbarInput.jsm",
      UrlbarUtils: "resource:///modules/UrlbarUtils.jsm",
      UrlbarSearchUtils: "resource:///modules/UrlbarSearchUtils.jsm",
    });

  lazy.UrlbarInput.prototype._toggleActionOverride_uc = lazy.UrlbarInput.prototype._toggleActionOverride;
  lazy.UrlbarInput.prototype._toggleActionOverride = function (event = null) {
    if (event.repeat) { return; }
    if (event.keyCode == event.DOM_VK_TAB && event.type == "keydown" && this.view.selectedElementIndex == 0) {
	  event.preventDefault(); event.stopImmediatePropagation(); //lazy.UrlbarInput.clearSelection();
      let res = this.view.getResultFromElement(this.view.selectedElement); let payload = res?.payload;
      let url = res?.autofill?.value ?? payload?.suggestion ?? payload?.keyword ?? payload?.query ?? payload?.url ?? this.value;
      if (!/\s/.test(url) && /\.[a-z]+/.test(url)) url = '"' + url.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'') + '"';
      this._loadURL(url, event, this._whereToOpen(event), {}, {source:res.source, type:res.type, searchTerm:url,}, this.browser);
      return;
    }
  }

  lazy.UrlbarInput.prototype.handleCommand = function (event = null) {
    let res = this.view.getResultFromElement(this.view.selectedElement); let payload = res?.payload;
    let url = res?.autofill?.value ?? payload?.suggestion ?? payload?.keyword ?? payload?.query ?? payload?.url ?? this.value;
    console.error(url);
    let btn = this.view.oneOffSearchButtons.selectedButton;
    if (res && res?.payload.keyword) {
      this.pickResult(res, event);
    }
    else if (btn && (event instanceof this.window.MouseEvent === false || event.target == btn)) {
      this.view.oneOffSearchButtons.handleSearchCommand(
        event, {engineName: btn.engine?.name, source: btn.source, entry: "oneoff"}
      );
    }
    else if (this.searchMode) { this.handleNavigation({event}); }
    else if (url && (/\s/.test(url) || !/\.[a-z]+/.test(url))) {
        this.handleNavigation({event});
    }
    else if (url && !/\s/.test(url) && /\.[a-z]+/.test(url)) {
      let flags = Ci.nsIURIFixup.FIXUP_FLAG_FIX_SCHEME_TYPOS;
      if (this.isPrivate) {flags |= Ci.nsIURIFixup.FIXUP_FLAG_PRIVATE_CONTEXT;}
      let {preferredURI: uri, postData} = Services.uriFixup.getFixupURIInfo(url, flags);
      this._loadURL(uri.spec, event, this._whereToOpen(event), {});
	}
  };
  console.info('\u2713 Addressbar redux v5');
  }
};

UC.Addressbar.init();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    console.info('\u2713 SimpleHotkeysOverride v2');
  }
};

//UC.SimpleHotkeysOverride.init();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*******************************************    PLACE UC SNIPPETS ABOVE THIS LINE!    *******************************************/
} }; if (!Services.appinfo.inSafeMode) new UserChromeJS();
/// ^,^
