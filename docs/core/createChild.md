### `Sx.createChild(task, [context], [args])`

Create sequence with dynamic child context and arguments.

#### Arguments
1. `task` _(function|generator|promise)_: Sequence code
2. `contextProperties` _(object|function*|null)_: Context propeties or context properties factory
3. `args` _(array|function)_: Arguments/arguments factory

`*` Argument `context` can be a function, which will be called with current context and must return next context properties. If you wish specify context as a function, you should pass its factory, like this `() => () => {}`

#### Returns
*(Promise)*: sequence

#### Import

```js
// es6+
import { createChild } from 'sequencex'
// node
const { createChild } = require('sequencex')
// browser (WIP)
window.SequenceX.createChild
```

#### Example
```js
apply(function () {
  // ...sequential operations here
}, process, ['arg1', 'arg2'])
  .then(result => {
    // ...handle result
  })
  .catch(error => {
    // ...handler error
  })
```
