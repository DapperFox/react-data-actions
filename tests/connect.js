/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import expect from 'expect';
import connect from '../src/connect';
import React from 'react';
import DataManager from '../src/DataManager';
import DataProvider from '../src/DataProvider';
import ReactTestUtils from 'react-addons-test-utils';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';

describe('connect', function () {
  beforeEach(function () {
    this.dataManager = new DataManager();
    this.baseComponent = class Base extends React.Component {
      static connectedActions () {
        return {};
      }

      render () {
        return <div className="base">base</div>;
      }
    };
  });
  it('it should set displayName from component name', function () {
    const connected = connect(this.baseComponent);
    expect(connected.displayName).toEqual('connect(Base)');
  });
  it('it should throw exception without dataManager', function () {
    const Connected = connect(this.baseComponent);
    let err;
    try {
      const component = ReactTestUtils.renderIntoDocument(<Connected />);
    } catch (e) {
      err = e;
    }
    expect(err).toExist();
  });
  it('it should render component', function () {
    const Connected = connect(this.baseComponent);
    const component = ReactDOMServer.renderToStaticMarkup(
      <DataProvider dataManager={ this.dataManager }>
        <Connected />
      </DataProvider>
    );
    expect(component).toEqual('<div class="base">base</div>');
  });

  it('it should pass props into connectedActions', function (done) {
    this.baseComponent.connectedActions = function (props) {
      expect(props.test).toEqual('one');
      done();
    };
    const Connected = connect(this.baseComponent);
    const component = ReactDOMServer.renderToStaticMarkup(
      <DataProvider dataManager={ this.dataManager }>
        <Connected test="one" />
      </DataProvider>
    );
  });

  it('it should run connectedActions functions passing in dataManager instance', function (done) {
    this.baseComponent.connectedActions = (props) => {
      return {
        test: (dm) => {
          expect(dm).toEqual(this.dataManager);
          done();
        },
      };
    };
    const Connected = connect(this.baseComponent);
    const component = ReactDOMServer.renderToStaticMarkup(
      <DataProvider dataManager={ this.dataManager }>
        <Connected test="one" />
      </DataProvider>
    );
  });

  it('it should set prop name in connected component to same name connectedAction key function result', function () {
    class TestComponent extends React.Component {
      static connectedActions (props) {
        return {
          myPropName: function (dm) {
            return 'hello';
          },
        };
      }

      render () {
        return <div className={ this.props.test }>{ this.props.myPropName }</div>;
      }
    }
    const ConnectedTestComponent = connect(TestComponent);
    const component = ReactDOMServer.renderToStaticMarkup(
      <DataProvider dataManager={ this.dataManager }>
        <ConnectedTestComponent test="one" />
      </DataProvider>
    );
    expect(component).toEqual('<div class="one">hello</div>');
  });
});
