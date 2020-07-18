import * as dotenv from "dotenv";

dotenv.config();

import Server from "./src/Server";
import firebase from "firebase";
import Discord from "discord.js";
const client = new Discord.Client({ fetchAllMembers: true });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
client.login(process.env.DISCORD_TOKEN);
new Server().createServer();

export { client };
