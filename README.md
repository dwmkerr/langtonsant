# Langton's Ant

[Langton's Ant](http://en.wikipedia.org/wiki/Langton's_ant) is a simple simulation in which we create a basic set of rules and apply them to a little universe. 

[Try it in your browser now](http://langtonsant.com)

![Langton's Ant](./docs/langtonsant.jpg)

## Example Programs

The configuration for a simulation is called a 'program'. Some interesting 
examples are below. There is also a guide to the program syntax.

### Basic Ant

```
LR
```

For the first few moves, shows simple patterns. Quickly becomes chaotic, then
forms a highway after about 10,000 moves.

### Ant Transformation Matrices

The Langton's Ant transformation matix is just a trivial form of a Turmite transformation matrix. An Ant is a Turmite which only has one state.

The Transformation Matrix for an Ant can be specified using the Turmite Transoformation Matrix syntax below, or shorthand.

Shorthand assumes that we have a tile state for each letter, and we always move forwards one tile state at a time, with the final tile always 'looping back' to the first tile.

Therefore, a program like this:

```
LLRL
```

Is just shorthand for the following matrix:

```
|      | T: 0        | T: 1        | T: 2        | T: 3        |
|------|-------------|-------------|-------------|-------------|
| a: 0 | (0, -90, 1) | (0, -90, 2) | (0, +90, 2) | (0, -90, 0) |

i.e.         L             L             R             L
```

### Turmite Transformation Matrices

The state transformation matrix defines how the following characteristics of the system can be altered:

- The Ant State
- The Ant Direction
- The Tile State

A transformation is a three-tuple:

- `(1, 90, 0)`: Ant State becomes `1`, Ant turns `90` clockwise, Tile State becomes `0`
- `(2, -90, 1)`: Ant State becomes `2`, Ant turns `90` counter-clockwise, Tile State becomes `1`

Direction changes can also be specified with letters:

- `L`: Left, i.e. 90 counter clockwise
- `R`: Right, i.e. 90 counter clockwise
- `U`: U-Turn, i.e. 180 degrees

For every combination of Ant State and Tile State, an entry in the matrix is required. Here is an example matrix, for a Fibonacci Spiral:

```
|      | T: 0      | T: 1      |
|------|-----------|-----------|
| a: 0 | (1,-90,1) | (1,-90,1) |
| a: 1 | (1,90,1)  | (0,0,0)   |
```

A state transformation matrix is a simple line of text which contains each three tuple, one after the other. For example, the matix above becomes:

```
(1,-90,1)(1,-90,1)(1,90,1)(0,0,0)
```

One of the goals of this project is to facilitate the easy sharing of this matrix. Readability and compactness are important. The compiler which builds the matrix from the input follows the following rules:

1. All whitespace is eliminated
2. If the program only contains `L` or `R` characters, it is expanded from shorthand, as described in the section on [Shorthand Ant Transformation Matrices]()
3. If there are no commas between set of tuples, they are added, then all brackets are removed, leading to a simple sequence (e.g. `1,-90,1,1,-90,1,1,90,1,0,0,0`)
4. If there tuples do not form a matrix with sufficient rank or order to cover all of the states defined in the tuples, an error is thrown

The compiler itself can be used with the following code:

```js
const { compiler } = require('langtonsant');

const input = `
  (1, L, 1), (1, L, 1)
  (1, R, 1), (0, 0, 0)
`;

const matrix = compiler(input);

console.log(matrix);
// TODO
```
  

## Developing

### Running the Code

Just clone the repo, then run:

```
npm install && npm start
```

To install dependencies and run the simulation in development mode.

### Deploying the Code

To build the distribution, run:

```
make build
```

To deploy to AWS, run:

```
make deploy
```

This command will require permissions to the `langtonsant.com` S3 bucket.

### CI/CD

There is a simple CI/CD pipeline for this project:

1. All commits build, test and lint on CircleCI 2.0
2. Any commit to master will be built. If tests pass, it will automatically deploy to www.langtonsant.com
3. Pushing a semver tag will trigger a publish to NPM

Bump the version with `npm run release`.

## Url Parameters

A set of parameters can be provided in the url.

| Parameter | Usage |
|-----------|-------|
| `p`       | The program string, e.g. `LLRL`. |

## Notes

In the original version of this project, the transformation matrix was more simple (not supporting turmites) and worked by applying a *delta* to the tile state. This meant that we could actually play the universe 'backwords', by applying the state transformations in reverse. With this latest version, we cannot do this, as the transformations are absolutely, i.e. we change a tile from A to B, without applying a vector.

This feels wrong - applying a vector is cleaner in a number of ways. However, vectors make it harder (at least with my quick attempts) to work out the rank and order of the transformation matrix, as we don't explicitly know how many states there should be. It might be worth considering a number of states for the ant and tiles as input to the rules, so that we can return a vector based model.

The best solution would probably be to simple examine the rank and order of the matrix, which might actually simplify the code. We would need to use a semicolon as as line separator for single line programs however.

## References

Very useful information came from:

- [https://github.com/rm-hull/turmites](https://github.com/rm-hull/turmites)


