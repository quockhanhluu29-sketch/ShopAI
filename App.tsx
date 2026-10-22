import React, { useEffect } from 'react';
import * as Updates from 'expo-updates';
import { ENABLE_OTA_UPDATE } from './src/constants/env';
import { RootNavigator } from './src/navigation/RootNavigator';
import { recordBreadcrumb, recordNonFatal } from './src/services/crashReporter';

const App = () => {
  useEffect(() => {
    if (__DEV__ || !ENABLE_OTA_UPDATE || !Updates.isEnabled) return;

    const checkForUpdate = async (): Promise<void> => {
      try {
        recordBreadcrumb('Checking for an OTA update');
        const update = await Updates.checkForUpdateAsync();
        if (!update.isAvailable) return;

        await Updates.fetchUpdateAsync();
        recordBreadcrumb('OTA update downloaded; reloading app');
        await Updates.reloadAsync();
      } catch (error) {
        recordNonFatal('OtaUpdateCheckFailed', error);
      }
    };

    void checkForUpdate();
  }, []);

  return <RootNavigator />;
};

export default App;
