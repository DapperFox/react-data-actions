import { getFetchConfiguration } from '../configureFetch';
export default function buildRequestPath (options, modelId) {
  let urlPath = options.path || options.url;
  const fetchConfiguration = getFetchConfiguration();
  // OPTIONS: baseName
  if (fetchConfiguration.baseName) {
    urlPath = `${fetchConfiguration.baseName}/${urlPath}`;
  }
  const idAttribute = options.idAttribute || 'id';
  urlPath = urlPath.replace(/:([a-zA-Z_]+)/g, (uncleanMatch) => {
    const match = uncleanMatch.substr(1);
    let found = options[match];
    if (match === 'id' || match === idAttribute) {
      found = options[idAttribute] || options.id;
    }
    if (found === undefined) {
      throw new Error(`url route regex failed to find match for ${match}`);
    }
    return found;
  });

  if (modelId !== undefined) {
    urlPath = `${urlPath}/${modelId}`;
  }

  if (options.extension) {
    urlPath = `${urlPath}.${options.extension}`;
  }
  return urlPath;
}
