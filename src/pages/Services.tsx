
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Моковые данные услуг
const allServices = [
  {
    id: 1,
    title: "Уборка квартир",
    description: "Комплексная уборка жилых помещений любой площади с применением профессиональных средств",
    price: "от 2000 ₽",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80",
    category: "residential"
  },
  {
    id: 2,
    title: "Уборка офисов",
    description: "Профессиональная уборка офисных помещений и бизнес-центров по индивидуальному графику",
    price: "от 3000 ₽",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80",
    category: "commercial"
  },
  {
    id: 3,
    title: "Мойка окон",
    description: "Качественная мойка окон и витражей любой сложности на высоте до 30 этажа",
    price: "от 1500 ₽",
    image: "https://images.unsplash.com/photo-1527689638836-411945a2b57c?auto=format&fit=crop&q=80",
    category: "specialized"
  },
  {
    id: 4,
    title: "Химчистка мебели",
    description: "Глубокая чистка мягкой мебели, ковров и матрасов с удалением пятен и запахов",
    price: "от 2500 ₽",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80",
    category: "specialized"
  },
  {
    id: 5,
    title: "Генеральная уборка",
    description: "Комплексная уборка с особым вниманием к деталям и труднодоступным местам",
    price: "от 4500 ₽",
    image: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&q=80",
    category: "residential"
  },
  {
    id: 6,
    title: "Послестроительная уборка",
    description: "Профессиональная уборка после ремонта или строительства с удалением строительной пыли",
    price: "от 5000 ₽",
    image: "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?auto=format&fit=crop&q=80",
    category: "specialized"
  },
  {
    id: 7,
    title: "Уборка коммерческих объектов",
    description: "Регулярная или разовая уборка торговых центров, магазинов, ресторанов",
    price: "от 4000 ₽",
    image: "https://images.unsplash.com/photo-1613618796124-3e8c74d585d9?auto=format&fit=crop&q=80",
    category: "commercial"
  },
  {
    id: 8,
    title: "Дезинфекция помещений",
    description: "Тщательная дезинфекция с применением специальных средств и оборудования",
    price: "от 3500 ₽",
    image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80",
    category: "specialized"
  },
  {
    id: 9,
    title: "Регулярная уборка",
    description: "Поддерживающая уборка по расписанию для дома или офиса",
    price: "от 1800 ₽",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80",
    category: "residential"
  }
];

// Категории услуг
const categories = [
  { id: "all", name: "Все услуги" },
  { id: "residential", name: "Для дома" },
  { id: "commercial", name: "Для бизнеса" },
  { id: "specialized", name: "Специализированные" }
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Фильтрация услуг по поиску и категории
  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Заголовок */}
        <section className="bg-blue-600 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Наши услуги</h1>
            <p className="text-xl max-w-3xl">
              Предлагаем полный спектр клининговых услуг для частных и коммерческих объектов с гарантией качества
            </p>
          </div>
        </section>
        
        {/* Фильтры и поиск */}
        <section className="py-8 px-4 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Поиск услуг..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button 
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Список услуг */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-medium text-gray-700 mb-4">
                  По вашему запросу ничего не найдено
                </h3>
                <p className="text-gray-500 mb-6">
                  Попробуйте изменить параметры поиска или выбрать другую категорию
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Информация о заказе */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Как заказать услугу?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Выберите услугу</h3>
                      <p className="text-gray-600">Ознакомьтесь с описанием и выберите подходящую услугу из каталога</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Оставьте заявку</h3>
                      <p className="text-gray-600">Нажмите "Заказать" и заполните форму заказа или свяжитесь с нами по телефону</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Согласуйте детали</h3>
                      <p className="text-gray-600">Наш менеджер свяжется с вами для уточнения деталей и стоимости</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Получите результат</h3>
                      <p className="text-gray-600">В назначенное время наша команда выполнит работу качественно и в срок</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-6">Остались вопросы?</h3>
                <p className="text-gray-600 mb-6">
                  Если у вас есть дополнительные вопросы или вам требуется индивидуальное решение, 
                  свяжитесь с нашими консультантами:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 rounded-full p-2">
                      <Filter className="text-blue-600" size={20} />
                    </div>
                    <a href="tel:+74951234567" className="text-lg font-medium hover:text-blue-600 transition-colors">
                      +7 (495) 123-45-67
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 rounded-full p-2">
                      <Filter className="text-blue-600" size={20} />
                    </div>
                    <a href="mailto:info@chistota.ru" className="text-lg font-medium hover:text-blue-600 transition-colors">
                      info@chistota.ru
                    </a>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <Button className="w-full" size="lg">
                  Заказать обратный звонок
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
