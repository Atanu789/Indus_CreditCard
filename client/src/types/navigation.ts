export type ServiceType = 'RewardsRedeem' | 'CardProtection';
export type FormMode = 'existing' | 'apply';

export type RootStackParamList = {
  Welcome: undefined;
  SimSelect: undefined;
  CardServices: {
    simLabel: string;
  };
  ServiceSelection: {
    simLabel: string;
    serviceType: ServiceType;
    cardName: string;
  };
  UserDetailsForm: {
    simLabel: string;
    serviceType: ServiceType;
    cardName: string;
    formMode: FormMode;
  };
  Success: {
    serviceType: ServiceType;
    fullName: string;
    referenceId: string;
    mobileNumber: string;
  };
  AdminLogin: undefined;
  AdminPanel: undefined;
};
