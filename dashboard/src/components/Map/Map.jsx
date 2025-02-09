
import React, { useState, useEffect } from "react";
import { Map as LeafletMap, TileLayer, Polyline } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "../../util/util";
import { Circle, Popup } from "react-leaflet";
import { generateRandomDisaster } from "../../App";

let numberOfDisaster = 0;
let numberOfpost = 0;

const casesTypeColor = [
  "red",
  "blue",
  "gray",

]
const board = [
  "gray",
  "blue",
  "red",
]
const casesTypefillOpacity = [
  0.3,
  0.5,
  0.3

]

/*
 color={"white"}
*/





function Map({ casesType, onNodeClick }) {
  const [countries, setCountries] = useState([]);
  const [center, setCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [zoom, setZoom] = useState(1.5);



  let cnt = 0;
  useEffect(() => {



    const interval = setInterval(() => {
      try {
        let xx = 0;
        fetch("http://localhost:4000/allpost")
          .then((response) => response.json())
          .then((data) => {

            const newNodes = data.map((x) => {
              const newNode = {
                latitude: x.position.latitude,
                longitude: x.position.longitude,
                radius: x.radius,
                _id: x._id,
                cases: 1
              };
              return newNode;
            });
            numberOfpost = newNodes.length;
            if (cnt % 2 == 0) {
              setCountries([...newNodes]);
            }
            else {
              fetch("http://localhost:4000/alldisaster").then((response) => response.json())
                .then((data) => {

                  const newNodes2 = data.map((x) => {

                    const newNode = {
                      latitude: x.latitude,
                      longitude: x.longitude,
                      radius: x.radius,
                      _id: x._id,
                      cases: 0
                    };
                    if (x.isActive == false) newNode.cases = 0;
                    return newNode;
                  });
                  numberOfDisaster = newNodes2.length;
                  setCountries([...newNodes, ...newNodes2]);
                })
            }
            cnt++;
          });
      } catch (err) {
        console.log("error")
      }


    }, 1000);
    return () => clearInterval(interval);


  }, []);













  return (
    <div>
      <div className="map">
        <LeafletMap center={center} zoom={zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {
            countries.map((x) =>
              <Circle
                center={[x.latitude, x.longitude]} color={0}
                fillColor={casesTypeColor[x.cases]} fillOpacity={casesTypefillOpacity[x.cases]}
                radius={x.radius}
                onClick={() => onNodeClick(x._id, x.radius, x.latitude, x.longitude)}
              ></Circle>
            )
          }
        </LeafletMap>
      </div>

    </div>
  );
}

export default Map;



//  showDataOnMap(countries, casesType)
/*




          {edges.map((edge, index) => (
            <Polyline
              key={index}
              positions={[
                [edge.from.lat, edge.from.long],
                [edge.to.lat, edge.to.long],
              ]}
              color="gray"
              weight={2} // جعل الخط رفيعًا
              dashArray={[5, 5]} // نمط الخط المتقطع
              animate={{ duration: 2000 }} // الأنميشن لمدة 2 ثانية
            />
          ))}
 */
