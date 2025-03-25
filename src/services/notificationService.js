// // services/notificationService.js
// // import admin from "firebase-admin";
// // import serviceAccount from "../path/to/serviceAccountKey.json"; // Firebase service account key

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export const sendNotification = async (message) => {
//   const notification = {
//     title: "New Event",
//     body: message,
//   };

//   // Send notification to all parents
//   const response = await admin.messaging().sendToTopic("parents", { notification });
//   return response;
// };