
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash, Plus, Minus, ShoppingCart, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Типы данных
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  options?: {
    id: number;
    title: string;
    price: number;
  }[];
}

// Моковые данные для корзины
const initialCartItems: CartItem[] = [
  {
    id: 1,
    title: "Уборка квартир",
    price: 2000,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80",
    quantity: 1,
    options: [
      { id: 1, title: "Мытье окон", price: 500 },
      { id: 3, title: "Уборка балкона", price: 700 }
    ]
  },
  {
    id: 3,
    title: "Мойка окон",
    price: 1500,
    image: "https://images.unsplash.com/photo-1527689638836-411945a2b57c?auto=format&fit=crop&q=80",
    quantity: 2,
    options: []
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isPromoLoading, setIsPromoLoading] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  // Расчет общей стоимости
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      
      // Добавляем стоимость опций
      if (item.options && item.options.length > 0) {
        const optionsTotal = item.options.reduce((sum, option) => sum + option.price, 0);
        itemTotal += optionsTotal * item.quantity;
      }
      
      return total + itemTotal;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 0; // Бесплатная доставка
  const total = subtotal - discount + deliveryFee;

  // Обработка изменения количества товара
  const handleQuantityChange = (id: number, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) } 
          : item
      )
    );
  };

  // Удаление товара из корзины
  const removeItemFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    setItemToRemove(null);
    
    toast({
      title: "Товар удален",
      description: "Услуга была удалена из корзины",
    });
  };

  // Применение промокода
  const applyPromoCode = () => {
    if (!promoCode) return;
    
    setIsPromoLoading(true);
    
    // Имитация проверки промокода
    setTimeout(() => {
      if (promoCode.toUpperCase() === "CLEAN10") {
        const newDiscount = Math.round(subtotal * 0.1); // 10% скидка
        setDiscount(newDiscount);
        setIsPromoApplied(true);
        
        toast({
          title: "Промокод применен",
          description: `Скидка 10% (${newDiscount} ₽) успешно применена`,
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Введен неверный промокод",
          variant: "destructive"
        });
      }
      
      setIsPromoLoading(false);
    }, 1000);
  };

  // Оформление заказа
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Имитация процесса оформления заказа
    setTimeout(() => {
      setIsOrderPlaced(true);
      setIsCheckingOut(false);
    }, 2000);
  };

  // Очистка корзины после оформления заказа
  useEffect(() => {
    if (isOrderPlaced) {
      setCartItems([]);
    }
  }, [isOrderPlaced]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Корзина</h1>
          
          {cartItems.length === 0 && !isOrderPlaced ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-medium text-gray-700 mb-3">Ваша корзина пуста</h2>
              <p className="text-gray-500 mb-6">
                Добавьте услуги в корзину, ч��обы оформить заказ
              </p>
              <Button asChild>
                <Link to="/services">Перейти к услугам</Link>
              </Button>
            </div>
          ) : isOrderPlaced ? (
            <div className="text-center py-12 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageCheck className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Заказ успешно оформлен!</h2>
              <p className="text-gray-600 mb-6">
                Спасибо за ваш заказ! Номер вашего заказа: <span className="font-medium">ORD-{Math.floor(Math.random() * 10000)}</span>.
                Мы свяжемся с вами в ближайшее время для уточнения деталей.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/">Вернуться на главную</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/services">Продолжить покупки</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Список товаров */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-lg">{item.title}</h3>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setItemToRemove(item.id)}>
                                    <Trash className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Удалить услугу</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Вы уверены, что хотите удалить услугу "{item.title}" из корзины?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => removeItemFromCart(item.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            
                            <p className="text-blue-600 font-medium mb-2">{item.price} ₽</p>
                            
                            {item.options && item.options.length > 0 && (
                              <div className="mb-2 text-sm text-gray-600">
                                <span className="font-medium">Дополнительные опции:</span>
                                <ul className="ml-4 mt-1">
                                  {item.options.map(option => (
                                    <li key={option.id}>
                                      {option.title} (+{option.price} ₽)
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="flex items-center mt-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="mx-3 w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Итоговая сумма */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Итого</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Сумма заказа:</span>
                        <span>{subtotal} ₽</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Скидка:</span>
                          <span>-{discount} ₽</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Стоимость выезда:</span>
                        <span>{deliveryFee > 0 ? `${deliveryFee} ₽` : "Бесплатно"}</span>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between font-bold">
                        <span>Всего:</span>
                        <span className="text-blue-600">{total} ₽</span>
                      </div>
                    </div>
                    
                    {/* Промокод */}
                    <div className="mb-6">
                      <p className="font-medium mb-2">Промокод:</p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Введите промокод"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={isPromoApplied || isPromoLoading}
                        />
                        <Button 
                          variant="outline" 
                          onClick={applyPromoCode}
                          disabled={!promoCode || isPromoApplied || isPromoLoading}
                        >
                          {isPromoLoading ? "..." : "Применить"}
                        </Button>
                      </div>
                      {isPromoApplied && (
                        <p className="text-green-600 text-sm mt-1">
                          Промокод CLEAN10 применен (скидка 10%)
                        </p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">
                        Попробуйте промокод "CLEAN10" для скидки 10%
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? "Оформление заказа..." : "Оформить заказ"}
                    </Button>
                    
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Нажимая на кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности
                    </p>
                  </CardContent>
                </Card>
                
                <div className="mt-4 text-center">
                  <Link 
                    to="/services" 
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                  >
                    Продолжить покупки
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
