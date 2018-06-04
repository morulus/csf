import {
  CANCEL
} from "../constants";

/* Cancel current task (it can a promise, or generator flow)*/
export default function cancel(task, final) {
  return function() {
    if (typeof task[CANCEL] === "function") {
      task[CANCEL](final);
    } else {
      throw new Error(`The task (${typeof task})cannot be cancelled`);
    }
  };
}
