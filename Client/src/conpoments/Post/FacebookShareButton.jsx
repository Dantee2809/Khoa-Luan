import React, { useEffect } from "react";

const FacebookShareButton = ({ postId }) => {
  const postUrl = `http://localhost:3000/post/${postId}`;

  useEffect(() => {
    // Kiểm tra và khởi tạo lại Facebook SDK nếu đã tải
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div>
      {/* Facebook Share Button */}
      <div
        className="fb-share-button"
        data-href={postUrl}
        data-layout="button_count"
        data-size="large"
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
          className="fb-xfbml-parse-ignore"
        >
          Chia sẻ
        </a>
      </div>
    </div>
  );
};

export default FacebookShareButton;
