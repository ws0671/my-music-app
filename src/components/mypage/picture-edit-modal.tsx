import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import useSessionStore from "../../stores/session";
import { supabase } from "../../utils/supabaseClient";

type Props = {
  avatarPreview: string | null;
  setAvatarPreview: React.Dispatch<React.SetStateAction<string | null>>;
  avatarFile: File | null;
  setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPictureEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveAvatar: () => void | Promise<void>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function PictureEditModal({
  avatarPreview,
  setAvatarPreview,
  avatarFile,
  setAvatarFile,
  setPictureEditModal,
  handleSaveAvatar,
  handleAvatarChange,
}: Props) {
  const [closing, setClosing] = useState(false);
  const [bgClosing, setBgClosing] = useState(false);

  const session = useSessionStore((state) => state.session);
  const user = session?.user.user_metadata;

  const handleModal = () => {
    setClosing(true);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSaveAvatar(avatarFile);
    handleModal();
  };
  return (
    <div>
      {/* <div
        className={`${bgClosing ? "animate-unfoldOut" : "animate-unfoldIn"}

        absolute inset-0 bg-black opacity-50`}
        onAnimationEnd={() => {
          if (bgClosing) setPictureEditModal(false);
        }}
      /> */}
      <form
        className={`${closing ? "animate-unfoldOut" : "animate-unfoldIn"} fixed top-1/2 left-1/2 -translate-1/2 bg-purple-500 rounded-t-lg rounded-b-lg`}
        onSubmit={onSubmit}
        onAnimationEnd={() => {
          if (closing) setPictureEditModal(false);
        }}
      >
        <label htmlFor="avatar2">
          <figure className="group rounded-t-lg w-44 h-44">
            <img
              className="w-44 h-44 rounded-t-lg"
              src={avatarPreview ?? user?.avatar_url ?? "/images/headphone.jpg"}
              alt=""
            />
            {/* <div className="opacity-0  group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-1/2 flex flex-col gap-2 items-center">
              <FontAwesomeIcon icon={faPen} className="fa-2x" />
              <span className="text-sm">사진 선택</span>
            </div> */}
          </figure>
        </label>
        {/* <input
          type="file"
          id="avatar2"
          className="sr-only"
          accept="image/*"
          onChange={handleAvatarChange}
        /> */}
        <div className="flex w-full h-full ">
          <button
            type="button"
            className=" px-4 py-2 w-full rounded-bl-lg hover:bg-white hover:text-black hover:cursor-pointer"
            onClick={handleModal}
          >
            취소
          </button>
          <button
            type="submit"
            className=" px-4 py-2 w-full rounded-br-lg hover:bg-white hover:text-black hover:cursor-pointer"
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
}
