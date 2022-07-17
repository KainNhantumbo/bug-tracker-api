import express from 'express';
import { Application } from 'express';
import { config } from 'dotenv';

config()
const app: Application = express();
const PORT = process.env.PORT || 3630

app.listen(PORT, () => {
  console.log(`Server listeling on port ${PORT}`);
});
