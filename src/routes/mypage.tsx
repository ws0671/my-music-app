import { faPen, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import useSessionStore from "../stores/session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import NameEditModal from "../components/mypage/name-edit-modal";
import { supabase } from "../utils/supabaseClient";
import PictureEditModal from "../components/mypage/picture-edit-modal";

interface Iuser {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
}

export default function Mypage() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [pictureEditModal, setPictureEditModal] = useState(false);
  const { session, setSession } = useSessionStore();
  const user = session?.user.user_metadata;
  const imgSrc = user?.avatar_url ?? "/images/headphone.jpg";

  const handleModal = () => {
    setModal(true);
  };
  const handlePictureEditModal = () => {
    setPictureEditModal(true);
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
  const handleSaveAvatar = async (avatarFile) => {
    if (!session?.user.id || !avatarFile) return;
    setSaving(true);
    try {
      const userId = session?.user.id;
      const ext = (() => {
        const m = avatarFile.type.split("/")[1]; // "image/png" → "png"
        return m ? `${m}` : "";
      })();
      const filename = `avatar_${Date.now()}.${ext}`;
      const filePath = `${userId}/${filename}`;

      // 1) Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);
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

      const { data: refreshName, error: getErr } =
        await supabase.auth.getSession();
      setSession(refreshName.session);

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
        <label htmlFor="avatar">
          <figure className="group relative">
            <img
              className="w-[12rem] h-[12rem] rounded-full cursor-pointer group-hover:opacity-50"
              onClick={handlePictureEditModal}
              src={imgSrc}
              alt=""
            />
            <div className="opacity-0  group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-1/2 flex flex-col gap-2 items-center">
              <FontAwesomeIcon icon={faPen} className="fa-2x" />
              <span className="text-sm">사진 선택</span>
            </div>
            <input
              id="avatar"
              accept="image/*"
              type="file"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </figure>
        </label>
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

      {modal ? <NameEditModal modal={modal} setModal={setModal} /> : null}
      {pictureEditModal ? (
        <PictureEditModal
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          setPictureEditModal={setPictureEditModal}
          handleSaveAvatar={handleSaveAvatar}
          handleAvatarChange={handleAvatarChange}
        />
      ) : null}
    </main>
  );
}
