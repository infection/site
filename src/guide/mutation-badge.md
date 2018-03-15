---
title: Mutation Badge
type: guide
order: 10
---

It's possible to add a fancy mutation score badge for your github project. 

## How to set it up

[![Infection MSI](https://badge.stryker-mutator.io/github.com/infection/infection/master)](https://infection.github.io)

Take these steps to enable the mutation score badge on your repository.

1. Make sure you enabled a Travis integration for your project (we only support Travis at the moment. Feel free to request another CI).
2. Go to https://dashboard.stryker-mutator.io and sign in with your github account. We use the [Stryker Dashboard](https://dashboard.stryker-mutator.io/) to store mutation score for badges. Strykes is a mutation testing framework for Javascript that shares its service for other mutations frameworks.
3. Enable a repository you want to create a mutation badge to. Stryker Dashboard will generate a key for you automatically. 
4. Configure an API key in your project. Please make sure you encrypt this variable using the [encrypted environment variables](https://docs.travis-ci.com/user/environment-variables/#Encrypting-environment-variables). For example:
`$ travis encrypt INFECTION_BADGE_API_KEY=89b99910-xxxx-yyyy-9a91-23d709c828b4 --add`
Make sure to use `INFECTION_BADGE_API_KEY` environment variable name instead of `STRYKER_DASHBOARD_API_KEY`.
5. Configure the badge logger in your `infection.json` file (you will need Infection version `0.9.0` or higher):
```json
{
    "logs": {
        "badge": {
            "branch": "master"
        }
    }
}
```
6. Force a Travis build: `$ git push origin master`

Your badge will be available at: `https://badge.stryker-mutator.io/github.com/{username}/{repository_name}/{branch}`. (don't forget to add it to your readme file)

If you want to make mutation badge as a link to Infection, use `[![Infection MSI](https://badge.stryker-mutator.io/github.com/{username}/{repository_name}/{branch})](https://infection.github.io)`

That's it! Hope you like it.
