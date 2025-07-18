import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 45],
  iconAnchor: [17, 46],
});

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords]);
  return null;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [coords, setCoords] = useState([51.505, -0.09]);

  const fetchIPData = async (ipOrDomain = "") => {
    const apiKey = "at_rSqiQXzhkmfYGtGgTMA2lWrwZZgWw";
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${
      ipOrDomain ? `ipAddress=${ipOrDomain}` : ""
    }`;

    try {
      const res = await fetch(url);
      const result = await res.json();

      if (result?.location) {
        setData(result);
        setCoords([result.location.lat, result.location.lng]);
      } else {
        throw new Error("Invalid data");
      }
    } catch (err) {
      console.error("Error fetching IP info", err);
      alert("Invalid IP or domain. Try again.");
    }
  };

  useEffect(() => {
    fetchIPData();
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    fetchIPData(query);
    setQuery("");
  };

  return (
    <div className="relative w-full h-screen font-sans">
      {/* Header */}
     <div
  className="bg-[url('/images/pattern-bg-mobile.png')] md:bg-[url('/images/pattern-bg-desktop.png')] 
             bg-cover bg-center p-6 text-white text-center z-10 relative"
>
        <h1 className="text-3xl md:text-4xl font-bold">IP Address Tracker</h1>
        <div className="flex justify-center mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for any IP address or domain"
            className="px-4 py-2 rounded-l-md w-64 md:w-96 text-black focus:outline-none bg-white font-semibold"
          />
          <button
            onClick={handleSearch}
            className="bg-black px-5 py-2 rounded-r-md hover:bg-gray-800 transition"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Info Panel */}
      {data && (
        <div className="bg-white shadow-xl rounded-xl w-[90%] max-w-5xl mx-auto mt-6 z-20 relative grid grid-cols-1 md:grid-cols-4 gap-6 p-6 text-center md:text-left ">
          <div>
            <p className="text-xs text-gray-500 uppercase">IP Address</p>
            <p className="font-bold text-lg break-all">{data.ip}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Location</p>
            <p className="font-bold text-lg">
              {data.location.city}, {data.location.region} {data.location.postalCode}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Timezone</p>
            <p className="font-bold text-lg">UTC {data.location.timezone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">ISP</p>
            <p className="font-bold text-lg">{data.isp}</p>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="mt-6 h-[calc(100%-300px)] z-0">
        <MapContainer
          center={coords}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
          <ChangeMapView coords={coords} />
          <Marker position={coords} icon={markerIcon}>
            <Popup>{data?.location?.city || "Location"}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
