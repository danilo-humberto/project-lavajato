const TRACKING_CODE_PREFIX = "LAVA-";
const TRACKING_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TRACKING_CODE_LENGTH = 12;

function getRandomIndex(max: number) {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
}

export function generateTrackingCode(): string {
  let code = "";

  for (let index = 0; index < TRACKING_CODE_LENGTH; index += 1) {
    code += TRACKING_CODE_CHARACTERS[getRandomIndex(TRACKING_CODE_CHARACTERS.length)];
  }

  return `${TRACKING_CODE_PREFIX}${code}`;
}
