import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = () => {
    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans selection:bg-primary-100 selection:text-primary-700">
            {/* Ambient Background Blur */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-100/30 rounded-full blur-[100px]" />
            </div>

            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0 relative">
                <Navbar />
                
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
