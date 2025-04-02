import { useEffect, useRef, useState } from 'react';
import Header from '../app/components/Header';

export default function Map() {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      map.addListener('click', (e) => {
        const newMarker = {
          id: Date.now(),
          name: 'New Marker',
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng(),
          description: 'Description',
        };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      });
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }
  }, []);

  return (
    <div>
      <Header />
      <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />
      <ul>
        {markers.map((marker) => (
          <li key={marker.id}>
            {marker.name}: {marker.latitude}, {marker.longitude}
          </li>
        ))}
      </ul>
    </div>
  );
} 