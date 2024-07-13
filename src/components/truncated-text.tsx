import { useEffect, useRef } from "react";
interface Text {
  text: string;
}

export default function TruncatedText({ text }: Text) {
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 2; // 2줄 높이 계산
      if (element instanceof HTMLElement)
        if (element.scrollHeight > maxHeight) {
          const words = text.split(" ");
          let truncatedText = "";
          for (let i = 0; i < words.length; i++) {
            element.innerText = truncatedText + words[i] + " ";
            if (element.scrollHeight > maxHeight) {
              element.innerText = truncatedText.trim() + " ...";
              break;
            }
            truncatedText += words[i] + " ";
          }
        }
    }
  }, [text]);

  return (
    <div className="text-xs text-gray-400" ref={textRef}>
      {text}
    </div>
  );
}
