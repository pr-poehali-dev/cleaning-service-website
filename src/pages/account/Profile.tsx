
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Edit, Save } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

const Profile = () => {
  const userDataStr = localStorage.getItem("user_data");
  const initialUserData: UserData = userDataStr 
    ? JSON.parse(userDataStr) 
    : { id: 0, name: "", email: "", phone: "" };
  
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Получаем инициалы пользователя для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Имитация сохранения на сервере
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновляем в localStorage
      localStorage.setItem("user_data", JSON.stringify(userData));
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    // Восстанавливаем данные из localStorage
    const userDataStr = localStorage.getItem("user_data");
    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Мой профиль</CardTitle>
            <CardDescription>
              Просмотр и редактирование персональных данных
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Фото профиля */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <Avatar className="h-32 w-32">
            {userData?.avatar ? (
              <AvatarImage src={userData.avatar} alt={userData.name} />
            ) : (
              <AvatarFallback className="text-3xl">
                {getInitials(userData.name)}
              </AvatarFallback>
            )}
          </Avatar>
          
          {isEditing && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Фото профиля</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Загрузить фото
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Удалить
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Рекомендуемый размер: 400x400 пикселей, JPG или PNG
              </p>
            </div>
          )}
        </div>
        
        {/* Персональные данные */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО</Label>
              {isEditing ? (
                <Input 
                  id="name" 
                  name="name" 
                  value={userData.name} 
                  onChange={handleChange} 
                />
              ) : (
                <p className="text-lg">{userData.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={userData.email} 
                  onChange={handleChange} 
                />
              ) : (
                <p className="text-lg">{userData.email}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              {isEditing ? (
                <Input 
                  id="phone" 
                  name="phone" 
                  value={userData.phone} 
                  onChange={handleChange} 
                />
              ) : (
                <p className="text-lg">{userData.phone}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {isEditing && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Сохранение..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Profile;
