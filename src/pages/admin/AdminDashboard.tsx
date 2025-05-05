
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { statsService } from '@/api/apiClient';
import { Calendar as CalendarIcon, Users, ShoppingBag, CreditCard, TrendingUp, TrendingDown, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

// Типы данных
interface DashboardStats {
  totalBookings: number;
  totalClients: number;
  totalRevenue: number;
  pendingBookings: number;
  // Для графиков
  revenueByPeriod: Array<{ date: string; amount: number }>;
  servicePerformance: Array<{ service: string; bookings: number; revenue: number }>;
  bookingsByStatus: Array<{ status: string; count: number }>;
  // Последние бронирования
  recentBookings: Array<{
    id: number;
    clientName: string;
    service: string;
    date: string;
    status: string;
    amount: number;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await statsService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Не удалось загрузить статистику. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  // Загрузка статистики по периоду
  useEffect(() => {
    const fetchStatsByPeriod = async () => {
      if (!dateRange.from || !dateRange.to) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const startDate = format(dateRange.from, 'yyyy-MM-dd');
        const endDate = format(dateRange.to, 'yyyy-MM-dd');
        
        const data = await statsService.getStatsByPeriod(startDate, endDate);
        setStats(prevStats => ({ ...prevStats, ...data }));
      } catch (err) {
        console.error('Failed to fetch period stats:', err);
        setError('Не удалось загрузить статистику за выбранный период.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (period === 'custom' && dateRange.from && dateRange.to) {
      fetchStatsByPeriod();
    }
  }, [period, dateRange]);
  
  // Функция для изменения периода
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    
    // Установка диапазона дат в зависимости от выбранного периода
    const today = new Date();
    let from: Date | undefined;
    
    switch (value) {
      case 'week':
        from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        break;
      case 'month':
        from = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        break;
      case 'quarter':
        from = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        break;
      case 'year':
        from = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
      default:
        // Для 'custom' оставляем текущий диапазон
        return;
    }
    
    setDateRange({ from, to: today });
  };
  
  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
        <div className="mt-4 md:mt-0">
          {/* Выбор периода */}
          <Tabs value={period} onValueChange={handlePeriodChange} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="month">Месяц</TabsTrigger>
              <TabsTrigger value="quarter">Квартал</TabsTrigger>
              <TabsTrigger value="year">Год</TabsTrigger>
              <TabsTrigger value="custom">Другой</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Календарь для выбора произвольного периода */}
      {period === 'custom' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Выберите период</CardTitle>
            <CardDescription>Укажите начальную и конечную дату</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                locale={ru}
                className="rounded-md border shadow"
              />
              
              <div className="mt-4 md:mt-0 self-center">
                <p className="text-sm text-gray-500 mb-2">Выбранный период:</p>
                <p className="text-sm font-medium">
                  {dateRange.from ? format(dateRange.from, 'PPP', { locale: ru }) : 'Не выбрано'} - 
                  {dateRange.to ? format(dateRange.to, 'PPP', { locale: ru }) : 'Не выбрано'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Карточки со сводной информацией */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Бронирования */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Бронирования</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.pendingBookings || 0} ожидающих подтверждения
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Клиенты */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Всего зарегистрировано
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Услуги */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Услуги</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.servicePerformance?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Активных услуг
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Доход */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Доход</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  За выбранный период
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Графики и таблицы */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* График доходов */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Доходы за период</CardTitle>
            <CardDescription>
              Динамика доходов за выбранный период
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : error ? (
              <div className="h-full w-full flex items-center justify-center text-center">
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground ml-4">График доходов будет здесь</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Таблица производительности услуг */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Популярные услуги</CardTitle>
            <CardDescription>
              Статистика по услугам за выбранный период
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
              <div className="h-64 w-full flex items-center justify-center text-center">
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : (
              <div className="relative">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 text-left font-medium">Услуга</th>
                      <th className="py-2 text-right font-medium">Кол-во</th>
                      <th className="py-2 text-right font-medium">Доход</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.servicePerformance?.slice(0, 5).map((service, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2">{service.service}</td>
                        <td className="py-2 text-right">{service.bookings}</td>
                        <td className="py-2 text-right">{formatCurrency(service.revenue)}</td>
                      </tr>
                    ))}
                    {(!stats?.servicePerformance || stats.servicePerformance.length === 0) && (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-muted-foreground">
                          Нет данных за выбранный период
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Последние бронирования */}
      <Card>
        <CardHeader>
          <CardTitle>Последние бронирования</CardTitle>
          <CardDescription>
            Недавно созданные бронирования и их статус
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
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-3 text-left font-medium">ID</th>
                    <th className="px-3 py-3 text-left font-medium">Клиент</th>
                    <th className="px-3 py-3 text-left font-medium">Услуга</th>
                    <th className="px-3 py-3 text-left font-medium">Дата</th>
                    <th className="px-3 py-3 text-left font-medium">Статус</th>
                    <th className="px-3 py-3 text-right font-medium">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentBookings?.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="px-3 py-3">{booking.id}</td>
                      <td className="px-3 py-3">{booking.clientName}</td>
                      <td className="px-3 py-3">{booking.service}</td>
                      <td className="px-3 py-3">
                        {format(new Date(booking.date), 'dd.MM.yyyy HH:mm')}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking.status === 'pending'
                            ? 'Ожидает'
                            : booking.status === 'confirmed'
                            ? 'Подтверждено'
                            : booking.status === 'cancelled'
                            ? 'Отменено'
                            : booking.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">{formatCurrency(booking.amount)}</td>
                    </tr>
                  ))}
                  {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-center text-muted-foreground">
                        Нет данных о недавних бронированиях
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
