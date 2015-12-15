import _ from 'lodash';
export default function headersFromResponse (response) {
  const headers = {};
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
  return headers;
}
