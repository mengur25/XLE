import React from 'react';
import Button from '../common/Button';


const CourseCard = ({ title, image, description, features, link, hideFeatures }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col group">
            <div className="relative h-[200px] overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button variant="primary" size="small" onClick={() => window.location.href = link}>
                        Xem chi tiết
                    </Button>
                </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-primary-dark mb-3 uppercase">{title}</h3>
                {!hideFeatures && (
                    <div className="text-sm text-text-secondary space-y-1">
                        {features && features.map((feature, index) => (
                            <p key={index} className="flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                {feature}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
