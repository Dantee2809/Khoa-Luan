import React, { useEffect } from "react";
import "./Post.css";
import config from "../../lib/config";
const FacebookShareButton = ({ postId }) => {
  const handleShare = () => {
    const postUrl = `${config.baseUrl}/post/${postId}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`;
    window.open(fbShareUrl, "facebook-share-dialog", "width=800,height=600");
  };

  return (
    <button onClick={handleShare} className="fb-share-button">
      Chia sẻ
    </button>
  );
};

export default FacebookShareButton;
