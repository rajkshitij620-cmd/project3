const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const path = require('path');

let mongod;

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
    return;
  }

  console.log('⚡ Starting embedded in-memory MongoDB...');
  mongod = await MongoMemoryServer.create({
    binary: { downloadDir: path.join(__dirname, '../../.mongodb-binaries') },
  });

  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log('✅ In-Memory MongoDB connected');
};

module.exports = { connectDB };
