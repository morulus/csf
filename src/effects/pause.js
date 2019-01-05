/* Peform pause in async flow */
export default function pause(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}
