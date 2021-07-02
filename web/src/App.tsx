import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import Landing from './components/landing/landing.component';
import Users from './components/users/users';
import Signup from './pages/signup/signup.component';
import LogIn from './pages/login/login.component';
import IsAuthenticated from './components/isAuthenticated/isAuthenticated';
import Profile from './pages/profile/profile.component';

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });
const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = authLink.concat(httpLink as any);
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Landing />
          </Route>
          <Route path='/landing'>
            <Landing />
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/login'>
            <LogIn />
          </Route>
          <IsAuthenticated>
            <Route exact path='/users'>
              <Users />
            </Route>
            <Route exact path='/profile'>
              <Profile />
            </Route>
          </IsAuthenticated>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
