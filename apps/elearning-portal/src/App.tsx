import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { CourseListPage } from "./pages/CourseListPage";

function App(): ReactElement {
	return (
		<Routes>
			<Route path="/" element={<CourseListPage />} />
			<Route path="/courses/:id" element={<CourseDetailPage />} />
		</Routes>
	);
}

export default App;
