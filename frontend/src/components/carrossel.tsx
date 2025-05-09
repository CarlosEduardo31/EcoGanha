"use client"
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export function Carrossel() {
  // Adicione mais itens ao carrossel conforme necessário
  const carouselItems = [
    {
      id: 1,
      image: "/ImageCarrossel1.svg",
      title: "Redução de Resíduos",
      description: "Ajude a reduzir o impacto ambiental do São João de Caruaru"
    },
    {
      id: 2,
      image: "/ImageCarrossel1.svg", // Substitua pelo caminho correto da imagem
      title: "Ganhe Descontos",
      description: "Troque pontos por descontos exclusivos em produtos e serviços"
    },
    {
      id: 3,
      image: "/ImageCarrossel1.svg", // Substitua pelo caminho correto da imagem
      title: "Proteja o Meio Ambiente",
      description: "Contribua para um futuro mais sustentável para nossa cidade"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Função para avançar o carrossel
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  }, [carouselItems.length]);

  // Função para voltar o carrossel
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  }, [carouselItems.length]);

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [nextSlide]);

  // Manipuladores de eventos de toque para suporte a gestos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Deslizar para a esquerda (próximo)
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Deslizar para a direita (anterior)
      prevSlide();
    }
  };

  return (
    <div className="w-full my-8 px-4">
      <h1 className="text-center text-lg sm:text-xl font-semibold text-[#003F25] mb-6">
        Benefícios da Iniciativa
      </h1>

      {/* Container principal do carrossel */}
      <div 
        className="relative overflow-hidden rounded-lg shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides do carrossel */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-48 sm:h-64 md:h-72 lg:h-80"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item) => (
            <div key={item.id} className="min-w-full relative">
              <Image
                src={item.image}
                alt={item.title}
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
                priority={item.id === 1}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-white font-semibold text-lg">{item.title}</h2>
                <p className="text-white text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 focus:outline-none"
          aria-label="Slide anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 focus:outline-none"
          aria-label="Próximo slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores de posição */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}