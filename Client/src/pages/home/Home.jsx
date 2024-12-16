import React from "react";
import "./Home.css";
import ProfileSide from "../../conpoments/ProfileSide/ProfileSide";
import PostSide from "../../conpoments/PostSide/PostSide";
import RightSide from "../../conpoments/RightSide/RightSide";
import Posts from "../../conpoments/Posts/Posts";

function Home() {
  return (
    <div className="Home">
      <ProfileSide className="ProfileSide" />
      <Posts className="Posts" />
      <RightSide className="RightSide" />
    </div>
  );
}

export default Home;
