import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Player from "./player";

test("플레이 버튼 클릭 시 일시정지 버튼으로 바뀐다", async () => {
  render(<Player setIsOpen={() => {}} />);

  // 플레이어 중앙 영역 기준으로 버튼 찾기
  const playerControl = screen.getByLabelText("플레이어 컨트롤");
  const playButton = within(playerControl).getByLabelText(/play/i);

  await userEvent.click(playButton);

  // 일시정지 버튼이 나타나는지 확인
  const pauseButton = within(playerControl).getByLabelText(/pause/i);
  expect(pauseButton).toBeInTheDocument();
});
