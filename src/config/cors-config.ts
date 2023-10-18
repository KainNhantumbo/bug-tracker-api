import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:3000',
    'https://bug-tracker-5e7x8pq4e-kainnhantumbo.vercel.app',
    'https://bug-tracker-pied.vercel.app',
    'https://bug-tracker-kainnhantumbo.vercel.app',
    'https://bug-tracker-git-master-kainnhantumbo.vercel.app/',
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
