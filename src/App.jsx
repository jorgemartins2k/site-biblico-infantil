import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  Download,
  BookOpen,
  Gamepad,
  Palette,
  Users,
  ShieldCheck,
  Star,
  Check,
  VolumeX,
} from "lucide-react";

// --- Custom Hooks ---

function useTimer(initialMinutes = 20) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = sessionStorage.getItem("lp_timer_remaining");
    return saved ? parseInt(saved, 10) : initialMinutes * 60;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return initialMinutes * 60;
        const next = prev - 1;
        sessionStorage.setItem("lp_timer_remaining", next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [initialMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-scroll]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}

// --- Components ---

const OfferBanner = ({ minutes, seconds }) => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  }, []);

  return (
    <div className="offer-banner">
      <Calendar className="w-5 h-5" />
      <span>
        Oferta Válida até <strong>{currentDate}</strong> — Faltam{" "}
        <strong>
          {minutes}:{seconds}
        </strong>
      </span>
    </div>
  );
};

const Hero = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const handleUnmute = () => {
    setIsMuted(false);
    setShowOverlay(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <section className="hero pt-20">
      <div className="container">
        <h1 data-scroll className="font-black text-primary">
          Ensine a Bíblia de forma Divertida e Inesquecível!
        </h1>
        <p data-scroll>
          Mais de 500 atividades bíblicas prontas para imprimir e aplicar em
          minutos. O material que toda mãe e professora precisava para educar
          com propósito.
        </p>

        <div className="video-container" data-scroll>
          <video
            ref={videoRef}
            src="/assets/videoplayback.mp4"
            playsInline
            loop
            muted={isMuted}
            controls
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          ></video>
          {showOverlay && (
            <div className="vsl-overlay" onClick={handleUnmute}>
              <div className="vsl-unmute-btn">
                <VolumeX />
                <span>Clique para Ativar o Som</span>
              </div>
            </div>
          )}
        </div>

        <a href="#oferta" className="btn btn-primary" data-scroll>
          QUERO GARANTIR MINHA CÓPIA AGORA
        </a>
      </div>
    </section>
  );
};

const Features = () => (
  <section id="what-you-get">
    <div className="container">
      <h2 className="text-center font-black" data-scroll>
        📖 O Que Você Vai Receber
      </h2>
      <div className="grid-4">
        {[
          {
            icon: BookOpen,
            title: "Histórias Ilustradas",
            desc: "Narrativas cativantes que facilitam o entendimento.",
          },
          {
            icon: Palette,
            title: "Desenhos para Colorir",
            desc: "Atividades artísticas para fixar o aprendizado.",
          },
          {
            icon: Gamepad,
            title: "Jogos Bíblicos",
            desc: "Diverta-se enquanto aprende passagens importantes.",
          },
          {
            icon: CheckCircle,
            title: "+500 Atividades",
            desc: "Material completo com labirintos, cruzadinhas e muito mais.",
          },
        ].map((f, i) => (
          <div key={i} className="card" data-scroll>
            <div className="icon-box">
              <f.icon />
            </div>
            <h3 className="font-bold">{f.title}</h3>
            <p className="text-muted">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Benefits = () => (
  <section style={{ backgroundColor: "hsl(var(--card))" }}>
    <div className="container">
      <h2 className="text-center font-black" data-scroll>
        ✨ A Solução Perfeita para Você
      </h2>
      <div className="grid-4">
        {[
          {
            title: "Economia de Tempo",
            desc: "Chega de passar horas procurando conteúdo na internet.",
          },
          {
            title: "Crescimento Espiritual",
            desc: "Base sólida para a educação cristã dos seus filhos.",
          },
          {
            title: "Fácil de Aplicar",
            desc: "Basta baixar, imprimir e começar a usar hoje mesmo.",
          },
          {
            title: "Material Didático",
            desc: "Desenvolvido por especialistas em educação infantil.",
          },
        ].map((b, i) => (
          <div key={i} className="card" data-scroll>
            <Check className="text-primary w-12 h-12 mx-auto mb-4" />
            <h3 className="font-bold">{b.title}</h3>
            <p className="text-muted">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Bonus = () => (
  <section className="bonus-section">
    <div className="container">
      <h2 className="text-center font-black" data-scroll>
        🎁 BÔNUS EXCLUSIVOS (TEMPO LIMITADO)
      </h2>
      <div className="bonus-grid">
        {[
          {
            img: "/assets/bonus-1.png",
            title: "Potinho da Oração",
            desc: "Guia criativo para ensinar sobre gratidão e petição.",
            val: "R$ 47",
          },
          {
            img: "/assets/bonus-2.png",
            title: "Livro de Colorir Especial",
            desc: "20 páginas extras com os personagens favoritos.",
            val: "R$ 39",
          },
          {
            img: "/assets/bonus-3.png",
            title: "Jogos Bíblicos Premium",
            desc: "Quebra-cabeças e desafios de lógica bíblica.",
            val: "R$ 57",
          },
        ].map((b, i) => (
          <div key={i} className="bonus-card" data-scroll>
            <img src={b.img} alt={b.title} />
            <h3 className="font-bold">{b.title}</h3>
            <p>{b.desc}</p>
            <span className="value-tag">
              Valor Individual: <span className="line-through">{b.val}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section>
    <div className="container">
      <div className="text-center mb-16">
        <p className="text-primary font-bold">DEPOIMENTOS 🌟</p>
        <h2 className="font-black">O Que as Mamães Estão Falando</h2>
      </div>
      <div className="testimonials-grid">
        {[
          {
            name: "Carla Silva",
            role: "Mãe e Professora",
            img: "/assets/testimonial-1-dSZDzBmj.jpg",
            content:
              "As atividades são incríveis! Meus filhos pedem para fazer todos os dias. Me ajudou muito na escola dominical.",
          },
          {
            name: "Patrícia Lima",
            role: "Líder de Ministério",
            img: "/assets/testimonial-2-AXhWkqap.jpg",
            content:
              "Um material completo e muito bem ilustrado. Economizo horas de preparo e as crianças amam.",
          },
          {
            name: "Juliana Santos",
            role: "Mãe",
            img: "/assets/testimonial-3-G8_DGLs1.jpg",
            content:
              "Melhor investimento que fiz este ano. O 'Potinho da Oração' virou um ritual diário em nossa casa.",
          },
        ].map((t, i) => (
          <div key={i} className="testimonial-card" data-scroll>
            <div className="stars">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="inline fill-current" />
              ))}
            </div>
            <p className="testimonial-content">"{t.content}"</p>
            <div className="testimonial-user">
              <img src={t.img} alt={t.name} />
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-muted text-sm">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = ({ minutes, seconds }) => (
  <section id="oferta" className="bg-primary" style={{ backgroundColor: "hsla(var(--primary), 0.05)" }}>
    <div className="container text-center">
      <h2 className="font-black" data-scroll>
        Acesso Vitalício por um Preço Especial!
      </h2>
      <p data-scroll>Escolha o melhor plano para você e sua família.</p>

      <div className="pricing-container">
        {/* Basic Plan */}
        <div className="plan-card" data-scroll>
          <div className="plan-header">
            <h3 className="font-bold">Acesso Básico</h3>
            <p className="text-muted">Essencial para começar</p>
            <div className="plan-price">R$ 27</div>
          </div>
          <ul className="plan-features">
            <li>
              <Check className="w-5 h-5" /> 200 Atividades Bíblicas
            </li>
            <li>
              <Check className="w-5 h-5" /> Formato PDF de alta qualidade
            </li>
            <li>
              <Check className="w-5 h-5" /> Acesso imediato via e-mail
            </li>
          </ul>
          <a href="#" className="btn w-full" style={{ border: "2px solid hsl(var(--primary))" }}>
            QUERO O BÁSICO
          </a>
        </div>

        {/* Premium Plan */}
        <div className="plan-card premium" data-scroll>
          <div className="badge-popular">MAIS VENDIDO</div>
          <div className="plan-header">
            <h3 className="font-bold text-primary">Plano Premium</h3>
            <p className="text-muted">Pacote Completo + Bônus</p>
            <div className="plan-price">R$ 47</div>
          </div>
          <ul className="plan-features">
            <li>
              <Check className="w-5 h-5" /> <strong>+500 Atividades Bíblicas</strong>
            </li>
            <li>
              <Check className="w-5 h-5" /> <strong>TODOS OS 3 BÔNUS</strong>
            </li>
            <li>
              <Check className="w-5 h-5" /> Acesso Vitalício
            </li>
            <li>
              <Check className="w-5 h-5" /> Suporte Exclusivo
            </li>
          </ul>
          <a href="#" className="btn btn-primary w-full">
            QUERO TUDO AGORA
          </a>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4" data-scroll>
        <p className="font-bold">ESSA OFERTA ACABA EM:</p>
        <div className="flex gap-4">
          <div className="timer-box">
            <span>{minutes}</span>
          </div>
          <div className="timer-box">
            <span>{seconds}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Author = () => (
  <section>
    <div className="container">
      <div className="author-card" data-scroll>
        <div className="author-image">
          <img
            src="/assets/smiley-woman-holding-closed-book.jpg"
            alt="Ana Cristina"
          />
          <div className="author-tag">AUTORA</div>
        </div>
        <div>
          <h2 className="font-black mb-4">Ana Cristina</h2>
          <p className="text-muted mb-6">
            Mãe, educadora e apaixonada pelo ensino da palavra de Deus para os
            pequenos. Minha missão é ajudar famílias a construírem um legado de
            fé através de materiais divertidos e edificantes.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Users className="text-primary" />
              <span className="font-bold">+10k Alunos</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-primary fill-current" />
              <span className="font-bold">4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="text-center">
    <div className="container">
      <div className="flex justify-center gap-8 mb-12">
        <ShieldCheck className="w-12 h-12 opacity-50" />
        <Download className="w-12 h-12 opacity-50" />
      </div>
      <p className="opacity-60 text-sm">
        © 2026 Coleção Bíblica Infantil. Todos os direitos reservados. <br />
        Este site não faz parte do Facebook ou Google.
      </p>
    </div>
  </footer>
);

// --- Main App ---

function App() {
  const { minutes, seconds } = useTimer(20);
  useScrollAnimations();

  return (
    <main>
      <OfferBanner minutes={minutes} seconds={seconds} />
      <Hero />
      <Features />
      <Benefits />
      <Bonus />
      <Testimonials />
      <Pricing minutes={minutes} seconds={seconds} />
      <Author />
      <Footer />
    </main>
  );
}

export default App;
