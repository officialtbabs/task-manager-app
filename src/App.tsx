import { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const TaskManager = lazy(() => import("./pages/TaskManager"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div />}>
          <Routes>
            <Route path="/login" element={<AuthLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/signup" element={<AuthLayout />}>
              <Route index element={<Signup />} />
            </Route>

            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/task-manager" element={<TaskManager />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
