
import { useState, useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authService } from '@/api/apiClient';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

// Типы для пользователя админки
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const AdminLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuthStatus = () => {
      const authData = authService.checkAuth();
      if (authData) {
        setUser(authData.user);
      }
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  // Если загрузка завершена и пользователь не авторизован
  if (!isLoading && !user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Обработчик выхода из системы
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      navigate('/admin/login');
    }
  };
  
  // Навигационные пункты
  const navigationItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, title: 'Дашборд', path: '/admin/dashboard' },
    { icon: <Calendar className="h-5 w-5" />, title: 'Бронирования', path: '/admin/bookings' },
    { icon: <ShoppingBag className="h-5 w-5" />, title: 'Услуги', path: '/admin/services' },
    { icon: <Users className="h-5 w-5" />, title: 'Клиенты', path: '/admin/clients' },
    { icon: <Settings className="h-5 w-5" />, title: 'Настройки', path: '/admin/settings' },
  ];

  // Функция для получения инициалов пользователя
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Боковая панель */}
      <aside 
        className={`fixed z-10 h-full bg-white shadow-md transition-all duration-300 lg:static ${
          isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Логотип */}
          <div className="flex h-16 items-center border-b px-4">
            {isSidebarOpen ? (
              <Link to="/admin/dashboard" className="font-bold text-xl text-blue-600">
                ЧистоТа Админ
              </Link>
            ) : (
              <Link to="/admin/dashboard" className="font-bold text-xl text-blue-600 mx-auto">
                ЧТ
              </Link>
            )}
          </div>
          
          {/* Навигация */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-md px-3 py-2 transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {isSidebarOpen && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Нижняя часть сайдбара */}
          <div className="border-t p-4">
            {isSidebarOpen ? (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Выйти
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="mx-auto text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </aside>
      
      {/* Основное содержимое */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Верхняя панель */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Профиль пользователя */}
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user?.name} />
                    ) : (
                      <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden md:inline-block">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  Настройки
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>
        
        {/* Контент */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
