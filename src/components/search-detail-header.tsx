export default function SearchDetailHeader() {
  return (
    <div className="mx-3 sticky top-0 [&>div]:inline-block [&>div]:bg-purple-600 [&>div]:mr-2 mb-10 text-sm [&>div]:cursor-pointer bg-purple-700 p-3">
      <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">전체</div>
      <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">곡</div>
      <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">앨범</div>
      <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">
        아티스트
      </div>
    </div>
  );
}
