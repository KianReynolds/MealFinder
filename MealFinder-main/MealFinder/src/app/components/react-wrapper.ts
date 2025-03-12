import React from 'react';
import ReactDOM from 'react-dom';

export const renderReactComponent = (Component: React.FC, container: HTMLElement) => {
  ReactDOM.render(React.createElement(Component), container);
};
