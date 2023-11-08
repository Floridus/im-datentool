import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import WorldChanger from '../WorldChanger/WorldChanger';

import './Header.scss';

const Header = () => {
  return (
    <Navbar expand="lg" className="header-area">
      <Navbar.Brand href="/">IM Datentool</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link href="/world">Weltübersicht</Nav.Link>
          <Nav.Link href="/ocean">Ozeanübersicht</Nav.Link>
          <Nav.Link href="/total-view">Gesamtansicht</Nav.Link>
          <Nav.Link href="/alliances">Allianzen</Nav.Link>
          <Nav.Link href="/players">Spieler</Nav.Link>
          <Nav.Link href="/changes">Wechsel</Nav.Link>
          <Nav.Link href="/battle-calculator">Kampfrechner</Nav.Link>
          <WorldChanger />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
