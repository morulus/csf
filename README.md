Communicating sequential flows
--

It is runner, which create asynchronous flow with the javascript es6 generators, native functions and promises.

Docs
--

- [API reference](https://github.com/morulus/csf/blob/master/docs/api.md)

## Concept

The concept of the library is very close to [co](https://www.npmjs.com/package/co), but unlike _co_ and others similar tools, __scf__ can be considered as greedy - it executes each entity, that can be executed.

For example, the function returns another function:

```js
new Csf(() => () => {
  return 'ok'
})
  .then(console.log)
// ok
```

We got `"ok"`, because nested function has executed too.

The same structure with [co](https://www.npmjs.com/package/co) returns a function, instead of final result:

```js
co(() => () => {
  return 'ok'
})
  .then(console.log)
// function()
```

Otherwise, each passed to the runner function will be invoked with the parent context.

Example:

```js
function getEnv() {
  return this.env;
}

new Csf(function () {
  this.env = 'node'
  return () => () => getEnv;
})
  .then(console.log)
// node
```

## Payload

When each entity is executed, the question arises how to predict the final result.

And to understand this, there is such a thing as a payload.

Each the returned value will be considered as payload and will be returned as final result if it is not of one the next types:

- Promises
- Functions (also async functions)
- Generators
- Generator functions

```js
const Csf = require('scf')

Csf.call(function *() {
  // yield Promise
  const a = yield Promise.resolve(4);
  // next: 4

  // yield constant
  const b = yield 8;
  // next: 8

  // yield function
  const c = yield function() {
    return 15;
  }
  // next: 15

  // yield generator
  const d = yield function *() {
    yield 16;
  }
  // next: 16

  // yield nested function
  const e = yield () => () => 23;
  // next: 23

  // yield generator result
  const f = (function *() {
    yield 42
  })();
  // next: 42

  // return calculated result
  return Math.sum(a, b, c, d, e, f)
})
  .then(console.log) // 108
```

Context inheritance
--

Any native function inherit parent context. This allows you to implicitly transfer data between different flow depth levels.

Even if middling function is a arrow-function, but it returns classic function, context will be proxied to that classic function.

```js
Csf.apply(() => () => {
  return function() {
    return typeof this;
  }
}, {})
  .then(console.log)
// "object"
```

Flow control helpers
--

The __csf__ library provides flow control [API](https://github.com/morulus/csf/blob/master/docs/api) (so called **fx**). You can get it from the path `csf/fx`.

```js
const { each } = require('csf/fx')
```

There are some of them:

- **`spawn`** Run sub-flow with the context inheritance
- **`fork`** Spawn non-blocking sub-flow
- **`payload`** Wrap function to return it as payload
- **`cancel`** Cancel async operation
- **`reduce`** Async reduce
- **`map`** Async map
- **`each`** Async each

etc. Read them all in the [API reference](/docs/fx).

Compatability
--

All you need is a node grater than [6.4.0](https://nodejs.org/en/blog/release/v6.4.0/) or [regenerator]()  (also babel [tranform-regenerator](https://babeljs.io/docs/plugins/transform-regenerator/)) transpiler for older versions of node and compatibility with old browsers.

### Special behavior of generators

Any returned es6 generator (or a generator result) will be executed until it returns final value.

```js
import Csf from 'csf'

const deferredCalc = function* (a, b) {
  yield new Promise(resolve => setTimeout(resolve, 3330))
  yield a + b;
}

new Csf(function* () {
  const a = yield 11;
  const b = yield 22;
  return deferredCalc(a, b);
})
  .then(console.log)
// 33
```

Keep in the mind, and there is an important part of the behavior - **only last generator result will be returned**.

And, if the generator contains no return operator, the value returned by last operator _yield_ will be considered as the final result.

```js
new Sequence(function *() {
  yield 1;
  yield 2;
  yield 3;
})
  .then(console.log)
// 3
```

### Executable values and payload

Functions, promises, and generators are considered to be **executable values**.

But all other types of values (as *numbers, strings, booleans, objects, symbols, null and undefined*) will be considered as, so-called, **payload** and will be returned to the parent function (or next generator step) as the result.

Creating standalone sequences
--

Csf allows you to wrap code with csf  runner, thus obtaining a standalone asynchronous function.

```js
import Csf from 'csf'

export default Csf.wrap(function* (url) {
  const serverResponse = yield fetch(url);
  return serverResponse.json();
});
```

Which will allow you to execute sequences without any additional access to the __csf__ API. Also, such functions can take arguments.

````js
import fetchUrl from './sequences/fetchUrl'

fetchUrl('/entity/33')
  .then(console.log)
// { type: 'entity', id: 33 }
````

Or use from an another sequence.

````js
import Csf from 'csf'
import fetchUrl from './sequences/fetchUrl'

Csf.call(function* () {
  const data = yield fetchUrl('/entity/33')
  console.log(data); // { type: 'entity', id: 33 }
});
````

Context in the ditails
---

Every sub-flow can access context of the initial flow. This means that you can manage the state or use API of your application from the child flow.

Even if your nested flow includes arrow-functions (which by nature can not access dynamic context), you can access context by returning classic functions.

Here is example how to get redux store state from nested arrow-function.

```js
import { createStore } from 'redux'
import { apply } from 'csf'

// Define helper, that can access state of the context
function getState() {
  return this.getState();
}

// Usual redux store
const store = createStore(state => state, {
  sequence: 'X'
});

// Apply sequence with store as context
apply(
  store,
  function* () {
    // Create few nested sequences
    return () => {
      // This function have no access to the store
      return () => {
        // This function have no access to the store too
        // But you can return a function, which have it.
        return getState;
      }
    }
  }
)
  .then(console.log)
// {sequence:'X'}
```

Channels
--

Foundation stone of CSP pattern is a channels. Channel can accumulate and radiate values. csf channel is not an object, but function, which returns promise with next value each time it called.

If channel is empty, then returned promise will be unresolved, until next value will be pushed to channel.

Sequence channels are not a in-flow API and can be used separately.

```js
const {
  createChannel
} = require("../lib");

const messages = createChannel();

messages.push("Hello");
messages.push("Channel");

messages().then(console.log); // Hello
messages().then(console.log); // World

```
Here is few examples of practicle usage of the channels.

Imagine situation when you should make request to the server each time user click on document. And you can not make more than 6 requests at a time.

Here is approximate solution on pure javascript:

```js
const requestsQueue = [];
let activeRequestsCount = 0;

function sendRequest(event) {
  if (activeRequests >= 6) {
    requestsQueue.push(event);
  } else {
    activeRequestsCount++;
    fetch('api/click')
      .then(() => {
        activeRequestsCount--;
        if (requestsQueue.length) {
          requestsQueue
            .slice(0, 6 - activeRequestsCount)
            .map(sendRequest)
        }
      })
  }
}

document.addEventListener('click', sendRequest);
```

_I'm not sure this example real works, but it shows how cumbersome it looks_

And here how it can be solved with channels:

```js
import Csf, { createChannel } from 'csf'

new Csf(function *() {
  // Create two channels
  const clicks = createChannel();
  const requests = createChannel();

  // Add every click event to channel `clicks`
  document.addEventListener('click', clicks.push)

  // Handle each next event through a while loop
  while (yield clicks) {
    // Await superfluous requests
    while (requests.count() >= 6) {
      yield requests;
    }

    // Create http request and push response
    // to channel `responses`
    requests.push(fetch('api/click'))
  }
})
```

Cancellation
--

Most of fork processes in __csf__ can be cancelled. To cancel any parallel process you should use special method `Csf.cancel`.

```js
const Csf = require('csf')

new Csf(function *() {
  const a = [1, 2, 3, 4, 5]
  const parallelFlow = yield Csf.fx.fork(Csf.fx.each(a, function *(val) {
    yield Csf.fx.pause(50);
    console.log(`Val: ${val}`)
  }));
  yield Csf.fx.pause(120)
  Csf.cancel(parallelFlow);
})
// Val: 1
// Val: 2
// Val: 3
```

In this example we canceled process, created by async operator `each`.

Author
--

Vladimir Kalmykov <vladimirmorulus@gmail.com>

License
--

MIT
