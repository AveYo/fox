// ==UserScript==
// @name            OneClickSearch redux v2
// @author          AveYo
// @description     see resource:///modules/UrlbarSearchOneOffs.jsm
// @include         main
// @onlyonce
// ==/UserScript==

if (typeof UC === 'undefined') UC = {};

UC.OneClickSearch = {
  init: function() {
    let UrlbarSearchOneOffs = window.gURLBar.view.oneOffSearchButtons; let UrlbarUtils = window.UrlbarUtils;
    UrlbarSearchOneOffs.handleSearchCommand = function (event, searchMode) {
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
