# Fire Detection System

This project is a fire detection system that processes geospatial data related to natural disaster alerts. It analyzes alerts based on time and location to detect potential fire events.

## Features  
- **Real-time alert reception**: Users can send alerts about potential fire outbreaks.  
- **Geospatial analysis**: Identifies intersecting events and merges them based on their geographical spread.  
- **Optimized search algorithms**: Enhances data retrieval efficiency by dividing the map into fixed grid squares.  
- **Interactive dashboard**: Displays real-time event data on a map.  
- **gRPC Communication**: Facilitates efficient inter-service communication.  

## Documentation
- **Project Overview & Analysis Algorithms:** [Read more](https://drive.google.com/file/d/1bB6PcCuE2MU4pmsHRq8LCePFIf99m8wk/view?usp=sharing)
- **Full Project Article:** [View here](https://alialsuleman.github.io/disaster%20analysis.html)

## Setup Instructions

### Prerequisites  
Make sure you have the following installed on your system:  
- **Node.js** (Latest LTS version recommended)  
- **MongoDB** (Running locally or as a cloud instance)  

### Installation Steps  
1. **Clone the repository**  
   ```bash
   git clone https://github.com/alialsuleman/Fire-analysis.git
   cd Fire-analysis
   ```

2. **Install dependencies**  
   server : 
   ```bash
   cd server
   npm install
   ```
   dashboard : 
   ```bash
   cd dashboard
   npm install
   ```

4. **Set up environment variables**  
   Create a `.env` file in the project root and add the necessary configurations:  
   ```env
   NODE_ENV=
   MONGO_URL = 
   MONGO_USR =
   MONGO_PAS =
   PORT =
   ID_QUEUE_SIZE = 
   ANALYSER_DELAY = 
   MIN_REQUIRE_COMMEN_AREA= 
   FIRE_ACTIVATION_RATE = 
   ```

5. **Start the application**  

   - **Start the backend server**  
     ```bash
     cd server
     npm start
     ```

   - **(Optional) Run the testing server**  
     you can run typescript script , it generate events and send it by grpc stream to the server .  
     ```bash
     cd server
     ts-node tsClient.ts
     ```
   - **(Optional) Run the dashboard frontend**  
     ```bash
     cd ../dashboard
     npm start
     ```


## Technologies Used
- **Node.js** (Backend processing)
- **MongoDB** (Database)
- **gRPC** (Inter-service communication)
- **HTTP Server** (Dashboard integration)
- **Leaflet.js** (Map visualization)

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
