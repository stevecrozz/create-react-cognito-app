import React from 'react';
import { observer, inject } from 'mobx-react';

const LoadingIndicator = inject('uiState')(observer(class LoadingIndicator extends React.Component {
  render() {
    let plainLoadingObject = this.props.uiState.loading.toJS();
    let loaderNames = Object.getOwnPropertyNames(plainLoadingObject);
    return <ul
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        display: this.props.uiState.loading.size > 0 ? "block" : "none"
      }}>
      {
        loaderNames.map(name => <li key={"LoadingIndicator." + name}>{plainLoadingObject[name]}</li>)
      }
    </ul>
  }
}))

export default LoadingIndicator;
