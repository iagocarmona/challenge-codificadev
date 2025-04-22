import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);

if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

import { App } from 'firebase-admin/app';

const app: App = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0]!;

export const firestore = getFirestore(app);
