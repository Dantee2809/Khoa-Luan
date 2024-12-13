import React, { useEffect } from "react";
import "./Post.css";

const FacebookShareButton = ({ postId }) => {
  const postUrl = `https://localhost:3000/post/${postId}`;

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
    window.open(fbShareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div>
      <button onClick={handleShare} className="custom-share-button">
        Chia sẻ
      </button>
    </div>
  );
};

export default FacebookShareButton;
