export interface ContractRequestPremium {
    contractType: string;
    premiumType: string;
    entreprise: string;
    startDate: Date;
    endDate: Date;
    maintenance: number;
    tickets: number;
    description:string;

  }
  export interface ContractRequestStandart {
    contractType: string;
    entreprise: string;
    startDate: Date;
    endDate: Date;
    tickets: number;
    description:string;

  }
  export interface ContractRequest
  {
    contractType: string;
    premiumType: string;
    entreprise: string;
    startDate: Date;
    endDate: Date;
    maintenance: number;
    tickets: number;
    description:string;

  }
  


  

