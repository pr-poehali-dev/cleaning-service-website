
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardHeader>
        <CardTitle>{service.title}</CardTitle>
        <CardDescription>{service.price}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{service.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link to={`/services/${service.id}`}>Подробнее</Link>
        </Button>
        <Button>Заказать</Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
