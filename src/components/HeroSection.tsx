
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative">
      {/* Фоновое изображение */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1527515673510-8e07b413110e?auto=format&fit=crop&q=80" 
          alt="Клининговые услуги" 
          className="w-full h-full object-cover brightness-[0.65]"
        />
      </div>
      
      <div className="relative z-10 px-4 py-24 sm:py-32 md:py-40 max-w-7xl mx-auto">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Профессиональный клининг для вашего дома и офиса
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Предоставляем качественные услуги по уборке помещений с применением профессионального оборудования и экологичных средств
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/services">Наши услуги</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
