// ==UserScript==
// @name            UrlFixUp redux v3
// @author          AveYo
// @description     ctrl+enter: .com ; shift+enter: .net ; ctrl+shift+enter: .org ctrl+alt+enter: browser.fixup.alternate.suffix
// @reference       see resource:///modules/UrlbarInput.jsm
// @include         main
// @onlyonce
// ==/UserScript==

if (typeof UC === 'undefined') UC = {};

UC.UrlFixUp = {
  init: function() {
    XPCOMUtils.defineLazyModuleGetters(this, {
      UrlbarInput: "resource:///modules/UrlbarInput.jsm",
    });

    this.UrlbarInput.prototype.handleCommand = function (event = null) {
      if ((!event.ctrlKey && !event.shiftKey) || this.view.oneOffSearchButtons.selectedButton || this.searchMode) {
        let isMouseEvent = event instanceof this.window.MouseEvent; if (isMouseEvent && event.button == 2) { return; }
        if (this.view.isOpen) {
          let selectedOneOff = this.view.oneOffSearchButtons.selectedButton;
          if (selectedOneOff && (!isMouseEvent || event.target == selectedOneOff)) {
            let searchMode = {engineName: selectedOneOff.engine?.name, source: selectedOneOff.source, entry: "oneoff"}
            this.view.oneOffSearchButtons.handleSearchCommand(event, searchMode); return;
          }
        }
        this.handleNavigation({ event }); return;
      }
      if (this.value) {
        let ext = '\.(org|com|net|'; let suffix = Services.prefs.getCharPref("browser.fixup.alternate.suffix");
        if (/[a-zA-Z]+/.test(suffix)) { ext += suffix.replace('.', '') + ')[/]*$' } else { ext += ')[/]*$'; suffix = '' }
        let regex =  new RegExp(ext, ''); let url = this.untrimmedValue.trim().replace(regex, '');
        if (event.ctrlKey && event.altKey) { url += suffix } else if (event.ctrlKey && event.shiftKey) { url += '.org' }
        else if (event.ctrlKey) { url += '.com' } else if (event.shiftKey) { url += '.net' }
        this.view.close(); this.value = url;
        //this._loadURL(url, event, 'current', {}); // uncomment to load url fixup directly
      }
    };
    console.info('\u2713 UrlFixUp');
  }
};

UC.UrlFixUp.init();
