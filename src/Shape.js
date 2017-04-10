import { PropTypes } from 'react';

export default PropTypes.shape({
  data: PropTypes.any,
  isFetching: PropTypes.bool,
  hasError: PropTypes.bool,
  fetchDate: PropTypes.instanceOf([Date]),
  status: PropTypes.number,
  statusText: PropTypes.string,
  headers: PropTypes.object,
});
