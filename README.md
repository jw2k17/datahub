# DataHub: A Generalized Metadata Search & Discovery Tool
[![Version](https://img.shields.io/github/v/release/linkedin/datahub?include_prereleases)](https://github.com/linkedin/datahub/releases)
[![Build Status](https://travis-ci.org/linkedin/datahub.svg)](https://travis-ci.org/linkedin/datahub)
[![License](https://img.shields.io/github/license/linkedin/datahub)](LICENSE)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/linkedin/datahub)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/linkedin/datahub/blob/master/CONTRIBUTING.md)

![DataHub](docs/imgs/datahub-logo.png)

> :mega: First town hall meeting on March 6th, 10am-11am PST: 
> - BlueJeans link: https://bluejeans.com/4642477444
> - [Signup sheet & questions](https://docs.google.com/spreadsheets/d/1hCTFQZnhYHAPa-DeIfyye4MlwmrY7GF4hBds5pTZJYM)

> :sparkles:Feb 2020 Update: 
> - Our [blog post](https://engineering.linkedin.com/blog/2020/open-sourcing-datahub--linkedins-metadata-search-and-discovery-p) on open sourcing DataHub is out!
> - *DataHub v0.3.0* is [released](https://github.com/linkedin/datahub/releases/tag/v0.3.0)!

## Introduction
DataHub is LinkedIn's generalized metadata search & discovery tool. To learn more about DataHub, check out our 
[LinkedIn blog post](https://engineering.linkedin.com/blog/2019/data-hub) and [Strata presentation](https://speakerdeck.com/shirshanka/the-evolution-of-metadata-linkedins-journey-strata-nyc-2019). 
You should also visit [DataHub Architecture](docs/architecture/architecture.md) to get a better understanding of how DataHub is implemented and [DataHub Onboarding Guide](docs/how/entity-onboarding.md) to understand how to extend DataHub for your own use case.

This repository contains the complete source code for both DataHub's frontend & backend. You can also read about [how we sync the changes](https://engineering.linkedin.com/blog/2020/open-sourcing-datahub--linkedins-metadata-search-and-discovery-p) between our the internal fork and GitHub. 

## Quickstart
1. Install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/). Make sure to configure Docker to allocate enough hardware resources for Docker engine. Tested & confirmed config: 4 CPUs, 8GB RAM, 2GB Swap area.
2. Open Docker either from the command line or the Desktop app and ensure it is up and running.
3. Clone this repo and `cd` into the root directory for the cloned repository.
4. Run below command to download and run all Docker containers in your local:
    ```
    cd docker/quickstart && docker-compose pull && docker-compose up --build
    ```
    This step takes long time and it might be hard to figure out when DataHub is fully up. You can refer to [this guide](https://github.com/linkedin/datahub/blob/master/docs/debugging.md#how-can-i-confirm-if-all-docker-containers-are-running-as-expected-after-a-quickstart) to verify if DataHub is up and running.
5. At this point, you should be able to start `DataHub` by opening [http://localhost:9001](http://localhost:9001) in your browser. You can sign in using `datahub` as both username and password. However, there is no data just yet.
6. To ingest [provided](https://github.com/linkedin/datahub/blob/master/metadata-ingestion/mce-cli/bootstrap_mce.dat) sample data to DataHub, switch to a new terminal, `cd` into the cloned `datahub` repo, and run below command:
    ```
    docker build -t ingestion -f docker/ingestion/Dockerfile . && cd docker/ingestion && docker-compose up
    ```
    After running this, you should be able to see sample data in DataHub.

Refer to [debugging guide](docs/debugging.md) if you have issues in any of the above steps.

## Quicklinks
* [DataHub Architecture](docs/architecture/architecture.md)
* [DataHub Onboarding Guide](docs/how/entity-onboarding.md)
* [Docker Images](docker)
* [Frontend App](datahub-frontend)
* [Web Client App](datahub-web)
* [Generalized Metadata Service](gms)
* [Metadata Consumer Jobs](metadata-jobs)
* [Metadata Ingestion](metadata-ingestion)

## Releases
See [Releases](https://github.com/linkedin/datahub/releases) page for more details.

## Contributing
We welcome contributions from the community. Please refer to [the guidelines](CONTRIBUTING.md) for more details. We also have a [contrib](contrib) directory for incubation. 

## Roadmap
Check out DataHub's [roadmap](docs/roadmap.md).

## Articles & Presentations
* [DataHub: A Generalized Metadata Search & Discovery Tool](https://engineering.linkedin.com/blog/2019/data-hub)
* [Open sourcing DataHub: LinkedIn’s metadata search and discovery platform](https://engineering.linkedin.com/blog/2020/open-sourcing-datahub--linkedins-metadata-search-and-discovery-p)
* [The evolution of metadata: LinkedIn’s story @ Strata Data Conference 2019](https://conferences.oreilly.com/strata/strata-ny-2019/public/schedule/detail/77575)
* [Journey of metadata at LinkedIn @ Crunch Data Conference 2019](https://www.youtube.com/watch?v=OB-O0Y6OYDE)
* [Data Catalogue — Knowing your data](https://medium.com/albert-franzi/data-catalogue-knowing-your-data-15f7d0724900)
* [How LinkedIn, Uber, Lyft, Airbnb and Netflix are Solving Data Management and Discovery for Machine Learning Solutions](https://towardsdatascience.com/how-linkedin-uber-lyft-airbnb-and-netflix-are-solving-data-management-and-discovery-for-machine-9b79ee9184bb)
