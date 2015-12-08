export default function isStateStale (state, options) {
  if (!state) {
    return true;
  }

  let maxAge = options.maxAge;
  if (maxAge === undefined) {
    // an hour
    maxAge = 3600000;
  } else if (maxAge === -1) {
    return false;
  }
  return state.fetchDate.getTime() < (new Date().getTime() - maxAge);
}
