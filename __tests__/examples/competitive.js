import Sequence, { fx, createChannel } from '../../src'
import EventEmitter from 'events'

const MOCK_URL = 'api/click';

describe('', () => {
  it('', () => {
    const mockee = new EventEmitter();
    let expectData = 32;
    const fetch = jest.fn((url, data) => {
      return (data) => {
        expects(url).toBe(MOCK_URL);
        expects(data).toBe(++expectData)
      }
    })
    return new Sequence(function *() {
      // Create two channels
      const clicks = createChannel();
      const requests = createChannel();

      // Add every click event to channel `clicks`
      mockee.on('click', clicks.push)
      mockee.on('done', clicks.done)

      const observer = yield fx.fork(function *() {
        let click;
        // Handle each next event through a while loop
        while (click = yield clicks) {
          // Await superfluous requests
          while (requests.count() >= 6) {
            yield requests;
          }

          // Create http request and push response
          // to channel `responses`
          requests.push(fetch(MOCK_URL, click))
        }
      });

      mockee.emit('click', 33);
      mockee.emit('click', 34);
      mockee.emit('click', 35);
      mockee.emit('click', 36);
      mockee.emit('done');

      return observer;
    })
  })
});
