import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import useSessionStore from "../stores/session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Modal from "../components/modal";
export default function Mypage() {
  const session = useSessionStore((state) => state.session);
  const user = session?.user.user_metadata;
  console.log(user);

  const [modal, setModal] = useState(true);
  const handleModal = () => {
    setModal((prev) => !prev);
  };
  const handleAvatar = () => {};
  return (
    <main>
      <header className="flex p-4 gap-4 bg-linear-to-b from-slate-300 to-slate-400">
        <figure className="">
          <label htmlFor="avatar">
            <img
              className="w-[12rem] h-[12rem] rounded-full hover:opacity-[50%] cursor-pointer"
              src="/images/headphone.jpg"
              alt=""
            />
          </label>
          <input id="avatar" accept="image/*" type="file" className="sr-only" />
        </figure>
        <div>
          <h1 className="text-[6rem] font-bold">내정보</h1>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{user?.name}</p>
            <FontAwesomeIcon
              onClick={handleAvatar}
              className="fa-lg cursor-pointer"
              icon={faPenToSquare}
            />
          </div>
        </div>
      </header>
      {modal ? <Modal setModal={setModal} /> : null}
    </main>
  );
}
