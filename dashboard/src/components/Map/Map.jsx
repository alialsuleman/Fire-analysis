
import React from "react";
import { Map as LeafletMap, TileLayer, Polyline } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "../../util/util";
import { Circle, Popup } from "react-leaflet";


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
function Map({ countries, casesType, center, zoom, edges, onNodeClick }) {
  // console.log(countries);
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
                center={[x.countryInfo.lat, x.countryInfo.long]}
                color={0}
                fillColor={casesTypeColor[x.cases]}
                fillOpacity={casesTypefillOpacity[x.cases]}
                radius={
                  x.radius
                }
                onClick={() => onNodeClick(x._id)}
              ></Circle>

            )
            //  showDataOnMap(countries, casesType)

          }


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
        </LeafletMap>
      </div>

    </div>
  );
}

export default Map;
