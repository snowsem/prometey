import logo from './logo.svg';
import './App.css';
import {LayoutComponent} from "./components/LayoutComponent";
import {VirtualEnvContainer} from "./containers/VirtualEnvContainer";

function App() {
  return (
    <div className="App">
        <LayoutComponent>
            <VirtualEnvContainer>

            </VirtualEnvContainer>
        </LayoutComponent>
    </div>
  );
}

export default App;
