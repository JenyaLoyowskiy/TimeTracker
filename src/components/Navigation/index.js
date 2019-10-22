import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth user={authUser}/> : ''
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = (user) => (
  <ul className={'navigationBar'}>
    <li>
      <Link user={user} to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link  to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

export default Navigation;
