import React from "react";
import ProfileLeft from "../../conpoments/ProfileLeft/ProfileLeft";
import ProfileCard from "../../conpoments/ProfileCard/ProfileCard";
import RightSide from "../../conpoments/RightSide/RightSide";
import "./Profile.css";
import PostSide from "../../conpoments/PostSide/PostSide";

const Profile = () => {
  return (
    <div className="Profile">
      {/* Cột bên trái */}
      <div className="Profile-left">
        <ProfileLeft />
      </div>

      {/* Phần giữa */}
      <div className="Profile-center">
        <ProfileCard />
        <PostSide />
      </div>

      {/* Cột bên phải */}
      <div className="Profile-right">
        <RightSide />
      </div>
    </div>
  );
};

export default Profile;
