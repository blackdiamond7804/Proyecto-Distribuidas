import api from "../api/axios";

function UploadButton({
  roomId,
  nickname,
  onUploaded,
  temporaryTime,
}) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("roomId", roomId);
    formData.append(
      "isTemporary",
      temporaryTime > 0
    );
    formData.append(
      "destroyAfter",
      temporaryTime
    );
    formData.append("nickname", nickname);

    try {
      const response = await api.post(
        "/upload",
        formData
      );

      onUploaded(response.data.data);
    } catch (error) {
      alert(
        error.response?.data?.message
      );
    }
  };

  return (
    <label className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-4 md:px-5 py-3 rounded-xl cursor-pointer transition duration-200 hover:scale-105 hover:shadow-lg shadow-purple-900/50 whitespace-nowrap">
      📎 Archivo

      <input
        type="file"
        hidden
        onChange={handleUpload}
      />
    </label>
  );
}

export default UploadButton;