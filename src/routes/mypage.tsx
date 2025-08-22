import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import useSessionStore from "../stores/session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Modal from "../components/modal";
import { supabase } from "../utils/supabaseClient";
export default function Mypage() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const session = useSessionStore((state) => state.session);
  const user = session?.user.user_metadata;
  console.log(session);

  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal((prev) => !prev);
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      e.target.value = ""; // 같은 파일 다시 선택 가능하도록 reset
      return;
    }

    // (선택) 크기 제한: 3MB
    const MAX = 3 * 1024 * 1024;
    if (file.size > MAX) {
      alert("3MB 이하 이미지를 업로드해주세요.");
      e.target.value = "";
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const handleSaveAvatar = async () => {
    if (!session?.user.id || !avatarFile) return;
    setSaving(true);
    try {
      const userId = session?.user.id;

      const filePath = `${userId}/avatar`;

      // 1) Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });
      if (uploadError) throw uploadError;

      // 2) 공개 URL 가져오기
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;
      if (!publicUrl) throw new Error("공개 URL 생성 실패");

      // 3) Auth 사용자 메타데이터 업데이트
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (updateError) throw updateError;

      // 4) UI 반영(미리보기 유지 or 서버값으로 갱신)
      alert("프로필 사진이 업데이트되었습니다.");
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "업로드 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="">
      <header className="flex p-4 gap-4 bg-linear-to-b from-slate-300 to-slate-400">
        <figure className="">
          <label htmlFor="avatar">
            <img
              className="w-[12rem] h-[12rem] rounded-full hover:opacity-[50%] cursor-pointer"
              src={avatarPreview ?? user?.avatar_url ?? "/images/headphone.jpg"}
              alt=""
            />
          </label>
          <input
            id="avatar"
            accept="image/*"
            type="file"
            className="sr-only"
            onChange={handleAvatarChange}
          />
        </figure>
        <div>
          <h1 className="text-[6rem] font-bold">내정보</h1>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{user?.name}</p>
            <FontAwesomeIcon
              onClick={handleModal}
              className="fa-lg cursor-pointer"
              icon={faPenToSquare}
            />
          </div>
        </div>
      </header>
      <button type="button" onClick={handleSaveAvatar}>
        Save Avatar
      </button>
      {modal ? <Modal modal={modal} setModal={setModal} /> : null}
    </main>
  );
}
