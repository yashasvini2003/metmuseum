import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
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
      <TwitterShareButton url={url}>
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      {"  "}
      <EmailShareButton url={url}>
        <EmailIcon size={32} round={true} />
      </EmailShareButton>
    </>
  );
};

export default Share;
