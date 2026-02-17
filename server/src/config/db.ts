import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/indusind_bank';
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoURI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error: any) {
      console.error(`MongoDB connection attempt ${attempt}/${maxRetries} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error('All MongoDB connection attempts failed. Server will run without DB.');
        console.error('Make sure your IP is whitelisted in MongoDB Atlas Network Access.');
        return; // Don't exit — let server run so we can still test
      }
      console.log(`Retrying in ${attempt * 2} seconds...`);
      await new Promise(r => setTimeout(r, attempt * 2000));
    }
  }
};

export default connectDB;
