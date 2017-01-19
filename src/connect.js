import React from 'react';
import _ from 'lodash';
import { shallowCompareProps } from './helpers/';

export default function connect (WrappedComponent, actions = undefined) {
  const connectedActions = actions || WrappedComponent.connectedActions;
  const name = WrappedComponent.displayName || WrappedComponent.name || 'AnonymousComponent';
  if (connectedActions === undefined) {
    throw new Error(`connecting "${name}" failed.
The component is missing the property connectedActions
OR connect was not handed the connectedActions as a second parameter`);
  }
  class ConnectedComponent extends React.Component {

    constructor (props, context) {
      super(props, context);
      this.isUpdating = false;
      this.setupData(props);
    }

    componentDidMount () {
      this.subscriber = ::this.onProviderDispatch;
      this.context.dataManager.subscribe(this.subscriber);
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
        this.setupData(this.props);
      }
    }

    setupData (nextProps) {
      this.updateDataRequirements(nextProps);
      const newState = { ...this.getConnectedData() };
      if (!this.state || !shallowCompareProps(newState, this.state)) {
        if (!this.state) {
          this.state = newState;
        } else {
          this.setState(newState);
        }
      }
    }

    getConnectedData () {
      const newState = {};
      const keys = Object.keys(this.connectedActions);
      keys.forEach((key) => {
        const connectedAction = this.connectedActions[key];
        newState[key] = connectedAction(this.context.dataManager);
      });
      return newState;
    }

    getConnectedActions (nextProps) {
      if (typeof connectedActions === 'function') {
        return connectedActions.call(undefined, nextProps);
      }
      return connectedActions;
    }

    render () {
      /* eslint-disable react/jsx-filename-extension */
      return <WrappedComponent ref={(n) => { this.connectedComponent = n; }} {...this.props} {...this.state} />;
    }

    updateDataRequirements (nextProps) {
      const newMapping = this.getConnectedActions(nextProps);
      if (!_.isEqual(this.connectedActions, newMapping)) {
        this.connectedActions = newMapping;
      }
    }
  }
  ConnectedComponent.displayName = `connect(${name})`;
  ConnectedComponent.contextTypes = {
    dataManager: React.PropTypes.object.isRequired,
  };
  return ConnectedComponent;
}
