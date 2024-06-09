import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupScreen from "./screens/SignupScreen.jsx";
import SigninScreen from './screens/SigninScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import WindowSize from './screenSize';
import Logo from './assets/Logo.png';

const App = () => {

  const [width] = WindowSize();

  return (
    <div>
      {
        width > 200 ? (
          <BrowserRouter>
            <Routes>
              <Route path='/signup' exact element={<SignupScreen />} />
              <Route path='/signin' exact element={<SigninScreen />} />
              <Route path='/' exact element={<HomeScreen />} />
            </Routes>
          </BrowserRouter>
        ) : (
          <div>
            <img 
              src={Logo} 
              style={{ 
                display: "block",
                margin: "auto", 
                width: "50%", 
              }}
            />
              <h3 
                style={{ 
                  textAlign: "center", 
                  color: "#1893f8",
                  marginTop : "20px"
                }}>
                Please Open the app in PC
              </h3>
          </div>
        )
      }
    </div>
  );
}

export default App;
