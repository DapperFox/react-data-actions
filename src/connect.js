import React from 'react';
import _ from 'lodash';

function connect (WrappedComponent) {
  class ConnectedComponent extends React.Component {

    constructor (props, context) {
      super(props, context);
      this.isUpdating = false;
      this.setupData(props);
    }

    componentDidMount () {
      this.subscriber = this.onProviderDispatch.bind(this);
      this.context.dataManager.subscribe(this.subscriber);
      this.setupData();
    }

    componentWillReceiveProps (nextProps) {
      this.isUpdating = true;
      this.setupData(nextProps);
      this.isUpdating = false;
    }

    componentWillUnmount () {
      // unsubscribe.
      this.context.dataManager.unsubscribe(this.subscriber);
      delete this.subscriber;
    }

    onProviderDispatch () {
      if (this.subscriber && !this.isUpdating) {
        this.setupData();
      }
    }

    setupData (nextProps) {
      this.updateDataRequirements(nextProps);
      const newState = Object.assign({}, this.getConnectedData());
      // todo replace with a shallow comparison
      if (!_.isEqual(newState, this.state)) {
        if (!this.state) {
          this.state = newState;
        } else {
          this.setState(newState);
        }
      }
    }

    getConnectedData () {
      const newState = {};
      for (const i in this.connectedActions) {
        if (this.connectedActions.hasOwnProperty(i)) {
          const connectedAction = this.connectedActions[i];
          newState[i] = connectedAction(this.context.dataManager);
        }
      }
      return newState;
    }


    getConnectedActions (nextProps) {
      const connectedActions = WrappedComponent.connectedActions;
      if (connectedActions) {
        if (typeof connectedActions === 'function') {
          return connectedActions.call(undefined, Object.assign({}, this.props, nextProps || {}));
        } else {
          return connectedActions;
        }
      }
      return undefined;
    }

    render () {
      return <WrappedComponent ref="connectedComponent" { ...this.props } { ...this.state } />;
    }

    updateDataRequirements (nextProps) {
      const newMapping = this.getConnectedActions(nextProps);
      if (!_.isEqual(this.connectedActions, newMapping)) {
        this.connectedActions = newMapping;
        return true;
      }
      return false;
    }
  }
  ConnectedComponent.displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name})`;
  ConnectedComponent.contextTypes = {
    dataManager: React.PropTypes.object.isRequired,
  };
  return ConnectedComponent;
}

export default connect;
