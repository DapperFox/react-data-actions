export default function shallowCompareProps (props = {}, otherProps = {}) {
  let n;
  for (n in props) {
    if (!otherProps.hasOwnProperty(n) || otherProps[n] !== props[n]) {
      return false;
    }
  }
  for (n in otherProps) {
    if (!props.hasOwnProperty(n) || otherProps[n] !== props[n]) {
      return false;
    }
  }
  return true;
}
