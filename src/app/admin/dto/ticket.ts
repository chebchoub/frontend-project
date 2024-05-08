interface Ticket {
  _id: string;
  titre: string;
  status: string; // Assurez-vous que le type de status correspond à votre implémentation
  openingDate: string; // Si vous utilisez des dates, vous pouvez les laisser comme des chaînes de caractères ou les convertir en objets Date si nécessaire
  closingDate: string;
  priority: string; // Assurez-vous que le type de priority correspond à votre implémentation
  category: string; // Assurez-vous que le type de category correspond à votre implémentation
  initialComment:any[];
  images: any[] ;
  files :any[] ;
  rating: number;
  client: any; // Vous devrez également définir l'interface Client si elle n'existe pas déjà
  archiver: boolean;
}