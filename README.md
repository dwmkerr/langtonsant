Langton's Ant
=============

[Langton's Ant](http://en.wikipedia.org/wiki/Langton's_ant) is a simple simulation in which we create a basic set of rules and apply them to a little universe. 

[Try it in your browser now](http://langtonsant.com)

![Langton's Ant](./docs/langtonsant.jpg)

## Running the Code

Just clone the repo, then run:

```
npm install && npm start
```

To install dependencies and run the simulation in development mode.

## Deploying the Code

To build the distribution, run:

```
make build
```

To deploy to AWS, run:

```
make deploy
```

This command will require permissions to the `langtonsant.com` S3 bucket.
