import React from 'react';
import ReactDOM from 'react-dom';

import Home from './components/home/Home';
import AddMovie from './components/addMovie/AddMovie';
import Detail from './components/detail/Detail';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';

import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import MovieShow from './components/admin/MovieShow';
import MovieList from './components/admin/MovieList';
import MovieCreate from './components/admin/MovieCreate';
import MovieEdit from './components/admin/MovieEdit';
import UserList from './components/admin/UserList';
import UserCreate from './components/admin/UserCreate';
import UserEdit from './components/admin/UserEdit';
import ReviewList from './components/admin/ReviewList';
import ReviewEdit from './components/admin/ReviewEdit';
import ReviewShow from './components/admin/ReviewShow';

import PublicRoute from './components/utils/router/PublicRoute';
import AdminRoute from './components/utils/router/AdminRoute';

import './app.css';

import { BrowserRouter as Router, Switch } from 'react-router-dom';

// const URL = "http://127.0.0.1:8000";
const URL = "https://itss-movie-review.herokuapp.com";

export default function App() {
  const user = JSON.parse(localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;

  return (
    <>
      <Router>
        <Switch>
          <PublicRoute path='/' exact component={Home} />
          <PublicRoute path='/add-movie' component={AddMovie} />
          <PublicRoute path='/movie/:id' component={Detail} />
          <PublicRoute path='/sign-up' component={SignUp} />
          <PublicRoute path='/login' component={Login} />
          <PublicRoute path='/profile' component={Profile} />
          
          {user ? (
            <Admin dataProvider={restProvider(`${URL}/api`)}>
              <PublicRoute path='/' exact component={Home} />
              <Resource
                name='movies'
                show={MovieShow}
                list={MovieList}
                create={MovieCreate}
                edit={MovieEdit}
              />
              <Resource
                name='users'
                list={UserList}
                create={UserCreate}
                edit={UserEdit}
              />
              <Resource
                name='reviews'
                list={ReviewList}
                show={ReviewShow}
                edit={ReviewEdit}
              />
            </Admin>
          ) : <PublicRoute path='/admin' exact component={Home} />
          }
        </Switch>
      </Router>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
