import mongoose from 'mongoose';

// makes a connection to database
const db = (uri: string) => mongoose.connect(uri);

export default db;
