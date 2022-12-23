import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="not-found">
    <img
      src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
      alt="not-found"
    />
    <Link to="/" className="link-home">
      <Button>Go Home</Button>
    </Link>
  </div>
);
