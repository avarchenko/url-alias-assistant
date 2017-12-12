'use strict';

// Originally based on tutorial at https://developer.mozilla.org/en-US/Add-ons/WebExtensions/user_interface/Omnibox
// FF: open "about:debugging", then "Load Temporary Add-on", select a manifest file
// Chrome: open "browser://extensions/", check "Developer mode" at top righ corner, click "Load unpacked application"

class OmniBar {
  constructor() {
    // to make it working in both Chrome and Firefox:
    if (typeof browser === "undefined") {
      this.TABS_CREATE = chrome.tabs.create;
      this.TABS_UPDATE = chrome.tabs.update;
      this.OMNIBOX = chrome.omnibox;
      this.EXTENSION_GETURL = chrome.extension.getURL;
      this.STORAGE = chrome.storage;
      // browser = chrome; // hack for Chrome
    } else {
      this.TABS_CREATE = browser.tabs.create;
      this.TABS_UPDATE = browser.tabs.update;
      this.OMNIBOX = browser.omnibox;
      this.EXTENSION_GETURL = browser.extension.getURL;
      this.STORAGE = browser.storage;
    }

    this.STORAGE.local.get(
      {
        settings: []
      }, // default value
      this.applySettings.bind(this));  // loader
  }


  getAllSuggestions(guessingText, addSuggestions) {
    let suggestions = [];
    let text = guessingText.trim();

    this._settings.forEach( (rule) => {
      let matchedValue = null;

      let prefixMatches = rule.prefix !== "" && text.startsWith(rule.prefix);

      if (rule.regexp !== undefined) {
        if (rule.regexpObj === undefined) {
          rule.regexpObj = new RegExp(rule.regexp);
        }

        let res = text.match(rule.regexpObj);
        if (res !== null && res.length > 1) {
          matchedValue = res[1];
        }
        if (prefixMatches && matchedValue === null) {
          matchedValue = "";  // to show the suggestion even if regexp doesn't match
        }
      } else if (prefixMatches) {
        matchedValue = text.slice(rule.prefix.length).trim();
      }

      if (guessingText === "help")
        matchedValue = "";

      if (matchedValue !== null) {
        this.processOneMatch(matchedValue, rule, suggestions)
      }
    });

    addSuggestions(suggestions);
    if (suggestions.length > 0) {
      this.defaultSuggestion = suggestions[0].content;
    } else {
      this.defaultSuggestion = "https://www.google.com/search?q="+encodeURIComponent(guessingText);
    }
  }


  processOneMatch(matchedValue, rule, suggestions) {
    if (rule.options) {
      if (rule.options.changeCase === 1) {
        matchedValue = matchedValue.toUpperCase();
      } else if (rule.options.changeCase === -1) {
        matchedValue = matchedValue.toLowerCase();
      }

      if (rule.options.escapeQuotes === true) {
        matchedValue = matchedValue.replace(/"/g, "\\\"");
      }
    } // options

    if (matchedValue !== "" || rule.prefix !== "") {
      let prefixHint = (rule.prefix === undefined) ? "" : rule.prefix + ": ";
      rule.suggestions.forEach( (ruleSuggestion) => {
        suggestions.push({
          content: ruleSuggestion.url.replace("$1", encodeURIComponent(matchedValue)),
          description: prefixHint + ruleSuggestion.description.replace(/\$1/g, matchedValue)
        });
      });
    }
  }


  // Open the page based on how the user clicks on a suggestion.
  processUserInput(text, disposition) {
    console.log("Processing '"+text+"' with disposition='"+disposition+"'");

    let url = text;
    // in chrome it passes whole omnibar text, including search prefix "g ", so need to cut it
    if (url.startsWith('g '))
      url = url.slice(2);

    let validUrlPrefix = /^https?:\/\//i;
    if (!validUrlPrefix.test(url)) {
      // Update the url if the user clicks on the default suggestion.
      url = this.defaultSuggestion;
    }

    switch (disposition) {
      case "currentTab":
        this.TABS_UPDATE({url: url});
        break;
      case "newForegroundTab":
        this.TABS_CREATE({url: url});
        break;
      case "newBackgroundTab":
        this.TABS_CREATE({url: url, active: false});
        break;
    }
  }

  applySettings(newJson) {
    // console.log("Applying New settings:");
    // console.log(newJson);
    if (newJson) {
      this._settings = newJson.settings;
    } else {
      this._settings = [];
    }
  }

  settingsChangedListener(changes, namespace) {
    console.log("settingsChangedListener.this=");
    console.log(this);
    for (let key in changes) {
      if (key !== "settings")
        continue;
      let storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
      this.applySettings({
        settings: storageChange.newValue
      });
    }
  }
}


var omniBar = new OmniBar();

// Provide help text to the user.
omniBar.OMNIBOX.setDefaultSuggestion({
  description: "Smart jump to Odin services (e.g. \"g APS-1\" to open Jira issue by ID | \"g rt102332\" to open support ticket #102332). Try type 'g help' and check add-on Options for more"
});
// Update the suggestions whenever the input is changed.
omniBar.OMNIBOX.onInputChanged.addListener(omniBar.getAllSuggestions.bind(omniBar));
omniBar.OMNIBOX.onInputEntered.addListener(omniBar.processUserInput.bind(omniBar));
omniBar.STORAGE.onChanged.addListener(omniBar.settingsChangedListener.bind(omniBar));
