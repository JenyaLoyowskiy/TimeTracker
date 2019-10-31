import React from 'react';
import Timer from '../Timer';
import Async, { useAsync } from "react-async";
import { withAuthorization } from '../Session';
import { AuthUserContext } from '../Session';
const HomePage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
                <Timer/>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
