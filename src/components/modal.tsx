import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import useSessionStore from "../stores/session";

export default function Modal({ setModal }) {
  const { session, setSession } = useSessionStore();
  const [newName, setNewName] = useState("");
  const handleModal = () => {
    setModal((prev) => !prev);
  };
  const handleEditName = (e) => {
    setNewName(e.currentTarget.value);
    console.log(newName);
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser({
      data: { name: newName }, // metadata에 name 저장
    });
    const { data: refreshName, error: getErr } =
      await supabase.auth.getSession();
    setSession(refreshName.session);

    if (getErr) throw getErr;

    if (error) {
      console.error("이름 변경 실패:", error.message);
    } else {
      console.log("이름 변경 성공:", data);
      // 필요하다면 모달 닫기 등 추가 처리
      setModal(false);
    }
  };
  return (
    <div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <form
        onSubmit={onSubmit}
        className="border-transparent border w-[30rem] h-[10rem] flex gap-3 justify-center rounded-lg items-center z-100 fixed transfrom bg-purple-700 top-1/2 left-1/2 transform -translate-1/2"
      >
        <input
          type="text"
          className="bg-white w-[24rem] h-[4rem] placeholder-gray-400 p-2 rounded-lg text-black"
          placeholder="바꾸고 싶은 이름을 입력하세요"
          onChange={handleEditName}
        />
        <button className="bg-red-700 w-16 h-16 rounded-full font-bold shadow-md">
          완료!
        </button>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={handleModal}
          className="fa-xl curosr-pointer absolute top-0 right-0 p-2 text-black"
        />
      </form>
    </div>
  );
}
