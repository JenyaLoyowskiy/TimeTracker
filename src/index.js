import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';

import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();


// import React, { Component } from "react";
// import ReactDOM from "react-dom";
// class App extends Component {
//     constructor() {
//         super();
//         this.state = { data: [] };
//     }
//
//     async componentDidMount() {
//         try {
//             const response = await fetch(`https://api.trello.com/1/boards/SrhQGIYA?cards=all`);
//             if (!response.ok) {
//                 throw Error(response.statusText);
//             }
//             const json = await response.json();
//             this.setState({ data: Array.from(json.cards) });
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     render() {
//         console.log(this.state.data);
//         return (
//             <div>
//                 <ul>
//
//                 </ul>
//             </div>
//         );
//     }
// }
// export default App;
// ReactDOM.render(<App />, document.getElementById("root"));