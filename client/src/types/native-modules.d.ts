declare module 'react-native-get-sms-android' {
  type FailureCallback = (message: string) => void;
  type SuccessCallback = (count: number, smsList: string) => void;

  const SmsAndroid: {
    list: (filter: string, failCallback: FailureCallback, successCallback: SuccessCallback) => void;
  };

  export default SmsAndroid;
}

declare module 'react-native-sim-data' {
  type SimInfo = {
    cards?: Array<{
      carrierName?: string;
      displayName?: string;
      slotIndex?: number;
      simSlotIndex?: number;
    }>;
  };

  const SimData: {
    getSimInfo: () => SimInfo;
  };

  export default SimData;
}
