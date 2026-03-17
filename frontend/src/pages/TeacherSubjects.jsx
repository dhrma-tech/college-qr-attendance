import { useState, useEffect } from 'react';
import api from '../utils/api';
import { BookOpen, Users, ArrowRight, Layers, Layout, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TeacherSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setSubjects(data.details.subjects || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-slate-100 border-t-primary-600 rounded-full" />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10 pb-20"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-xl shadow-slate-200/20">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Subjects</h1>
                    <p className="text-sm font-medium text-slate-500">Your assigned subjects and courses</p>
                </div>
                <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-slate-100 border border-slate-200" />
                    ))}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-[10px] font-black tracking-tighter text-white">
                        +{subjects.length}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.map((subject, index) => (
                    <motion.div 
                        key={subject._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white p-8 rounded-[40px] border border-slate-200 hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-200/20 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Interactive Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-primary-600 transition-colors">
                                <BookOpen className="w-6 h-6" />
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">{subject.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subject.code}</span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Semester {subject.semester}</span>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                                </div>
                            </div>

                            <Link 
                                to="/teacher/sessions" 
                                state={{ subjectId: subject._id, subjectName: subject.name }}
                                className="w-full relative group/btn overflow-hidden py-4 px-6 rounded-2xl bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest transition-all hover:bg-primary-600 hover:text-white flex items-center justify-center gap-3"
                            >
                                <span className="relative z-10">View Sessions</span>
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                            </Link>
                        </div>
                    </motion.div>
                ))}

                {subjects.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-slate-300">
                            <Layers className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">No Subjects Assigned</h2>
                        <p className="text-sm font-medium text-slate-400 max-w-xs">No academic subjects have been assigned to your profile by the system administrator.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TeacherSubjects;
