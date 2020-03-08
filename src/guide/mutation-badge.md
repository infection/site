---
title: Mutation Badge
type: guide
order: 8
---

It's possible to add a fancy mutation score badge for your project. 

## How to set it up

[![Infection MSI](https://badge.stryker-mutator.io/github.com/infection/infection/master)](https://infection.github.io)

Take these steps to enable the mutation score badge on your repository:

1. Make sure you have enabled a continuous integration service for your project. 

   We use [`ondram/ci-detector`](https://github.com/OndraM/ci-detector) to detect continuous-integration services.  
   
   Feel free to request an additional integration there if the list of [currently supported continuous-integration servers](https://github.com/OndraM/ci-detector#supported-continuous-integration-servers) does not contain a service you require.

2. Go to https://dashboard.stryker-mutator.io and sign in with your GitHub account. 

   We use the [Stryker Dashboard](https://dashboard.stryker-mutator.io/) to store mutation score for badges. Stryker is a mutation testing framework for Javascript that shares its service for other mutations frameworks.

3. Enable a repository for which you want to create a mutation badge. Stryker Dashboard will generate a key for you automatically. 

4. Provide the API key for your project as a secret environment variable - either `INFECTION_BADGE_API_KEY` or `STRYKER_DASHBOARD_API_KEY` can be used.

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

6. Force a build by running:

   ```shell
   $ git push origin master
   ```

Your badge will be available at: `https://badge.stryker-mutator.io/github.com/{username}/{repository_name}/{branch}`. (don't forget to add it to your readme file)

If you want to make mutation badge as a link to Infection, use `[![Infection MSI](https://badge.stryker-mutator.io/github.com/{username}/{repository_name}/{branch})](https://infection.github.io)`

That's it! Hope you like it.
