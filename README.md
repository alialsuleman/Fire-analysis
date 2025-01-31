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
   git clone https://github.com/your-username/fire-detection-system.git
   cd fire-detection-system
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the project root and add the necessary configurations:  
   ```env
   MONGO_URI=mongodb://localhost:27017/fire-detection
   GRPC_PORT=50051
   HTTP_PORT=3000
   ```

4. **Start the application**  

   - **Start the backend server**  
     ```bash
     npm start
     ```

   - **(Optional) Run the dashboard frontend**  
     If the dashboard is in a separate repository, navigate to its directory and start it:  
     ```bash
     cd ../fire-detection-dashboard
     npm install
     npm start
     ```

### Running with Docker (Optional)  
You can run the entire system using **Docker** if you prefer containerized deployment:  
```bash
docker-compose up --build
```

This will start both the backend and database services.

## Technologies Used
- **Node.js** (Backend processing)
- **MongoDB** (Database)
- **gRPC** (Inter-service communication)
- **HTTP Server** (Dashboard integration)
- **Leaflet.js** (Map visualization)

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
