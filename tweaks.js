/// tweaks.js - a minimal bootstrap to run javascript snippets on Firefox startup - by AveYo
/// create in Firefox install directory - C:\Program Files\Mozilla Firefox\tweaks.js
/** must also create C:\Program Files\Mozilla Firefox\defaults\pref\enable-tweaks.js with the 2 lines below (use LF line endings, keep comments):
/// enable-tweaks.js
pref("general.config.filename", "tweaks.js"); pref("general.config.obscure_value", 0); pref("general.config.sandbox_enabled", false);
*************************************************************************************************************************************************/
try { let {classes: Cc, interfaces: Ci, manager: Cm} = Components;
const {XPCOMUtils} = Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
XPCOMUtils.defineLazyModuleGetters(this, {Services: "resource://gre/modules/Services.jsm"});
function TweaksJS() {Services.obs.addObserver(this, 'chrome-document-global-created', false);}
TweaksJS.prototype = { observe: function (s) { s.addEventListener('DOMContentLoaded', this, {once: true}); }, handleEvent: function (aEvent) {
let document = aEvent.originalTarget; let window = document.defaultView; let location = window.location; if (window._gBrowser) {
if (/^(chrome:(?!\/\/(global\/content\/commonDialog|browser\/content\/webext-panels)\.x?html)|about:(?!blank))/i.test(location.href)) {
window.gBrowser = window._gBrowser; let UC = {}; // inspired by github /xiaoxiaoflood/firefox-scripts/
/***************************************************    PLACE CUSTOM CODE BELOW THIS LINE!    ***************************************************/


/// Simple Hotkeys Override by AveYo
/// for available commands, see C:/Program Files/Mozilla Firefox/browser/omni.ja/chrome/browser/content/browser/browser.xhtml ('mainKeyset')
/// for available VK codes, see C:/Program Files/Mozilla Firefox/browser/omni.ja/chrome/devtools/modules/devtools/client/shared/keycodes.js
/// ==============================================================================================================================================
function hotkeys(id, modifiers, key, command, oncommand) {
  const k = window.document.createXULElement("key"); k.id = id;
  if (!key.startsWith("VK_")) {k.setAttribute("key", key);} else {k.setAttribute("keycode", key); k.setAttribute("event", "keydown");}
  k.setAttribute("modifiers", modifiers); if (command) k.setAttribute("command", command); if (oncommand) k.setAttribute("oncommand", oncommand);
  window.document.getElementById("mainKeyset").appendChild(k);
}
// Example 1: use Ctrl+Shift+B for Library (set either command or oncommand like in browser.xhtml - here, command set, oncommand empty)
hotkeys("hot_library", "accel,shift", "VK_B", "Browser:ShowAllBookmarks", "");
// Example 2: use B to toggle Bookmarks toolbar (set either command or oncommand like in browser.xhtml - here, command empty, oncommand set)
hotkeys("hot_bookmtb", "", "B", "", "BookmarkingUI.toggleBookmarksToolbar('shortcut');");
// Example 3: use Ctrl+Alt+Q instead of Ctrl+Shift+Q to prevent accidental quit
let key_quit = document.getElementById("key_quitApplication"); if (key_quit) key_quit.setAttribute("modifiers", "accel,alt");
// Example 4: remove quit application built-in shortcut
let key_quit_rem = document.getElementById("key_quitApplication"); if (key_quit_rem) key_quit.remove();


/***************************************************    PLACE CUSTOM CODE ABOVE THIS LINE!    ***************************************************/
} } } }; if (!Services.appinfo.inSafeMode) {new TweaksJS();} } catch(ex) {};
