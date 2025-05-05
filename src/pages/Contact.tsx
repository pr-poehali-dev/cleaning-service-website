
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, Bookmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    subscribe: false,
    submitted: false,
    loading: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormState(prev => ({ ...prev, subject: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormState(prev => ({ ...prev, subscribe: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    if (!formState.name || !formState.email || !formState.phone || !formState.message) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    // Имитация отправки формы
    setFormState(prev => ({ ...prev, loading: true }));
    
    setTimeout(() => {
      setFormState(prev => ({ 
        ...prev, 
        loading: false,
        submitted: true,
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        subscribe: false
      }));
      
      toast({
        title: "Сообщение отправлено",
        description: "Мы свяжемся с вами в ближайшее время",
      });
    }, 1500);
  };

  const officeLocations = [
    {
      id: 1,
      name: "Центральный офис",
      address: "г. Москва, ул. Пушкина, д. 10",
      phone: "+7 (495) 123-45-67",
      email: "info@chistota.ru",
      hours: "Пн-Пт: 9:00 - 19:00"
    },
    {
      id: 2,
      name: "Дополнительный офис",
      address: "г. Москва, ул. Ленина, д. 25",
      phone: "+7 (495) 765-43-21",
      email: "office2@chistota.ru",
      hours: "Пн-Пт: 10:00 - 18:00"
    }
  ];

  const faqs = [
    {
      question: "Как заказать уборку?",
      answer: "Вы можете заказать уборку, заполнив форму на нашем сайте, позвонив по телефону или отправив заявку на электронную почту."
    },
    {
      question: "Какие способы оплаты вы принимаете?",
      answer: "Мы принимаем оплату наличными, банковскими картами, а также переводом на расчетный счет компании."
    },
    {
      question: "Предоставляете ли вы чеки и документы на оказанные услуги?",
      answer: "Да, после выполнения работ мы предоставляем все необходимые документы, включая чеки, акты выполненных работ и договоры."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Заголовок */}
        <section className="bg-blue-600 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Свяжитесь с нами</h1>
            <p className="text-xl max-w-3xl">
              Наша команда готова ответить на все ваши вопросы и помочь подобрать оптимальное решение для ваших задач
            </p>
          </div>
        </section>
        
        {/* Основной контент */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Контактная информация */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Контактная информация</h2>
                <p className="text-gray-700 mb-8">
                  Вы можете связаться с нами любым удобным способом. Мы всегда рады ответить на ваши вопросы и помочь выбрать оптимальное решение для уборки вашего дома или офиса.
                </p>
                
                <div className="space-y-8">
                  {officeLocations.map(office => (
                    <Card key={office.id}>
                      <CardHeader>
                        <CardTitle>{office.name}</CardTitle>
                        <CardDescription>Контактные данные</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Адрес:</p>
                            <p className="text-gray-600">{office.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Телефон:</p>
                            <a href={`tel:${office.phone}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                              {office.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Email:</p>
                            <a href={`mailto:${office.email}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                              {office.email}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Часы работы:</p>
                            <p className="text-gray-600">{office.hours}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* FAQ */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <div className="flex gap-4 items-start">
                      <Bookmark className="h-8 w-8 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg mb-2">Не нашли ответ на свой вопрос?</h3>
                        <p className="text-gray-600 mb-4">
                          Свяжитесь с нами любым удобным способом, и мы с радостью ответим на все ваши вопросы.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Форма связи */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Отправить сообщение</CardTitle>
                    <CardDescription>
                      Заполните форму ниже, и мы свяжемся с вами в ближайшее время
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {formState.submitted ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                          <Send className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Спасибо за ваше сообщение!</h3>
                        <p className="text-gray-600 mb-6">
                          Мы получили вашу заявку и свяжемся с вами в ближайшее время.
                        </p>
                        <Button 
                          onClick={() => setFormState(prev => ({ ...prev, submitted: false }))}
                        >
                          Отправить новое сообщение
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">ФИО <span className="text-red-500">*</span></Label>
                            <Input
                              id="name"
                              name="name"
                              value={formState.name}
                              onChange={handleInputChange}
                              placeholder="Введите ваше имя"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formState.email}
                                onChange={handleInputChange}
                                placeholder="example@mail.ru"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="phone">Телефон <span className="text-red-500">*</span></Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={formState.phone}
                                onChange={handleInputChange}
                                placeholder="+7 (___) ___-__-__"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="subject">Тема обращения</Label>
                            <Select value={formState.subject} onValueChange={handleSelectChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тему" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">Общий вопрос</SelectItem>
                                <SelectItem value="service">Услуги и цены</SelectItem>
                                <SelectItem value="feedback">Отзыв о работе</SelectItem>
                                <SelectItem value="partnership">Сотрудничество</SelectItem>
                                <SelectItem value="other">Другое</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="message">Сообщение <span className="text-red-500">*</span></Label>
                            <Textarea
                              id="message"
                              name="message"
                              value={formState.message}
                              onChange={handleInputChange}
                              placeholder="Напишите ваше сообщение..."
                              rows={5}
                              required
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="subscribe"
                              checked={formState.subscribe}
                              onCheckedChange={handleSwitchChange}
                            />
                            <Label htmlFor="subscribe" className="text-sm cursor-pointer">
                              Я хочу получать рассылку с новостями и специальными предложениями
                            </Label>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg"
                            disabled={formState.loading}
                          >
                            {formState.loading ? "Отправка..." : "Отправить сообщение"}
                          </Button>
                          <p className="text-sm text-gray-500 mt-2 text-center">
                            Нажимая на кнопку, вы соглашаетесь с нашей{" "}
                            <a href="/privacy" className="text-blue-600 hover:underline">
                              политикой конфиденциальности
                            </a>
                          </p>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Карта */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Наше расположение</h2>
            <div className="rounded-lg overflow-hidden shadow-md h-96 bg-gray-200">
              {/* Здесь должна быть карта, но для простоты используем заглушку */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">Карта расположения офисов компании "ЧистоТа"</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
