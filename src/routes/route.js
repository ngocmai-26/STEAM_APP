import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import HomePage from '../pages/HomePage';
import CoursePage from '../pages/CoursePage';
import StudentInformationPage from '../pages/StudentInformationPage';
import SchedulePage from '../pages/SchedulePage';
import ClassOverviewPage from '../pages/ClassOverviewPage';
import ClassDetailPage from '../pages/ClassDetailPage';
import StudentImage from '../pages/StudentImage';
import StudentEvaluate from '../pages/StudentEvaluate';
import ProfilePage from '../pages/ProfilePage';
import AttendancePage from '../pages/AttendancePage';
import FacilityPage from '../pages/FacilityPage';
import NewsPage from '../pages/NewsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/student-info" element={<StudentInformationPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/class" element={<ClassOverviewPage />} />
        <Route path="/class/:id" element={<ClassDetailPage />} />
        <Route path="/student-images" element={<StudentImage />} />
        <Route path="/student-evaluation" element={<StudentEvaluate />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/facilities" element={<FacilityPage />} />
        <Route path="/news" element={<NewsPage />} />
      </Route>
    </Routes>
  );
} 