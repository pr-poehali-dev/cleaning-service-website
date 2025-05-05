
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FileImage, 
  X,
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { servicesService } from '@/api/apiClient';
import { toast } from '@/hooks/use-toast';

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
  longDescription?: string;
  price: number;
  priceUnit: string;
  image: string;
  category: string;
  duration: string;
  features: string[];
  additionalOptions: ServiceOption[];
  faq: Array<{ question: string; answer: string }>;
  active: boolean;
}

interface ServiceFormData {
  title: string;
  description: string;
  longDescription: string;
  price: number;
  priceUnit: string;
  image: string;
  category: string;
  duration: string;
  features: string[];
  additionalOptions: ServiceOption[];
  faq: Array<{ question: string; answer: string }>;
  active: boolean;
}

const AdminServices = () => {
  // Состояния
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    longDescription: '',
    price: 0,
    priceUnit: 'за услугу',
    image: '',
    category: 'residential',
    duration: '',
    features: [''],
    additionalOptions: [{ id: 1, title: '', price: 0 }],
    faq: [{ question: '', answer: '' }],
    active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загрузка услуг
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await servicesService.getAllServices();
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Не удалось загрузить список услуг. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  // Фильтрация услуг
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Обработчики формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => {
      const features = [...prev.features];
      features.splice(index, 1);
      return { ...prev, features };
    });
  };

  const handleOptionChange = (index: number, field: 'title' | 'price', value: string | number) => {
    setFormData(prev => {
      const options = [...prev.additionalOptions];
      options[index] = { ...options[index], [field]: value };
      return { ...prev, additionalOptions: options };
    });
  };

  const addOption = () => {
    setFormData(prev => {
      const lastOption = prev.additionalOptions[prev.additionalOptions.length - 1];
      const newId = lastOption ? lastOption.id + 1 : 1;
      return {
        ...prev,
        additionalOptions: [...prev.additionalOptions, { id: newId, title: '', price: 0 }]
      };
    });
  };

  const removeOption = (index: number) => {
    setFormData(prev => {
      const options = [...prev.additionalOptions];
      options.splice(index, 1);
      return { ...prev, additionalOptions: options };
    });
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => {
      const faq = [...prev.faq];
      faq[index] = { ...faq[index], [field]: value };
      return { ...prev, faq };
    });
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => {
      const faq = [...prev.faq];
      faq.splice(index, 1);
      return { ...prev, faq };
    });
  };

  // Открытие диалога для создания новой услуги
  const openCreateDialog = () => {
    setIsEditing(false);
    setEditingServiceId(null);
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      price: 0,
      priceUnit: 'за услугу',
      image: '',
      category: 'residential',
      duration: '',
      features: [''],
      additionalOptions: [{ id: 1, title: '', price: 0 }],
      faq: [{ question: '', answer: '' }],
      active: true
    });
    setIsDialogOpen(true);
  };

  // Открытие диалога для редактирования услуги
  const openEditDialog = (service: Service) => {
    setIsEditing(true);
    setEditingServiceId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      longDescription: service.longDescription || '',
      price: service.price,
      priceUnit: service.priceUnit,
      image: service.image,
      category: service.category,
      duration: service.duration,
      features: service.features.length ? service.features : [''],
      additionalOptions: service.additionalOptions.length ? service.additionalOptions : [{ id: 1, title: '', price: 0 }],
      faq: service.faq.length ? service.faq : [{ question: '', answer: '' }],
      active: service.active
    });
    setIsDialogOpen(true);
  };

  // Подтверждение удаления услуги
  const confirmDeleteService = (id: number) => {
    setServiceIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Удаление услуги
  const deleteService = async () => {
    if (!serviceIdToDelete) return;
    
    try {
      await servicesService.deleteService(serviceIdToDelete);
      
      // Обновляем список услуг
      setServices(prev => prev.filter(service => service.id !== serviceIdToDelete));
      
      toast({
        title: "Успех",
        description: "Услуга успешно удалена",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить услугу. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setServiceIdToDelete(null);
    }
  };

  // Сохранение услуги (создание или обновление)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Валидация данных
      if (!formData.title || !formData.description || formData.price <= 0) {
        toast({
          title: "Ошибка валидации",
          description: "Пожалуйста, заполните все обязательные поля.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      let result;
      
      if (isEditing && editingServiceId) {
        // Обновление существующей услуги
        result = await servicesService.updateService(editingServiceId, formData);
        
        // Обновляем список услуг
        setServices(prev => 
          prev.map(service => 
            service.id === editingServiceId ? { ...result } : service
          )
        );
        
        toast({
          title: "Успех",
          description: "Услуга успешно обновлена",
        });
      } else {
        // Создание новой услуги
        result = await servicesService.createService(formData);
        
        // Добавляем новую услугу в список
        setServices(prev => [...prev, result]);
        
        toast({
          title: "Успех",
          description: "Новая услуга успешно создана",
        });
      }
      
      // Закрываем диалог
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить услугу. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Категории услуг
  const categories = [
    { id: "all", name: "Все категории" },
    { id: "residential", name: "Для дома" },
    { id: "commercial", name: "Для бизнеса" },
    { id: "specialized", name: "Специализированные" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Управление услугами</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Добавить услугу
        </Button>
      </div>
      
      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Поиск услуг..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Таблица услуг */}
      <Card>
        <CardHeader>
          <CardTitle>Список услуг</CardTitle>
          <CardDescription>
            Управляйте услугами вашей компании
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
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Услуги не найдены</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Фото</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          {service.image ? (
                            <img 
                              src={service.image} 
                              alt={service.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FileImage className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>
                        {service.category === 'residential' 
                          ? 'Для дома' 
                          : service.category === 'commercial' 
                          ? 'Для бизнеса' 
                          : 'Специализированная'}
                      </TableCell>
                      <TableCell>{service.price} ₽ {service.priceUnit}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          service.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.active ? 'Активна' : 'Неактивна'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(service)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => confirmDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Диалог для создания/редактирования услуги */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Редактирование услуги' : 'Добавление новой услуги'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Измените данные услуги и нажмите "Сохранить"' 
                : 'Заполните форму для добавления новой услуги'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название услуги *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Например: Уборка квартир"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Категория *</Label>
                  <Select name="category" value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Для дома</SelectItem>
                      <SelectItem value="commercial">Для бизнеса</SelectItem>
                      <SelectItem value="specialized">Специализированная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Краткое описание *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Краткое описание услуги"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longDescription">Полное описание</Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  placeholder="Подробное описание услуги"
                  rows={5}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Цена (₽) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.price}
                    onChange={handleNumberInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priceUnit">Единица цены</Label>
                  <Select name="priceUnit" value={formData.priceUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, priceUnit: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите единицу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="за услугу">за услугу</SelectItem>
                      <SelectItem value="за м²">за м²</SelectItem>
                      <SelectItem value="за час">за час</SelectItem>
                      <SelectItem value="за день">за день</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Среднее время выполнения</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Например: 3-4 часа"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">URL изображения</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">Рекомендуемый размер: 800x600px</p>
              </div>
              
              {/* Особенности услуги */}
              <div className="border-t pt-4 mt-2">
                <label className="font-medium block mb-2">Особенности услуги</label>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Например: Мытье полов и плинтусов"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                        disabled={formData.features.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Добавить особенность
                  </Button>
                </div>
              </div>
              
              {/* Дополнительные опции */}
              <div className="border-t pt-4 mt-2">
                <label className="font-medium block mb-2">Дополнительные опции</label>
                <div className="space-y-3">
                  {formData.additionalOptions.map((option, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-2">
                      <Input
                        value={option.title}
                        onChange={(e) => handleOptionChange(index, 'title', e.target.value)}
                        placeholder="Название опции"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          step="100"
                          value={option.price || ''}
                          onChange={(e) => handleOptionChange(index, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Цена (₽)"
                          className="w-28"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          disabled={formData.additionalOptions.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Добавить опцию
                  </Button>
                </div>
              </div>
              
              {/* FAQ */}
              <div className="border-t pt-4 mt-2">
                <label className="font-medium block mb-2">Часто задаваемые вопросы</label>
                <div className="space-y-4">
                  {formData.faq.map((item, index) => (
                    <div key={index} className="space-y-2 border p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Вопрос и ответ #{index + 1}</label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFaq(index)}
                          disabled={formData.faq.length <= 1}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={item.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        placeholder="Вопрос"
                      />
                      <Textarea
                        value={item.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        placeholder="Ответ"
                        rows={3}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFaq}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Добавить вопрос/ответ
                  </Button>
                </div>
              </div>
              
              {/* Статус */}
              <div className="flex items-center space-x-2 border-t pt-4">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Услуга активна
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту услугу? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={deleteService}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
