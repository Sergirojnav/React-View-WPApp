import React, { useEffect, useState } from 'react';

function MiComponente() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    fetch('http://192.168.1.54:8080/jugadores') // Reemplaza con la URL de tu API
      .then(response => response.json())
      .then(data => setDatos(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      {datos ? <pre>{JSON.stringify(datos, null, 2)}</pre> : <p>Cargando...</p>}
    </div>
  );
}

export default MiComponente;
