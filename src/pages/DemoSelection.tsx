import { motion } from "framer-motion";
import { MonitorPlay, ShoppingBag, Camera, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DemoSelection() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4"
          >
            Choose Your Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Experience V-Try from two completely different perspectives. Let us
            show you what our technology can do for you and your customers.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Direct Integration (B2B) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <MonitorPlay className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Platform Sandbox
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed h-20">
                Dive straight into the core 3D engine. Best for brands and
                developers wanting to test constraints, performance, and
                features.
              </p>

              <Link
                to="/try-on"
                className="inline-flex items-center gap-2 font-bold text-slate-700 group-hover:text-slate-900"
              >
                Launch Sandbox{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: E-commerce (B2C View) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden ring-2 ring-transparent hover:ring-[#FF6F61]/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-50 text-[#FF6F61] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FF6F61] group-hover:text-white transition-colors duration-300">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#FF6F61] text-xs font-bold uppercase tracking-wider mb-4">
                Recommended
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Store Integration Demo
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed h-14">
                See exactly how your customers will experience the "Try-On"
                button while shopping on your online store.
              </p>

              <Link
                to="/shop-demo"
                className="inline-flex items-center gap-2 font-bold text-[#FF6F61]"
              >
                View Customer Flow{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: 2D Live Try-On (Webcam) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden ring-2 ring-transparent hover:ring-emerald-500/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Camera className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4">
                New ✨
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                2D Live Try-On
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed h-14">
                Use your webcam for real-time AI-powered virtual try-on. See
                clothes on your own body instantly.
              </p>

              <Link
                to="/virtual-style-check"
                className="inline-flex items-center gap-2 font-bold text-emerald-600"
              >
                Try With Camera{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
