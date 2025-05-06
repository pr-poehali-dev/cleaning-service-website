
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, SlidersHorizontal, X, Check, ArrowUpDown, Grid, List } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { servicesService } from "@/api/apiClient";
import { toast } from "@/hooks/use-toast";

// Типы данных
interface ServiceOption {
  id: number;
  title: string;
  price: number;
}

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  image: string;
  category: string;
  duration: string;
  features: string[];
  additionalOptions: ServiceOption[];
}

// Моковые услуги (на случай если API недоступно)
const mockServices: Service[] = [
  {
    id: 1,
    title: "Уборка квартир",
    description: "Комплексная уборка жилых помещений любой площади с применением профессиональных средств",
    price: 2000,
    priceUnit: "за услугу",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80",
    category: "residential",
    duration: "3-4 часа",
    features: [
      "Мытье полов и плинтусов",
      "Удаление пыли со всех доступных поверхностей",
      "Мытье зеркал и стеклянных поверхностей"
    ],
    additionalOptions: [
      { id: 1, title: "Мытье окон", price: 500 },
      { id: 2, title: "Химчистка мягкой мебели", price: 1500 }
    ]
  },
  {
    id: 2,
    title: "Уборка офисов",
    description: "Профессиональная уборка офисных помещений и бизнес-центров по индивидуальному графику",
    price: 3000,
    priceUnit: "за услугу",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80",
    category: "commercial",
    duration: "4-6 часов",
    features: [
      "Влажная и сухая уборка пола",
      "Удаление пыли с мебели и оргтехники",
      "Мытье дверей и дверных ручек"
    ],
    additionalOptions: [
      { id: 1, title: "Мытье окон", price: 800 },
      { id: 2, title: "Химчистка офисных кресел", price: 500 }
    ]
  },
  {
    id: 3,
    title: "Мойка окон",
    description: "Качественная мойка окон и витражей любой сложности на высоте до 30 этажа",
    price: 1500,
    priceUnit: "за услугу",
    image: "https://images.unsplash.com/photo-1527689638836-411945a2b57c?auto=format&fit=crop&q=80",
    category: "specialized",
    duration: "1-3 часа",
    features: [
      "Очистка стекол от загрязнений",
      "Мытье рам и подоконников",
      "Удаление следов от наклеек и скотча"
    ],
    additionalOptions: [
      { id: 1, title: "Мытье москитных сеток", price: 200 },
      { id: 2, title: "Очистка жалюзи", price: 500 }
    ]
  }
];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Получение параметров из URL
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialMinPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : 0;
  const initialMaxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : 10000;
  const initialSort = searchParams.get("sort") || "price-asc";
  const initialView = searchParams.get("view") || "grid";
  
  // Состояния для фильтрации и сортировки
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
  const [sortOption, setSortOption] = useState(initialSort);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView as "grid" | "list");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Список всех доступных функций (собирается из всех услуг)
  const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);
  
  // Загрузка услуг
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // В реальном приложении данные загружаются с API
        // const data = await servicesService.getAllServices();
        
        // Используем моки для демонстрации
        const data = mockServices;
        setServices(data);
        
        // Собираем все доступные функции из услуг
        const features = new Set<string>();
        data.forEach(service => {
          service.features.forEach(feature => {
            features.add(feature);
          });
        });
        setAvailableFeatures(Array.from(features));
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Не удалось загрузить список услуг. Пожалуйста, попробуйте позже.');
        setServices(mockServices); // Используем моки в случае ошибки
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Обновление URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchTerm) params.set("search", searchTerm);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString());
    if (sortOption !== "price-asc") params.set("sort", sortOption);
    if (viewMode !== "grid") params.set("view", viewMode);
    
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchTerm, priceRange, sortOption, viewMode, setSearchParams]);
  
  // Фильтрация услуг
  const filteredServices = services.filter(service => {
    // Фильтр по поиску
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Фильтр по категории
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    // Фильтр по цене
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    
    // Фильтр по характеристикам
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => service.features.includes(feature));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesFeatures;
  });
  
  // Сортировка услуг
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  // Категории услуг
  const categories = [
    { id: "all", name: "Все услуги" },
    { id: "residential", name: "Для дома" },
    { id: "commercial", name: "Для бизнеса" },
    { id: "specialized", name: "Специализированные" }
  ];
  
  // Опции сортировки
  const sortOptions = [
    { value: "price-asc", label: "Цена: по возрастанию" },
    { value: "price-desc", label: "Цена: по убыванию" },
    { value: "name-asc", label: "Название: А-Я" },
    { value: "name-desc", label: "Название: Я-А" }
  ];
  
  // Обработчик изменения характеристик
  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange([0, 10000]);
    setSelectedFeatures([]);
    setSortOption("price-asc");
  };
  
  // Подсчет количества активных фильтров
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (searchTerm) count++;
    if (priceRange[0] > 0 || priceRange[1] < 10000) count++;
    if (selectedFeatures.length > 0) count++;
    return count;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Заголовок */}
        <section className="bg-blue-600 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Каталог услуг</h1>
            <p className="text-xl max-w-3xl">
              Выберите подходящую услугу из нашего каталога или воспользуйтесь фильтрами для поиска
            </p>
          </div>
        </section>
        
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Мобильные фильтры и поиск */}
            <div className="flex flex-col md:hidden gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Поиск услуг..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Dialog open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Filter className="mr-2 h-4 w-4" />
                      Фильтры
                      {getActiveFiltersCount() > 0 && (
                        <Badge className="ml-2 bg-blue-600 hover:bg-blue-700">
                          {getActiveFiltersCount()}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Фильтры</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Категории */}
                      <div className="space-y-2">
                        <Label>Категория</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {categories.map(category => (
                            <div
                              key={category.id}
                              className={`flex items-center justify-between px-4 py-2 border rounded-md cursor-pointer ${
                                selectedCategory === category.id 
                                  ? 'border-blue-600 bg-blue-50 text-blue-600' 
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              <span>{category.name}</span>
                              {selectedCategory === category.id && (
                                <Check className="h-4 w-4" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Ценовой диапазон */}
                      <div className="space-y-4">
                        <Label>Цена</Label>
                        <Slider
                          value={priceRange}
                          min={0}
                          max={10000}
                          step={100}
                          onValueChange={setPriceRange}
                          className="mt-2"
                        />
                        <div className="flex items-center justify-between">
                          <p>{priceRange[0]} ₽</p>
                          <p>{priceRange[1]} ₽</p>
                        </div>
                      </div>
                      
                      {/* Характеристики */}
                      <div className="space-y-2">
                        <Label>Характеристики</Label>
                        <div className="space-y-2">
                          {availableFeatures.map(feature => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox
                                id={`feature-${feature}`}
                                checked={selectedFeatures.includes(feature)}
                                onCheckedChange={() => handleFeatureChange(feature)}
                              />
                              <label
                                htmlFor={`feature-${feature}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {feature}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={resetFilters}>
                          Сбросить
                        </Button>
                        <Button className="flex-1" onClick={() => setIsMobileFilterOpen(false)}>
                          Применить
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="flex-1">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Сортировка</span>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                  <TabsList>
                    <TabsTrigger value="grid">
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Десктопные фильтры */}
              <div className="hidden md:block w-64 flex-shrink-0 space-y-6">
                <div className="sticky top-20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Фильтры</h2>
                    {getActiveFiltersCount() > 0 && (
                      <Button variant="ghost" size="sm" onClick={resetFilters}>
                        Сбросить
                      </Button>
                    )}
                  </div>
                  
                  {/* Поиск */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="search"
                      placeholder="Поиск услуг..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Категории */}
                  <div className="space-y-2 mb-6">
                    <h3 className="font-medium">Категория</h3>
                    <div className="space-y-1">
                      {categories.map(category => (
                        <div
                          key={category.id}
                          className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm ${
                            selectedCategory === category.id 
                              ? 'bg-blue-50 text-blue-600 font-medium' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <span>{category.name}</span>
                          {selectedCategory === category.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Ценовой диапазон */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium">Цена</h3>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{priceRange[0]} ₽</p>
                      <p className="text-sm">{priceRange[1]} ₽</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Характеристики */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Характеристики</h3>
                    <div className="space-y-2">
                      {availableFeatures.map(feature => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={`feature-desktop-${feature}`}
                            checked={selectedFeatures.includes(feature)}
                            onCheckedChange={() => handleFeatureChange(feature)}
                          />
                          <label
                            htmlFor={`feature-desktop-${feature}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Основной контент */}
              <div className="flex-1">
                {/* Десктопная панель инструментов */}
                <div className="hidden md:flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      {sortedServices.length} {sortedServices.length === 1 ? 'услуга' : 
                       sortedServices.length > 1 && sortedServices.length < 5 ? 'услуги' : 'услуг'}
                    </h2>
                    {getActiveFiltersCount() > 0 && (
                      <p className="text-sm text-gray-500">
                        Применено фильтров: {getActiveFiltersCount()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Сортировка" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                      <TabsList>
                        <TabsTrigger value="grid">
                          <Grid className="h-4 w-4 mr-2" />
                          Сетка
                        </TabsTrigger>
                        <TabsTrigger value="list">
                          <List className="h-4 w-4 mr-2" />
                          Список
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                
                {/* Результаты поиска */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Загрузка услуг...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Произошла ошибка</h3>
                    <p className="text-gray-500">{error}</p>
                  </div>
                ) : sortedServices.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Услуги не найдены</h3>
                    <p className="text-gray-500 mb-6">
                      Попробуйте изменить параметры поиска или сбросить фильтры
                    </p>
                    <Button onClick={resetFilters}>Сбросить фильтры</Button>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedServices.map(service => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sortedServices.map(service => (
                      <div 
                        key={service.id} 
                        className="flex flex-col sm:flex-row gap-4 border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="w-full sm:w-48 h-48 flex-shrink-0">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col p-4 flex-grow">
                          <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                          <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                          <div className="flex flex-wrap justify-between items-end gap-4">
                            <div>
                              <p className="text-blue-600 font-bold text-lg">{service.price} ₽ {service.priceUnit}</p>
                              <p className="text-gray-500 text-sm">Время: {service.duration}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button asChild variant="outline">
                                <Link to={`/services/${service.id}`}>Подробнее</Link>
                              </Button>
                              <Button asChild>
                                <Link to={`/booking/${service.id}`}>Заказать</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;
