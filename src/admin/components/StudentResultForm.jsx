import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import client from '../../api/client';
import RichTextEditor from './RichTextEditor';

const StudentResultForm = ({ result, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        inputScore: '',
        overall: '',
        listening: '',
        reading: '',
        writing: '',
        speaking: '',
        className: '',
        studyTime: '',
        testimonial: '',
        certificateImageUrl: '',
        profileImgURL: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await client.get('/programs/tracks');
                setTracks(res.data);
            } catch (error) {
                console.error('Error fetching tracks:', error);
            }
        };
        fetchTracks();
    }, []);

    useEffect(() => {
        if (result) {
            setFormData({
                name: result.name,
                inputScore: result.inputScore || '',
                overall: result.overall || '',
                listening: result.listening || '',
                reading: result.reading || '',
                writing: result.writing || '',
                speaking: result.speaking || '',
                className: result.className || '',
                studyTime: result.studyTime || '',
                testimonial: result.testimonial || '',
                certificateImageUrl: result.certificateImageUrl || '',
                profileImgURL: result.profileImgURL || '',
            });
        }
    }, [result]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return null;

        const data = new FormData();
        data.append('image', file);

        try {
            setUploading(true);
            const res = await client.post('/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploading(false);
            return res.data.image_url;
        } catch (err) {
            setUploading(false);
            setError('Image upload failed');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let imageUrl = formData.certificateImageUrl;
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (uploadedUrl) imageUrl = uploadedUrl;
            else return;
        }

        let profileUrl = formData.profileImgURL;
        if (profileImageFile) {
            const uploadedUrl = await uploadImage(profileImageFile);
            if (uploadedUrl) profileUrl = uploadedUrl;
            else return;
        }

        const dataToSubmit = { ...formData, certificateImageUrl: imageUrl, profileImgURL: profileUrl };

        try {
            if (result) {
                await client.put(`/student-results/${result._id}`, dataToSubmit);
            } else {
                await client.post('/student-results', dataToSubmit);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {result ? 'Edit Student Result' : 'Add Student Result'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class Name (Track)
                            </label>
                            <select
                                name="className"
                                value={formData.className}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a Track</option>
                                {tracks.map((track) => (
                                    <option key={track._id} value={track.name}>
                                        {track.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input Score
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                name="inputScore"
                                value={formData.inputScore}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Overall Score
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                name="overall"
                                value={formData.overall}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Listening
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                name="listening"
                                value={formData.listening}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reading
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                name="reading"
                                value={formData.reading}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Writing
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                name="writing"
                                value={formData.writing}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Speaking
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                name="speaking"
                                value={formData.speaking}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Study Time
                            </label>
                            <input
                                type="text"
                                name="studyTime"
                                value={formData.studyTime}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Testimonial
                            </label>
                            <RichTextEditor
                                value={formData.testimonial}
                                onChange={(data) =>
                                    setFormData((prev) => ({ ...prev, testimonial: data }))
                                }
                                placeholder="Enter testimonial..."
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Certificate Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                        {formData.certificateImageUrl && !imageFile && (
                            <img
                                src={formData.certificateImageUrl}
                                alt="Preview"
                                className="mt-2 h-32 object-cover rounded"
                            />
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="w-full"
                        />
                        {formData.profileImgURL && !profileImageFile && (
                            <img
                                src={formData.profileImgURL}
                                alt="Preview"
                                className="mt-2 h-32 object-cover rounded"
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : result ? 'Update Result' : 'Create Result'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentResultForm;
