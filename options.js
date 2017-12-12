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
}

function saveOptions(e) {
  e.preventDefault();
  let jsonObject;
  try {
    jsonObject = JSON.parse(document.querySelector("#settingsJson").value);
    showError("");
  } catch(e) {
    console.log("[ERR] Failed to parse the new settings:");
    console.log(e);
    showError("[ERR] Failed to parse the new settings:\n" + e);
    return;
  }
  chrome.storage.local.set(
    {
      settings: jsonObject
    },
    function() {
      showMessage("Changes saved");
    }
  );
}

function showMessage(text, closeOptionsPopup) {
  let msg = document.querySelector("#Message");
  msg.textContent = text;
  setTimeout(function() {
    msg.textContent = "";
    if (closeOptionsPopup === true) {
      window.close();
    }
  }, 750);
}

function showError(text) {
  let msg = document.querySelector("#Error");
  msg.textContent = text;
}

function resetToDefaultOptions() {
  bootbox.confirm({
    message: "Are you sure you want to reset your current rules with a default set?\nYOU WILL LOSE ALL YOUR CHANGES IN THE RULES!!!",
    buttons: {
      cancel: {
        label: 'No',
        className: 'btn-success'
      },
      confirm: {
        label: 'Yes',
        className: 'btn-danger'
      }
    },
    callback: function (result) {
      if (result === true) {
        console.log("Resetting settings with defaults");
        document.querySelector("#settingsJson").value = JSON.stringify(defaultSettings, null, ' ');
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("#form").addEventListener("submit", saveOptions);
document.querySelector("#Reset").addEventListener("click", loadOptions);
document.querySelector("#ResetToDefault").addEventListener("click", resetToDefaultOptions);
