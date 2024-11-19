import React, { useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";


const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4>Thông tin cá nhân</h4>
        <div>
          <UilPen
            width="2rem"
            height="1.2rem"
            onClick={() => setModalOpened(true)}
          />
          <ProfileModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
          />
        </div>
      </div>
      <div className="info">
        <span>
          <b>Địa chỉ: </b>
        </span>
        <span>Ngõ 34 Hòa Hải, Đà Nẵng</span>
      </div>

      <div className="info">
        <span>
          <b>Nơi làm việc: </b>
        </span>
        <span>Facebook</span>
      </div>

      <button className="button logout-button">Đăng Xuất</button>
    </div>
  );
};

export default InfoCard;