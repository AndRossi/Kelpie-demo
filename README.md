# Kelpie Demo

This repository contains the code for a simple demonstration of the [Kelpie Framework](https://github.com/AndRossi/Kelpie) to explain embedding-based Link Prediction models on Knowledge Graphs.

The Kelpie framework has been presented with a [research paper](https://dl.acm.org/doi/abs/10.1145/3514221.3517887) at the [SIGMOD 2022](https://2022.sigmod.org/) conference.

Our Kelpie demonstration will be presented at the [VLDB 2022](https://vldb.org/2022/) conference.

*Note: due to the impossibility to host a demo on a GPU-intensive server, this application just displays pre-computed results obtained by the Kelpie framework.*


## Getting Started

```bash
git clone https://github.com/AndRossi/Kelpie-demo
cd Kelpie-demo
npm install
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. 
If you edit and save any component file in `src`, you can reload the page to see your changes.


## Svelte

The demo is a simple static page devel developed with the [Svelte framework](https://svelte.dev/).
It can be deployed to Vercel with zero-configuration. 

## Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/vercel/tree/main/examples/svelte&template=svelte)

_Live Example: https://svelte.vercel.app_

## Credits

This demo has been developed with a huge help by my elder brother [Luca Rossi](https://www.linkedin.com/in/lucaronin/).
In addition to being an amazing brother, Luca authors [Refactoring](https://refactoring.club/), a great newsletter on Engineering management and leadership. You should definitely have a look at it!
