SequenceX Api Reference
==

General
--

## Core API

- [`Sequence`](./core/sequence.md)
- [`apply`](./core/apply.md)
- [`create`](./core/create.md)
- [`createChild`](./core/createChild.md)
- [`createChannel`](./core/createChannel.md)

## Fx

- [`spawn`](./fx/spawn.md)

`fx` is a group of special helpers, which can be used to control sequence flow and do some operations with sequence context.

**The most part of `fx` API is used with the `yield` statement**.

Fx
--


```js
import { fx } from 'sequencex'
```

### fx.spawn

Spawn blocking sequence with child context.

```
function fork(task, context, args): any
```

#### Import

##### es6

```js
import { fx } from 'sequencex'

const {
  spawn
} = fx;
```

##### node

```js
const { fx } = require('sequencex');

const {
  spawn
} = fx;
```

##### browser

```js
SequenceX.fx.spawn
```

#### Arguments

- **`task`** _(function|generator|promise)_ Sequence code
- **`context`** _(object|function*|null)_ Context
- **`args`** _array<any>_ Arguments


### fx.fork

Create sub-sequence, which detached from main sequence flow.

```
function fork(task, context, args): promise
```

#### Import

##### es6

```js
import { fx } from 'sequencex'

const {
  fork
} = fx;
```

##### node

```js
const { fx } = require('sequencex');

const {
  fork
} = fx;
```

##### browser

```js
SequenceX.fx.fork
```

#### Arguments

- **`task`** _(function|generator|promise)_ Sequence code
- **`context`** _(object|function*|null)_ Context
- **`args`** _array<any>_ Arguments

### fx.getContext

Get sequence context

```
function getContext(): context
```

#### Import

##### es6

```js
import { fx } from 'sequencex'

const {
  getContext
} = fx;
```

##### node

```js
const { fx } = require('sequencex');

const {
  getContext
} = fx;
```

##### browser

```js
SequenceX.fx.getContext
```

#### Arguments

_No arguments_

### fx.payload

Helps to return executable value as payload (prevent execution of function, generators and promises)

```
function payload(value): (function|generator|promise)
```

#### Import

##### es6

```js
import { fx } from 'sequencex'

const {
  payload
} = fx;
```

##### node

```js
const { fx } = require('sequencex');

const {
  payload
} = fx;
```

##### browser

```js
SequenceX.fx.payload
```

#### Arguments

- **`value`** (function|generator|promise)

### fx.cancel

Cancel child sequence or channel

```
function cancel(sequence): undefined
```

#### Import

##### es6

```js
import { fx } from 'sequencex'

const {
  cancel
} = fx;
```

##### node

```js
const { fx } = require('sequencex');

const {
  cancel
} = fx;
```

##### browser

```js
SequenceX.fx.cancel
```

#### Arguments

- **`value`** (function|generator|promise)

### fx.createChildContext

Create new object, inherited from current context and extended with specified properties.

You may need it to manually create custom child sequence.

```
function createChildContext(properties): object
```

#### Import

##### es6

```js
import { fx } from 'sequencex'

const {
  createChildContext
} = fx;
```

##### node

```js
const { fx } = require('sequencex');

const {
  createChildContext
} = fx;
```

##### browser

```js
SequenceX.fx.createChildContext
```

#### Arguments

- **`properties`** (object) Default properties of new context
