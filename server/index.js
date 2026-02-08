const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-service-account.json"))
});


require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.get('/', async (req, res) => {
  res.send('Node server is running! ON PORT 3001');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

async function verifyFirebaseToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("No token");

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

app.get("/protected", verifyFirebaseToken, (req, res) => {
  res.json({ uid: req.user.uid });
});
