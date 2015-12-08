const requestConfiguration = {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

function getFetchConfiguration () {
  return requestConfiguration;
}
export default function configureFetch (o) {
  const headers = requestConfiguration.headers || {};
  Object.assign(requestConfiguration, o);
  requestConfiguration.headers = Object.assign(headers, requestConfiguration.headers || {});
}
export { getFetchConfiguration };
