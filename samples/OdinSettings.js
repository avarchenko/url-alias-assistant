var defaultSettings =
[
  {
    "regexp": "([a-zA-Z]+-[0-9]+)",
    "options": {
      "changeCase": 1
    },
    "suggestions": [
      {
        "url": "https://jira.int.zone/browse/$1",
        "description": "Odin Jira issue #$1",
        "comment": "Internal Odin Jira to open POA-1, APSA-1 etc"
      },
      {
        "url": "https://cloudteam.atlassian.net/browse/$1",
        "description": "Cloud Team Jira issue #$1",
        "comment": "CORPIT-1981 and other"
      },
      {
        "url": "https://imcloud.atlassian.net/browse/$1",
        "description": "IM Cloud Jira issue #$1",
        "comment": "KPN-1 and other"
      }
    ]
  },
  {
    "prefix": "ja",
    "options": {
      "changeCase": 1
    },
    "suggestions": [
      {
        "url": "https://jira.int.zone/browse/APSA-$1",
        "description": "Odin Jira issue #APSA-$1",
        "comment": "Internal Odin Jira to open in APSA project"
      }
    ]
  },
  {
    "prefix": "jt",
    "options": {
      "escapeQuotes": true
    },
    "suggestions": [
      {
        "url": "https://jira.int.zone/issues/?jql=text~%22$1%22 ORDER BY created DESC",
        "description": "Search for Jira issues that contain the text '$1'"
      }
    ]
  },
  {
    "prefix": "sp",
    "suggestions": [
      {
        "url": "http://spconfig.int.zone:7000/$1",
        "description": "Open SPConfig stack with name '$1'"
      }
    ]
  },
  {
    "prefix": "st",
    "suggestions": [
      {
        "url": "http://spconfig.int.zone:7000/$1",
        "description": "Open SPConfig stack with name '$1'"
      }
    ]
  },
  {
    "regexp": "([0-9]+)",
    "prefix": "rt",
    "suggestions": [
      {
        "url": "https://support.odin.com/Ticket/Display.html?id=$1",
        "description": "Support ticket #$1"
      }
    ]
  },
  {
    "prefix": "git",
    "suggestions": [
      {
        "url": "https://git.int.zone/dashboard",
        "description": "Git Bitbucket repository"
      },
      {
        "url": "https://git.int.zone/projects/AP/repos/osa/browse",
        "description": "Git OA Platform repository (also known as 'Trunk')"
      },
      {
        "url": "https://git.int.zone/projects/AP/repos/automation-7.2/browse",
        "description": "Git Platform fork for OA 7.2 (codename Tawny Eagle)"
      },
      {
        "url": "https://git.int.zone/projects/AP/repos/automation-7.1/browse",
        "description": "Git Platform fork for OA 7.1 (codename Black Eagle)"
      },
      {
        "url": "https://git.int.zone/projects/AP/repos/osa-flamingo/browse",
        "description": "Git Platform fork for OA 7.0 (codename Eagle)"
      }
    ]
  },
  {
    "prefix": "ci",
    "suggestions": [
      {
        "url": "http://ci.int.zone/jenkins/",
        "description": "Jenkins server"
      },
      {
        "url": "http://ci.ap.int.zone/",
        "description": "AP Jenkins server"
      },
      {
        "url": "http://ci.int.zone/nexus/#welcome",
        "description": "Nexus repository"
      }
    ]
  }
];
