// ==UserScript==
// @name            Addressbar redux v4
// @author          AveYo
// @description     Open input as URL on Enter - press Tab to Search for input instead
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

  this.UrlbarInput.prototype._toggleActionOverride_uc = this.UrlbarInput.prototype._toggleActionOverride;
  this.UrlbarInput.prototype._toggleActionOverride = function (event = null) {
    if (event.repeat) { return; }
    this._toggleActionOverride_uc(event);
    if (event.keyCode == event.DOM_VK_TAB && event.type == "keydown" && this.view.selectedElementIndex < 1 && this.value)
      this.handleNavigation({});
  }

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
    else if (this.searchMode || this.view.selectedElementIndex == 0 || (this.value && /\s/.test(this.value))) {
      this.handleNavigation({event});
    }
    else if (this.value && /\s/.test(this.value) === false) {
      let flags = Ci.nsIURIFixup.FIXUP_FLAG_FIX_SCHEME_TYPOS;
      if (this.isPrivate) {flags |= Ci.nsIURIFixup.FIXUP_FLAG_PRIVATE_CONTEXT;}
      let {preferredURI: uri, postData} = Services.uriFixup.getFixupURIInfo(this.value, flags);
      this._loadURL(uri.spec, event, this._whereToOpen(event), {});
      }
    };
    console.info('\u2713 Addressbar redux v4');
  }
};

UC.Addressbar.init();