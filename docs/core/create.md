### `Sx.create(task, [context], [args])`

Create sequence with specific context and arguments.

#### Arguments
1. `task` _(function|generator|promise)_: Sequence code
2. `context` _(object|function|null)_: Context
3. `args` _(array|function)_: Arguments/arguments transformer

#### Returns
*(Promise)*: Result

#### Import

```js
// es6+
import { create } from 'sequencex'
// node
const { create } = require('sequencex')
// browser (WIP)
window.SequenceX.create
```

#### Example
```js
import fs from 'fs-extra'

const readJson = create(function (filename) {
  const cwd = this.cwd();
  try {
    yield fs.readJson(
      path.resolve(cwd, filename)
    )
  }
}, process)

readJson('./package.json')
  .then(result => {
    // ...handle result
  })
  .catch(error => {
    // ...handler error
  })
```
