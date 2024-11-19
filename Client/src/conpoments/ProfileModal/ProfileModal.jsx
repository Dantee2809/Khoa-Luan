import { Modal, useMantineTheme } from "@mantine/core";
import "./ProfileModal.css"
function ProfileModal({ modalOpened, setModalOpened }) {
  const theme = useMantineTheme();

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="infoForm">
        <h3>Thông tin cá nhân</h3>

        <div>
          <input
            type="text"
            className="infoInput"
            name="Họ"
            placeholder="Họ"
          />
          <input
            type="text"
            className="infoInput"
            name="Tên"
            placeholder="Tên"
          />
        </div>

        <div>
          <input
            type="text"
            className="infoInput"
            name="Nơi làm việc"
            placeholder="Nơi làm việc"
          />
        </div>

        <div>
          <input
            type="text"
            className="infoInput"
            name="Địa chỉ"
            placeholder="Địa chỉ"
          />

          <input
            type="text"
            className="infoInput"
            name="Thành Phố/ Tỉnh"
            placeholder="Thành Phố/ Tỉnh"
          />
        </div>
        <div>
            Chọn ảnh bìa:
            <input type="file" name='profileImg'/>
            Chọn ảnh đại diện:
            <input type="file" name="coverImg" />
        </div>

        <button className="button infoButton ">Cập nhật</button>
      </form>
    </Modal>
  );
}

export default ProfileModal;