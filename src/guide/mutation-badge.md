---
title: Mutation Badge, cloud HTML report
type: guide
order: 80
---

We use the [Stryker Dashboard](https://dashboard.stryker-mutator.io/) to store mutation score for badges and host HTML reports in the cloud. [Stryker](https://stryker-mutator.io) is a mutation testing framework for Javascript that shares its service for other mutations frameworks.

## How to set it up

[![Infection MSI](https://badge.stryker-mutator.io/github.com/infection/infection/master)](https://infection.github.io)

Take these steps to enable the mutation score badge / cloud HTML report on your repository:

1. Make sure you have enabled a continuous integration service for your project. 

   We use [`ondram/ci-detector`](https://github.com/OndraM/ci-detector) to detect continuous-integration services.  
   
   Feel free to request an additional integration there if the list of [currently supported continuous-integration servers](https://github.com/OndraM/ci-detector#supported-continuous-integration-servers) does not contain a service you require.

2. Go to https://dashboard.stryker-mutator.io and sign in with your GitHub account.

3. Enable a repository for which you want to create a mutation badge / cloud HTML report. Stryker Dashboard will generate a key for you automatically. 

4. Provide the API key for your project as a secret environment variable - either `INFECTION_DASHBOARD_API_KEY` or `STRYKER_DASHBOARD_API_KEY` can be used.

5. Configure the `stryker` logger in your `infection.json5` file:

    for badge

    ```json
    {
        "logs": {
            "stryker": {
                "badge": "/^release-.*$/"
            }
        }
    }
    ```

    or for HTML report to host it on Stryker Dashboard

    ```json
    {
        "logs": {
            "stryker": {
                "report": "/^release-.*$/"
            }
        }
    }
    ```

    > You can use either `badge` or `report`, but not both.
    > 
    > Using HTML report automatically enables badge on Stryker Dashboard. 

    If you provide a value that is not a regular expression starting and ending with `/`, a direct match will be performed:

    ```json
    {
        "logs": {
            "stryker": {
                "badge": "main"
            }
        }
    }
    ```

7. Force a build by running:

   ```shell
   $ git push origin main
   ```

HTML report will be available at URL: `https://badge.stryker-mutator.io/github.com/{username}/{repository_name}/{branch}`. 

For example https://dashboard.stryker-mutator.io/reports/github.com/infection/infection/master

To get the Badge image, go to Stryker Dashboard and copy the link there. Don't forget to add it to your readme file.

That's it! Hope you like it.
