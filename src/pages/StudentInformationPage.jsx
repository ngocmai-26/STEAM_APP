import React from 'react';
import StudentList from '../components/StudentList';
import Footer from '../components/Footer';

export default function StudentInformationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
      <div className="flex-1 flex flex-col items-center">
        <StudentList />
      </div>
      <Footer />
    </div>
  );
} 