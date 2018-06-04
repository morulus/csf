SequenceX
==

SequenceX is a generator-based communicating sequential asynchronous operations manager. Inspired by the redux-saga, by ideology close to [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes). But **it is not strict implementation of CSP pattern**.

Designed as a universal tool for managing an asynchronous sequence flow. It does not impose restrictions on use in a particular engine or framework. All you need is a node grater than [6.4.0](https://nodejs.org/en/blog/release/v6.4.0/) or [regenerator]()  (also babel [tranform-regenerator](https://babeljs.io/docs/plugins/transform-regenerator/)) transpiler for older versions of node and compatibility with old browsers.

Beta
--

**The current major version still lower than 1. It is not fully tested. Most likely, its API and functionality will be changed. Use it at your own risk.**

However, it inherits the experience from the previous project [reciprocator](https://github.com/morulus/reciprocator) and therefore it is not quite raw.

To develop the functionality and debugging was spent more than a month and few years of cultivation the idea. But a final understanding of the principles has come only now. So I started from blank project.

If you'd like to contribute project, please contact me, contact me or make pull requests. But I do not guarantee that I will approve all concept changes.

Docs
--

- [API reference](./docs/api.md)

Principle and inspiration
--

SequenceX is a wrapper for functions, generators, and promises, which allows you to execute them as a sequence.

Main princliple of SequenceX is that **any returned executable value will be executed**. Thus, if your function returns another function, or promise, or generator, these will be resolved.

In general, the sequence resembles a chain of Promise, but it will also involve functions and generators.

This approach is already partially implemented in the [redux-saga](https://github.com/redux-saga/redux-saga). I tried to make it more independent, so that it could be used with anything (not only with redux).

### Behavior of functions

For example, if your function returns another function, that another function will be invoked automatically in the same context. If that function returns a function again, it will be invoked too. And so on, until the final result is obtained.

```js
import Sequence from 'sequencex'

const deepValue => () => () => () => 33;

new Sequence(deepValue)
  .then(console.log)
// 33

```

### Behavior of promises

Any returned promise will be awaited for the final result.

```js
import Sequence from 'sequencex'

new Sequence(new Promise(resolve => setTimeout(
  () => resolve(33),
  3300
)))
  .then(console.log)
// 33

```

### Behavior of generators

Any returned es6 generator (or a generator result) will be executed as sub-sequence until it returns final value.

```js
import Sequence from 'sequencex'

const deferredCalc = function* (a, b) {
  yield new Promise(resolve => setTimeout(resolve, 3330))
  yield a + b;
}

new Sequence(function* () {
  const a = yield 11;
  const b = yield 22;
  return deferredCalc(a, b);
})
  .then(console.log)
// 33
```

Keep in the mind, and there is an important part of the behavior of SequenceX, that **only last generator result will be returned as result to the upper handler**.

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

Functions, promises, and generators are considered to be **executable values**. It means that if you return of one these type to the runner, it will be executed.

But all other types of values (as *numbers, strings, booleans, objects, symbols, null and undefined*) will be considered as, so-called, **payload** and will be returned to the parent function (or next generator step) as the result.

This means that you can not return a function as a final result of the sequence.

Here's an example when I try to get property selector with Ramda. Ramda works by carrying pattern and if we pass not enough arguments it returns another function, which will be immediately called by SequenceX runner without arguments and this process will last indefinitely.

```js
// Anti-pattern
import R from 'ramda'

// Will not work as expected
new Sequence(function () {
  return R.pick(['id'])
})
  .then(console.log)
// This script never stops its execution
// because Ramda.pick will always return a function
```

If you strongly need to return an executable value as the result there is a helper function called `fx.payload` which in a special way pushes the result upward without execution.

```js
import Sequence, { fx } from 'sequencex'
import R from 'ramda'

// Will not work as expected
new Sequence(function () {
  return fx.payload(R.pick(['id']))
})
  .then(console.log)
// function r(e){return 0===arguments.length||n(e)?r:t.apply(this,arguments)}
```

Or you can wrap your executable value into the array or an object to prevent its execution.

```js
new Sequence(() => {
  return [() => {}] // This function won't be executed, because
                    // it wrapped into the array
})
  .then(console.log)
// [function ()]
```

Async result
--

SequenceX is always asynchronious and returns a Promise, even if the initial function synchronious.

```js
new Sequence(function () {
  return 33;
}).then(console.log)
// 33
```

Creating standalone sequences
--

SequenceX allows you to wrap code with SequenceX  runner, thus obtaining a standalone asynchronous function.

```js
import Sequence from 'sequencex'

export default Sequence.create(function* (url) {
  const serverResponse = yield fetch(url);
  return serverResponse.json();
});
```

Which will allow you to execute sequences without any additional access to the SequenceX API. Also, such functions can take arguments.

````js
import fetchUrl from './sequences/fetchUrl'

fetchUrl('/entity/33')
  .then(console.log)
// { type: 'entity', id: 33 }
````

Or use from an another sequence.

````js
import Sequence from 'sequencex'
import fetchUrl from './sequences/fetchUrl'

new Sequence(function* () {
  const data = yield fetchUrl('/entity/33')
  console.log(data); // { type: 'entity', id: 33 }
});
````


Context
---

Every subsequence you can access context of the initial function. This means that you can manage the state and use API of your application from the sequence.

```js
const Sequence = require('sequencex')

Sequence.apply(process, function() {
  return function () {
    const cwd = this.cwd();
  }
});
```

Even if your nested sequence includes arrow-functions (which by nature can not access dynamic context), you can access context by returning normal functions.

Here is example how to get redux store state from some nested arrow-function.

```js
import { createStore } from 'redux'
import { apply } from 'sequencex'

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

Foundation stone of CSP pattern is a channels. Channel can accumulate and radiate values. SequenceX channel is not an object, but function, that returns promise with next value each time it called.

If channel is empty, then returned promise will be unresolved, until next value will be pushed to channel.

Sequence channels are not a part of fx collection and can be used separately of sequence flow.

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
Here is few examples of practicle usage of SequenceX channels.

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
import { createChannel } from 'sequencex'

new Sequence(function *() {
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

Author
--

Vladimir Kalmykov <vladimirmorulus@gmail.com>

License
--

MIT, 2018
