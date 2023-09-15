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
