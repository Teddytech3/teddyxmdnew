const { MongoClient } = require('mongodb');
const logger = require('./utils/logger');

let client = null;
let db = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not defined in environment variables');
        }
        
        if (client && db) {
            return db;
        }
        
        client = new MongoClient(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 5000
        });
        
        await client.connect();
        db = client.db();
        
        logger.info('✅ MongoDB connected successfully');
        reconnectAttempts = 0;
        
        // Handle connection errors after initial connection
        client.on('error', async (err) => {
            logger.error('MongoDB connection error:', err);
            await reconnectToMongo();
        });
        
        return db;
    } catch (err) {
        logger.error('MongoDB connection failed:', err);
        await reconnectToMongo();
        throw err;
    }
}

async function reconnectToMongo() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        logger.error('Max reconnection attempts reached');
        return null;
    }
    
    reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    
    logger.info(`Reconnecting to MongoDB in ${delay}ms (attempt ${reconnectAttempts})`);
    
    setTimeout(async () => {
        try {
            if (client) {
                await client.close();
            }
            client = null;
            db = null;
            await connectDB();
        } catch (err) {
            logger.error('Reconnection failed:', err);
        }
    }, delay);
}

async function closeDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        logger.info('MongoDB connection closed');
    }
}

module.exports = { connectDB, closeDB, getDB: () => db };
