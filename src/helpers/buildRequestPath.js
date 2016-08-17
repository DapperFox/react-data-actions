export default function buildRequestPath (options, modelId) {
  let urlPath = options.path || options.url;
  let modelIdUsed = false;
  const idAttribute = options.idAttribute || 'id';
  urlPath = urlPath.replace(/:([a-zA-Z_]+)/g, (uncleanMatch) => {
    const match = uncleanMatch.substr(1);
    let found = options[match];
    if (found === undefined && (match === 'id' || match === idAttribute)) {
      found = modelId || options[idAttribute] || options.id;
      modelIdUsed = true;
    }
    if (found === undefined) {
      throw new Error(`url route regex failed to find match for ${match}`);
    }
    return found;
  });

  if (modelId !== undefined && !modelIdUsed) {
    urlPath = `${urlPath}/${modelId}`;
  }

  if (options.extension && urlPath.substr(urlPath.length - options.extension.length - 1) !== `.${options.extension}`) {
    urlPath = `${urlPath}.${options.extension}`;
  }
  return urlPath;
}
