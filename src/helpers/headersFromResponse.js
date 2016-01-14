import _ from 'lodash';
export default function headersFromResponse (response) {
  const headers = {};
  if (response.headers.entries) {
    for (const pair of response.headers.entries()) {
      const key = pair[0];
      const value = pair[1];
      if (headers[key]) {
        if (!_.isArray(headers[key])) {
          headers[key] = [headers[key]];
        }
        headers[key].push(value);
      } else {
        headers[key] = value;
      }
    }
  } else if (response.headers.map) {
    for (let i in response.headers.map) {
      if (response.headers.map.hasOwnProperty(i)) {
        const value = response.headers.map[i];
        if (value.length > 1) {
          headers[i] = value;
        } else {
          headers[i] = value[0];
        }
      }
    }
  }
  return headers;
}
