
interface ImageItem {
    url: string;
    filename: string;
    fileType: string;
    size: number;
  }
  
  interface PDFItem {
    url: string;
    filename: string;
    fileType: string;
    size: number;
  }
  
  export interface TicketRequest {
    titre: string;
    priority: string;
    category: string;
    initialComment: string;
    images: ImageItem[];
    files: PDFItem[];
  }
  