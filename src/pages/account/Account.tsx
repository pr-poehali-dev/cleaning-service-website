
import { useState, useEffect } from "react";
import { useNavigate, Link, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { User, Settings, ShoppingCart, LogOut, Home, Calendar, Edit } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

const AccountLayout = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem("user_token");
    const userDataStr = localStorage.getItem("user_data");
    
    if (!token || !userDataStr) {
      navigate("/auth/login");
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(userDataStr);
      setUserData(parsedUserData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/auth/login");
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из аккаунта",
    });
    
    navigate("/");
  };

  // Если данные загружаются или пользователь не авторизован
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Загрузка данных...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Получаем инициалы пользователя для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            {/* Сайдбар */}
            <div className="space-y-6">
              {/* Профиль */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      {userData?.avatar ? (
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                      ) : (
                        <AvatarFallback className="text-lg">
                          {userData ? getInitials(userData.name) : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h2 className="text-xl font-semibold">{userData?.name}</h2>
                    <p className="text-sm text-gray-500">{userData?.email}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Навигация */}
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : ""}`}
                      onClick={() => {
                        setActiveTab("profile");
                        navigate("/account");
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Мой профиль
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "orders" ? "bg-blue-50 text-blue-600" : ""}`}
                      onClick={() => {
                        setActiveTab("orders");
                        navigate("/account/orders");
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      История заказов
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "bookings" ? "bg-blue-50 text-blue-600" : ""}`}
                      onClick={() => {
                        setActiveTab("bookings");
                        navigate("/account/bookings");
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Мои бронирования
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : ""}`}
                      onClick={() => {
                        setActiveTab("settings");
                        navigate("/account/settings");
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Настройки
                    </Button>
                  </nav>
                </CardContent>
              </Card>
              
              {/* Действия */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate("/")}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      На главную
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Выйти
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Выйти из аккаунта?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите выйти из личного кабинета?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLogout}>Выйти</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Основной контент */}
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccountLayout;
