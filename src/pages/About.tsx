
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, Award, Users, Heart, TrendingUp } from "lucide-react";

const About = () => {
  const team = [
    {
      id: 1,
      name: "Елена Смирнова",
      position: "Генеральный директор",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      description: "Опыт работы в клининговой отрасли более 10 лет. Отвечает за стратегическое развитие компании."
    },
    {
      id: 2,
      name: "Александр Петров",
      position: "Технический директор",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      description: "Эксперт в области клининговых технологий. Контролирует качество предоставляемых услуг."
    },
    {
      id: 3,
      name: "Мария Иванова",
      position: "Руководитель отдела продаж",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      description: "Отвечает за работу с клиентами и развитие партнерских отношений."
    },
    {
      id: 4,
      name: "Дмитрий Козлов",
      position: "Главный менеджер проектов",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400",
      description: "Координирует работу бригад специалистов и контролирует выполнение заказов."
    }
  ];

  const stats = [
    { id: 1, value: "10+", label: "лет на рынке" },
    { id: 2, value: "5000+", label: "довольных клиентов" },
    { id: 3, value: "50+", label: "квалифицированных сотрудников" },
    { id: 4, value: "98%", label: "положительных отзывов" }
  ];

  const values = [
    {
      id: 1,
      icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
      title: "Качество",
      description: "Мы не просто убираем, а делаем это с особым вниманием к деталям, чтобы результат превзошел ваши ожидания."
    },
    {
      id: 2,
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Пунктуальность",
      description: "Мы ценим ваше время и всегда выполняем работу в оговоренные сроки, без опозданий и переносов."
    },
    {
      id: 3,
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Профессионализм",
      description: "Наши сотрудники регулярно повышают квалификацию и используют современные технологии уборки."
    },
    {
      id: 4,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Клиентоориентированность",
      description: "Мы всегда прислушиваемся к пожеланиям клиентов и готовы подстроиться под индивидуальные требования."
    },
    {
      id: 5,
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "Экологичность",
      description: "Мы используем безопасные для людей и окружающей среды моющие средства и технологии."
    },
    {
      id: 6,
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Развитие",
      description: "Мы постоянно совершенствуемся, внедряем новые методы работы и расширяем спектр услуг."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Заголовок */}
        <section className="bg-blue-600 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">О компании</h1>
            <p className="text-xl max-w-3xl">
              Мы — команда профессионалов, объединенных общей целью: сделать мир чище и комфортнее для наших клиентов
            </p>
          </div>
        </section>
        
        {/* История компании */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Наша история</h2>
                <p className="text-gray-700 mb-4">
                  Компания "ЧистоТа" была основана в 2013 году группой энтузиастов, увлеченных идеей предоставления качественных клининговых услуг для дома и бизнеса. Мы начинали как небольшая команда из 5 человек, выполняя заказы по уборке квартир и офисов.
                </p>
                <p className="text-gray-700 mb-4">
                  За годы упорного труда и постоянного совершенствования мы выросли в крупную компанию, обслуживающую тысячи клиентов по всему городу. Мы расширили спектр услуг, внедрили современные технологии и создали команду профессионалов, которые любят свое дело.
                </p>
                <p className="text-gray-700 mb-4">
                  Сегодня "ЧистоТа" — это узнаваемый бренд, который ассоциируется с высоким качеством, надежностью и профессионализмом. Мы гордимся нашей репутацией и стремимся каждый день оправдывать доверие наших клиентов.
                </p>
                <Button asChild className="mt-2">
                  <Link to="/services">Наши услуги</Link>
                </Button>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80" 
                  alt="История компании" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                  <p className="text-gray-700 italic text-sm">
                    "Наша миссия — делать мир чище и комфортнее, освобождая время наших клиентов для действительно важных дел"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Статистика */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Компания в цифрах</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(stat => (
                <div key={stat.id} className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Ценности */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Наши ценности</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map(value => (
                <Card key={value.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Команда */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Наша команда</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map(member => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Сертификаты */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Сертификаты и награды</h2>
                <p className="text-gray-700 mb-4">
                  Наша компания имеет все необходимые сертификаты и лицензии для выполнения клининговых работ любой сложности. Мы регулярно проходим аудиты качества и соответствуем всем отраслевым стандартам.
                </p>
                <p className="text-gray-700 mb-4">
                  За годы работы мы получили множество наград и благодарностей от наших клиентов и партнеров, что подтверждает высокий уровень нашего профессионализма и качества предоставляемых услуг.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Сертификат ISO 9001:2015 — Система менеджмента качества</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Сертификат ISO 14001:2015 — Система экологического менеджмента</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Знак качества "Лучшие в России" — 2022</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Награда "Выбор потребителей" — 2021, 2022, 2023</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-center justify-center">
                  <img 
                    src="https://via.placeholder.com/200x200/f3f4f6/404040?text=ISO+9001" 
                    alt="ISO 9001 Сертификат" 
                    className="max-h-32"
                  />
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-center justify-center">
                  <img 
                    src="https://via.placeholder.com/200x200/f3f4f6/404040?text=ISO+14001" 
                    alt="ISO 14001 Сертификат" 
                    className="max-h-32"
                  />
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-center justify-center">
                  <img 
                    src="https://via.placeholder.com/200x200/f3f4f6/404040?text=Best+Quality" 
                    alt="Знак качества" 
                    className="max-h-32"
                  />
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-center justify-center">
                  <img 
                    src="https://via.placeholder.com/200x200/f3f4f6/404040?text=Customer+Choice" 
                    alt="Выбор потребителей" 
                    className="max-h-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Призыв к действию */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Начните сотрудничество с нами</h2>
            <p className="text-xl mb-8 opacity-90">
              Узнайте, как наша команда профессионалов может помочь с уборкой вашего дома или офиса
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="default" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/contact">Связаться с нами</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                <Link to="/services">Наши услуги</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
