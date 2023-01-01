import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="not-found pt-5">
    <img
      src="https://stories.freepiklabs.com/storage/23279/404-error-page-not-found-with-people-connecting-a-plug-pana-2861.png"
      alt="not-found"
    />
    <Link to="/" className="link-home">
      <Button variant="contained" className="alert-links">
        Go Home
      </Button>
    </Link>
  </div>
);
