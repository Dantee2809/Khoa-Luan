import React from "react";
import ProfileLeft from "../../conpoments/ProfileLeft/ProfileLeft";
import ProfileCard from "../../conpoments/ProfileCard/ProfileCard";
import RightSide from "../../conpoments/RightSide/RightSide";
import "./Profile.css";
import PostSide from "../../conpoments/PostSide/PostSide";
import Posts from "../../conpoments/Posts/Posts";

const Profile = () => {
  return (
    <div className="Profile">
      <ProfileLeft />
      <div className="Profile-center">
        <ProfileCard />
        {/* <PostSide /> */}
        <Posts />
      </div>
      <RightSide />
    </div>
  );
};

export default Profile;
