SequenceX Api Reference
==

General
--

General API should be used outside the sequence.

### Sequence

Promise-like class. Run sequence and provide api to handle result.

`class Sequence(task): promise`

#### Import

##### Es6
```js
import Sequence from 'sequencex'
```

##### Node

```js
const Sequence = require('sequencex')
```

##### Brower

```js
SequenceX
```

#### Arguments

- **`task`** _(function|generator|promise)_ Sequence code

### Apply

Run sequence with specific context and arguments. Return promise.

`function apply(task, context, args): promise`

#### Import

##### es6

```js
import { apply } from 'sequencex'
```

##### node

```js
const { apply } = require('sequencex');
```

##### browser

```js
SequenceX.apply
```

#### Arguments

- **`task`** _(function|generator|promise)_ Sequence code
- **`context`** _(object|function|null)_ Context
- **`args`** _array<any>_ Arguments

### Create


Create sequence with optional context, which can be used standalone.

```
function create(task, context, args) : function
```

#### Import

##### es6

```js
import { create } from 'sequencex'
```

##### node

```js
const { create } = require('sequencex');
```

##### browser

```js
SequenceX.create
```

#### Arguments

- **`task`** _(function|generator|promise)_ Sequence code
- **`context`** _(object|function|null)_ Context
- **`args`** _array<any>_ Arguments

### Create child

Create sequence with optional child context

```
function createChild(task, context, args) : function
```

#### Import

##### es6

```js
import { createChild } from 'sequencex'
```

##### node

```js
const { createChild } = require('sequencex');
```

##### browser

```js
SequenceX.createChild
```

#### Arguments

- **`task`** _(function|generator|promise)_ Sequence code
- **`context`** _(object|function*|null)_ Context
- **`args`** _array<any>_ Arguments

`*` Argument `context` can be a function, which will be called with current context and must return next context properties.

### createChannel

Create new channel

`function createChannel(): channel`

#### Import

##### Es6
```js
import { createChannel } from 'sequencex'
```

##### Node

```js
const { createChannel } = require('sequencex')
```

##### Brower

```js
SequenceX.createChannel
```

#### Arguments

_No arguments_

Fx
--

`fx` is a group of special helpers, which can be used to control sequence flow and do some operations with sequence context.

**The most part of `fx` API is used with the `yield` statement**.

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
