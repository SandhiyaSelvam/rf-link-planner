<<<<<<< HEAD
# RF Link Planner Tool

## Overview
The RF Link Planner Tool is a web-based application designed to help users plan simple point-to-point RF links between towers on a map. Users can place towers, configure their frequencies, and visualize the Fresnel zone around the links connecting these towers.

## Features
- **Interactive Map**: Users can click on the map to place towers and connect them with links.
- **Frequency Configuration**: Each tower has a configurable frequency (in GHz), and links can only be created between towers with matching frequencies.
- **Fresnel Zone Visualization**: The tool calculates and displays the first Fresnel zone as an ellipse around the link connecting two towers.
- **User-Friendly Interface**: The application provides controls for adding and managing towers and links.

## Technologies Used
- **React**: For building the user interface.
- **Vite**: As the build tool for fast development and optimized production builds.
- **Leaflet/Google Maps**: For displaying the map and handling geographical data.
- **Open-Elevation API**: For fetching elevation data to calculate the Fresnel zone.

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rf-link-planner.git
   ```
2. Navigate to the project directory:
   ```
   cd rf-link-planner
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and go to `http://localhost:3000` to view the application.

## Usage
- Click on the map to place towers.
- Configure the frequency of each tower by clicking on it.
- Click on one tower and then another to create a link between them (only if frequencies match).
- Click on a link to visualize the Fresnel zone.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
=======
# rf-link-planner
>>>>>>> db0570a9847dcb49fa185429145c7fdf3e068b9b
