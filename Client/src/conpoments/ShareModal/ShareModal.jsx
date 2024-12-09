import { Modal, useMantineTheme } from "@mantine/core";
import PostShare from "../PostShare/PostShare";

function ShareModal({ modalOpened, setModalOpened }) {
  const theme = useMantineTheme();

  // Callback khi tạo bài thành công
  const handlePostCreateSuccess = () => {
    setModalOpened(false); // Đóng modal khi tạo bài thành công
  };

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
      <PostShare onPostCreateSuccess={handlePostCreateSuccess} />
    </Modal>
  );
}

export default ShareModal;
