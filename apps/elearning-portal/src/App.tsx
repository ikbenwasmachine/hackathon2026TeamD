import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { CurrentUserProvider } from "./auth/CurrentUserContext";
import { Nav } from "./components/Nav";
import { AdminCoursesPage } from "./pages/AdminCoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { CourseListPage } from "./pages/CourseListPage";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { HomePage } from "./pages/HomePage";
import { ThemeProvider } from "./theme/ThemeProvider";

function App(): ReactElement {
	return (
		<ThemeProvider>
			<CurrentUserProvider>
				<Nav />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/courses" element={<CourseListPage />} />
					<Route path="/courses/:id" element={<CourseDetailPage />} />
					<Route path="/signup" element={<CreateAccountPage />} />
					<Route path="/admin" element={<AdminCoursesPage />} />
				</Routes>
			</CurrentUserProvider>
		</ThemeProvider>
	);
}

export default App;
