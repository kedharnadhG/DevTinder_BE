const mongoose = require("mongoose");

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;  //5secs

//creating a singleTon class for db-connection
class DatabaseConnection{
    constructor(){
        this.retryCount = 0;
        this.isConnected = false;

        mongoose.set('strictQuery', true);  // by enabling "strictQuery" mode, it removes the non-existing fields from the query

        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully");
            this.isConnected = true;
        })

        mongoose.connection.on("disconnected", () => {
            console.log("Database disconnected");
            this.handleDisConnection();
        })

        mongoose.connection.on("error", (err) => {
            console.log("Error connecting to database", err);
            this.isConnected = false;
        })


        //for handling app termination
        process.on("SIGNTERM", this.handleAppTermination.bind(this));

    }

    async connect() {
        try {
            if(!process.env.MONGO_URI){
                throw new Error("MONGO_URI is not found in the environment variables");
            }

            //optional parameters for connection (connection options)
            const connectionOptions = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4
            }

            if(process.env.NODE_ENV === "development"){
                mongoose.set('debug', true);  //for debugging
            }

            await mongoose.connect(process.env.MONGO_URI, connectionOptions);

            this.retryCount = 0;   //reset the retry count on successful connection

        } catch (error) {
            console.error("Error connecting to database", error.message);
            await this.handleConnectionError();
            
        }
    }


    async handleConnectionError() {
        if(this.retryCount < MAX_RETRIES){
            this.retryCount++;
            console.log(`Retrying connection to database (attempt ${this.retryCount} of${MAX_RETRIES})`);

            await new Promise((resolve) => setTimeout(() => {
                resolve();
            }, RETRY_INTERVAL));

            //after 5secs, retrying the connection
            await this.connect();
        } else {
            console.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
            process.exit(1);
        }
    }

    async handleDisConnection() {
        if(!this.isConnected){
            console.log("Attempting to reconnect to database...");
            await this.connect();
        }
    }

    async handleAppTermination() {
        try {
            await mongoose.connection.close();
            console.log("MongoDB connection closed through app termination");
            process.exit(0);
        } catch (error) {
            console.log("Error closing the connection", error);
            process.exit(1);
        }

    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        }

    }

}

//create a singleton instance
const dbConnetion = new DatabaseConnection();
module.exports = {
  connect: dbConnetion.connect.bind(dbConnetion),
  getDBStatus: dbConnetion.getConnectionStatus.bind(dbConnetion)
};
