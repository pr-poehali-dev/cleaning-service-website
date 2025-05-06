
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { bookingsService } from '@/api/apiClient';
import { toast } from '@/hooks/use-toast';

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
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalAmount: number;
  additionalOptions: BookingOption[];
  comments?: string;
  createdAt: string;
}

const AdminBookings = () => {
  // Состояния
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusUpdateComment, setStatusUpdateComment] = useState('');
  const [newStatus, setNewStatus] = useState<Booking['status']>('confirmed');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Загрузка бронирований
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await bookingsService.getAllBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Не удалось загрузить список бронирований. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  // Фильтрация бронирований
  const filteredBookings = bookings.filter(booking => {
    // Фильтр по поиску
    const matchesSearch = 
      booking.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      booking.clientPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.clientEmail && booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      booking.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Фильтр по статусу
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    // Фильтр по дате
    const bookingDate = new Date(booking.datetime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = 
        bookingDate.getDate() === today.getDate() && 
        bookingDate.getMonth() === today.getMonth() && 
        bookingDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === 'tomorrow') {
      matchesDate = 
        bookingDate.getDate() === tomorrow.getDate() && 
        bookingDate.getMonth() === tomorrow.getMonth() && 
        bookingDate.getFullYear() === tomorrow.getFullYear();
    } else if (dateFilter === 'future') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      matchesDate = bookingDate > todayStart;
    } else if (dateFilter === 'past') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      matchesDate = bookingDate < todayStart;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
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

  // Открытие диалога с деталями бронирования
  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailDialogOpen(true);
  };

  // Открытие диалога изменения статуса
  const openStatusUpdateDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status === 'pending' ? 'confirmed' : booking.status === 'confirmed' ? 'completed' : booking.status);
    setStatusUpdateComment('');
    setIsStatusDialogOpen(true);
  };

  // Обновление статуса бронирования
  const updateBookingStatus = async () => {
    if (!selectedBooking) return;
    
    setIsUpdatingStatus(true);
    
    try {
      await bookingsService.updateBookingStatus(selectedBooking.id, newStatus);
      
      // Обновление списка бронирований
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
      
      toast({
        title: "Статус обновлен",
        description: `Статус бронирования #${selectedBooking.reference} успешно изменен`,
      });
      
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус бронирования. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Управление бронированиями</h1>
      </div>
      
      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Поиск по имени, телефону, номеру..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                <SelectItem value="confirmed">Подтверждено</SelectItem>
                <SelectItem value="completed">Выполнено</SelectItem>
                <SelectItem value="cancelled">Отменено</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Дата" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все даты</SelectItem>
                <SelectItem value="today">Сегодня</SelectItem>
                <SelectItem value="tomorrow">Завтра</SelectItem>
                <SelectItem value="future">Будущие</SelectItem>
                <SelectItem value="past">Прошедшие</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Таблица бронирований */}
      <Card>
        <CardHeader>
          <CardTitle>Список бронирований</CardTitle>
          <CardDescription>
            Управляйте бронированиями и меняйте их статус
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Бронирования не найдены</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>№</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Услуга</TableHead>
                    <TableHead>Дата и время</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const statusDetails = getStatusDetails(booking.status);
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.reference}</TableCell>
                        <TableCell>{booking.clientName}</TableCell>
                        <TableCell>{booking.serviceTitle}</TableCell>
                        <TableCell>
                          {formatDate(booking.datetime)}, {formatTime(booking.datetime)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${statusDetails.color} border-0`}>
                            {statusDetails.text}
                          </Badge>
                        </TableCell>
                        <TableCell>{booking.totalAmount} ₽</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openBookingDetails(booking)}
                            >
                              Детали
                            </Button>
                            {['pending', 'confirmed'].includes(booking.status) && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openStatusUpdateDialog(booking)}
                              >
                                Изменить статус
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Диалог с деталями бронирования */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Бронирование #{selectedBooking.reference}
                  <Badge variant="outline" className={`${getStatusDetails(selectedBooking.status).color} border-0 ml-2`}>
                    {getStatusDetails(selectedBooking.status).text}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Создано: {formatDate(selectedBooking.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Информация о клиенте</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-600">Имя:</span>
                        <span>{selectedBooking.clientName}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span>{selectedBooking.clientPhone}</span>
                      </div>
                      {selectedBooking.clientEmail && (
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span>{selectedBooking.clientEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Детали услуги</h3>
                    <p className="font-medium">{selectedBooking.serviceTitle}</p>
                    {selectedBooking.additionalOptions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-600">Дополнительные опции:</p>
                        <ul className="text-sm ml-5 mt-1 list-disc">
                          {selectedBooking.additionalOptions.map((option) => (
                            <li key={option.id}>
                              {option.title} - {option.price} ₽
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {selectedBooking.comments && (
                    <div>
                      <h3 className="font-semibold mb-2">Комментарии клиента</h3>
                      <p className="text-sm bg-gray-50 p-3 rounded-md">
                        {selectedBooking.comments}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Детали бронирования</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Дата:</p>
                          <p>{formatDate(selectedBooking.datetime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Время:</p>
                          <p>{formatTime(selectedBooking.datetime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Адрес:</p>
                          <p>{selectedBooking.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold mb-2">Финансовая информация</h3>
                    <div className="flex justify-between items-center font-medium">
                      <span>Итоговая сумма:</span>
                      <span className="text-xl">{selectedBooking.totalAmount} ₽</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                {['pending', 'confirmed'].includes(selectedBooking.status) && (
                  <Button
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      openStatusUpdateDialog(selectedBooking);
                    }}
                  >
                    Изменить статус
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Закрыть
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Диалог изменения статуса */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Изменение статуса бронирования</DialogTitle>
                <DialogDescription>
                  Бронирование #{selectedBooking.reference} - {selectedBooking.serviceTitle}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Текущий статус</Label>
                  <Badge variant="outline" className={`${getStatusDetails(selectedBooking.status).color} border-0`}>
                    {getStatusDetails(selectedBooking.status).text}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                </div>
                
                <div className="space-y-2">
                  <Label>Новый статус</Label>
                  <Select value={newStatus} onValueChange={(value: Booking['status']) => setNewStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedBooking.status === 'pending' && (
                        <>
                          <SelectItem value="confirmed">Подтвердить</SelectItem>
                          <SelectItem value="cancelled">Отменить</SelectItem>
                        </>
                      )}
                      {selectedBooking.status === 'confirmed' && (
                        <>
                          <SelectItem value="completed">Выполнено</SelectItem>
                          <SelectItem value="cancelled">Отменить</SelectItem>
                        </>
                      )}
                      {selectedBooking.status === 'completed' && (
                        <SelectItem value="completed" disabled>
                          Выполнено (Финальный статус)
                        </SelectItem>
                      )}
                      {selectedBooking.status === 'cancelled' && (
                        <SelectItem value="cancelled" disabled>
                          Отменено (Финальный статус)
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="statusComment">Комментарий (необязательно)</Label>
                  <Textarea
                    id="statusComment"
                    placeholder="Добавьте комментарий к изменению статуса"
                    value={statusUpdateComment}
                    onChange={(e) => setStatusUpdateComment(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                  Отмена
                </Button>
                <Button 
                  onClick={updateBookingStatus}
                  disabled={isUpdatingStatus || selectedBooking.status === newStatus}
                >
                  {isUpdatingStatus ? "Сохранение..." : "Сохранить"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
