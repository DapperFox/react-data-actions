[![Build Status](https://travis-ci.org/inlineblock/react-data-actions.svg)](https://travis-ci.org/inlineblock/react-data-actions)
# React Data Actions

## What

React Data Actions is a tool for helping you get remote data to your components. No more componentDidMount requests. No more setting state.

Out of the box support for show, index, create, delete, update, and invalidation state calls.

It also has use for simple state storage for stuff that does not use a backend.

## Why

This helped us remove about 40% of code for certain top-level views. It also prevented multiple requests for data, like if you sidebar needs the list of something and the view itself does too.

## How

##### Install
```bash
$ npm i react-data-actions
```

##### Setup your DataProvider to give out the DataManager at the application top level
DataManager manages the state of the application. You need to create an instance of this or maybe two if you don't want shared data between applications in the same browser.

DataProvider receives the DataManager and providers it to all the views that need it, so those "ConnectedComponents" know where to get their state from.

```js
# application.js
const dataManager = new DataManager(); 
ReactDOM.render((
  <DataProvider dataManager={ dataManager }>
    <RouterOrView>
    ...
    </RouterOrView>
  </DataProvider>
), document.getElementById('turd'));
```


##### Create an action generator
Now that our components that we create can access it, lets define where some data is.

Let's make a list of all the Authors
```js
# authorsActions.js

import { restActionsGenerator } from 'react-data-actions';

export default restActionsGenerator({
  path: 'authors',
  idAttribute: 'id', // its defaulted to id
  maxAge: 60000 // milliseconds, defautls to a day
});
```

##### Create an Connected Component
So we have these "authorsActions" we created above. Basically its a generator that can helps us do RESTful calls to that path

```js
# AuthorsList.js

import authorsActions from 'authorsActions';
import React from 'react';
import { connect } from 'react-data-actions';

class AuthorsList extends React.Component {
  static connectedActions (props) {
    return {
      authors: authorsActions.indexAction({
        where: { // this will become query string stuff on an index, so /authors?is_active=1
          is_active: true
        }
      }), // key is authors, so will be access this.props.authors
    }
  }

  render () {
    if (this.props.authors.isFetching) {
      // show loader
    } else if (this.props.authors.hasError) {
      // show errors
    } else {
      const data = this.props.authors.data; // the result of the resposse
      return (
        <ul>
        ... loop through the data and render authors
        </ul>
      );
    }
  }
}

export default connect(AuthorsList);
```

***Most important thing is that connect at the bottom, it will wrap your React.Component and connect it with the DataPovider.***

##### So then what the magic?
So as the requests are happeing, your ConnectedComponent (like AuthorsList) will re-render itself every time it's state changes. So when the request kicks off, it will be rendered, when it succeeds or fails it will re-renders, when another view modifies the state, it will re-render.

##### Got any more magic?

You can do a default if you do an indexAction(), if the response is an array of models, data-actions-generator will cache every model by the idAttribute (which defaults to 'id') so if you do a showAction({ id: 3 }) and a previously completed indexAction has that ID, it wont do a request for it.


## More Examples

##### Create

```js
# CreateAuthorsForm.js

import authorsActions from 'authorsActions';
import React from 'react';
import { connect } from 'react-data-actions';

class CreateAuthorsForm extends React.Component {
  static propTypes = {
    createAuthor: React.PropTypes.func.isRequired,
    onComplete: React.PropTypes.func.isRequired,
  }
  
  static connectedActions (props) {
    return {
      createAuthor: authorsActions.createAction(),
    }
  }
  
  onSubmit (evt) {
    evt.preventDefault();
    const name = this.refs.name.value; // React 1.4 allows dom elements to not need ReactDOM.findDOMNode
    if (name) {
      this.createAuthorWithName(name);
    } else {
      this.setState({
        errorMessage: 'Authors name cannot be empty',
      });
    }
  }

  render () {
    return (
      <form onSubmit={ ::this.onSubmit }>
        { this.renderError() }
        <input name="name" ref="name" />
        <button type="submit">Create Author</button>
      </form>
    );
  }
  
  renderError () {
    if (this.state.errorMessage) {
      return <div className="error">{ this.state.errorMessage }</div>;
    }
  }
  
  createAuthorWithName (name) {
    this.props.createAuthor({
      name,
      timestamp: new Date().getTime(),
    }).then((model) => {
      if (this.props.onComplete) {
        this.props.onComplete(model);
      }
    }).catch((request) => {
      this.setState({
        errorMessage: `Request failed: ${request.status}`,
      });
    });
  }
}

export default connect(CreateAuthorsForm);
```




##### Update

This will cascade to any other view when its done updating.

```js
# UpdateAuthorForm.js

import authorsActions from 'authorsActions';
import React from 'react';
import { connect } from 'react-data-actions';

class UpdateAuthorForm extends React.Component {
  static propTypes = {
    author: React.PropTypes.object.isRequired, // the current other model
    updateAuthor: React.PropTypes.func.isRequired, // the connected action
    onComplete: React.PropTypes.func.isRequired, // the onComplete call back
  }
  
  static connectedActions (props) {
    return {
      updateAuthor: authorsActions.updateAction(),
    }
  }
  
  constructor (props, context) {
    super(props, context);
    this.state = {
      name: props.author.name, // i'm handed an author, so lets just use the name
    };
  }
  
  componentWillReceiveProps (props) {
    if (props.author) {
      this.setState({
        name: props.author.name, // i'm handed an author again
      });
    }
  }
  
  onChange (evt) {
    this.setState({
      name: this.refs.name.value,
    });
  }
  
  onSubmit (evt) {
    evt.preventDefault();
    if (this.state.name) {
      this.performUpdateRequest();
    } else {
      this.setState({
        errorMessage: 'Authors name cannot be empty',
      });
    }
  }

  render () {
    return (
      <form onSubmit={ ::this.onSubmit }>
        { this.renderError() }
        <input name="name" ref="authorsName" value={ this.state.name } />
        <button type="submit">Update Author</button>
      </form>
    );
  }
  
  renderError () {
    if (this.state.errorMessage) {
      return <div className="error">{ this.state.errorMessage }</div>;
    }
  }
  
  updateAuthorWithName () {
    // Since we pass in the entire object for this.props.author, it will read its id attribute and figure where to update it.
    this.props.updateAuthor(Object.assign({}, this.props.author, {
      name: this.state.name,
    }).then((model) => {
      if (this.props.onComplete) {
        this.props.onComplete(model);
      }
    }).catch((request) => {
      this.setState({
        errorMessage: `Request failed: ${request.status}`,
      });
    });
  }
}

export default connect(UpdateAuthorForm);
```

##### Invalidation

This example is an index invalidation. so assume its a force refresh.

```js
# AuthorsList.js

import authorsActions from 'authorsActions';
import React from 'react';
import { connect } from 'react-data-actions';

class AuthorsList extends React.Component {
  static connectedActions (props) {
    return {
      authors: authorsActions.indexAction({
        where: { // this will become query string stuff on an index, so /authors?is_active=1
          is_active: true
        }
      }),
      forceRefreshAuthors: authorsActions.invalidateIndexAction({
        where: { // we need our where clause to match the one above, if you want to do all index do invalidateAllAction or invalidateShowAction ... then pass it object you want invalidated or a stub with its idAttribute filled (e.g. {id: 3})
          is_active: true
        }
      }),
    }
  }
  
  onButtonClick (evt) {
    // Notice that this page still has a requirement for this data,
    // so once this invalidation is done, this view __WILL__ refetch the data.
    this.props.forceRefreshAuthors();
  }

  render () {
    if (this.props.authors.isFetching) {
      // show loader
      return <img src="spinner.gif" />
    } else if (this.props.authors.hasError) {
      // show errors
      return <div className="error">{ this.props.authors.errorMessage }</div>;
    } else {
      const data = this.props.authors.data; // the result of the resposse
      return (
        <ul>
          { this.renderAuthorsList(data) }
        </ul>
        <button onClick={ ::this.onButtonClick }>FORCE REFRESH ME</button>
      );
    }
  }
  
  renderList (data) {
    return data.map((author) => {
      return <div className="author">{ author.name }</div>;
    });
  }
}

export default connect(AuthorsList);
```


### Non-backend data

Use `actionsGenerator` for simple state stuff. Just don't forget if you are storing an object or array, to clone it or use something immutable.

```js
// dateRangeActions.js

import { actionsGenerator } from 'react-data-actions';

export default actionsGenerator({
  name: 'blob', // optional
  maxAge: 30000, // millisecond, optional, by default its forever
});

```

```js
// Page.js

import dateRangeActions from 'dateRangeActions';
import { connect } from 'react-data-actions';
import React from 'react';

class Page extends React.Component {

  static connectedActions () {
    return {
      setDateRange: dateRangeActions.setAction(),// this.props.setDateRange is a setter function
      dateRange: dateRangeActions.getAction(), // this.props.dateRange is the state value, not a getter
    }
  }

  render () {
    return <div>{ this.props.dateRange }</div>;
  }
}
export default connect(Page);
```
