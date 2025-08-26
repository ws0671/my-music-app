import { Link, useParams } from "react-router-dom";

export default function SearchDetailHeader() {
  const { id } = useParams();
  return (
    <div className="mx-3 sticky top-0 [&_div]:inline-block [&_div]:bg-purple-600 [&_div]:mr-2 mb-10 text-sm [&_div]:cursor-pointer bg-purple-700 p-3 z-[5]">
      <Link to={`/search/${id}`}>
        <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">
          전체
        </div>
      </Link>
      <Link to={`/search/${id}/tracks`}>
        <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">곡</div>
      </Link>
      <Link to={`/search/${id}/albums`}>
        <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">
          앨범
        </div>
      </Link>
      <Link to={`/search/${id}/artists`}>
        <div className="rounded-[1rem] py-1.5 px-3 hover:bg-purple-500">
          아티스트
        </div>
      </Link>
    </div>
  );
}
