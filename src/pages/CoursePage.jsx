import React from 'react';
import CourseList from '../components/CourseList';
import Footer from '../components/Footer';

export default function CoursePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
      <div className="flex-1 flex flex-col items-center">
        <CourseList />
      </div>
      <Footer />
    </div>
  );
}
