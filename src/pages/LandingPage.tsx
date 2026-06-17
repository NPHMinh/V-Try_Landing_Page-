import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as any },
    },
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-white to-white"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 text-[#FF6F61] text-sm font-medium mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#FF6F61]"></span>
              V-Try Core Plugin v2.0
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]"
            >
              Reduce Return Rates by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F61] to-orange-400">
                20%
              </span>{" "}
              with AI Virtual Fit.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              The ultimate 3D fitting room plugin for your fashion e-commerce
              store. Increase conversions and build buyer confidence instantly.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-[#FF6F61] rounded-full shadow-lg hover:bg-[#fa5c4d] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Launch 3D Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                View Documentation
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              The Problem with Online Fashion
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <RefreshCcw className="w-8 h-8 text-red-500" />,
                title: "High Return Costs",
                desc: "30% of all clothing bought online is returned, primarily due to sizing issues.",
              },
              {
                icon: <Users className="w-8 h-8 text-orange-500" />,
                title: "Poor User Experience",
                desc: "Customers hesitate to buy without knowing how the garment actually fits on their body type.",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-amber-500" />,
                title: "Low Conversion Rates",
                desc: "Size uncertainty is the #1 reason for cart abandonment in fashion e-commerce.",
              },
            ].map((err, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                  {err.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {err.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{err.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How V-Try Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to transform your shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 -z-10"></div>

            {[
              {
                step: "01",
                title: "Integrate Plugin",
                desc: "Add our single line of script to your store. We support Shopify, WooCommerce, and custom builds.",
              },
              {
                step: "02",
                title: "User Inputs Size",
                desc: "Customers enter basic parameters like height, weight, and body shape in seconds.",
              },
              {
                step: "03",
                title: "Match with 3D Garment",
                desc: "Our AI generates a real-time 3D simulation of exactly how the item will fit their distinct body.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-white border-4 border-[#FF6F61] rounded-full flex items-center justify-center text-2xl font-black text-[#FF6F61] mb-8 shadow-sm">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
