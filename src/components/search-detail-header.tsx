import { Link, useParams } from "react-router-dom";

export default function SearchDetailHeader() {
  const { id } = useParams();
  return (
    <div className="mx-3 sticky top-0 [&>div]:inline-block [&>div]:bg-purple-600 [&>div]:mr-2 mb-10 text-sm [&>div]:cursor-pointer bg-purple-700 p-3 z-20">
      <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">
        <Link to={`/search/${id}`}>전체</Link>
      </div>
      <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">
        <Link to={`/search/${id}/tracks`}>곡</Link>
      </div>
      <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">
        <Link to={`/search/${id}/albums`}>앨범</Link>
      </div>
      <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">
        <Link to={`/search/${id}/artists`}>아티스트</Link>
      </div>
    </div>
  );
}
