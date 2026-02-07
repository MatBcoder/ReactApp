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
