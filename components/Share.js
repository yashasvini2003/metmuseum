import React from "react";
import {
  FacebookShareButton,
  EmailShareButton,
  FacebookIcon,
  EmailIcon,
} from "react-share";

const Share = ({ url }) => {
  return (
    <>
      <strong style={{ marginLeft: "1rem" }}>Share: </strong>
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
      {"  "}
      <EmailShareButton url={url}>
        <EmailIcon size={32} round={true} />
      </EmailShareButton>
    </>
  );
};

export default Share;
