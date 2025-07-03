import useSessionStore from "./session.mock"; // persist 없는 mock
import { Session } from "@supabase/supabase-js";

test("로그인 상태 변경 테스트", () => {
  const fakeSession = { access_token: "abc" } as Session;

  useSessionStore.setState({ session: fakeSession });

  const store = useSessionStore.getState();
  expect(store.session).toBe(fakeSession);
});
