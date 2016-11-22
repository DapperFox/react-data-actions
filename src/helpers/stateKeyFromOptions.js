import buildRequestPath from './buildRequestPath';

export default function stateKeyFromOptions (o) {
  return o.stateKey || buildRequestPath(o);
}
