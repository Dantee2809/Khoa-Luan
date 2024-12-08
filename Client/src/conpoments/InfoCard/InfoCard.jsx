import React, { useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut } from "lucide-react";

const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const { authUser } = useAuthStore((state) => state);
  const { logout } = useAuthStore();

  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4 style={{ fontSize: "20px", fontWeight: "700" }}>
          Thông tin cá nhân
        </h4>
        <div>
          <UilPen
            width="2rem"
            height="1.2rem"
            onClick={() => setModalOpened(true)}
          />
          <ProfileModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
            userData={authUser} // Truyền authUser mới nhất vào
          />
        </div>
      </div>
      <div className="info">
        <span>
          <b>Email: </b>
        </span>
        <span>{authUser.email}</span>
      </div>

      <div className="info">
        <span>
          <b>Tên người dùng: </b>
        </span>
        <span>
          {authUser.firstname} {authUser.lastname}
        </span>
      </div>
    </div>
  );
};
export default InfoCard;
