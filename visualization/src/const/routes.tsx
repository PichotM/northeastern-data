import React from 'react';

const Home = React.lazy(() =>
    import  ('../pages/home/index'));

const routes = [
    { path: '/', exact: true, component: Home },
]

export default routes;