import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';

const ReferenceMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const res = await client.get('/blog-posts');
                const data = res.data;
                const postsArray = Array.isArray(data) ? data : (data?.posts ?? data?.data ?? []);

                setMaterials(postsArray.map(post => ({
                    id: post._id,
                    title: post.title,
                    description: post.excerpt,
                    image: post.coverImageUrl,
                    overlayTitle: post.title.toUpperCase(),
                    slug: post.slug
                })));
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };

        fetchBlogPosts();
    }, []);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#312e81] mb-12 text-center uppercase">
                    TÀI LIỆU THAM KHẢO THÊM
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {materials.map((item) => (
                        <div key={item.id} className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Image Section */}
                            <div className="relative h-[400px] bg-gray-100 group overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay Content */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-between p-6 cursor-pointer"
                                    onClick={() => navigate(`/${item.slug}`)}
                                >
                                    <div className="text-center mt-8">
                                        <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 backdrop-blur-sm flex items-center justify-center">
                                            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-pink-400"></div>
                                        </div>
                                        <h3 className="text-white font-bold text-xl uppercase drop-shadow-md leading-tight">
                                            {item.overlayTitle}
                                        </h3>
                                    </div>

                                    <div className="bg-[#a5b4fc] text-white text-center py-2 px-4 rounded-full font-bold uppercase text-sm mx-auto w-full max-w-[90%] mb-4 hover:bg-[#818cf8] transition-colors">
                                        TÌM HIỂU TRONG BÀI VIẾT DƯỚI ĐÂY
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex flex-col flex-grow bg-[#f9fafb]">
                                <h4 className="font-bold text-gray-800 mb-3 line-clamp-2 min-h-[3rem]">
                                    {item.title}
                                </h4>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                                    {item.description}
                                </p>
                                <button
                                    onClick={() => navigate(`/${item.slug}`)}
                                    className="bg-[#5b5e98] text-white px-8 py-2 rounded font-bold hover:bg-[#4a4d85] transition-colors uppercase text-sm self-center mt-auto"
                                >
                                    XEM THÊM
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReferenceMaterials;
