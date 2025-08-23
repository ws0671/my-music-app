import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import useSessionStore from "../../stores/session";

export default function NameEditModal({ modal, setModal }) {
  const [closing, setClosing] = useState(false);
  const [bgClosing, setBgClosing] = useState(false);
  const { session, setSession } = useSessionStore();
  const [newName, setNewName] = useState("");
  const handleModal = () => {
    setClosing(true);
  };
  const handleEditName = (e) => {
    setNewName(e.currentTarget.value);
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      alert("닉네임을 입력하세요!");
      return;
    }

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
      handleModal();
    }
  };
  return (
    <div>
      {/* <div
        className={`${bgClosing ? "animate-unfoldOut" : "animate-unfoldIn"}

        absolute inset-0 bg-black opacity-50`}
      /> */}
      <form
        onSubmit={onSubmit}
        className={`${closing ? "animate-unfoldOut" : "animate-unfoldIn"} flex flex-col shadow-xl border-transparent border justify-center rounded-lg items-center fixed transfrom bg-purple-500 top-1/2 left-1/2 transform -translate-1/2`}
        onAnimationEnd={() => {
          if (closing) setModal(false);
        }}
      >
        <input
          type="text"
          className="bg-white placeholder:italic placeholder-gray-400 p-2 rounded-t-lg placeholderp-2 text-black focus:outline-none placeholder:text-xs"
          placeholder="새로운 이름을 입력하세요"
          onChange={handleEditName}
        />
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
