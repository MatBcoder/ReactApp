require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const admin = require("firebase-admin");

// 1. Init Firebase
admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-service-account.json"))
});

// 2. Init Express
const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));


const port = 3001;

// 3. Init Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// 4. Middleware
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

// 5. Routes
app.get('/', (req, res) => {
  res.send('Node server is running! ON PORT 3001');
});

app.get("/protected", verifyFirebaseToken, async (req, res) => {
  const uid = req.user.uid;

  const { data: existingUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("firebase_uid", uid)
    .single();

  if (error && error.code === "PGRST116") {
    return res.status(403).json({ message: "User not registered. Please sign up." });
  }

  if (error) return res.status(500).json(error);

  res.json(existingUser);
});


// 6. Start server LAST
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
