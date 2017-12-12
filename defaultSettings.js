var defaultSettings =
[
  {
    "prefix": "te",
    "suggestions": [
      {
        "url": "https://translate.google.com/#auto/en/$1",
        "description": "Translate to English a phrase '$1'"
      }
    ]
  },
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
];
