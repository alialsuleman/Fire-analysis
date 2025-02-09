
import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox/InfoBox";
import LineGraph from "./components/LineGraph/LineGraph";
import { sortData, prettyPrintStat } from "./util/util";
import numeral from "numeral";
import Map from "./components/Map/Map";
import "leaflet/dist/leaflet.css";
import CitySelector from "./components/CitySelector/CitySelector";
import Table from "./components/Table/Table";

let DEGREE = 111000;
let DEGREE_IN_KM = DEGREE / 1000;
export let latitudeShift = 90 * DEGREE_IN_KM + 10;
export let longitudeShift = 180 * DEGREE_IN_KM + 10;


export function getSlicingIndex(latitude, longitude) {
  let latitudeIndex = Math.floor((latitude * DEGREE_IN_KM + latitudeShift));
  let longitudeIndex = Math.floor((longitude * DEGREE_IN_KM + longitudeShift));
  return {
    longitude: longitudeIndex,
    latitude: latitudeIndex
  }
}



export const generateRandomDisaster = () => {
  const lat = Math.random() * 180 - 90;
  const long = Math.random() * 360 - 180;
  return {
    updated: Date.now(),
    country: `RandomCountry${Math.floor(Math.random() * 1000)}`,
    countryInfo: {

      lat: lat,
      long: long,
    },
    cases: Math.floor(Math.random() * 10), //// post or disaster 
    isActice: 0,  //// active post or not 
    radius: Math.floor(3102),
    todayCases: Math.floor(Math.random() * 1000),
    deaths: Math.floor(Math.random() * 1000),
    confidence: 10,
    severity: 1,
    createdAt: Date.now()
  };
};


let numberOfDisaster = 0;
let numberOfpost = 0;

let disaster_table_id = "123";
const App = () => {

  const [countryInfo, setCountryInfo] = useState({});
  const [casesType, setCasesType] = useState("cases");
  //const [mapZoom, setMapZoom] = useState(3);
  const [selectedNodeData, setSelectedNodeData] = useState([]);







  const handleNodeClick = (node, raduis, lat, long) => {
    disaster_table_id = node;
    fetch(`http://localhost:4000/getDataForNode/${disaster_table_id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.map(x => {
          let y = x;
          y.radius = raduis;
          y.longitude = long;
          y.latitude = lat;
          return y;
        })
        console.log(data);
        setSelectedNodeData(data);
      })

  };



  // useEffect(() => {
  //   setCountryInfo(initialData);
  // }, []);




  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">

        </div>

        <div className="map_stuff">
          <div className="mp">  <Map
            casesType={casesType}
            onNodeClick={handleNodeClick}
          /></div>
          <div className="tesst">   <CitySelector data={{}}></CitySelector>  </div>
        </div>
        <div className="footerrr">

        </div>
        <h4 className="events">Events</h4>
        <Table data={selectedNodeData}></Table>

      </div>





    </div >
  );
};

export default App;




/*

  <div className="app__right">
        <Table data={selectedNodeData} />
      </div>
     <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Disaster Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(numberOfDisaster)}
            total={numeral(numberOfpost).format("0")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div >
 <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>


  useEffect(() => {
    const interval = setInterval(() => {

      fetch("http://localhost:4000/allpost")
        .then((response) => response.json())
        .then((data) => {

          for (let x of data) {

            const newNode = generateRandomDisaster();;
            newNode.countryInfo.lat = x.position.latitude;
            newNode.countryInfo.long = x.position.longitude;
            newNode.cases = 2;
            initialData.push(newNode);
          }
          console.log(...initialData);

          setNodes((prevNodes) => {
            return [...initialData];
          });
        });


      fetch("http://localhost:4000/alldisaster")

        .then((response) => response.json())
        .then((data) => {
          for (let x of data) {
            const newNode = generateRandomDisaster();;
            newNode.countryInfo.lat = x.position.latitude;
            newNode.countryInfo.long = x.position.longitude;
            newNode.cases = 1;
            console.log(newNode);
            initialData.push(newNode);
            setNodes((prevNodes) => {
              return [...prevNodes, newNode];
            });

          }

        });





      /* const lastNode = initialData[initialData.length - 2];
      console.log(1);
      setEdges((prevEdges) => [
        ...prevEdges,
        {
          from: { lat: lastNode.countryInfo.lat, long: lastNode.countryInfo.long },
          to: { lat: newNode.countryInfo.lat, long: newNode.countryInfo.long },
        },
      ]);
      
    }, 4000);


    

    return () => clearInterval(interval);
  }, []);


  */