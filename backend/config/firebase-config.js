import admin from 'firebase-admin';
import serviceAccount from '../firebase.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://easy-a7462.firebaseio.com'
});

export default admin;