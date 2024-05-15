// MainPage.jsx
import React from 'react';

const MainPage = () => {
  return (
    <div style={{ 
      backgroundImage: `url(/background@2x.png)`, // directly reference the image in the public folder
      backgroundSize: 'cover', // cover ensures the image covers the whole div
      height: '100vh', // sets the height of the div to the full viewport height
      color: 'black' // sets the text color to white for better visibility
    }}>
      <h1>Bienvenido a la página principal</h1>
      <p>¡Has iniciado sesión correctamente!</p>
      {/* Aquí puedes agregar cualquier contenido adicional que desees mostrar en la página principal */}
    </div>
  );
};

export default MainPage;