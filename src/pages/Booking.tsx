
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, addDays, getDay, isAfter, isBefore, startOfDay, endOfDay, addMinutes } from "date-fns";
import { ru } from "date-fns/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { servicesService, bookingsService } from "@/api/apiClient";
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

interface BookingFormData {
  serviceId: number;
  date: Date | null;
  time: string;
  address: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  additionalOptions: number[];
  comments: string;
}

interface TimeSlot {
  label: string;
  value: string;
  disabled: boolean;
}

const generateTimeSlots = (date: Date | null): TimeSlot[] => {
  // Начальное и конечное время для записи (9:00 - 18:00)
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) continue; // Не генерируем слоты после 18:00
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Проверяем, не прошло ли уже это время для сегодняшнего дня
      let disabled = false;
      if (date && date.getDate() === today.getDate() && 
          date.getMonth() === today.getMonth() && 
          date.getFullYear() === today.getFullYear()) {
        const slotTime = new Date(date);
        slotTime.setHours(hour);
        slotTime.setMinutes(minute);
        disabled = slotTime < today;
      }
      
      slots.push({
        label: timeString,
        value: timeString,
        disabled
      });
    }
  }
  
  return slots;
};

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Дата, 2: Контактные данные, 3: Подтверждение
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  
  // Генерация доступных временных слотов
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // Данные для бронирования
  const [bookingData, setBookingData] = useState<BookingFormData>({
    serviceId: parseInt(id || '0'),
    date: null,
    time: '',
    address: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    additionalOptions: [],
    comments: ''
  });
  
  
  // Расчет полной стоимости
  const calculateTotal = () => {
    if (!service) return 0;
    
    let total = service.price;
    
    // Добавление стоимости выбранных опций
    bookingData.additionalOptions.forEach(optionId => {
      const option = service.additionalOptions.find(opt => opt.id === optionId);
      if (option) {
        total += option.price;
      }
    });
    
    return total;
  };
  
  // Загрузка данных об услуге
  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await servicesService.getServiceById(parseInt(id));
        setService(data);
      } catch (err) {
        console.error('Failed to fetch service:', err);
        setError('Не удалось загрузить информацию об услуге. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchService();
  }, [id]);
  
  // Обновление временных слотов при изменении даты
  useEffect(() => {
    if (bookingData.date) {
      setTimeSlots(generateTimeSlots(bookingData.date));
    }
  }, [bookingData.date]);
  
  // Переключение опций
  const toggleOption = (optionId: number) => {
    setBookingData(prev => {
      if (prev.additionalOptions.includes(optionId)) {
        return {
          ...prev,
          additionalOptions: prev.additionalOptions.filter(id => id !== optionId)
        };
      } else {
        return {
          ...prev,
          additionalOptions: [...prev.additionalOptions, optionId]
        };
      }
    });
  };
  
  // Обработчик изменения даты
  const handleDateChange = (date: Date | undefined) => {
    setBookingData(prev => ({
      ...prev,
      date: date || null,
      time: '' // Сбрасываем выбранное время при изменении даты
    }));
  };
  
  // Обработчик изменения формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };
  
  // Переход к следующему шагу
  const handleNextStep = () => {
    // Валидация текущего шага
    if (step === 1) {
      if (!bookingData.date || !bookingData.time) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, выберите дату и время",
          variant: "destructive"
        });
        return;
      }
    } else if (step === 2) {
      if (!bookingData.clientName || !bookingData.clientPhone || !bookingData.address) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, заполните все обязательные поля",
          variant: "destructive"
        });
        return;
      }
      
      // Простая валидация email, если указан
      if (bookingData.clientEmail && !/\S+@\S+\.\S+/.test(bookingData.clientEmail)) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, укажите корректный email",
          variant: "destructive"
        });
        return;
      }
      
      // Простая валидация телефона
      if (!/^\+?[0-9\s\-()]{10,15}$/.test(bookingData.clientPhone)) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, укажите корректный номер телефона",
          variant: "destructive"
        });
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };
  
  // Возврат к предыдущему шагу
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  // Отправка формы бронирования
  const handleSubmit = async () => {
    if (!service || !bookingData.date || !bookingData.time) return;
    
    setIsSubmitting(true);
    
    try {
      // Объединяем дату и время
      const bookingDateTime = new Date(bookingData.date);
      const [hours, minutes] = bookingData.time.split(':').map(Number);
      bookingDateTime.setHours(hours, minutes);
      
      // Подготовка данных для отправки
      const bookingPayload = {
        serviceId: service.id,
        serviceTitle: service.title,
        datetime: bookingDateTime.toISOString(),
        address: bookingData.address,
        clientName: bookingData.clientName,
        clientPhone: bookingData.clientPhone,
        clientEmail: bookingData.clientEmail || undefined,
        additionalOptions: bookingData.additionalOptions.map(optionId => {
          const option = service.additionalOptions.find(opt => opt.id === optionId);
          return {
            id: optionId,
            title: option?.title || '',
            price: option?.price || 0
          };
        }),
        comments: bookingData.comments || undefined,
        totalAmount: calculateTotal()
      };
      
      // Отправка запроса
      const response = await bookingsService.createBooking(bookingPayload);
      
      // Обработка успешного ответа
      setBookingSuccess(true);
      setBookingReference(response.reference || response.id?.toString());
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать бронирование. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Если услуга не найдена
  if (!isLoading && !service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Услуга не найдена</h1>
            <p className="text-gray-600 mb-6">К сожалению, запрашиваемая услуга не найдена или недоступна.</p>
            <Button asChild>
              <a href="/services">Вернуться к списку услуг</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Если произошла ошибка
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Произошла ошибка</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button asChild>
              <a href="/services">Вернуться к списку услуг</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Если бронирование успешно создано
  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-2xl">Бронирование успешно создано!</CardTitle>
              <CardDescription>
                Ваша заявка принята и находится в обработке
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Номер бронирования</p>
                  <p className="font-medium">{bookingReference || 'Будет направлен в SMS'}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Услуга</p>
                  <p className="font-medium">{service?.title}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Дата и время</p>
                  <p className="font-medium">
                    {bookingData.date 
                      ? `${format(bookingData.date, 'dd MMMM yyyy', { locale: ru })}, ${bookingData.time}`
                      : 'Не указано'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Стоимость</p>
                  <p className="font-medium">{calculateTotal()} ₽</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа. Вы также получите SMS с информацией о вашем бронировании.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={() => navigate('/')}>
                Вернуться на главную
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/services')}>
                Просмотреть другие услуги
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Основной компонент
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Хлебные крошки и заголовок */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <a href="/" className="hover:text-blue-600 transition-colors">Главная</a>
              <ChevronRight className="h-4 w-4 mx-2" />
              <a href="/services" className="hover:text-blue-600 transition-colors">Услуги</a>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900">{service?.title || 'Бронирование'}</span>
            </div>
            
            <h1 className="text-2xl font-bold">Бронирование услуги: {service?.title}</h1>
          </div>
          
          {/* Индикатор шагов */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center rounded-full h-8 w-8 ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center rounded-full h-8 w-8 ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step >= 3 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center rounded-full h-8 w-8 ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Выбор даты и времени</span>
              <span>Ваши данные</span>
              <span>Подтверждение</span>
            </div>
          </div>
          
          <Card>
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Выберите дату и время</CardTitle>
                  <CardDescription>
                    Укажите удобные для вас дату и время оказания услуги
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Календарь для выбора даты */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:flex-1 space-y-1">
                      <Label>Дата</Label>
                      <div className="border rounded-md p-1">
                        <Calendar
                          mode="single"
                          selected={bookingData.date || undefined}
                          onSelect={handleDateChange}
                          disabled={(date) => 
                            isAfter(startOfDay(date), startOfDay(addDays(new Date(), 30))) ||
                            isBefore(date, startOfDay(new Date())) ||
                            getDay(date) === 0  // Воскресенье выходной
                          }
                          className="mx-auto"
                          locale={ru}
                        />
                      </div>
                    </div>
                    
                    {/* Выбор времени */}
                    <div className="md:flex-1 space-y-1">
                      <Label>Время</Label>
                      {bookingData.date ? (
                        <div className="border rounded-md p-4 h-full">
                          <div className="grid grid-cols-2 gap-2">
                            {timeSlots.map((slot) => (
                              <Button
                                key={slot.value}
                                type="button"
                                variant={bookingData.time === slot.value ? "default" : "outline"}
                                onClick={() => setBookingData(prev => ({ ...prev, time: slot.value }))}
                                disabled={slot.disabled}
                                className="w-full justify-start"
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {slot.label}
                              </Button>
                            ))}
                          </div>
                          {timeSlots.length === 0 && (
                            <p className="text-center text-gray-500">Нет доступных слотов на выбранную дату</p>
                          )}
                        </div>
                      ) : (
                        <div className="border rounded-md p-4 flex items-center justify-center h-full">
                          <p className="text-gray-500">
                            Сначала выберите дату
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Дополнительные опции */}
                  {service?.additionalOptions && service.additionalOptions.length > 0 && (
                    <div className="space-y-3">
                      <Label>Дополнительные опции</Label>
                      <div className="space-y-2">
                        {service.additionalOptions.map(option => (
                          <div 
                            key={option.id} 
                            className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                              bookingData.additionalOptions.includes(option.id) 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => toggleOption(option.id)}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                                bookingData.additionalOptions.includes(option.id) ? 'bg-blue-600' : 'border border-gray-300'
                              }`}>
                                {bookingData.additionalOptions.includes(option.id) && (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span>{option.title}</span>
                            </div>
                            <span className="font-medium">+{option.price} ₽</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Адрес */}
                  <div className="space-y-1">
                    <Label htmlFor="address">Адрес</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={bookingData.address}
                      onChange={handleInputChange}
                      placeholder="Укажите полный адрес: город, улица, дом, квартира"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate(`/services/${id}`)}>
                    Назад к услуге
                  </Button>
                  <Button onClick={handleNextStep}>
                    Далее
                  </Button>
                </CardFooter>
              </>
            )}
            
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Ваши контактные данные</CardTitle>
                  <CardDescription>
                    Заполните информацию для связи
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="clientName">Ваше имя *</Label>
                    <Input
                      id="clientName"
                      name="clientName"
                      value={bookingData.clientName}
                      onChange={handleInputChange}
                      placeholder="Иванов Иван Иванович"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="clientPhone">Телефон *</Label>
                    <Input
                      id="clientPhone"
                      name="clientPhone"
                      value={bookingData.clientPhone}
                      onChange={handleInputChange}
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Мы свяжемся с вами по телефону для подтверждения заказа
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      name="clientEmail"
                      type="email"
                      value={bookingData.clientEmail}
                      onChange={handleInputChange}
                      placeholder="example@mail.ru"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="comments">Комментарии</Label>
                    <Textarea
                      id="comments"
                      name="comments"
                      value={bookingData.comments}
                      onChange={handleInputChange}
                      placeholder="Дополнительная информация, пожелания или вопросы"
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Назад
                  </Button>
                  <Button onClick={handleNextStep}>
                    Далее
                  </Button>
                </CardFooter>
              </>
            )}
            
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Подтверждение бронирования</CardTitle>
                  <CardDescription>
                    Проверьте правильность введенных данных
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Детали услуги */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                        {service?.image ? (
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{service?.title}</h3>
                        <p className="text-gray-600">{service?.description}</p>
                        <p className="text-blue-600 font-medium">
                          {service?.price} ₽ {service?.priceUnit}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Детали бронирования */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Дата и время</h4>
                        <p className="text-gray-700 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          {bookingData.date 
                            ? format(bookingData.date, 'dd MMMM yyyy', { locale: ru })
                            : 'Не выбрано'}
                        </p>
                        <p className="text-gray-700 flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          {bookingData.time || 'Не выбрано'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Адрес</h4>
                        <p className="text-gray-700">
                          {bookingData.address || 'Не указан'}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Контактные данные */}
                    <div>
                      <h4 className="font-medium mb-2">Контактные данные</h4>
                      <div className="space-y-1">
                        <p className="text-gray-700"><span className="text-gray-500">Имя:</span> {bookingData.clientName}</p>
                        <p className="text-gray-700"><span className="text-gray-500">Телефон:</span> {bookingData.clientPhone}</p>
                        {bookingData.clientEmail && (
                          <p className="text-gray-700"><span className="text-gray-500">Email:</span> {bookingData.clientEmail}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Выбранные опции */}
                    {bookingData.additionalOptions.length > 0 && service && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Дополнительные опции</h4>
                          <ul className="space-y-1">
                            {bookingData.additionalOptions.map(optionId => {
                              const option = service.additionalOptions.find(opt => opt.id === optionId);
                              return option ? (
                                <li key={option.id} className="flex justify-between">
                                  <span className="text-gray-700">{option.title}</span>
                                  <span className="font-medium">{option.price} ₽</span>
                                </li>
                              ) : null;
                            })}
                          </ul>
                        </div>
                      </>
                    )}
                    
                    {/* Комментарии */}
                    {bookingData.comments && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Комментарии</h4>
                          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md">
                            {bookingData.comments}
                          </p>
                        </div>
                      </>
                    )}
                    
                    <Separator />
                    
                    {/* Итоговая стоимость */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Итоговая стоимость:</span>
                        <span className="text-xl font-bold text-blue-600">{calculateTotal()} ₽</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>
                      Нажимая кнопку "Подтвердить", вы соглашаетесь с условиями обработки персональных данных и 
                      <a href="/terms" className="text-blue-600 hover:underline"> политикой конфиденциальности</a>.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Назад
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Подтверждение...' : 'Подтвердить бронирование'}
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
