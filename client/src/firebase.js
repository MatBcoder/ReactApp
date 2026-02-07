import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeZhxa06dgIAg9jE49E9WR_PUEuE2XhQE",
  authDomain: "reactapp-662b1.firebaseapp.com",
  projectId: "reactapp-662b1",
  appId: "1:910893600055:web:dda5f14ff40893bffd5eb2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
