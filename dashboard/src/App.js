
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
import Table from "./components/Table/Table";
import { sortData, prettyPrintStat } from "./util/util";
import numeral from "numeral";
import Map from "./components/Map/Map";
import "leaflet/dist/leaflet.css";

let DEGREE = 110000;
let DEGREE_IN_KM = DEGREE / 1000;
export let latitudeShift = 90 * DEGREE_IN_KM + 10;
export let longitudeShift = 180 * DEGREE_IN_KM + 10;


export function getSlicingPostion(x, y) {

  //*100 - longitudeShift + x/DEGREE_IN_KM ;
  x *= 100;
  x -= longitudeShift;
  x *= 100;
  x /= DEGREE_IN_KM;

  y *= 100;
  y -= latitudeShift;
  y *= 100;
  y /= DEGREE_IN_KM;

  return {
    x, y
  }
}


let initialData = [

  {
    updated: 1722242315500,
    country: "Angola",
    countryInfo: {
      address: "any",
      country: "any",
      city: "any",
      state: "any",
      lat: -12.5,
      long: 18.5,
    },
    cases: Math.floor(Math.random() * 10), //// post or disaster 
    isActice: 0,  //// active post or not 
    radius: Math.floor(3102),
    todayCases: Math.floor(Math.random() * 1000),
    deaths: Math.floor(Math.random() * 1000),
    confidence: 10,
    severity: 1,
    createdAt: Date.now()
  },
];



const generateRandomDisaster = () => {
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
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  //const [mapZoom, setMapZoom] = useState(3);

  const [selectedNodeData, setSelectedNodeData] = useState([]);



  useEffect(() => {
    const interval = setInterval(() => {
      //   console.log("h i " + disaster_table_id);
      fetch(`http://localhost:4000/getDataForNode/${disaster_table_id}`)
        .then((response) => response.json())
        .then((data) => {
          setSelectedNodeData(data);
        })


    }, 800);

    return () => clearInterval(interval);
  }, []);





  const handleNodeClick = (node) => {
    disaster_table_id = node;
    // fetch(`http://localhost:4000/getDataForNode/${disaster_table_id}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setSelectedNodeData(data);
    //   })

  };



  useEffect(() => {
    setCountryInfo(initialData);
  }, []);




  useEffect(() => {
    const getCountriesData = async () => {
      const countries = initialData.map((country) => ({
        name: country.country,
        value: country.country,
      }));
      let sortedData = sortData(initialData);
      setCountries(countries);
      setNodes(initialData);
      setTableData(sortedData);
      setMapZoom(0);
    };

    getCountriesData();
  }, []);






  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setInputCountry(countryCode);
    setCountryInfo(initialData.find((country) => country.countryInfo.iso2 === countryCode));
    const selectedCountry = initialData.find((country) => country.countryInfo.iso2 === countryCode);
    if (selectedCountry) {
      setMapCenter([selectedCountry.countryInfo.lat, selectedCountry.countryInfo.long]);
      setMapZoom(4);
    } else {
      setMapCenter([34.80746, -40.4796]);
      setMapZoom(3);
    }
  };


  let cnt = 0;
  useEffect(() => {
    const interval = setInterval(() => {
      let xx = 0;

      fetch("http://localhost:4000/allpost")
        .then((response) => response.json())
        .then((data) => {
          const newNodes = data.map((x) => {
            const newNode = generateRandomDisaster();
            newNode.countryInfo.lat = x.position.latitude + xx;
            newNode.countryInfo.long = x.position.longitude + xx;
            newNode.radius = x.radius;
            newNode._id = x.disaster_id;
            //  xx += 0.0001;
            newNode.cases = 1;
            return newNode;
          });
          //   console.log("dis");
          //  console.log(newNodes);
          numberOfpost = newNodes.length;
          if (cnt % 2 == 0) {
            setNodes([...newNodes]);
          }
          else {
            fetch("http://localhost:4000/alldisaster")
              .then((response) => response.json())
              .then((data) => {
                const newNodes2 = data.map((x) => {
                  const newNode = generateRandomDisaster();
                  newNode.countryInfo.lat = x.position.latitude + xx;
                  newNode.countryInfo.long = x.position.longitude + xx;
                  newNode.radius = x.radius;
                  newNode._id = x._id;

                  // xx += 0.0001;
                  newNode.cases = 0;
                  console.log(x.isActive)
                  if (x.isActive == false) newNode.cases = 2;
                  return newNode;
                });
                //   console.log("dis");
                //  console.log(newNodes);
                initialData = newNodes;
                numberOfDisaster = newNodes2.length;
                setNodes([...newNodes, ...newNodes2]);
              });
          }
          cnt++;

        });
      fetch("http://localhost:4000/alledge")
        .then((response) => response.json())
        .then((data) => {

          let arr = [];
          for (let xx of data) {
            arr.push(
              {
                from: { lat: xx.latitude1, long: xx.longitude1 },
                to: { lat: xx.latitude2, long: xx.longitude2 },
              }
            )
          }
          console.log("edg");
          console.log(arr);
          setEdges((prevEdges) => [...arr]);
        });

    }, 800);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {

  //     fetch("http://localhost:4000/index")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data) {
  //           console.log(data[1].x);
  //           data = getSlicingPostion(data[1].x, data[1].y);
  //           console.log(data);
  //         }

  //       });

  //   }, 800);

  //   return () => clearInterval(interval);
  // }, []);



  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Disaster Tracker</h1>
          {/* <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
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
        </div>
        <Map
          countries={nodes}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          edges={edges}
          onNodeClick={handleNodeClick}
        />
      </div>
      <div className="app__right">
        <Table data={selectedNodeData} />
      </div>

    </div>
  );
};

export default App;




/*

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