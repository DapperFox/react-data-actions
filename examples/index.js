import React from 'react';
import ReactDOM from 'react-dom';

import { configureFetch, connect, DataProvider, DataManager, dataActionsGenerator } from '../src/';
configureFetch({
  headers: {
    'X-Daddy-warbucks': 'queen'
  }
});
const usersActions = dataActionsGenerator({
  path: 'examples/users',
  extension: 'json',
  waitFor: false,
});

class Inner extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    id: React.PropTypes.number.isRequired,
    deleteAction: React.PropTypes.func.isRequired,
    updateAction: React.PropTypes.func.isRequired,
  }

  static connectedActions (props) {
    return {
      user: usersActions.showAction({
        id: props.id,
      }),
      deleteAction: usersActions.deleteAction({
        waitFor:false,
        invalidate: true
      }),
      updateAction: usersActions.updateAction(),
    };
  }

  onDelete () {
    this.setState({error: false});
    this.props.deleteAction({ id: this.props.id }).catch(() => {
    });
  }

  onUpdate () {
    this.setState({error: false});
    this.props.updateAction({ id: this.props.id, name: 'jane' }).catch(() => {
      this.setState({error: true});
    });
  }

  render () {
    return (
      <div className="hey">
        <div>{ this.renderUser() }</div>
        { this.renderError() }
      </div>
    );
  }

  renderError () {
    if (this.state && this.state.error) {
      return <div>has error { this.state.errorMessage }</div>;
    }
  }

  renderUser () {
    if (this.props.user) {
      return <strong>{ this.props.user.data ? this.props.user.data.name : 'nuffin' }<button onClick={ ::this.onDelete }>Delete</button><button onClick={ ::this.onUpdate }>Update</button></strong>;
    }
  }

}
Inner = connect(Inner);

class Page extends React.Component {
  static propTypes = {
    users: React.PropTypes.object.isRequired,
  }

  static connectedActions () {
    return {
      users: usersActions.indexAction({
        where: {
          is_active: true,
        },
      }),
      addUser: usersActions.createAction({
        performRequest: false,
      }),
      invalidateAll: usersActions.invalidateAllAction(),
      invalidateShow: usersActions.invalidateShowAction(),
      invalidateIndex: usersActions.invalidateIndexAction({
        where: {
          is_active: true,
        },
      }),
      invalidateIndexNoWhere: usersActions.invalidateIndexAction({
      }),
    };
  }

  onAddClick () {
    const id = new Date().getTime();
    this.props.addUser({
      id: id,
      name: new Date().getTime() + ' other user',
    });
    this.setState({
      users: (this.state && this.state.users || []).concat([{id: id}]),
    });
  }

  onInvalidateAll () {
    this.props.invalidateAll();
  }

  
  onInvalidateShow () {
    this.props.invalidateShow({
      id: 1,
    });
  }

  
  onInvalidateIndex () {
    this.props.invalidateIndex({
    });
  }

  
  onInvalidateIndexNowhere () {
    this.props.invalidateIndexNoWhere({
    });
  }

  render () {
    return (
      <div>
        <h1>users:</h1>
        <ul>{ this.renderUsers() }</ul>
        <ul>{ this.renderOtherUsers() }</ul>
        <button onClick={ ::this.onAddClick }>ADD guy</button>
        <button onClick={ ::this.onInvalidateAll }>Invalidate All</button>
        <button onClick={ ::this.onInvalidateShow }>Invalidate Show</button>
        <button onClick={ ::this.onInvalidateIndex }>Invalidate index</button>
        <button onClick={ ::this.onInvalidateIndexNowhere }>Invalidate no where</button>
      </div>
    );
  }

  renderUsers () {
    if (this.props.users.data) {
      console.log(this.props.users);
      return this.props.users.data.map((user) => {
        return <li key={user.id}>{ user.name }<Inner id={ user.id } /></li>;
      });
    }
  }

  renderOtherUsers () {
    if (this.state && this.state.users) {
      return this.state.users.map((user) => {
        return <li key={user.id}>{ user.name }<Inner id={ user.id } /></li>;
      });
    }
  }
}
Page = connect(Page);

window.addEventListener('load', () => {
  ReactDOM.render((
    <DataProvider dataManager={ DataManager.getInstance() }>
      <div>
        <h2>Page</h2>
        <Page />
      </div>
    </DataProvider>
  ), document.getElementById('turd'));
});
