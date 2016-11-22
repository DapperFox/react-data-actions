export default function headersFromResponse (response) {
  const headers = {};
  if (response.headers.entries) {
    const headerKeys = response.headers.keys();
    Array.from(headerKeys).forEach((key) => {
      const value = response.headers.getAll(key);
      if (value.count > 1) {
        headers[key] = value;
      } else {
        headers[key] = value[0];
      }
    });
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
