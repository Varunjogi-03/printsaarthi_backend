import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
   
    const mongoURI = process.env.MONGO_URI ;
    
    console.log(`📍 Connecting to: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);
    console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!");
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error("   Please check your MongoDB connection settings.");
    process.exit(1);
  }
};

// Function to check database health
export const checkDBHealth = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    status: state === 1 ? 'healthy' : 'unhealthy',
    state: states[state] || 'unknown',
    readyState: state
  };
};

export default connectDB;
