# url-alias-assistant
The addon for Firefox and Chrome browsers which simplifies navigation to frequently used URLs especially if these URLs are ID-based URLs.
Please read [Native Support in Browsers](#native-support-in-browsers) chapter - maybe you actually don't need this plug-in.

# Purpose
Originally based on ideas implemented in [URL Alias](https://addons.mozilla.org/en-US/firefox/addon/url-alias-8703/) plug-in for Firefox I've used widely. But the plug-in stopped work after my Firefox was upgraded to v57.

I often need to open URLs like Jira issues. And often I don’t have a full URL, but have only it's ID. Without the plug-in I have to open some Jira page, paste the Jira ID into Search field and click Enter.
With the plug-in I just type `g jDO-1` in browser and it navigates me to a proper page like [https://sample.atlassian.net/browse/DO-1](https://sample.atlassian.net/browse/DO-1). Fast and efficient!

Another case that can't be covered by simple bookmarking: I want to search Jira issues by a text phrase. All I need is type `g jt"error string"` and it will open a search results page like [https://sample.atlassian.net/issues/?jql=text~%22%5C%22error%20string%5C%22%22%20ORDER%20BY%20created%20DESC](https://sample.atlassian.net/issues/?jql=text~%22%5C%22error%20string%5C%22%22%20ORDER%20BY%20created%20DESC)

Works both in Google Chrome and Firefox v57+.

# Native Support in Browsers

After the plug-in was released, I was told there are native ways both in Firefox and Chrome browsers to get the same functionality, so the plug-in became useless for most of scenarios.
I've put some how-to below. Hope it will help you.

## Chrome
Open the following [Search Settings](browser://settings/searchEngines) link.
Here you can see all custom search engines currently registered in your browser (the list is growing automaticaly once you visit a site advertising such custom search support).
You can customize the list:

- in 1st column put the Hint text to be shown in a list of address bar suggestions. Sample: `GitHub`
- in 2nd column put the Keyword. It could be a hostname of the site or some shorter string. Sample: `github.com`
- in 3rd column put the target URL, using "%s" as a placeholder for parameters. Sample: `https://github.com/search?q=%s&ref=opensearch`


## Firefox
Open your bookmarks page (press Ctrl+B).
Create new bookmark with the following important fields specified:

- Name: `Quick-Search Github`
- Location: `https://github.com/search?q=%s&ref=opensearch`
- Keyword: `github.com`


# How to Configure

Go to plug-in Options page and see the JSON representing the current settings.
Copy the whole text and paste into your favorite JSON editor.
Edit the rules as you need and copy-paste them back into Options page.

## Format

### Minimal Rule Sample
The rule below is a typical tiny rule which helps you to translate any phrase to English using Google Translate website:
```
  {
    "prefix": "te",
    "suggestions": [
      {
        "url": "https://translate.google.com/#auto/en/$1",
        "description": "Translate to English a phrase '$1'"
      }
    ]
  }
```

Here:

- `prefix` field specifies which combination will trigger the rule
- `suggestions` field specifies one or more "suggestion lines" that will be produced in your browser once the rule triggered
- `url` field represents the target URL address to navigate to. Note `$1` placeholder - it will be replaced by the text you've written after `prefix` in your browser.
- `description` field represents the text which will be shown in "suggestion line" produced by this rule. Note `$1` placeholder - it will be replaced by the text you've written after `prefix` in your browser.

After this rule will be added, you can easily translate any phrase (`Привет` in this sample) to English just typing `g teПривет` in location bar.

### Most Complex Rule Sample
```
  {
    "prefix": "j",
    "regexp": "([a-zA-Z]+-[0-9]+)",
    "options": {
      "changeCase": 1
    },
    "suggestions": [
      {
        "url": "https://sample.atlassian.net/browse/$1",
        "description": "Jira issue #$1 in Sample team",
        "comment": "For me - Default jira issue in Sample"
      },
      {
        "url": "https://sample2.atlassian.net/browse/$1",
        "description": "Yet another Jira issue #$1"
      }
    ]
  }
```
Here:

- optional `prefix` field specifies which combination will trigger the rule. If field `regexp` is not specified, all text entered in browser after the prefix will be used as a value of `$1` during substitutions.
- optional `regexp` field specifies a regexp that will trigger the rule. All text entered in browser after the prefix and matching to the regexp will be used as a value of `$1` during substitutions.
- optional `options` field could contain the following optional modificators:
-- `changeCase` - if specified, could be either -1 or 1. Where `-1` means lowercase value of `$1`, `1` means uppercase value of `$1`.
-- `escapeQuotes` - if specified and set to `true`. In such case, the double quotes (") in value of `$1` will be escaped with back-slash (\\) symbol.
- `suggestions` field specifies one or more "suggestion line" groups that will be produced in your browser once the rule triggered:
-- `url` field represents the target URL address to navigate to. Note `$1` placeholder - it will be replaced by the text you've written after `prefix` in your browser.
-- `description` field specifies the text shown in browser as a text of generated suggestion line. Note `$1` placeholder - it will be replaced by the text matching to your regexp (if specified) or by text you've written after `prefix` in your browser.
-- optional `comment` field you may use it to store any comments for yourself.

After this rule will be added, you can easily open Jira issue (`DO-1` in this sample) in one of Jira teams just typing `g jDO-1` or even `g jDO-1` in location bar.

# How to Build
At this moment, a build process is not automated and consists of the following manual steps:

1. Download necessary libraries into the "./libs" folder:
```
cd ./libs/ && rm -f *.js *.cs
http -d https://code.jquery.com/jquery-3.2.1.min.js --output jquery.min.js
http -d https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
http -d https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
http -d https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js
```
2. Archive necessary files into a zip archive:
```
zip url-alias-assistant-plugin.zip *.js *.json logo96.png logo48.png *.html libs/*
```
3. Submit archive as a new version to [Google Webstore](https://chrome.google.com/webstore/developer/dashboard) and [Mozilla Developer Hub](https://addons.mozilla.org/en-US/developers/addons).

# Obtain Latest Version
Go to [Firefox Add-ons Site](https://addons.mozilla.org/en-US/firefox/addon/url-alias-assistant/) or [Chrome Web Store](https://chrome.google.com/webstore/detail/url-alias-assistant/mphkengpjhplgaenijfjiagldcnmndeb) to check the latest version and related info.
