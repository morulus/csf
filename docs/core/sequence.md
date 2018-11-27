### `class Sequence(task)`

Run sequence.

#### Arguments
1. `[task]` *(Function|generator|promise)*: Sequence

#### Returns
*(Sequence)*: Promise-like instance.

#### Import

```js
// es6+
import csf from 'csf'
// node
const csf = require('csf')
```

#### Example
```js
csf(function () {
  // ...sequential operations here
})
  .then(result => {
    // ...handle result
  })
  .catch(error => {
    // ...handler error
  })
```
