### `apply(task, [context], [args])`

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
import { apply } from 'csf'
// node
const { apply } = require('csf')
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
