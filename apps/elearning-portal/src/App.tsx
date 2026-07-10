import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { CurrentUserProvider } from "./auth/CurrentUserContext";
import { Nav } from "./components/Nav";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { CourseListPage } from "./pages/CourseListPage";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { HomePage } from "./pages/HomePage";

function App(): ReactElement {
	return (
		<CurrentUserProvider>
			<Nav />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/courses" element={<CourseListPage />} />
				<Route path="/courses/:id" element={<CourseDetailPage />} />
				<Route path="/signup" element={<CreateAccountPage />} />
			</Routes>
		</CurrentUserProvider>
	);
}

export default App;
