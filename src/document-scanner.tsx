import React, { useCallback, useEffect, useState } from 'react';

import { Button, NativeModules, View, NativeEventEmitter, Platform } from 'react-native';

import { ScannerKey } from './config';
import type { IDocumentScannerProps } from './types';
import { DocumentType } from './types';

export default function DocumentScanner({
  documentScannerView = () => undefined,
}: IDocumentScannerProps) {
  const MrzScanner = NativeModules.RNMrzscannerlib;
  const EventEmitter = new NativeEventEmitter(MrzScanner);

  const [selectedDocumentType, setSelectedDocumentType] = useState<number | null>(null);

  const handleDocumentScan = useCallback(
    (type: DocumentType | number): void => {
      console.log('log-----type', type);
      setSelectedDocumentType(type);

      if (DocumentType.idCardFrontSide === type) {
        MrzScanner.setExtractPortraitEnabled(true);
        MrzScanner.setScannerType(4);
        MrzScanner.startScanner();
      } else if (DocumentType.fromGallery === type) {
        MrzScanner.setScannerType(1);
        MrzScanner.scanFromGallery();
      } else {
        MrzScanner.setExtractIdBackEnabled(true);
        MrzScanner.setExtractFullPassportImageEnabled(true);
        MrzScanner.setScannerType(0);
        MrzScanner.startScanner();
      }
    },
    [MrzScanner],
  );

  useEffect(() => {
    MrzScanner.registerWithLicenseKey(ScannerKey[Platform.OS]);
  }, [MrzScanner]);

  useEffect(() => {
    const documentScannerSubscription = EventEmitter.addListener(
      'successfulScanEmittedEvent',
      (scannerBody) => {
        console.log('log-----body', scannerBody);
        console.log('log--------selectedDocumentType', selectedDocumentType);
      },
    );

    const idFrontScannerSubscription = EventEmitter.addListener(
      'successfulIdFrontScanEmittedEvent',
      (body) => {
        console.log('log-----body', body);
      },
    );

    return () => {
      documentScannerSubscription.remove();
      idFrontScannerSubscription.remove();
    };
  }, [EventEmitter, selectedDocumentType]);

  return (
    <View style={{ flex: 1 }}>
      {documentScannerView() ? (
        documentScannerView(handleDocumentScan)
      ) : (
        <View>
          <Button
            title="Passport Scanner"
            onPress={() => handleDocumentScan(DocumentType.passport)}
            color="red"
          />
          <Button
            title="ID Card Scanner"
            onPress={() => handleDocumentScan(DocumentType.idCardBackSide)}
            color="red"
          />
          <Button
            title="ID Card Scanner"
            onPress={() => handleDocumentScan(DocumentType.fromGallery)}
            color="red"
          />
        </View>
      )}
    </View>
  );
}
