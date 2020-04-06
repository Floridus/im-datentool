import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import './App.css';

import Home from './components/Home/Home';
import World from './components/World/World';

function App () {
  /*const client = new ApolloClient({
    uri: 'https://48p1r2roz4.sse.codesandbox.io',
  });*/

  return (
    <>
      {/*<ApolloProvider client={client}>*/}
        <Router>
          <Navbar>
            <Navbar.Brand href="/">IM Datentool</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/world">Weltübersicht</Nav.Link>
                <Nav.Link href="/ocean">Ozeanübersicht</Nav.Link>
                <Nav.Link href="/alliances">Allianzen</Nav.Link>
                <Nav.Link href="/players">Spieler</Nav.Link>
                <Nav.Link href="/changes">Wechsel</Nav.Link>
              </Nav>
            </Navbar.Collapse>
            Welt 47
          </Navbar>
          <div className="root">
            <Switch>
              <Route path="/" exact><Home /></Route>
              <Route path="/world" exact><World /></Route>
            </Switch>
          </div>
          <Navbar fixed="bottom">
            <Navbar.Text>
              Made with <span className="heart">❤</span> in Austria by Floridus
            </Navbar.Text>
          </Navbar>
        </Router>
      {/*</ApolloProvider>*/}
    </>
  );
}

export default App;
