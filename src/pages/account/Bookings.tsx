
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Search, Filter, RefreshCw, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Типы данных
interface BookingOption {
  id: number;
  title: string;
  price: number;
}

interface Booking {
  id: number;
  reference: string;
  serviceId: number;
  serviceTitle: string;
  datetime: string;
  address: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalAmount: number;
  additionalOptions: BookingOption[];
  createdAt: string;
}

// Моковые данные бронирований
const mockBookings: Booking[] = [
  {
    id: 1,
    reference: "BKG-2023-001",
    serviceId: 1,
    serviceTitle: "Уборка квартир",
    datetime: "2023-06-15T14:00:00",
    address: "г. Москва, ул. Пушкина, д. 10, кв. 5",
    status: "completed",
    totalAmount: 3200,
    additionalOptions: [
      { id: 1, title: "Мытье окон", price: 500 },
      { id: 3, title: "Уборка балкона", price: 700 }
    ],
    createdAt: "2023-06-10T12:30:00"
  },
  {
    id: 2,
    reference: "BKG-2023-002",
    serviceId: 5,
    serviceTitle: "Генеральная уборка",
    datetime: "2023-07-20T10:00:00",
    address: "г. Москва, ул. Ленина, д. 25, кв. 12",
    status: "confirmed",
    totalAmount: 4500,
    additionalOptions: [],
    createdAt: "2023-07-15T09:45:00"
  },
  {
    id: 3,
    reference: "BKG-2023-003",
    serviceId: 2,
    serviceTitle: "Уборка офисов",
    datetime: "2023-08-05T16:30:00",
    address: "г. Москва, пр. Мира, д. 78, офис 43",
    status: "pending",
    totalAmount: 3000,
    additionalOptions: [
      { id: 2, title: "Мытье окон", price: 800 }
    ],
    createdAt: "2023-08-01T14:20:00"
  }
];

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  
  useEffect(() => {
    // Имитация загрузки данных
    const loadBookings = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookings(mockBookings);
      } catch (error) {
        console.error("Error loading bookings:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить историю бронирований",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookings();
  }, []);
  
  // Фильтрация бронирований
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filter === "all" || booking.status === filter;
    const matchesSearch = booking.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          booking.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  // Форматирование даты
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "dd MMMM yyyy", { locale: ru });
  };
  
  // Форматирование времени
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "HH:mm", { locale: ru });
  };
  
  // Получение текста и цвета статуса
  const getStatusDetails = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return { text: 'Ожидает подтверждения', color: 'bg-yellow-100 text-yellow-800' };
      case 'confirmed':
        return { text: 'Подтвержден', color: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { text: 'Выполнен', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: 'Отменен', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Неизвестно', color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  // Отмена бронирования
  const cancelBooking = async () => {
    if (!cancelBookingId) return;
    
    setIsCancelling(true);
    
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновление статуса бронирования
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === cancelBookingId 
            ? { ...booking, status: "cancelled" } 
            : booking
        )
      );
      
      toast({
        title: "Бронирование отменено",
        description: "Ваше бронирование успешно отменено",
      });
      
      setCancelBookingId(null);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отменить бронирование. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои бронирования</CardTitle>
        <CardDescription>
          Управление бронированиями услуг
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Поиск по номеру или услуге..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все бронирования</SelectItem>
              <SelectItem value="pending">Ожидающие</SelectItem>
              <SelectItem value="confirmed">Подтверждённые</SelectItem>
              <SelectItem value="completed">Выполненные</SelectItem>
              <SelectItem value="cancelled">Отменённые</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Список бронирований */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Загрузка бронирований...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">У вас пока нет бронирований</h3>
            {searchTerm || filter !== "all" ? (
              <p className="text-gray-500 mb-4">Попробуйте изменить параметры поиска</p>
            ) : (
              <p className="text-gray-500 mb-4">Забронируйте услугу прямо сейчас</p>
            )}
            <Button asChild>
              <Link to="/services">Перейти к услугам</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => {
              const statusDetails = getStatusDetails(booking.status);
              const bookingDate = new Date(booking.datetime);
              const isPast = bookingDate < new Date();
              
              return (
                <Card key={booking.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-medium">Бронирование №{booking.reference}</h3>
                        <p className="text-sm text-gray-500">
                          Создано: {formatDate(booking.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className={`${statusDetails.color} border-0`}>
                          {statusDetails.text}
                        </Badge>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Детали бронирования */}
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">{booking.serviceTitle}</p>
                        {booking.additionalOptions.length > 0 && (
                          <ul className="text-sm text-gray-600 mt-1">
                            {booking.additionalOptions.map(option => (
                              <li key={option.id}>+ {option.title}: {option.price} ₽</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Дата и время:</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.datetime)}, {formatTime(booking.datetime)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Адрес:</p>
                            <p className="text-sm text-gray-600">{booking.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-sm font-medium">Стоимость услуги:</p>
                        <p className="text-xl font-bold">{booking.totalAmount} ₽</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(booking.status === 'pending' || booking.status === 'confirmed') && !isPast && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Отменить
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Отменить бронирование</DialogTitle>
                                <DialogDescription>
                                  Вы уверены, что хотите отменить бронирование №{booking.reference}?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="cancel-reason">Причина отмены (необязательно)</Label>
                                  <Textarea
                                    id="cancel-reason"
                                    placeholder="Укажите причину отмены бронирования"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setCancelBookingId(null)}>
                                  Отмена
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={cancelBooking}
                                  disabled={isCancelling}
                                >
                                  {isCancelling ? "Отмена..." : "Подтвердить отмену"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        <Button variant="outline" asChild>
                          <Link to={`/account/bookings/${booking.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Подробнее
                          </Link>
                        </Button>
                        
                        {['completed'].includes(booking.status) && (
                          <Button variant="outline" asChild>
                            <Link to={`/services/${booking.serviceId}`}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Забронировать снова
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Bookings;
