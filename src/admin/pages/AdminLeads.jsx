import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import client from '../../api/client';

const AdminLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const { data } = await client.get('/leads');
                setLeads(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leads:', error);
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const handleExport = async () => {
        try {
            const response = await client.get('/leads/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'leads.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting leads:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await client.put(`/leads/${id}`, { status: newStatus });
            setLeads(leads.map(lead =>
                lead._id === id ? { ...lead, status: newStatus } : lead
            ));
        } catch (error) {
            console.error('Error updating lead status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Leads</h1>
                <button
                    onClick={handleExport}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Download size={20} />
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Họ tên</th>
                            <th className="px-6 py-4">Email / SĐT</th>
                            <th className="px-6 py-4">Mục tiêu</th>
                            <th className="px-6 py-4">Thời gian tư vấn</th>
                            <th className="px-6 py-4">Ngày tạo</th>
                            <th className="px-6 py-4">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leads.map((lead) => (
                            <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {lead.name}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex flex-col">
                                        <span>{lead.email}</span>
                                        <span className="text-xs text-gray-400">{lead.phone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 max-w-xs">
                                    <div className="flex flex-wrap gap-1">
                                        {lead.goals?.map((goal, idx) => (
                                            <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">
                                                {goal}
                                            </span>
                                        ))}
                                    </div>
                                    {lead.message && <div className="text-xs text-gray-400 mt-1 italic">Msg: {lead.message}</div>}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex flex-wrap gap-1">
                                        {lead.consultationTime?.map((time, idx) => (
                                            <span key={idx} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs border border-purple-100">
                                                {time}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                    {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                        className={`px-2 py-1 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${lead.status === 'new'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>

                                    </select>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                    No leads found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLeads;
