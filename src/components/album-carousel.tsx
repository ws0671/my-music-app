import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

export default function AlbumCarousel({ albums }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // 스크롤 위치 체크
  const checkScroll = useCallback(() => {
    const el = trackRef.current;

    if (!el) return;

    const atStart = el.scrollLeft <= 6;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    setShowLeft(!atStart);
    setShowRight(!atEnd);
  }, []);

  useEffect(() => {
    checkScroll(); // 처음 로딩 시 상태 반영
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  // 스크롤 이동
  const scrollByPage = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const page = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === "next" ? page : -page, behavior: "smooth" });
  };

  if (!albums?.length) return null;

  return (
    <section className="relative">
      {/* 트랙 */}
      <ul
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 no-scrollbar"
        style={{
          msOverflowStyle: "none", // IE, Edge
          scrollbarWidth: "none", // Firefox
        }}
      >
        {albums.map((item) => (
          <li
            key={item.id}
            className="snap-start flex-shrink-0 w-[168px] group"
          >
            <Link to={`/album/${item.id}`} className="block">
              <img
                className="rounded-lg w-full aspect-square object-cover"
                src={item.images?.[0]?.url}
                alt={item.name}
              />
              <div className="my-1 truncate font-bold">{item.name}</div>
              <div className="truncate text-sm text-gray-400">
                {item.artists.map((artist, index) => (
                  <span key={artist.id}>
                    <Link to={`/artist/${artist.id}`}>
                      <span className="hover:underline">{artist.name}</span>
                    </Link>
                    {index < item.artists.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </Link>
            {showLeft && (
              <button
                type="button"
                aria-label="Previous"
                onClick={() => scrollByPage("prev")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-200 h-10 w-10 items-center justify-center rounded-full bg-white/60 shadow hover:bg-white/80"
              >
                ‹
              </button>
            )}
            {showRight && (
              <button
                type="button"
                aria-label="Next"
                onClick={() => scrollByPage("next")}
                className="transition-opacity duration-200 group-hover:opacity-100 absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0  h-10 w-10 items-center justify-center rounded-full bg-white/60 shadow hover:bg-white/80"
              >
                ›
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
