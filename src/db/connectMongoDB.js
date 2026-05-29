import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URL;

    if (!mongoURI) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectMongoDB;
