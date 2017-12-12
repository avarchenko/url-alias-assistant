// Originally based on tutorial at https://developer.mozilla.org/en-US/Add-ons/WebExtensions/user_interface/Omnibox

const jiraIssueIdRE = /([a-zA-Z]+-[0-9]+)/;
const numbersRE = /([0-9]+)/;

// to make it working in both Chrome and Firefox:
var TABS_CREATE, TABS_UPDATE, OMNIBOX, EXTENSION_GETURL;
setupFunctionAliases();

// Provide help text to the user.
OMNIBOX.setDefaultSuggestion({
  description: "Smart jump to Odin services (e.g. \"g APS-1\" to open Jira issue by ID | \"g rt102332\" to open support ticket #102332). Use \"g help\" to get all possible suggestions"
});

// Update the suggestions whenever the input is changed.
OMNIBOX.onInputChanged.addListener((guessingText, addSuggestions) => {
  let suggestions = [];
  let text = guessingText.trim();
  let tokens = text.toLowerCase().split(" ");

  let res = text.match(jiraIssueIdRE);
  if (res !== null) {
    jiraID = res[1].toUpperCase();
    // POA-1, APS-1, APSA-1, DO-1 etc:
    suggestions.push({
      content: "https://jira.int.zone/browse/" + jiraID,
      description: "Odin Jira issue #" + jiraID
    });
    // CORPIT-1981 and other:
    suggestions.push({
      content: "https://cloudteam.atlassian.net/browse/" + jiraID,
      description: "Cloud Team Jira issue #" + jiraID
    });
    // KPN-1 and other:
    suggestions.push({
      content: "https://imcloud.atlassian.net/browse/" + jiraID,
      description: "IM Cloud Jira issue #" + jiraID
    });
  }

  // Jira text guesses:
  const JIRA_SEARCH_PREFIX = "jt";
  if (text.startsWith(JIRA_SEARCH_PREFIX)) {
    text = text.slice(JIRA_SEARCH_PREFIX.length).trim(); // cut JIRA_SEARCH_PREFIX at the beginning
    suggestions.push({
      content: "https://jira.int.zone/issues/?jql=text~%22"+encodeURIComponent(text.replace("\"", "\\\""))+"%22 ORDER BY created DESC",
      description: "Search for Jira issues that contain the text '" + text + "'"
    });
  }

  // SPConfig stacks guesses:
  const SPCONFIG_SEARCH_PREFIX = "sp";
  if (text.startsWith(SPCONFIG_SEARCH_PREFIX)) {
    text = text.slice(SPCONFIG_SEARCH_PREFIX.length).trim(); // cut SPCONFIG_SEARCH_PREFIX at the beginning
    suggestions.push({
      content: "http://spconfig.int.zone:7000/"+text,
      description: "Open SPConfig stack with name '" + text + "'"
    });
  }

  // RT guesses:
  res = text.match(numbersRE);
  if (res !== null) {
    let rtID = res[1];
    let rtSuggestion = {
      content: "https://support.odin.com/Ticket/Display.html?id=" + rtID,
      description: "Support ticket #" + rtID
    };
    if (text.startsWith("rt")) {
      // if prefixed with "rt", make it topmost suggestion
      suggestions.splice(0, 0, rtSuggestion);
    } else {
      // else - just add to bottom
      suggestions.push(rtSuggestion);
    }
  }

  // RT guesses:
  if (text.startsWith('rt')) {
    suggestions.splice(0, 0, {
      content: "https://support.odin.com/",
      description: "Support ticket portal"
    });
  }

  // Git guesses:
  if (text.startsWith('git')) {
    suggestions.splice(0, 0, {
      content: "https://git.int.zone/dashboard",
      description: "Git Bitbucket repository"
    }, {
      content: "https://git.int.zone/projects/AP/repos/osa/browse",
      description: "Git OA Platform repository (also known as 'Trunk')"
    }, {
      content: "https://git.int.zone/projects/AP/repos/automation-7.2/browse",
      description: "Git Platform fork for OA 7.2 (codename Tawny Eagle)"
    }, {
      content: "https://git.int.zone/projects/AP/repos/automation-7.1/browse",
      description: "Git Platform fork for OA 7.1 (codename Black Eagle)"
    }, {
      content: "https://git.int.zone/projects/AP/repos/osa-flamingo/browse",
      description: "Git Platform fork for OA 7.0 (codename Eagle)"
    });
  }

  // CI guesses:
  if (text.startsWith('ci')) {
    suggestions.splice(0, 0, {
      content: "http://ci.int.zone/jenkins/",
      description: "Jenkins server"
    }, {
      content: "http://ci.ap.int.zone/",
      description: "AP Jenkins server"
    }, {
      content: "http://ci.int.zone/nexus/#welcome",
      description: "Nexus repository"
    });
  }

  // TODO: add guesses for:
  // - intranet by name
  // - git PR
  // - git commit/revision
  // - jenkins jobs
  // - stack

  addSuggestions(suggestions);
});


// Open the page based on how the user clicks on a suggestion.
OMNIBOX.onInputEntered.addListener((text, disposition) => {
  console.log("Processing '"+text+"' with disposition='"+disposition+"'");
  // in chrome it passes whole omnibar text, including search prefix "g ", so need to cut it
  if (text.startsWith('g '))
    text = text.slice(2);

  let url = text;
  let validUrlPrefix = /^https?:\/\//i;
  if (!validUrlPrefix.test(text)) {
    // Update the url if the user clicks on the default suggestion.
    // TODO - try to follow the top suggestion if exist
    url = `https://www.google.ru/search?q=${text}`;
    if (text === "help") {
      url = EXTENSION_GETURL("help.html");
    }
    console.log("Failing to Google search");
  }

  switch (disposition) {
    case "currentTab":
      TABS_UPDATE({url: url});
      break;
    case "newForegroundTab":
      TABS_CREATE({url: url});
      break;
    case "newBackgroundTab":
      TABS_CREATE({url: url, active: false});
      break;
  }
});

function setupFunctionAliases() {
  if (typeof browser === "undefined") {
    TABS_CREATE = chrome.tabs.create;
    TABS_UPDATE = chrome.tabs.update;
    OMNIBOX = chrome.omnibox;
    EXTENSION_GETURL = chrome.extension.getURL
    // browser = chrome; // hack for Chrome
  } else {
    TABS_CREATE = browser.tabs.create;
    TABS_UPDATE = browser.tabs.update;
    OMNIBOX = browser.omnibox;
    EXTENSION_GETURL = browser.extension.getURL
  }
}
