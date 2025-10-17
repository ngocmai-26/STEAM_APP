import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ApiServices } from '../services/ApiServices';
import { openWebview } from 'zmp-sdk';


export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const openUrlInWebview = async (url) => {
    try {
      await openWebview({
        url: url, // Nhận URL từ tham số truyền vào
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      // Xử lý khi gọi API thất bại
      console.log(error);
    }
  };


  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const newsData = await ApiServices.getNews();
        const fetchedNews = newsData.data || [];

        // Transform API data to match component structure
        const transformedNews = fetchedNews.map(item => ({
          id: item.id,
          title: item.title,
          summary: item.summary || item.description || 'Không có mô tả',
          image: item.image || "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80",
          date: new Date(item.created_at || item.date).toLocaleDateString('vi-VN'),
          category: item.category || 'general',
          readTime: item.read_time || '3 phút đọc'
        }));

        setNews(transformedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
        // Set empty array if API fails
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-200 to-white rounded-b-3xl shadow-md p-2">
        <div className="flex flex-col items-center">
          <img src="/logo192.png" alt="logo" className="w-12 h-12 mt-2" />
          <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 mt-1">STEAM <span className="text-yellow-400">AI</span></h1>
          <div className="text-base font-semibold text-blue-700 mt-1">FUN <span className="text-orange-400">-</span> LEARN <span className="text-orange-400">-</span> CREATE</div>
        </div>
      </div>

      

      {/* News Content */}
      <div className="px-4 mt-4">
        

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    
                    <span className="text-xs text-gray-400">{item.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <button className="text-xs text-blue-600 font-medium hover:text-blue-700" onClick={() => {
                openUrlInWebview(item.link);
              }}>
                      Đọc thêm →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl">📰</span>
            <p className="mt-2">Chưa có tin tức nào trong danh mục này</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
