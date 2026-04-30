import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    X, Heart, SlidersHorizontal, Info, Briefcase,
    MapPin, DollarSign, ChevronLeft, Check, Code2,
    Layers, RotateCcw
} from 'lucide-react';
import {useNavigate} from "react-router-dom";

const MOCK_JOBS = [
    {
        id: '1',
        company: 'TechNova',
        role: 'Frontend Developer',
        salary: 'R$ 8.000 - 12.000',
        seniority: 'Pleno',
        location: 'Remoto',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
        description: 'Estamos buscando um Desenvolvedor Frontend Pleno para criar interfaces incríveis para nossos produtos core. Você será parte de um time ágil focado em performance.',
        requirements: ['3+ anos de experiência com React', 'Proficiência em TypeScript', 'Experiência com testes automatizados (Jest/Testing Library)', 'Familiaridade com CI/CD'],
        benefits: ['Plano de Saúde Internacional', 'Vale Alimentação R$ 1000', 'Auxílio Home Office', 'Gympass', 'Horário Flexível'],
        applyUrl: 'https://example.com/apply/1'
    },
    {
        id: '2',
        company: 'DataFlow Inc.',
        role: 'Backend Engineer',
        salary: 'R$ 12.000 - 16.000',
        seniority: 'Sênior',
        location: 'Híbrido (São Paulo)',
        skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
        description: 'Procuramos um engenheiro experiente para escalar nossa arquitetura de microserviços de alta disponibilidade. O desafio envolve lidar com alto volume de transações financeiras.',
        requirements: ['5+ anos em Node.js/Python', 'Experiência sólida com AWS (EC2, S3, SQS)', 'Arquitetura orientada a eventos', 'Otimização de queries SQL avançadas'],
        benefits: ['Plano de Saúde Top', 'Bônus Anual agressivo', 'Stock Options', 'Verba de Educação (R$ 5k/ano)'],
        applyUrl: 'https://example.com/apply/2'
    },
    {
        id: '3',
        company: 'FintechX',
        role: 'Fullstack Developer',
        salary: 'R$ 6.000 - 9.000',
        seniority: 'Júnior/Pleno',
        location: 'Remoto',
        skills: ['React', 'Java', 'Spring Boot'],
        description: 'Junte-se ao nosso time para revolucionar o mercado financeiro. Atuação de ponta a ponta nas features, desde a concepção do banco de dados até a tela final no app.',
        requirements: ['Experiência prévia com Java e React', 'Conhecimento em bancos relacionais', 'Vontade de aprender e crescer com mentoria'],
        benefits: ['PLR agressiva', 'Vale Refeição R$ 1200', 'Seguro de Vida', 'Zenklub'],
        applyUrl: 'https://example.com/apply/3'
    },
    {
        id: '4',
        company: 'CloudOps',
        role: 'DevOps Engineer',
        salary: 'R$ 14.000 - 18.000',
        seniority: 'Sênior',
        location: 'Remoto',
        skills: ['Kubernetes', 'Terraform', 'CI/CD', 'AWS'],
        description: 'Buscamos um especialista em infraestrutura para liderar a modernização dos nossos clusters e disseminar a cultura de automação entre os squads de desenvolvimento.',
        requirements: ['Domínio de Kubernetes em produção', 'Terraform avançado', 'Vivência sólida em cultura SRE e monitoramento (Datadog/Prometheus)'],
        benefits: ['Salário competitivo', 'Acesso a certificações pagas', 'Home office flexível', 'Equipamento Apple'],
        applyUrl: 'https://example.com/apply/4'
    },
    {
        id: '5',
        company: 'Agência Criativa',
        role: 'Frontend UI Developer',
        salary: 'R$ 4.000 - 6.000',
        seniority: 'Júnior',
        location: 'Presencial (Rio de Janeiro)',
        skills: ['HTML/CSS', 'JavaScript', 'Vue.js'],
        description: 'Ótima oportunidade para quem quer focar em animações e interfaces pixel-perfect em projetos de alto impacto visual para grandes marcas globais.',
        requirements: ['Paixão por CSS e design', 'Noções de Vue.js ou React', 'Portfólio com projetos visuais bem polidos'],
        benefits: ['Ambiente descontraído', 'Sexta-feira curta (half-day)', 'Cursos de design', 'Pet friendly'],
        applyUrl: 'https://example.com/apply/5'
    }
];

const SKILL_OPTIONS = ['React', 'Node.js', 'TypeScript', 'Java', 'AWS', 'Kubernetes', 'Vue.js'];
const ROLE_OPTIONS = ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile'];
const SENIORITY_OPTIONS = ['Júnior', 'Pleno', 'Sênior'];

// --- COMPONENTES ---

// Componente: Painel de Detalhes da Vaga (Compartilhado entre Mobile e Desktop)
const JobDetailsView = ({ job, onClose, onApply, isMobile }) => {
    if (!job) return null;

    return (
        <div className="h-full flex flex-col relative bg-white">
            {/* Header específico para Mobile */}
            {isMobile && (
                <div className="sticky top-0 bg-white/90 backdrop-blur-md p-4 flex items-center border-b border-zinc-100 z-20">
                    <button onClick={onClose} className="p-2 mr-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-zinc-700" />
                    </button>
                    <span className="font-semibold text-zinc-800">Detalhes da Vaga</span>
                </div>
            )}

            {/* Header específico para Desktop */}
            {!isMobile && (
                <div className="hidden lg:flex items-center p-6 border-b border-zinc-100 bg-zinc-50/50 flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-zinc-400 mr-3" />
                    <span className="font-semibold text-zinc-600 text-sm uppercase tracking-wider">Visualização da Vaga</span>
                </div>
            )}

            {/* Conteúdo Rolável */}
            <div className="flex-grow overflow-y-auto p-6 lg:p-10 pb-32 lg:pb-32 custom-scrollbar">
                <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-2">{job.role}</h1>
                <p className="text-xl text-zinc-600 mb-6">{job.company}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                        <DollarSign className="w-5 h-5 text-zinc-400 mb-3" />
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Salário</p>
                        <p className="font-medium text-zinc-800">{job.salary}</p>
                    </div>
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                        <MapPin className="w-5 h-5 text-zinc-400 mb-3" />
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Local</p>
                        <p className="font-medium text-zinc-800">{job.location}</p>
                    </div>
                </div>

                <section className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-2">Sobre a vaga</h3>
                    <p className="text-zinc-600 leading-relaxed">{job.description}</p>
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-2">Requisitos</h3>
                    <ul className="space-y-3">
                        {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start">
                                <div className="min-w-4 mt-1 mr-3"><Check className="w-4 h-4 text-zinc-800" /></div>
                                <span className="text-zinc-600">{req}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-2">Stack / Tecnologias</h3>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                            <span key={idx} className="px-4 py-1.5 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium border border-zinc-200">
                {skill}
              </span>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-2">Benefícios</h3>
                    <ul className="grid grid-cols-1 gap-2">
                        {job.benefits.map((ben, idx) => (
                            <li key={idx} className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-zinc-700 text-sm flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mr-3"></div>
                                {ben}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Botão de Aplicar Fixo no Rodapé */}
            <div className="absolute bottom-0 left-0 w-full p-4 lg:p-6 bg-gradient-to-t from-white via-white to-white/0 z-20">
                <button
                    onClick={() => onApply(job)}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg py-4 rounded-xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    <Heart className="w-5 h-5 text-zinc-300" fill="currentColor" />
                    <span>{isMobile ? "Candidatar-se" : "Candidatar-se à Vaga"}</span>
                </button>
            </div>
        </div>
    );
};


// Componente: Cartão de Arraste (SwipeCard)
const SwipeCard = ({ job, onSwipe, onClick, isTopCard, forceSwipe }) => {
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [exitDir, setExitDir] = useState(null);
    const cardRef = useRef(null);

    // Ouve eventos de botões externos
    useEffect(() => {
        if (forceSwipe) setExitDir(forceSwipe);
    }, [forceSwipe]);

    const handleDragStart = (clientX, clientY) => {
        if (!isTopCard || exitDir) return;
        setDragStart({ x: clientX, y: clientY });
        setIsDragging(true);
    };

    const handleDragMove = (clientX, clientY) => {
        if (!isDragging) return;
        const offsetX = clientX - dragStart.x;
        const offsetY = clientY - dragStart.y;
        setDragOffset({ x: offsetX, y: offsetY });
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const swipeThreshold = 100; // Limite em pixels para confirmar swipe
        if (dragOffset.x > swipeThreshold) {
            setExitDir('right');
            setTimeout(() => onSwipe('right'), 300);
        } else if (dragOffset.x < -swipeThreshold) {
            setExitDir('left');
            setTimeout(() => onSwipe('left'), 300);
        } else {
            // Retorna ao centro caso não atinja o threshold
            setDragOffset({ x: 0, y: 0 });
        }
    };

    // Eventos Mobile (Corrigidos)
    const onTouchStart = (e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = handleDragEnd;

    // Eventos Desktop
    const onMouseDown = (e) => handleDragStart(e.clientX, e.clientY);
    const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = handleDragEnd;
    const onMouseLeave = () => { if (isDragging) handleDragEnd(); };

    // Cálculos para animações visuais fluidas
    const currentX = exitDir === 'right' ? 500 : exitDir === 'left' ? -500 : dragOffset.x;
    const rotate = currentX * 0.05;
    const likeOpacity = Math.min(Math.max(currentX / 100, 0), 1);
    const nopeOpacity = Math.min(Math.max(-currentX / 100, 0), 1);

    const style = isTopCard ? {
        transform: `translate(${exitDir === 'right' ? '150%' : exitDir === 'left' ? '-150%' : dragOffset.x + 'px'}, ${dragOffset.y}px) rotate(${rotate}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab'
    } : {};

    return (
        <div
            ref={cardRef}
            className={`absolute w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200 select-none ${!isTopCard && 'pointer-events-none'}`}
            style={{
                ...style,
                zIndex: isTopCard ? 10 : 1,
                transform: isTopCard ? style.transform : 'scale(0.95) translateY(20px)',
                opacity: isTopCard ? (exitDir ? 0 : 1) : 0.8,
                transition: isTopCard ? style.transition : 'all 0.3s ease'
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            {isTopCard && (
                <>
                    <div className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-bold text-4xl px-4 py-2 rounded-lg transform -rotate-12 z-20 pointer-events-none" style={{ opacity: likeOpacity }}>
                        APLICAR
                    </div>
                    <div className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold text-4xl px-4 py-2 rounded-lg transform rotate-12 z-20 pointer-events-none" style={{ opacity: nopeOpacity }}>
                        DESCARTAR
                    </div>
                </>
            )}

            <div
                className="flex flex-col h-full cursor-pointer"
                onClick={() => {
                    if (Math.abs(dragOffset.x) < 10 && Math.abs(dragOffset.y) < 10) onClick();
                }}
            >
                <div className="flex-grow p-6 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/50 to-transparent relative">
                    <div className="absolute inset-0 bg-zinc-800 -z-10"></div>

                    <div className="text-white">
                        <h2 className="text-3xl font-bold mb-1">{job.role}</h2>
                        <div className="flex items-center text-zinc-300 mb-4">
                            <Briefcase className="w-4 h-4 mr-2" />
                            <span className="text-lg font-medium">{job.company}</span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm bg-black/40 backdrop-blur-sm p-2 rounded-lg w-fit">
                                <DollarSign className="w-4 h-4 mr-2 text-zinc-400" />
                                <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center text-sm bg-black/40 backdrop-blur-sm p-2 rounded-lg w-fit">
                                <MapPin className="w-4 h-4 mr-2 text-zinc-400" />
                                <span>{job.location}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {job.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-zinc-200/20 rounded-full text-xs font-medium border border-zinc-500/30">
                  {skill}
                </span>
                            ))}
                            {job.skills.length > 3 && (
                                <span className="px-3 py-1 bg-zinc-200/20 rounded-full text-xs font-medium border border-zinc-500/30">
                  +{job.skills.length - 3}
                </span>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 text-zinc-400 animate-pulse hidden sm:block">
                        <Info className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- APP PRINCIPAL ---
export default function DevSwipe() {
    const [jobs, setJobs] = useState([]);
    const [interactedIds, setInteractedIds] = useState(new Set());

    const [activeJobIndex, setActiveJobIndex] = useState(0);
    const [selectedJobDetails, setSelectedJobDetails] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [swipeAnimation, setSwipeAnimation] = useState(null);

    const [filters, setFilters] = useState({ role: '', seniority: '', skills: [] });
    const navigate = useNavigate();


    // Define o título da aba do navegador
    useEffect(() => {
        document.title = "DevSwipe";
    }, []);

    // Init Histórico
    useEffect(() => {
        const saved = localStorage.getItem('devswipe_interacted');
        if (saved) setInteractedIds(new Set(JSON.parse(saved)));
    }, []);

    // Sync Jobs + Filtros
    useEffect(() => {
        let filtered = MOCK_JOBS.filter(job => !interactedIds.has(job.id));
        if (filters.role) filtered = filtered.filter(job => job.role.toLowerCase().includes(filters.role.toLowerCase()));
        if (filters.seniority) filtered = filtered.filter(job => job.seniority === filters.seniority);
        if (filters.skills.length > 0) filtered = filtered.filter(job => filters.skills.some(skill => job.skills.includes(skill)));

        setJobs(filtered);
        setActiveJobIndex(0);
    }, [filters, interactedIds]);

    const recordInteraction = useCallback((jobId, action) => {
        setInteractedIds(prev => {
            const newSet = new Set(prev);
            newSet.add(jobId);
            localStorage.setItem('devswipe_interacted', JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    }, []);

    // Botões Programáticos de Swipe
    const triggerSwipe = useCallback((direction) => {
        if (activeJobIndex >= jobs.length || swipeAnimation) return;
        const currentJob = jobs[activeJobIndex];

        setSwipeAnimation(direction); // Anima o card
        setTimeout(() => {
            if (direction === 'right') window.open(currentJob.applyUrl, '_blank');
            recordInteraction(currentJob.id, direction);
            setSwipeAnimation(null);
            setSelectedJobDetails(null); // Reseta a vaga detalhada na direita/modal
        }, 300);
    }, [activeJobIndex, jobs, swipeAnimation, recordInteraction]);

    const resetHistory = () => {
        localStorage.removeItem('devswipe_interacted');
        setInteractedIds(new Set());
    };

    const currentJob = jobs[activeJobIndex];
    const nextJob = jobs[activeJobIndex + 1];

    return (
        // Fundo geral preenchendo a tela, adaptável (paddings apenas em Desktop)
        <div className="min-h-screen bg-zinc-200 text-zinc-900 flex justify-center items-center overflow-hidden sm:p-6 lg:p-10" style={{ fontFamily: "'Ubuntu', sans-serif" }}>

            {/* Container Responsivo: Simulador Mobile nas telas pequenas, Painel Completo nas grandes */}
            <div className="w-full max-w-5xl h-[100dvh] sm:h-[85vh] sm:min-h-[700px] bg-zinc-50 flex flex-col lg:flex-row relative shadow-2xl sm:rounded-3xl border-zinc-200 sm:border overflow-hidden">

                {/* --- COLUNA ESQUERDA: Feed de Swipe --- */}
                <div className="w-full lg:w-[450px] lg:min-w-[450px] flex-shrink-0 h-full flex flex-col relative bg-zinc-50 z-10 border-r border-zinc-200">

                    {/* Header Mobile/Esquerda */}
                    <header className="flex justify-between items-center p-4 border-b border-zinc-200 bg-white shadow-sm z-10">
                        <div onClick={() => navigate(-1)} className="cursor-pointer flex items-center space-x-2 text-zinc-800">
                            <Code2 className="w-8 h-8" strokeWidth={2.5} />
                            <h1 className="text-xl font-black tracking-tight">DevSwipe</h1>
                        </div>
                        <button onClick={() => setShowFilters(true)} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                            <SlidersHorizontal className="w-5 h-5 text-zinc-700" />
                        </button>
                    </header>

                    {/* Área Central dos Cards */}
                    <main className="flex-grow relative overflow-hidden p-4 flex flex-col justify-center items-center">
                        {jobs.length > 0 ? (
                            <div className="relative w-full max-w-sm mx-auto h-[65vh] max-h-[550px] lg:h-[550px]">
                                {nextJob && (
                                    <SwipeCard job={nextJob} isTopCard={false} />
                                )}

                                {currentJob && (
                                    <SwipeCard
                                        key={currentJob.id} // Fundamental para resetar estado interno ao trocar card
                                        job={currentJob}
                                        isTopCard={true}
                                        forceSwipe={swipeAnimation}
                                        onSwipe={(dir) => {
                                            if (dir === 'right') window.open(currentJob.applyUrl, '_blank');
                                            recordInteraction(currentJob.id, dir);
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
                                <button onClick={resetHistory} className="flex items-center space-x-2 bg-zinc-200 text-zinc-700 px-5 py-2.5 rounded-lg font-bold hover:bg-zinc-300 transition-colors">
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Resetar Histórico</span>
                                </button>
                            </div>
                        )}
                    </main>

                    {/* Botões do Rodapé */}
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

                    {/* Modal Mobile (Sobe por cima do feed em telas pequenas) */}
                    <div className={`lg:hidden absolute inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${selectedJobDetails ? 'translate-y-0' : 'translate-y-full'} overflow-hidden`}>
                        <JobDetailsView
                            job={selectedJobDetails}
                            onClose={() => setSelectedJobDetails(null)}
                            onApply={(jobClicked) => {
                                if (currentJob && jobClicked.id === currentJob.id) {
                                    triggerSwipe('right');
                                } else {
                                    window.open(jobClicked.applyUrl, '_blank');
                                    recordInteraction(jobClicked.id, 'right');
                                    setSelectedJobDetails(null);
                                }
                            }}
                            isMobile={true}
                        />
                    </div>
                </div>

                {/* --- COLUNA DIREITA: Detalhes da Vaga (Desktop Apenas) --- */}
                <div className="hidden lg:flex flex-1 bg-white flex-col overflow-hidden relative">
                    {currentJob ? (
                        <JobDetailsView
                            job={selectedJobDetails || currentJob} // Mostra a selecionada, senão a do topo
                            onClose={() => setSelectedJobDetails(null)}
                            onApply={(jobClicked) => {
                                if (currentJob && jobClicked.id === currentJob.id) {
                                    triggerSwipe('right'); // Sincroniza click direito com animação na esquerda
                                } else {
                                    window.open(jobClicked.applyUrl, '_blank');
                                    recordInteraction(jobClicked.id, 'right');
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

                {/* Modal de Filtros (Sobrepõe toda a tela) */}
                {showFilters && (
                    <div className="absolute inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4 animate-in fade-in duration-200 backdrop-blur-sm">
                        <div className="bg-white w-full lg:max-w-lg h-[85vh] lg:h-auto lg:max-h-[85vh] rounded-t-3xl lg:rounded-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-full lg:slide-in-from-bottom-8 overflow-hidden">

                            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/50">
                                <h2 className="text-xl font-bold text-zinc-800">Filtrar Vagas</h2>
                                <button onClick={() => setShowFilters(false)} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200">
                                    <X className="w-5 h-5 text-zinc-600" />
                                </button>
                            </div>

                            <div className="p-6 lg:p-8 overflow-y-auto flex-grow space-y-8 custom-scrollbar">
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Área de Atuação</h3>
                                    <select
                                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 font-medium outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all cursor-pointer"
                                        value={filters.role}
                                        onChange={(e) => setFilters({...filters, role: e.target.value})}
                                    >
                                        <option value="">Todas as áreas</option>
                                        {ROLE_OPTIONS.map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Nível de Experiência</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {SENIORITY_OPTIONS.map(level => (
                                            <button
                                                key={level}
                                                onClick={() => setFilters({...filters, seniority: filters.seniority === level ? '' : level})}
                                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                                                    filters.seniority === level
                                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'
                                                }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Principais Tecnologias</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {SKILL_OPTIONS.map(skill => {
                                            const isSelected = filters.skills.includes(skill);
                                            return (
                                                <button
                                                    key={skill}
                                                    onClick={() => {
                                                        const newSkills = isSelected
                                                            ? filters.skills.filter(s => s !== skill)
                                                            : [...filters.skills, skill];
                                                        setFilters({...filters, skills: newSkills});
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-sm transition-all border flex items-center space-x-1 font-medium ${
                                                        isSelected
                                                            ? 'bg-zinc-100 text-zinc-900 border-zinc-400'
                                                            : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="w-3.5 h-3.5 mr-1" />}
                                                    <span>{skill}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 lg:p-6 border-t border-zinc-100 flex gap-4 bg-zinc-50/50">
                                <button
                                    onClick={() => setFilters({ role: '', seniority: '', skills: [] })}
                                    className="flex-1 py-4 text-zinc-600 font-bold hover:bg-zinc-100 rounded-xl transition-colors"
                                >
                                    Limpar Tudo
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-[2] py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-zinc-800 transition-colors"
                                >
                                    Ver Resultados
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d8; }
      `}} />
        </div>
    );
}