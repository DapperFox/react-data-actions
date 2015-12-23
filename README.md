[![Build Status](https://travis-ci.org/nuvi/react-data-actions.svg)](https://travis-ci.org/nuvi/react-data-actions)
# React Data Actions

## What

React Data Actions is a tool for helping you get remote data to your components. No more componentDidMount requests. No more setting state.

Out of the box support for show, index, delete, update, and invalidation calls.

## Why

This helped us remove about 40% of code for certain top-level views. It also prevented multiple requests for data, like if you sidebar needs the list of something and the view itself does too.

## How

##### Install
```
npm i react-data-actions
```

##### Setup your DataProvider to give out the DataManager at the application top level
DataManager manages the state of the application. You need to create an instance of this or maybe two if you don't want shared data between applications in the same browser.

DataProvider receives the DataManager and providers it to all the views that need it, so those "ConnectedComponents" know where to get their state from.

```application.js
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
``` authorsActions.js
import { dataActionsGenerator } from 'react-data-actions';

export default dataActionsGenerator({
  path: 'authors'
});
```

##### Create an Connected Component
So we have these "authorsActions" we created above. Basically its a generator that can helps us do RESTful calls to that path

```AuthorsList.js

import authorsActions from 'authorsActions';
import React from 'react';
import { connect } from 'react-data-actions';

class AuthorsList extends React.Component {
  static connectedActions (props) {
    return {
      authors: authorsActions.indexAction(), // key is authors, so will be access this.props.authors
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

***Most important thing is that connect at the bottom, it will wrap your React.Component and will read the connectedActions call (passing in the props received) and will give the state this Component.***

