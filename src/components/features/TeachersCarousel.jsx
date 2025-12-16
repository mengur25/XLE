import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import client from '../../api/client';

const TeachersCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await client.get('/mentors');
                const data = res.data;
                const mentorsArray = Array.isArray(data) ? data : (data?.mentors ?? data?.data ?? []);

                setTeachers(mentorsArray.map(mentor => ({
                    _id: mentor._id,
                    name: mentor.name,
                    overall: mentor.overall,
                    slogan_Title: mentor.slogan_Title,
                    slogan_Content: mentor.slogan_Content,
                    imageUrl: mentor.imageUrl,
                    ieltsImage: mentor.ieltsImage
                })));
            } catch (error) {
                console.error('Error fetching mentors:', error);
            }
        };

        fetchMentors();
    }, []);

    // Auto-play logic
    useEffect(() => {
        if (teachers.length === 0) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 4000); // 4 seconds

        return () => clearInterval(interval);
    }, [currentIndex, teachers.length]);

    const nextSlide = () => {
        if (teachers.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % teachers.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + teachers.length) % teachers.length);
    };

    // Calculate visible teachers (circular)
    const getVisibleTeachers = () => {
        if (teachers.length === 0) return [];
        const visible = [];
        for (let i = 0; i < 2; i++) {
            visible.push(teachers[(currentIndex + i) % teachers.length]);
        }
        return visible;
    };

    if (teachers.length === 0) return null;

    return (
        <section className="py-24 bg-[#f8f9fc]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#312e81] mb-12 text-center uppercase">
                    ĐỘI NGŨ GIÁO VIÊN
                </h2>

                <div className="relative max-w-6xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-[#9ca3af] hover:bg-[#6b7280] text-white p-2 rounded-full shadow-lg transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-[#9ca3af] hover:bg-[#6b7280] text-white p-2 rounded-full shadow-lg transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Carousel Content */}
                    <div className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ease-in-out">
                            {getVisibleTeachers().map((teacher, index) => {
                                if (!teacher) return null;
                                return (
                                    <div key={`${teacher._id}-${index}`} className="bg-[#e0e7ff] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-md relative overflow-hidden h-full min-h-[300px]">
                                        {/* Image */}
                                        <div className="w-full md:w-1/2 h-64 md:h-full relative z-10">
                                            <img
                                                src={teacher.imageUrl}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover object-top rounded-xl md:rounded-none md:bg-transparent mix-blend-multiply"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="w-full md:w-1/2 flex flex-col justify-center z-10 text-left">
                                            <h3 className="text-xl font-bold text-[#312e81] mb-2 uppercase">{teacher.name}</h3>
                                            <p className="text-[#4b5563] font-semibold mb-4">Overall: <span className="text-2xl font-bold text-[#312e81]">{teacher.overall}</span></p>

                                            <div className="mb-6">
                                                <p className="font-bold text-black uppercase text-sm mb-1">"{teacher.slogan_Title}</p>
                                                <div className="text-[#4b5563] italic text-sm" dangerouslySetInnerHTML={{ __html: teacher.slogan_Content }} />
                                            </div>

                                            <button className="bg-[#5b5e98] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4a4d85] transition-colors shadow-md self-start md:self-end mt-auto">
                                                Xem thêm
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <a href="/teachers" className="text-[#312e81] font-bold hover:underline text-lg inline-flex items-center gap-2">
                        Xem thêm các giảng viên tại Xa Lộ English
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TeachersCarousel;
