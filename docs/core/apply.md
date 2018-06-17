### `Sx.apply(task, [context], [args])`

Run sequence with specific context and arguments.

#### Arguments
1. `task` _(function|generator|promise)_: Sequence code
2. `context` _(object|function|null)_: Context
3. `args` _array_: Arguments

#### Returns
*(Promise)*: Resultative promise

#### Import

```js
// es6+
import { apply } from 'sequencex'
// node
const { apply } = require('sequencex')
// browser (WIP)
window.SequenceX.apply
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
