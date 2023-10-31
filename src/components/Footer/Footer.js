import React from 'react';

import './Footer.scss';

const Footer = () => {
  return (
    <div className="footer-area">
      <a href="https://www.insel-monarchie.de/" target="_blank" rel="noreferrer">Insel-Monarchie</a>
      <span className="mx-2">||</span>
      <a href="https://forum.insel-monarchie.de/" target="_blank" rel="noreferrer">Forum</a>
      <span className="mx-2">||</span>
      Made with <span className="heart">❤</span> in Austria by Floridus
    </div>
  );
};

export default Footer;
