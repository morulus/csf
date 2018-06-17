### `class Sequence(task)`

Run sequence.

#### Arguments
1. `[task]` *(Function|generator|promise)*: Sequence

#### Returns
*(Sequence)*: Promise-like instance.

#### Import

```js
// es6+
import Sequence from 'sequencex'
// node
const Sequence = require('sequencex')
// browser (WIP)
window.SequenceX
```

#### Example
```js
new Sequence(function () {
  // ...sequential operations here
})
  .then(result => {
    // ...handle result
  })
  .catch(error => {
    // ...handler error
  })
```
