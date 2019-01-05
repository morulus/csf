import {
  CHANNEL
} from "./constants";

export default function isChannel(smth) {
  return smth && typeof smth === "function" && smth[CHANNEL];
}
