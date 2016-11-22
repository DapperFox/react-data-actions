export default function shallowCompareProps (props = {}, otherProps = {}) {
  const propsKeys = Object.keys(props);
  if (propsKeys.find((key) => {
    return otherProps[key] !== props[key];
  }) !== undefined) {
    return false;
  }
  const otherPropsKeys = Object.keys(otherProps);
  if (otherPropsKeys.find((key) => {
    return otherProps[key] !== props[key];
  }) !== undefined) {
    return false;
  }
  return true;
}
