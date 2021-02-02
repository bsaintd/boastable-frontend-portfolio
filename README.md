# The Boastable App

> This is the frontend for the Boastable app. It's deployed here on GitHub pages and communicates with an API hosted on GCloud in a container service.

## Updates
Currently in the process of transitioning most data requests to GraphQL queries and expanding the features to include importing lists of customers.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Deploy

You'll after creating a build, you'll need to create a subtree on the gh-pages branch to deploy.

``` bash
bash deploy.sh
```
