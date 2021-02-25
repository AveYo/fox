/// Create in Firefox-Install-Directory/UserChrome.js - a minimal bootstrap to run javascript snippets on Firefox startup - by AveYo
try {
  let {classes:Cc, interfaces:Ci, manager:Cm} = Components;
  const {XPCOMUtils} = Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
  XPCOMUtils.defineLazyModuleGetters(this, {
    Services: "resource://gre/modules/Services.jsm",
    UrlbarSearchOneOffs: "resource:///modules/UrlbarSearchOneOffs.jsm",
    UrlbarUtils: "resource:///modules/UrlbarUtils.jsm",
    //Preferences: "resource://gre/modules/Preferences.jsm",
  });
  function UserChromeJS() {Services.obs.addObserver(this, 'chrome-document-global-created', false);}
  UserChromeJS.prototype = {observe:function(s) {s.addEventListener('DOMContentLoaded', this, {once:true});}, handleEvent:function(evt) {
    let document = evt.originalTarget; let window = document.defaultView; let location = window.location;
    let skip = /^chrome:(?!\/\/(global\/content\/(commonDialog|alerts\/alert)|browser\/content\/webext-panels)\.x?html)|about:(?!blank)/i;
    if (!window._gBrowser || !skip.test(location.href)) return; window.gBrowser = window._gBrowser; let UC = {};
/***********************************************    PLACE CUSTOM CODE BELOW THIS LINE!    ***********************************************/


/// OneClickSearch redux v1.2 by AveYo - see resource:///modules/UrlbarSearchOneOffs.jsm
/// ======================================================================================================================================
UrlbarSearchOneOffs.prototype.handleSearchCommand = function (event, searchMode) {
  let button = this.selectedButton;
  if (button == this.view.oneOffSearchButtons.settingsButtonCompact) {
    this.input.controller.engagementEvent.discard(); this.selectedButton.doCommand(); return;
  }
  let engine = Services.search.getEngineByName(searchMode.engineName); let { where, params } = this._whereToOpen(event);
  if (engine && !event.shiftKey) {
    this.input.handleNavigation({ event, oneOffParams: { openWhere: where, openParams: params, engine: this.selectedButton.engine, }, });
    this.selectedButton = null; return;
  }
  let startQueryParams = {allowAutofill: !searchMode.engineName && searchMode.source != UrlbarUtils.RESULT_SOURCE.SEARCH, event, };
  this.input.searchMode = searchMode; this.input.startQuery(startQueryParams); this.selectedButton = button;
};

/// Simple Hotkeys Override by AveYo
/// for available commands, see Firefox-Install-Directory/browser/omni.ja/chrome/browser/content/browser/browser.xhtml ('mainKeyset')
/// for available VK codes, see Firefox-Install-Directory/browser/omni.ja/chrome/devtools/modules/devtools/client/shared/keycodes.js
/// ======================================================================================================================================
function hotkeys(id, modifiers, key, cmd, oncmd) {
  const k = window.document.createXULElement("key"); k.id = id;
  if (!key.startsWith("VK_")) {k.setAttribute("key", key);} else {k.setAttribute("keycode", key); k.setAttribute("event", "keydown");}
  k.setAttribute("modifiers", modifiers); if (cmd) k.setAttribute("command", cmd); if (oncmd) k.setAttribute("oncommand", oncmd);
  window.document.getElementById("mainKeyset").appendChild(k);
}
// Example 1: Ctrl+Shift+B for Library (set either command or oncommand like in browser.xhtml - here, command set, oncommand empty)
hotkeys("hot_library", "accel,shift", "VK_B", "Browser:ShowAllBookmarks", "");
// Example 2: B to toggle Bookmarks toolbar (set either command or oncommand like in browser.xhtml - here, command empty, oncommand set)
hotkeys("hot_bookmtb", "", "B", "", "BookmarkingUI.toggleBookmarksToolbar('shortcut');");
// Example 3: Ctrl+Alt+Q instead of Ctrl+Shift+Q to prevent accidental quit
let key_quit = document.getElementById("key_quitApplication"); if (key_quit) key_quit.setAttribute("modifiers", "accel,alt");
// Example 4: remove quit application built-in shortcut
let key_quit_rem = document.getElementById("key_quitApplication"); if (key_quit_rem) key_quit.remove();


/***********************************************    PLACE CUSTOM CODE ABOVE THIS LINE!    ***********************************************/
} }; if (!Services.appinfo.inSafeMode) new UserChromeJS(); } catch(ex) {};
/// ^-^
