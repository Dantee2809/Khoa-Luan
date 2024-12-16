import React, { useEffect } from "react";
import "./Post.css";

const FacebookShareButton = ({ postId, className }) => {
  const postUrl = `https://b432-117-2-254-194.ngrok-free.app/post/${postId}`;

  // // Khởi tạo lại Facebook SDK nếu cần
  // useEffect(() => {
  //   if (!window.FB) {
  //     window.fbAsyncInit = function () {
  //       window.FB.init({
  //         appId: `${postUrl}`, // Thay 'your-app-id' bằng appId của bạn
  //         autoLogAppEvents: true,
  //         xfbml: true,
  //         version: "v16.0",
  //       });
  //     };
  //     const script = document.createElement("script");
  //     script.src = "https://connect.facebook.net/en_US/sdk.js";
  //     script.async = true;
  //     script.defer = true;
  //     document.body.appendChild(script);
  //   } else {
  //     window.FB.XFBML.parse();
  //   }
  // }, []);

  const handleShare = () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`;
    window.open(fbShareUrl, "_blank");
  };

  return (
    <div>
      <button onClick={handleShare} className="custom-share-button">
        Chia sẻ trên Facebook
      </button>
    </div>
  );
};

export default FacebookShareButton;
