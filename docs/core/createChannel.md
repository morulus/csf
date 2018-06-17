### `Sx.createChannel()`

Create new channel

#### Returns
*(function)*: Channel

#### Import

```js
// es6+
import { createChannel } from 'sequencex'
// node
const { createChannel } = require('sequencex')
// browser (WIP)
window.SequenceX.createChannel
```

#### Example
```js
const letters = createChannel();

letters.push('A')
letters.push('B')
letters.push('C')

letters.count(); // 3

new Sequence(function *() {
  while (true) {
    const letter = yield letters;
    console.log(`Next letter is ${letter}`)
  }
})
// Next letter is A
// Next letter is B
// Next letter is C
```
