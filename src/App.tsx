import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import FindPassword from "./routes/find-password";
import UpdatePassword from "./routes/update-password";
import Album from "./routes/album";
import Artist from "./routes/artist";
import Search from "./routes/search";
import Albums from "./routes/search/albums";
import Artists from "./routes/search/artists";
import Tracks from "./routes/search/tracks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "album/:id",
        element: <Album />,
      },
      {
        path: "artist/:id",
        element: <Artist />,
      },
      {
        path: "search/:id",
        element: <Search />,
      },
      {
        path: "search/:id",
        children: [
          {
            path: "albums",
            element: <Albums />,
          },
          {
            path: "artists",
            element: <Artists />,
          },
          {
            path: "tracks",
            element: <Tracks />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/find-password",
    element: <FindPassword />,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
]);

function App() {
  return (
    <div className="font-gmarket">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
