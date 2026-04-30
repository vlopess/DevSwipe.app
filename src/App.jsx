import React, { useEffect, useState } from 'react';
import {
  Heart, X, ChevronRight
} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import Jobicy from './assets/jobicy.svg';
import Muse from './assets/Muse.svg';


const FloatingCard = ({ delay, rotate, zIndex, job, isLiked }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
      <div
          className={`absolute w-72 sm:w-80 h-[400px] bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden transition-all duration-1000 ease-out flex flex-col`}
          style={{
            zIndex,
            transform: animate
                ? `translate(${isLiked ? '40px' : '-40px'}, ${isLiked ? '-20px' : '20px'}) rotate(${rotate}deg) scale(1)`
                : `translate(0px, 100px) rotate(0deg) scale(0.8)`,
            opacity: animate ? 1 : 0
          }}
      >
        <div className="flex-grow p-6 flex flex-col justify-end bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-zinc-800 relative">
          {/* Overlay Action Icon */}
          <div className="absolute top-6 right-6">
            {isLiked ? (
                <div className="bg-zinc-900/40 p-3 rounded-full backdrop-blur-md border border-zinc-700">
                  <Heart className="w-8 h-8 text-white" fill="currentColor" />
                </div>
            ) : (
                <div className="bg-zinc-900/40 p-3 rounded-full backdrop-blur-md border border-zinc-700">
                  <X className="w-8 h-8 text-zinc-400" strokeWidth={3} />
                </div>
            )}
          </div>

          <div className="text-white z-10">
            <h3 className="text-2xl font-bold mb-1">{job.role}</h3>
            <p className="text-zinc-300 font-medium mb-3">{job.company}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-white/10 rounded-md text-xs font-medium backdrop-blur-sm">
                {skill}
              </span>
              ))}
            </div>
            <div className="flex items-center text-sm text-zinc-400">
              <span>{job.salary}</span>
              <span className="mx-2">•</span>
              <span>{job.location}</span>
            </div>
          </div>
        </div>
      </div>
  );
};


// --- PÁGINA PRINCIPAL ---

export default function DevSwipeLanding() {
  const navigate = useNavigate();
  return (
      <div className="min-h-screen bg-zinc-50 pt-25 text-zinc-900 overflow-x-hidden" style={{ fontFamily: "'Ubuntu', sans-serif" }}>
        <style dangerouslySetInnerHTML={{__html: "@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');"}} />

        {/* HERO SECTION */}
        <section className="relative lg:pt-10 lg:pb-14 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

              {/* Texto Hero */}
              <div className="mb-16 lg:mb-0 text-center lg:text-left z-10 relative">

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-[1.1] mb-6">
                  O teu próximo <br className="hidden lg:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-900">emprego em TI</span> <br/>
                  à distância de um swipe.
                </h1>

                <p className="text-lg sm:text-xl text-zinc-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Uma plataforma moderna e intuitiva que reúne vagas de tecnologia em um único lugar, simplificando a forma como desenvolvedores encontram oportunidades.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <button onClick={() => navigate('/jobs')} className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-transform hover:scale-105 shadow-xl flex items-center justify-center cursor-pointer">
                    Ver Vagas
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>

              {/* Ilustração / Cards Flutuantes */}
              <div className="relative h-[400px] sm:h-[500px] flex justify-center items-center w-full lg:w-auto">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-white rounded-full blur-3xl opacity-50"></div>

                <FloatingCard
                    delay={600}
                    rotate={-8}
                    zIndex={10}
                    isLiked={false}
                    job={{
                      role: "Backend Engineer",
                      company: "DataFlow Inc.",
                      skills: ["Node.js", "AWS", "SQL"],
                      salary: "R$ 12k - 16k",
                      location: "Híbrido"
                    }}
                />

                <FloatingCard
                    delay={100}
                    rotate={6}
                    zIndex={20}
                    isLiked={true}
                    job={{
                      role: "Frontend Developer",
                      company: "TechNova",
                      skills: ["React", "TypeScript", "Tailwind"],
                      salary: "R$ 8k - 12k",
                      location: "Remoto"
                    }}
                />
              </div>

            </div>
          </div>
        </section>

          {/* DOCK FLUTUANTE DE APIS (GLASSMORPHISM) */}
          <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 z-50 w-[100%] max-w-5xl animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
              <div className="relative
                  bg-black/10
                  backdrop-blur-2xl
                  border border-white/20
                  shadow-[0_8px_32px_rgba(0,0,0,0.25)]
                  rounded-full
                  py-4 px-6 md:px-10
                  flex flex-col md:flex-row items-center justify-center md:justify-between
                  gap-3 md:gap-6
                  before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-b before:from-white/20 before:to-transparent
                  before:opacity-30 before:pointer-events-none
                ">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                Powered by
                </p>
                  <div
                      className="flex gap-6 md:gap-10 transition-all duration-500 h-10">
                      <div className="flex items-center space-x-2">
                          <img
                              src="https://remotive.com/remotive_website_layout/static/src/brand/SVG/wordmark_H_orange.svg"
                              alt="Remotive" width={125}/>
                      </div>
                      <div className="flex items-center space-x-2">
                          <img src={Muse} alt="Muse" width={115}/>
                      </div>
                      <div className="flex items-center space-x-2">
                          <img src="https://zunastatic-abf.kxcdn.com/images/global/adzuna_logo.svg" alt="Adzuna"
                               width={125}/>
                      </div>
                      <div className="flex items-center space-x-2 hidden sm:flex">
                          <img src="https://www.arbeitnow.com/images/logo.png" alt="arbeitnow" width={125}/>
                      </div>
                      <div className="flex items-center space-x-2">
                          <img src={Jobicy} alt="Jobicy" width={115}/>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}