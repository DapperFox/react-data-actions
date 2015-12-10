export default function createInitialFetchState (currentState = {}) {
  return Object.assign({}, {
    data: currentState.data,
    fetchDate: new Date(),
    hasError: false,
    isFetching: true,
    status: -1,
    headers: undefined,
  });
}
