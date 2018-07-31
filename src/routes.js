import React from 'react';
import {Router, Route, IndexRoute,
  IndexRedirect, Redirect, useRouterHistory} from 'react-router';
import {createHashHistory} from 'history';

import App from './components/app';
import Home from './components/home';
import Gallery from './components/gallery';
import Page from './components/page';
import Profile from './components/Profile';
import About from './components/About';
import Tutorials from './components/tutorials';
import soon from './components/soon';



import {examplePages, docPages} from '../contents/pages';

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

const getDefaultPath = pages => {
  const path = [];
  let page;
  while (pages) {
    page = pages[0];
    pages = page.children;
    path.push(page.path);
  }
  return path.join('/');
};

const renderRoute = (page, i) => {
  const {children, path, content} = page;
  if (!children) {
    return (<Route key={i} path={path} component={Page} content={content} />);
  }

  return (
    <Route key={i} path={path} >
      <IndexRedirect to={getDefaultPath(children)} />
      {children.map(renderRoute)}
    </Route>
  );
};

const renderRouteGroup = (path, pages) => {
  const defaultPage = getDefaultPath(pages);
  return (
    <Route path={path} component={Gallery} pages={pages}>
      <IndexRedirect to={defaultPage} />
      {pages.map(renderRoute)}
      <Redirect from="*" to={defaultPage} />
    </Route>
  );
};

// eslint-disable-next-line react/display-name
export default () => (
  <Router history={appHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/Profile" component={Profile}>
      <IndexRoute component={Profile} />
      </Route>
      <Route path="/About" component={About}>
      <IndexRoute component={About} />
      </Route>
       <Route path="/Tutorials" component={Tutorials}>
      <IndexRoute component={Tutorials} />
      </Route>
       <Route path="/soon" component={soon}>
      <IndexRoute component={soon} />
      </Route>
      

      {renderRouteGroup('examples', examplePages)}
      {renderRouteGroup('documentation', docPages)}
      <Redirect from="*" to="/" /> 

    </Route>
 
  </Router>
);
