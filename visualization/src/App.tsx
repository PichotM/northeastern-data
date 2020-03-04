import React, { Suspense } from 'react';
import './App.css';
import { HashRouter, Switch, Route } from 'react-router-dom';
import routes from './const/routes';

const App: React.FC = () => {
  const loading = () => <div>Loading...</div>

  return (
    <div>
      <Suspense fallback={loading()}>
        <HashRouter basename='/phone'>
          <Switch>
            {routes.map((route, idx) => {
              return route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  render={(props: any) => (
                    <route.component {...props} />
                  )} />
              ) : (null);
            })}
          </Switch>
        </HashRouter>
      </Suspense>
    </div>
  )
}

export default App;
