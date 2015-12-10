import React from 'react';

class DataProvider extends React.Component {

  static propTypes = {
    dataManager: React.PropTypes.object.isRequired,
    children: React.PropTypes.node,
  }

  constructor (props, context) {
    super(props, context);
    this.dataManager = props.dataManager;
  }

  getChildContext () {
    return {
      dataManager: this.dataManager,
    };
  }

  render () {
    let children = this.props.children;
    if (typeof children === 'function') {
      children = children();
    }
    return React.Children.only(children);
  }
}

DataProvider.childContextTypes = {
  dataManager: React.PropTypes.object.isRequired,
};

export default DataProvider;
