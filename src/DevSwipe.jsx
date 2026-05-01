import React, { useState, useEffect, useCallback } from 'react';
import { X, Heart, SlidersHorizontal, Check, Code2, Layers, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { SwipeCard } from "./components/SwipeCard.jsx";
import { JobDetailsView } from "./components/JobDetailsView.jsx";
import { useJobSearch } from "./hooks/JobSearch.jsx";

const SKILL_OPTIONS = ['React', 'Node.js', 'TypeScript', 'Java', 'AWS', 'Kubernetes', 'Vue.js'];
const ROLE_OPTIONS = ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'Data/ML', 'Design'];
const SENIORITY_OPTIONS = ['Júnior', 'Pleno', 'Sênior'];
const WORK_MODE_OPTIONS = ['remote', 'hybrid', 'on_site'];

export default function DevSwipe() {
    const { jobs, loading, filters, setFilters, pagination, loadMoreJobs } = useJobSearch();
    const [showFilters, setShowFilters] = useState(false);
    const [activeJobIndex, setActiveJobIndex] = useState(0);
    const [selectedJobDetails, setSelectedJobDetails] = useState(null);
    const [swipeAnimation, setSwipeAnimation] = useState(null);
    const [currentJob, setCurrentJob] = useState(null);
    const [nextJob, setNextJob] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "DevSwipe";
    }, []);

    useEffect(() => {
        if (jobs.length > 0 && activeJobIndex < jobs.length) {
            setCurrentJob(jobs[activeJobIndex]);
            setNextJob(jobs[activeJobIndex + 1] || null);
        } else {
            setCurrentJob(null);
            setNextJob(null);
        }
    }, [jobs, activeJobIndex]);

    useEffect(() => {
        const threshold = Math.max(2, Math.ceil(jobs.length / 3));
        if (activeJobIndex >= jobs.length - threshold && !loading && pagination?.has_next) {
            console.log(`Carregando mais jobs (índice: ${activeJobIndex}, total: ${jobs.length})`);
            loadMoreJobs();
        }
    }, [activeJobIndex, jobs.length, loading, pagination?.has_next, loadMoreJobs]);

    const triggerSwipe = useCallback((direction) => {
        if (activeJobIndex >= jobs.length || swipeAnimation) return;

        setSwipeAnimation(direction);

        setTimeout(() => {
            if (direction === 'right' && currentJob?.external_url) {
                window.open(currentJob.external_url, '_blank');
            }

            setSelectedJobDetails(null);
            setSwipeAnimation(null);
            setActiveJobIndex((prev) => prev + 1);

        }, 300);
    }, [activeJobIndex, jobs.length, swipeAnimation, currentJob]);

    const getCurrentPage = () => {
        if (pagination.per_page === 0) return 1;
        return Math.floor(activeJobIndex / pagination.per_page) + 1;
    };


    if (loading && jobs.length === 0 && !showFilters) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-600">Carregando vagas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-200 text-zinc-900 flex justify-center items-center overflow-hidden sm:p-6 lg:p-10" style={{ fontFamily: "'Ubuntu', sans-serif" }}>

            <div className="w-full max-w-5xl h-[100dvh] sm:h-[85vh] sm:min-h-[700px] bg-zinc-50 flex flex-col lg:flex-row relative shadow-2xl sm:rounded-3xl border-zinc-200 sm:border overflow-hidden">

                <div className="w-full lg:w-[450px] lg:min-w-[450px] flex-shrink-0 h-full flex flex-col relative bg-zinc-50 z-10 border-r border-zinc-200">

                    <header className="flex justify-between items-center p-4 border-b border-zinc-200 bg-white shadow-sm z-10">
                        <div onClick={() => navigate(-1)} className="cursor-pointer flex items-center space-x-2 text-zinc-800">
                            <Code2 className="w-8 h-8" strokeWidth={2.5} />
                            <h1 className="text-xl font-black tracking-tight">DevSwipe</h1>
                        </div>
                        <button onClick={() => setShowFilters(true)} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                            <SlidersHorizontal className="w-5 h-5 text-zinc-700" />
                        </button>
                    </header>


                    <main className="flex-grow relative overflow-hidden p-4 flex flex-col justify-center items-center">
                        {jobs.length > 0 ? (
                            <div className="relative w-full max-w-sm mx-auto h-[65vh] max-h-[550px] lg:h-[550px]">
                                {nextJob && (
                                    <SwipeCard job={nextJob} isTopCard={false} />
                                )}

                                {currentJob && (
                                    <SwipeCard
                                        key={currentJob.id}
                                        job={currentJob}
                                        isTopCard={true}
                                        forceSwipe={swipeAnimation}
                                        onSwipe={(dir) => {
                                            if (dir === 'right' && currentJob?.external_url) {
                                                window.open(currentJob.external_url, '_blank');
                                            }
                                            setSelectedJobDetails(null);
                                        }}
                                        onClick={() => setSelectedJobDetails(currentJob)}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-8 text-zinc-500 h-full">
                                <Layers className="w-16 h-16 mb-4 text-zinc-300" />
                                <h2 className="text-xl font-bold text-zinc-700 mb-2">Fim da linha!</h2>
                                <p className="mb-6 text-sm">Não há mais vagas no momento com os filtros selecionados.</p>
                                <button
                                    onClick={() => setFilters("reset")}
                                    className="px-6 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        )}
                    </main>
                    {jobs.length > 0 && (
                        <div className="px-4 pt-4 pb-2">
                            <div className="mt-2 text-xs text-zinc-400 text-center">
                                Página {getCurrentPage()} de {pagination.total_pages || 1}
                            </div>
                        </div>
                    )}
                    <footer className="h-24 bg-white border-t border-zinc-200 flex justify-center items-center gap-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
                        <button
                            onClick={() => triggerSwipe('left')}
                            disabled={!currentJob || !!swipeAnimation}
                            className="w-14 h-14 bg-white border-2 border-zinc-200 rounded-full flex justify-center items-center text-zinc-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all disabled:opacity-50 shadow-sm"
                        >
                            <X className="w-6 h-6" strokeWidth={3} />
                        </button>
                        <button
                            onClick={() => triggerSwipe('right')}
                            disabled={!currentJob || !!swipeAnimation}
                            className="w-16 h-16 bg-zinc-900 rounded-full flex justify-center items-center text-white hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-lg transform hover:scale-105"
                        >
                            <Heart className="w-7 h-7" strokeWidth={2.5} fill="currentColor" />
                        </button>
                    </footer>

                    <div className={`lg:hidden absolute inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${selectedJobDetails ? 'translate-y-0' : 'translate-y-full'} overflow-hidden`}>
                        <JobDetailsView
                            job={selectedJobDetails}
                            onClose={() => setSelectedJobDetails(null)}
                            onApply={(jobClicked) => {
                                if (currentJob && jobClicked.id === currentJob.id) {
                                    triggerSwipe('right');
                                } else {
                                    window.open(jobClicked.external_url, '_blank');
                                    setSelectedJobDetails(null);
                                }
                            }}
                            isMobile={true}
                        />
                    </div>
                </div>

                <div className="hidden lg:flex flex-1 bg-white flex-col overflow-hidden relative">
                    {currentJob ? (
                        <JobDetailsView
                            job={currentJob}
                            onClose={() => setSelectedJobDetails(null)}
                            onApply={(jobClicked) => {
                                if (currentJob && jobClicked.id === currentJob.id) {
                                    triggerSwipe('right');
                                } else {
                                    window.open(jobClicked.external_url, '_blank');
                                    setSelectedJobDetails(null);
                                }
                            }}
                            isMobile={false}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 text-zinc-400 h-full bg-zinc-50">
                            <Code2 className="w-24 h-24 mb-6 text-zinc-200" />
                            <h2 className="text-2xl font-bold text-zinc-300 mb-2">DevSwipe</h2>
                            <p className="max-w-xs">Navegue pelas vagas arrastando os cards na lateral. Os detalhes completos aparecerão aqui.</p>
                        </div>
                    )}
                </div>

                {showFilters && (
                    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full lg:max-w-lg h-[90vh] lg:h-auto lg:max-h-[85vh] rounded-t-3xl lg:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full lg:slide-in-from-bottom-8">

                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/50">
                                <h2 className="text-xl font-bold text-zinc-800">Filtrar Vagas</h2>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-6 lg:p-8 overflow-y-auto flex-grow space-y-8 custom-scrollbar">


                                {/* Área de Atuação */}
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
                                        Área de Atuação
                                    </h3>
                                    <select
                                        value={filters.role_area}
                                        onChange={(e) => setFilters("role_area", e.target.value)}
                                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 font-medium outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition cursor-pointer"
                                    >
                                        <option value="">Todas as áreas</option>
                                        {ROLE_OPTIONS.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
                                        Nível de Experiência
                                    </h3>
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {SENIORITY_OPTIONS.map((level) => {
                                            const active = filters.seniority.includes(level);
                                            return (
                                                <button
                                                    key={level}
                                                    onClick={() => {
                                                        const updated = active
                                                            ? filters.seniority.filter((s) => s !== level)
                                                            : [...filters.seniority, level];

                                                        setFilters("seniority", updated);
                                                    }}
                                                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                                                        active
                                                            ? "bg-zinc-900 text-white"
                                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                                    }`}
                                                >
                                                    {level}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col p-4 lg:p-6 border-t border-zinc-200 flex gap-4 bg-zinc-50/50">
                                <button
                                    onClick={() => setFilters("reset")}
                                    className="flex-1 py-4 text-zinc-600 border border-zinc-200 font-bold hover:bg-zinc-100 rounded-xl transition"
                                >
                                    Limpar Tudo
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-[2] py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-zinc-800 transition"
                                >
                                    Buscar Vagas
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
}