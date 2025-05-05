
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Clock, Check, ShoppingCart, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Моковые данные услуг
const services = [
  {
    id: 1,
    title: "Уборка квартир",
    description: "Комплексная уборка жилых помещений любой площади с применением профессиональных средств",
    price: 2000,
    priceUnit: "за услугу",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80",
    category: "residential",
    longDescription: "Наша команда профессионалов выполнит комплексную уборку вашей квартиры или дома с использованием профессионального оборудования и экологичных моющих средств. Мы тщательно вычистим все поверхности, пол, окна, санузлы и кухонное пространство, чтобы ваш дом сиял чистотой.",
    duration: "3-4 часа",
    features: [
      "Мытье полов и плинтусов",
      "Удаление пыли со всех доступных поверхностей",
      "Мытье зеркал и стеклянных поверхностей",
      "Уборка санузлов и ванной комнаты",
      "Мытье кухонных поверхностей",
      "Вынос мусора"
    ],
    additionalOptions: [
      { id: 1, title: "Мытье окон", price: 500 },
      { id: 2, title: "Химчистка мягкой мебели", price: 1500 },
      { id: 3, title: "Уборка балкона", price: 700 },
      { id: 4, title: "Мытье люстр", price: 800 }
    ],
    faq: [
      {
        question: "Сколько человек работает над уборкой?",
        answer: "Обычно в команде 1-2 человека, в зависимости от площади помещения и объема работ."
      },
      {
        question: "Какие моющие средства вы используете?",
        answer: "Мы используем профессиональные экологичные средства, которые эффективно удаляют загрязнения, но безопасны для людей и домашних животных."
      },
      {
        question: "Нужно ли мне предоставлять свой инвентарь?",
        answer: "Нет, наши специалисты приезжают со всем необходимым оборудованием и инвентарем."
      }
    ],
    reviews: [
      {
        id: 1,
        author: "Анна М.",
        date: "15.04.2023",
        rating: 5,
        text: "Отличный сервис! Уборка была выполнена очень тщательно и быстро. Обязательно воспользуюсь услугами еще раз."
      },
      {
        id: 2,
        author: "Сергей К.",
        date: "23.03.2023",
        rating: 4,
        text: "Качественная уборка, но немного задержались по времени. В целом доволен результатом."
      },
      {
        id: 3,
        author: "Екатерина Д.",
        date: "05.02.2023",
        rating: 5,
        text: "Профессиональный подход, внимание к деталям. Моя квартира сияет чистотой!"
      }
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
    longDescription: "Мы предлагаем профессиональную уборку офисных помещений любой площади. Наши специалисты выполнят все необходимые работы качественно и в удобное для вас время, не нарушая рабочий процесс. Мы подберем оптимальный график уборки и составим индивидуальный план обслуживания.",
    duration: "зависит от площади",
    features: [
      "Влажная и сухая уборка пола",
      "Удаление пыли с мебели и оргтехники",
      "Мытье дверей и дверных ручек",
      "Уборка санузлов и кухонной зоны",
      "Вынос мусора и замена пакетов",
      "Мытье окон по запросу"
    ],
    additionalOptions: [
      { id: 1, title: "Мытье окон", price: 800 },
      { id: 2, title: "Химчистка офисных кресел", price: 500 },
      { id: 3, title: "Полировка твердых поверхностей", price: 1200 },
      { id: 4, title: "Дезинфекция помещений", price: 2000 }
    ],
    faq: [
      {
        question: "Можно ли заказать уборку в нерабочее время?",
        answer: "Да, мы можем организовать уборку в вечернее время, ночные часы или выходные дни."
      },
      {
        question: "Возможна ли уборка по графику?",
        answer: "Да, мы предлагаем регулярную уборку по согласованному с вами графику: ежедневно, несколько раз в неделю или еженедельно."
      },
      {
        question: "Заключаете ли вы договор на обслуживание?",
        answer: "Да, со всеми клиентами, которые заказывают регулярную уборку, мы заключаем официальный договор."
      }
    ],
    reviews: [
      {
        id: 1,
        author: "ООО 'Технопрогресс'",
        date: "10.05.2023",
        rating: 5,
        text: "Пользуемся услугами компании уже больше года. Всегда качественно и без нареканий."
      },
      {
        id: 2,
        author: "ИП Смирнов А.В.",
        date: "18.04.2023",
        rating: 5,
        text: "Отличный сервис для небольшого офиса. Приемлемые цены, качественная работа."
      }
    ]
  },
  // Другие услуги...
];

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("description");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  
  // Получаем данные выбранной услуги
  const service = services.find(s => s.id === Number(id));
  
  // Если услуга не найдена
  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Услуга не найдена</h1>
            <p className="text-gray-600 mb-6">К сожалению, запрашиваемая услуга не найдена</p>
            <Button asChild>
              <Link to="/services">Вернуться к списку услуг</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Функция добавления опции
  const toggleOption = (optionId: number) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };
  
  // Рассчет итоговой стоимости
  const calculateTotal = () => {
    let total = service.price * quantity;
    
    // Добавляем стоимость выбранных опций
    selectedOptions.forEach(optionId => {
      const option = service.additionalOptions.find(opt => opt.id === optionId);
      if (option) {
        total += option.price * quantity;
      }
    });
    
    return total;
  };
  
  // Обработка добавления в корзину
  const handleAddToCart = () => {
    toast({
      title: "Добавлено в корзину",
      description: `${service.title} (${quantity} шт.) и ${selectedOptions.length} дополнительных опций`,
    });
  };
  
  // Функция для отрисовки звездного рейтинга
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Хлебные крошки */}
        <div className="bg-gray-50 py-3 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600 transition-colors">Главная</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/services" className="hover:text-blue-600 transition-colors">Услуги</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900">{service.title}</span>
            </div>
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Изображение */}
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Информация об услуге */}
              <div>
                <div className="mb-6">
                  <Badge variant="outline" className="mb-3">
                    {service.category === "residential" ? "Для дома" : 
                     service.category === "commercial" ? "Для бизнеса" : 
                     "Специализированная услуга"}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h1>
                  <p className="text-xl font-medium text-blue-600 mb-4">
                    {service.price} ₽ <span className="text-sm text-gray-500">{service.priceUnit}</span>
                  </p>
                  <div className="flex items-center text-gray-600 mb-6">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Среднее время: {service.duration}</span>
                  </div>
                  <p className="text-gray-700">{service.description}</p>
                </div>
                
                {/* Количество */}
                <div className="mb-6">
                  <p className="font-medium mb-2">Количество:</p>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 text-lg font-medium w-8 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Дополнительные опции */}
                <div className="mb-8">
                  <p className="font-medium mb-3">Дополнительные опции:</p>
                  <div className="space-y-2">
                    {service.additionalOptions.map(option => (
                      <div 
                        key={option.id} 
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                          selectedOptions.includes(option.id) 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleOption(option.id)}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                            selectedOptions.includes(option.id) ? 'bg-blue-600' : 'border border-gray-300'
                          }`}>
                            {selectedOptions.includes(option.id) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span>{option.title}</span>
                        </div>
                        <span>+{option.price} ₽</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Итоговая сумма и кнопки */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Базовая стоимость:</span>
                    <span>{service.price * quantity} ₽</span>
                  </div>
                  {selectedOptions.length > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Дополнительные опции:</span>
                      <span>
                        {selectedOptions.reduce((sum, optId) => {
                          const option = service.additionalOptions.find(o => o.id === optId);
                          return sum + (option ? option.price * quantity : 0);
                        }, 0)} ₽
                      </span>
                    </div>
                  )}
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Итого:</span>
                    <span className="text-xl font-bold text-blue-600">{calculateTotal()} ₽</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="flex-1" 
                    size="lg" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Добавить в корзину
                  </Button>
                  <Button 
                    className="flex-1" 
                    size="lg" 
                    variant="outline"
                    asChild
                  >
                    <Link to="/contact">Заказать сейчас</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Вкладки с дополнительной информацией */}
            <div className="mt-16">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
                  <TabsTrigger value="description">Описание</TabsTrigger>
                  <TabsTrigger value="faq">Вопросы и ответы</TabsTrigger>
                  <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Описание услуги</h2>
                      <p className="text-gray-700 mb-6">{service.longDescription}</p>
                      
                      <h3 className="text-xl font-bold mb-3">Что входит в услугу:</h3>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="faq" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
                      <div className="space-y-6">
                        {service.faq.map((item, index) => (
                          <div key={index}>
                            <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                            <p className="text-gray-600">{item.answer}</p>
                            {index < service.faq.length - 1 && <Separator className="mt-4" />}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Отзывы клиентов</h2>
                        <Button variant="outline">Оставить отзыв</Button>
                      </div>
                      
                      <div className="space-y-6">
                        {service.reviews.map(review => (
                          <div key={review.id} className="border-b pb-6 last:border-0">
                            <div className="flex justify-between mb-2">
                              <div>
                                <span className="font-medium">{review.author}</span>
                                <span className="text-gray-500 text-sm ml-2">{review.date}</span>
                              </div>
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-700">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;
