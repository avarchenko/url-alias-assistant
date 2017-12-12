function loadOptions() {
  console.log("Loading current settings from the storage");
  console.log(defaultSettings);
  chrome.storage.local.get(
    {
      settings: defaultSettings
    },
    function(data) {
      document.querySelector("#settingsJson").value = JSON.stringify(data.settings, null, ' ');
    });
  // getting.then(setCurrentChoice, onError);
}

function saveOptions(e) {
  console.log("entered into saveOptions()");
  e.preventDefault();
  let jsonObject;
  try {
    jsonObject = JSON.parse(document.querySelector("#settingsJson").value);
    showError("");
  } catch(e) {
    console.log("[ERR] Failed to parse the new settings:");
    console.log(e);
    showError("[ERR] Failed to parse the new settings:\n" + e);
  }
  chrome.storage.local.set(
    {
      settings: jsonObject
    },
    function() {
      showMessageAndHideIt("Changes saved");
    }
  );
}

function showMessageAndHideIt(text) {
  let msg = document.querySelector("#Message");
  msg.textContent = text;
  setTimeout(function() {
    msg.textContent = "";
  }, 750);
}

function showError(text) {
  let msg = document.querySelector("#Error");
  msg.textContent = text;
}

function resetToDefaultOptions() {
  console.log("Resetting settings with defaults");
  document.querySelector("#settingsJson").value = JSON.stringify(defaultSettings, null, ' ');
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("#form").addEventListener("submit", saveOptions);
// document.querySelector("#Save").addEventListener("click", saveOptions);
document.querySelector("#Reset").addEventListener("click", resetToDefaultOptions);