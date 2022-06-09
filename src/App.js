import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>Generador de Scritps</h1>
      <nav style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <div className="menu" >
            <Link className="App-link boton" to="/nokia">Nokia</Link>
            <Link className="App-link boton" to="/switch">Switches de CT</Link>
        </div>        
      </nav>
      <Outlet />
    </div>   
  );
}

export default App;
