import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useCallback } from "react";

const team = [
  {
    name: "Nguyễn Thị Thùy Linh",
    role: "CEO (Marketing)",
    image:
      "/Avatar/Linh.jpg",
    bio: "Chịu trách nhiệm điều phối dự án, trực tiếp phân công nhiệm vụ và định hướng chiến lược marketing tổng thể cho toàn đội.",
  },
  {
    name: "Nguyễn Quỳnh Duyên",
    role: "Business Planner (Marketing)",
    image:
      "/Avatar/Duyên.jpg",
    bio: "Chuyên viên lập kế hoạch. Chịu trách nhiệm lên ý tưởng, xây dựng và triển khai các chiến dịch truyền thông marketing cho dự án.",
  },
  {
    name: "Huỳnh Nguyên Khánh Bình",
    role: "CMO (Marketing)",
    image:
      "/Avatar/Binh.png",
    bio: "Phụ trách chuyên môn marketing. Đảm nhận vai trò đại diện nhóm thuyết trình và trình bày các giải pháp của dự án trước đối tác.",
  },
  {
    name: "Trần Đình Duy Phương",
    role: "Software Engineer",
    image:
      "/Avatar/Phuong.jpg",
    bio: "Đảm nhiệm việc phát triển ý tưởng sản phẩm và chuyên sâu nghiên cứu các giải pháp kỹ thuật để tối ưu hóa hệ thống.",
  },
  {
    name: "Nguyễn Chơn Phước",
    role: "CTO (IT)",
    image:
      "/Avatar/Phước.jpg",
    bio: "Kỹ sư công nghệ cốt lõi. Tập trung vào việc nghiên cứu và ứng dụng trí tuệ nhân tạo (AI) để giải quyết các bài toán của sản phẩm.",
  },
  {
    name: "Nguyễn Phạm Hoàng Minh",
    role: "Software Engineer",
    image: "/Avatar/Minh.jpg",
    bio: "Đồng hành trong việc phát triển ý tưởng sản phẩm, trực tiếp tham gia nghiên cứu và triển khai các giải pháp kỹ thuật phần mềm.",
  },
];

const CARD_WIDTH = 320;
const CARD_GAP = 24;

export default function AboutTeam() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const updateActiveIndex = useCallback(() => {
    if (!trackRef.current) return;
    const index = Math.round(trackRef.current.scrollLeft / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(Math.min(Math.max(index, 0), team.length - 1));
  }, []);

  const scrollTo = (index: number) => {
    if (!trackRef.current) return;
    const clampedIndex = Math.min(Math.max(index, 0), team.length - 1);
    trackRef.current.scrollTo({
      left: clampedIndex * (CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });
    setActiveIndex(clampedIndex);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    if (trackRef.current) trackRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    updateActiveIndex();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Prev / Next buttons */}
          <button
            onClick={() => scrollTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 text-gray-700 hover:text-[#FF6F61] hover:border-[#FF6F61] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTo(activeIndex + 1)}
            disabled={activeIndex === team.length - 1}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 text-gray-700 hover:text-[#FF6F61] hover:border-[#FF6F61] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable track */}
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-6 select-none"
            style={{
              cursor: "grab",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={updateActiveIndex}
            onScroll={updateActiveIndex}
          >
            {/* hide native scrollbar for webkit */}
            <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

            {team.map((member, index) => (
              <div
                key={member.name}
                className="group flex-none w-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-72 w-full overflow-hidden">

                  <img
                    src={member.image}
                    alt={member.name}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Social overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 translate-y-3 group-hover:translate-y-0">
                    {[Linkedin, Twitter, Github, Mail].map((Icon, i) => (
                      <button
                        key={i}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-900 hover:text-[#FF6F61] hover:bg-white transition-colors shadow-lg"
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>

                  {/* Index badge */}
                  <span className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur-sm text-xs font-bold text-gray-500 px-2 py-0.5 rounded-full">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Info */}
                <div className="px-6 py-5 text-center">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-[#FF6F61] font-semibold text-sm mt-1 mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {team.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex
                  ? "w-6 bg-[#FF6F61]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
              />
            ))}
          </div>
        </motion.div>

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
