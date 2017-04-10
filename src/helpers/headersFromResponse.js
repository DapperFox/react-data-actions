function getHeadersFromEntries (responseHeaders) {
  const headerKeys = responseHeaders.keys();
  const headers = {};
  Array.from(headerKeys).forEach((key) => {
    const value = responseHeaders.getAll ? responseHeaders.getAll(key) : responseHeaders.get(key);
    if (value.count > 1) {
      headers[key] = value;
    } else {
      headers[key] = value[0];
    }
  });
  return headers;
}

export default function headersFromResponse (response) {
  const headers = {};
  if (response.headers.entries) {
    Object.assign(headers, getHeadersFromEntries(response.headers));
  } else if (response.headers.map) {
    const mapKeys = Object.keys(response.headers.map);
    mapKeys.forEach((i) => {
      const value = response.headers.map[i];
      if (value.length > 1) {
        headers[i] = value;
      } else {
        headers[i] = value[0];
      }
    });
  }
  return headers;
}
