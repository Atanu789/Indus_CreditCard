export type ServiceType = 'RewardsRedeem' | 'CardProtection';

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
