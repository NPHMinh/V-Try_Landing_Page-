import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Former Fashion Director at Vogue turned tech entrepreneur. Passionate about solving the $500B reverse logistics problem.",
  },
  {
    name: "Marcus Johnson",
    role: "CTO & Co-founder",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Ex-Google Brain researcher specializing in 3D computer vision and generative AI applied to soft body physics.",
  },
  {
    name: "Elena Rodriguez",
    role: "Chief Marketing Officer",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Built go-to-market strategies for 3 successful e-commerce unicorns. Expert in B2B SaaS growth and brand positioning.",
  },
  {
    name: "David Kim",
    role: "Product Lead",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Obsessed with bridging the gap between physical retail experiences and digital convenience through intuitive UX.",
  },
];

export default function AboutTeam() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[#FF6F61] font-bold tracking-wide uppercase text-sm mb-3">
              Our Mission
            </h2>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Building the Future of Digital Fashion Retail
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed text-balance">
              We are a team of fashion industry veterans, AI researchers, and
              engineers working together to eliminate the guesswork from online
              shopping and drastically reduce fashion's carbon footprint.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-80 w-full overflow-hidden rounded-2xl mb-6 shadow-sm">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />

                {/* Social Links Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 translate-y-4 group-hover:translate-y-0">
                  {[Linkedin, Twitter, Github, Mail].map((Icon, i) => (
                    <button
                      key={i}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-900 hover:text-[#FF6F61] hover:bg-white transition-colors shadow-lg"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center px-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-[#FF6F61] font-medium text-sm mb-3">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Investor Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 pt-16 border-t border-gray-100 text-center"
        >
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
            Backed by Visionary Investors
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {/* Logos Placeholders */}
            <h2 className="text-2xl font-black text-gray-800">SEQUOIA</h2>
            <h2 className="text-2xl font-black text-gray-800">Y COMBINATOR</h2>
            <h2 className="text-2xl font-black text-gray-800">
              ANDREESSEN HOROWITZ
            </h2>
            <h2 className="text-2xl font-black text-gray-800">LIGHTSPEED</h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
