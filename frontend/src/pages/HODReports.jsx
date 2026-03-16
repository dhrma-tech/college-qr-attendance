import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    Download, FileText, Search, Filter, 
    Calendar, Book, ChevronDown, 
    ArrowRight, Printer, Share2, MoreVertical,
    History, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const HODReports = () => {
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(null); // 'csv' | 'pdf' | null
    const [reports, setReports] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({
        subjectId: '',
        from: '',
        to: '',
        status: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [subjectsRes, logsRes] = await Promise.all([
                api.get('/hod/subjects'),
                api.get('/hod/audit-logs')
            ]);
            setSubjects(subjectsRes.data);
            setReports(logsRes.data);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to load reports data');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format) => {
        const label = format.toUpperCase();
        setExporting(format);
        try {
            const { subjectId, from, to } = filters;
            let query = `/hod/export?format=${format}`;
            if (subjectId) query += `&subjectId=${subjectId}`;
            if (from) query += `&from=${from}`;
            if (to) query += `&to=${to}`;

            const { data } = await api.get(query, {
                responseType: 'blob',
            });
            const mimeType = format === 'pdf' ? 'application/pdf' : 'text/csv';
            const blob = new Blob([data], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendance_report_${Date.now()}.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success(`${label} report downloaded successfully.`);
        } catch (err) {
            console.error('Export error:', err);
            toast.error(`Export failed: ${err?.response?.data?.message || err.message}`);
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Report Control Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/50 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-xl shadow-slate-200/10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reporting Suite</h1>
                    <p className="text-sm font-medium text-slate-500">Comprehensive departmental throughput analytics and audit logs</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => handleExport('pdf')}
                        disabled={!!exporting}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        {exporting === 'pdf' ? 'Generating PDF...' : 'Export PDF Audit'}
                    </button>
                    <button 
                        onClick={() => handleExport('csv')}
                        disabled={!!exporting}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:border-primary-600 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {exporting === 'csv' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {exporting === 'csv' ? 'Preparing CSV...' : 'Raw CSV Data'}
                    </button>
                </div>
            </div>

            {/* Matrix Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Subject Filter */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm group hover:border-primary-200 transition-all">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Academic Module</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-full">
                            <Book className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                            <select 
                                value={filters.subjectId}
                                onChange={(e) => setFilters(f => ({ ...f, subjectId: e.target.value }))}
                                className="text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0 w-full appearance-none cursor-pointer"
                            >
                                <option value="">All Subjects</option>
                                {subjects.map(s => (
                                    <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                                ))}
                            </select>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                </div>

                {/* From Date Filter */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm group hover:border-primary-200 transition-all">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">From Date</p>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                        <input 
                            type="date"
                            value={filters.from}
                            onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))}
                            className="text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0 w-full cursor-pointer"
                        />
                    </div>
                </div>

                {/* To Date Filter */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm group hover:border-primary-200 transition-all">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">To Date</p>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                        <input 
                            type="date"
                            value={filters.to}
                            onChange={(e) => setFilters(f => ({ ...f, to: e.target.value }))}
                            className="text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0 w-full cursor-pointer"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm group hover:border-primary-200 transition-all">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Verification Status</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-full">
                            <CheckCircle className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                            <select 
                                value={filters.status}
                                onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                                className="text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0 w-full appearance-none cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                <option value="finalized">Finalized</option>
                                <option value="active">Active</option>
                            </select>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl shadow-slate-200/20 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-3 rounded-2xl">
                            <History className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Institutional Audit Log</h3>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            className="bg-slate-50 border-none rounded-2xl pl-11 pr-6 py-3 text-xs font-bold focus:ring-2 focus:ring-primary-100 min-w-[280px]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Segment</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Primary</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Throughput</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reports.map((report, index) => (
                                <tr 
                                    key={report.id}
                                    className="group hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-900 text-xs group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                {report.subject.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 tracking-tight">{report.subject}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{report.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <p className="text-sm font-bold text-slate-700">{report.teacher}</p>
                                        <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest">Verified Node</p>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className="inline-block px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black border border-emerald-100">
                                            {report.attendance}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${report.status === 'Finalized' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{report.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:text-primary-600 transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:text-primary-600 transition-colors">
                                                <Printer className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:text-primary-600 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Nodes 1-3 of 256 Total Protocols</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, '...'].map((n, i) => (
                            <button key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${i === 0 ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500 hover:border-primary-100'}`}>
                                {n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reporting Shield */}
            <div className="bg-indigo-600 p-8 rounded-[40px] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
                <div className="flex gap-8 items-center relative z-10">
                    <div className="p-5 bg-white/10 rounded-[28px] border border-white/20 backdrop-blur-md">
                        <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black tracking-tight mb-2">Audit Synchronization</h4>
                        <p className="text-sm text-indigo-100 leading-relaxed font-bold max-w-2xl opacity-80">
                            The reporting suite iterates through institutional attendance blocks every 24 hours. 
                            Pending verifications represent sessions currently undergoing end-of-day cryptographic finalization.
                        </p>
                    </div>
                    <button className="ml-auto flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-indigo-900/10">
                        Institutional Review
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HODReports;
