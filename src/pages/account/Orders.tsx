
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Search, Filter, RefreshCw, ExternalLink, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Link } from "react-router-dom";

// Типы данных
interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  options?: {
    id: number;
    title: string;
    price: number;
  }[];
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalAmount: number;
  items: OrderItem[];
  address?: string;
  paymentMethod: string;
}

// Моковые данные заказов
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2023-001",
    date: "2023-05-15T14:30:00",
    status: "completed",
    totalAmount: 3500,
    items: [
      {
        id: 1,
        title: "Уборка квартир",
        price: 2000,
        quantity: 1,
        options: [
          { id: 1, title: "Мытье окон", price: 500 },
          { id: 3, title: "Уборка балкона", price: 700 }
        ]
      },
      {
        id: 3,
        title: "Мойка окон",
        price: 300,
        quantity: 1
      }
    ],
    address: "г. Москва, ул. Пушкина, д. 10, кв. 5",
    paymentMethod: "Банковская карта"
  },
  {
    id: 2,
    orderNumber: "ORD-2023-002",
    date: "2023-06-20T10:00:00",
    status: "confirmed",
    totalAmount: 4500,
    items: [
      {
        id: 5,
        title: "Генеральная уборка",
        price: 4500,
        quantity: 1
      }
    ],
    address: "г. Москва, ул. Ленина, д. 25, кв. 12",
    paymentMethod: "Наличные"
  },
  {
    id: 3,
    orderNumber: "ORD-2023-003",
    date: "2023-07-05T16:45:00",
    status: "pending",
    totalAmount: 1800,
    items: [
      {
        id: 9,
        title: "Регулярная уборка",
        price: 1800,
        quantity: 1
      }
    ],
    address: "г. Москва, пр. Мира, д. 78, кв. 43",
    paymentMethod: "Банковская карта"
  }
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Имитация загрузки данных
    const loadOrders = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить историю заказов",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, []);
  
  // Фильтрация заказов
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === "all" || order.status === filter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });
  
  // Функция повторного заказа
  const repeatOrder = (order: Order) => {
    // В реальном приложении здесь будет логика добавления в корзину
    toast({
      title: "Заказ добавлен в корзину",
      description: `Заказ №${order.orderNumber} добавлен в корзину`,
    });
  };
  
  // Форматирование даты
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Получение текста и цвета статуса
  const getStatusDetails = (status: Order['status']) => {
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>История заказов</CardTitle>
        <CardDescription>
          Просмотр ваших предыдущих заказов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Поиск по номеру заказа или услуге..."
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
              <SelectItem value="all">Все заказы</SelectItem>
              <SelectItem value="pending">Ожидающие</SelectItem>
              <SelectItem value="confirmed">Подтверждённые</SelectItem>
              <SelectItem value="completed">Выполненные</SelectItem>
              <SelectItem value="cancelled">Отменённые</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Список заказов */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Загрузка заказов...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">У вас пока нет заказов</h3>
            {searchTerm || filter !== "all" ? (
              <p className="text-gray-500 mb-4">Попробуйте изменить параметры поиска</p>
            ) : (
              <p className="text-gray-500 mb-4">Самое время воспользоваться нашими услугами</p>
            )}
            <Button asChild>
              <Link to="/services">Перейти к услугам</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const statusDetails = getStatusDetails(order.status);
              
              return (
                <Card key={order.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-medium">Заказ №{order.orderNumber}</h3>
                        <p className="text-sm text-gray-500">
                          от {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className={`${statusDetails.color} border-0`}>
                          {statusDetails.text}
                        </Badge>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Элементы заказа */}
                    <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between gap-2">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            {item.options && item.options.length > 0 && (
                              <ul className="text-sm text-gray-600 mt-1">
                                {item.options.map(option => (
                                  <li key={option.id}>+ {option.title}: {option.price} ₽</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="text-right">
                            <p>{item.price} ₽ x {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {order.address && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm font-medium">Адрес:</p>
                          <p className="text-sm text-gray-600">{order.address}</p>
                        </div>
                      </>
                    )}
                    
                    <Separator className="my-4" />
                    
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-sm font-medium">Способ оплаты:</p>
                        <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Итого:</p>
                        <p className="text-xl font-bold">{order.totalAmount} ₽</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-6">
                      {['completed', 'confirmed'].includes(order.status) && (
                        <Button variant="outline" onClick={() => repeatOrder(order)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Повторить заказ
                        </Button>
                      )}
                      <Button variant="outline" asChild>
                        <Link to={`/account/orders/${order.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Подробнее
                        </Link>
                      </Button>
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

export default Orders;
