import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import fullDashboardPreview from "@/assets/images/fulldashboard-preview.png";
import heatmapPreview from "@/assets/images/heatmap-preview.png";
import progressLogPreview from "@/assets/images/progresslog-preview.png";
import questsPreview from "@/assets/images/quests-preview.png";
import ThemeToggle from "@/components/ThemeToggle";


const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/*-------------------- Navbar -------------------*/}
      <header className={`sticky top-0 z-50 bg-landing-surface/80 backdrop-blur-md border-b border-landing-border transition-all duration-300 ${isScrolled ? "shadow-md": ""}`}>
        <div className='max-w-full px-5 sm:px-8 mx-auto h-16 flex items-center justify-between'>

          <div className='flex items-center gap-1 sm:gap-2 md:gap-3'>
            <img src="/favicon.jpg" alt="HabitQuest Logo" className='h-7 sm:h-8 w-7 sm:w-8 rounded-md sm:rounded-lg'/>
            <span className='text-lg sm:text-xl font-bold tracking-tight'>
              HabitQuest
            </span>
          </div>

          <div className='hidden sm:flex items-center gap-8'>
            <a href='#features'
            className='font-medium text-landing-text-muted hover:text-landing-text transition'>
              Features
            </a>
            <a href='#how-it-works'
            className='font-medium text-landing-text-muted hover:text-landing-text transition'>
              How It Works
            </a>
          </div>

          <div className='flex items-center gap-1 sm:gap-2 md:gap-4'>
            <ThemeToggle />

            <Link to="/login"
            className='px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md sm:rounded-lg border border-landing-border font-medium hover:bg-landing-surface-muted transition'>
              Login
            </Link>
            <Link to="/register"
            className='px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md sm:rounded-lg bg-primary text-white font-medium hover:scale-105 transition'>
              Register
            </Link>
          </div>
        </div>
      </header>


      <main>
        {/* --------------- Hero section --------------- */}
        <section id='hero' className='relative overflow-hidden'>

          <div className='absolute inset-0 bg-linear-to-b from-landing-hero-start to-landing-hero-end'></div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-32">

            <div className='grid lg:grid-cols-2 gap-8 md:gap-12 items-center'>

              {/* --- Left Box --- */}
              <motion.div
                initial={{opacity:0, y:40}}
                animate={{opacity:1, y:0}}
                transition={{duration:0.6}} 
                className='space-y-6'
              >

                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-landing-text'>
                  Finish Quests.<br/> 
                  Build Streaks.<br />
                  <span className="text-primary"> Level Up.</span>
                </h1>
                <p className='text-base sm:text-lg text-landing-text-muted max-w-xl'>
                  Track habits, maintain streaks, and visualize your progress as you turn daily consistency into long-term growth.
                </p>
                <Link to="/register"
                  className='inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-105 transition'>
                  Get Started
                </Link>
              </motion.div>

              {/* --- Right Box --- */}
              <motion.div
                initial={{opacity:0, x:40}}
                animate={{
                  opacity:1,
                  x:0,
                  y:[0,-10,0],
                  rotate: [-2, 0, -2],
                }} 
                transition={{
                  opacity: {duration: 0.8},
                  x: {duration: 0.8},
                  y:{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className='relative flex justify-center'
              >

                <div className="absolute top-0 right-0 w-1/2 h-1/2 translate-x-1/3 -translate-y-1/3 bg-landing-glow-primary/40 blur-[120px] rounded-full"></div>

                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 -translate-x-1/3 translate-y-1/3 bg-landing-glow-secondary/60 blur-[120px] rounded-full"></div>

                <img src={fullDashboardPreview} alt="Dashboard Preview" 
                  className='relative rounded-2xl shadow-2xl border border-landing-border w-full max-w-2xl transition-transform duration-500 hover:scale-[1.02]' />

              </motion.div>

            </div>
            
          </div>
        </section>


        {/*-------------- Feature section -------------- */}
        <section id='features' className='max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-10'>
          <div className='text-center max-w-3xl mx-auto mb-12 md:mb-20'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-landing-text'>
              Everything You Need to Stay Consistent
            </h2>
            <p className='mt-4 text-lg text-landing-text-muted'>
              HabitQuest helps you build habits, maintain streaks, and visualize long-term progress through a clean and focused experience.
            </p>
          </div>

          {/* Feature 1 */}
          <div className='grid lg:grid-cols-2 gap-8 md:gap-12 items-center py-8 lg:py-12 px-4 sm:px-6 lg:px-8 rounded-3xl bg-landing-surface border border-landing-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10'>
            {/* Text */}
            <motion.div
              initial = {{opacity: 0, x: -40}}
              whileInView={{opacity:1, x:0}}
              viewport={{once:true, amount:0.3}}
              transition={{duration: 0.6}} 
              className='space-y-4'
            >
              <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-landing-text'>
                Track Your Daily Habits
              </h3>

              <p className='text-base sm:text-lg text-landing-text-muted'>
                Create habits, mark daily progress, and stay focused on what matters. HabitQuest keeps your goals simple and accessible so consistency becomes part of your routine.
              </p>
            </motion.div>

            {/* Image */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className='flex justify-center'
            >
              <img src={questsPreview} alt="Quest Tracking" 
                className='w-full max-w-lg rounded-2xl shadow-xl border border-landing-border transition-transform duration-500 hover:scale-[1.02]'/>
            </motion.div>
          </div>

          {/* Feature 2 */}
          <div className='grid lg:grid-cols-2 gap-8 md:gap-12 items-center py-8 lg:py-12 px-4 sm:px-6 lg:px-8 rounded-3xl bg-landing-surface border border-landing-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10'>
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center order-2 lg:order-1"
            >
              <img src={heatmapPreview} alt="Heatmap Preview" 
                className='w-full max-w-lg rounded-2xl shadow-xl border border-landing-border transition-transform duration-500 hover:scale-[1.02]'
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 order-1 lg:order-2"
            >
              <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-landing-text'>
                Visualize Your Efforts
              </h3>
              <p className='text-base sm:text-lg text-landing-text-muted'>
                View your habit activity at a glance with a 6-month heatmap. Spot trends, celebrate streaks, and stay motivated as you watch your progress grow over time.
              </p>
            </motion.div>

          </div>

          {/* Feature 3 */}
          <div className='grid lg:grid-cols-2 gap-8 md:gap-12 items-center py-8 lg:py-12 px-4 sm:px-6 lg:px-8 rounded-3xl bg-landing-surface border border-landing-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10'>
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-landing-text'>
                Understand Progress
              </h3>

              <p className='text-base sm:text-lg text-landing-text-muted'>
                Monitor completion rates, track streaks, and gain insights into your long-term growth. HabitQuest turns daily actions into measurable progress.
              </p>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <img src={progressLogPreview} alt="Progress Analytics" 
                className='w-full max-w-lg rounded-2xl shadow-xl border border-landing-border transition-transform duration-500 hover:scale-[1.02]'
              />
            </motion.div>
          </div>
        </section>


        {/*------------ How It Works section ----------- */}
        <section id='how-it-works' className='max-w-7xl mx-auto px-6 py-16 lg:py-24'>
          <div className='text-center max-w-3xl mx-auto mb-12 md:mb-20'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-landing-text'>
              How It Works
            </h2>
            <p className='mt-4 text-lg text-landing-text-muted'>
              A simple process designed to help you stay consistent every day.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>

            {/* Step 1 */}
            <motion.div
              initial={{opacity:0, y:40}}
              whileInView={{opacity:1, y:0}}
              viewport={{once: true, amount: 0.3}}
              transition={{duration: 0.5}}
              className='p-5 lg:p-6 rounded-2xl bg-landing-surface border border-landing-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10'
            >
              <div className='text-3xl font-bold text-primary mb-4'>
                01
              </div>
              <h3 className='text-xl text-landing-text font-semibold mb-2'>
                Create Habits
              </h3>
              <p className='text-landing-text-muted'>
                Add the habits you want to build and organize your daily goals.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-5 lg:p-6 rounded-2xl bg-landing-surface border border-landing-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="text-3xl font-bold text-primary mb-4">
                02
              </div>

              <h3 className="text-xl text-landing-text font-semibold mb-2">
                Track Progress
              </h3>

              <p className="text-landing-text-muted">
                Mark habits as completed and maintain your daily routine.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-5 lg:p-6 rounded-2xl bg-landing-surface border border-landing-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="text-3xl font-bold text-primary mb-4">
                03
              </div>

              <h3 className="text-xl text-landing-text font-semibold mb-2">
                Build Streaks
              </h3>

              <p className="text-landing-text-muted">
                Stay motivated by maintaining consistency over time.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-5 lg:p-6 rounded-2xl bg-landing-surface border border-landing-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="text-3xl font-bold text-primary mb-4">
                04
              </div>

              <h3 className="text-xl text-landing-text font-semibold mb-2">
                Analyze Growth
              </h3>

              <p className="text-landing-text-muted">
                Use analytics to understand your long-term progress.
              </p>
            </motion.div>

          </div>
        </section>


        {/* ---------------- CTA section --------------- */}
        <section id='cta' className='max-w-7xl mx-auto px-6 py-16 lg:py-24'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className='relative overflow-hidden rounded-3xl bg-linear-to-r from-landing-cta-start/10 to-landing-cta-end/10 p-10 lg:p-16 text-center'
          >
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-landing-text'>
              Ready to Build Better Habits?
            </h2>

            <p className='mt-4 text-base sm:text-lg text-landing-text-muted max-w-2xl mx-auto'>
              Start tracking your habits, building streaks, and visualizing your progress today with HabitQuest.
            </p>

            <Link to="/register" className='inline-flex mt-8 px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:scale-105 transition'>
              Get Started
            </Link>

          </motion.div>
        </section>

      </main>

      {/* ------------------ Footer -------------------- */}
      <footer className='border-t border-landing-border'>
        <div className='max-w-7xl mx-auto px-6 py-10 text-center'>

          <div className='flex items-center justify-center gap-3'>
            <img src="/favicon.jpg" alt="HabitQuest Logo" className='h-8 w-8 rounded-xl' />
            
            <h3 className='text-2xl font-bold text-landing-text'>
              HabitQuest
            </h3>
          </div>

          <p className='mt-3 text-landing-text-muted'>
            Build habits. Maintain streaks. Stay consistent.
          </p>

          <p className="mt-4 text-sm text-landing-text-muted">
            © 2026 HabitQuest
          </p>

        </div>
      </footer>

    </>
  );
};

export default LandingPage;