import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Connect} from "./screens/Connect.tsx";
import {Success} from "./screens/Success.tsx";
import {Viewport} from "./shared/ui/Viewport/Viewport.tsx";
import {ThemeProvider} from "./features/theme/ThemeProvider.tsx";

const App = () => {
    return (
        <ThemeProvider>
            <Viewport>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Connect />} />
                        <Route path="/success" element={<Success />} />
                    </Routes>
                </BrowserRouter>
            </Viewport>
        </ThemeProvider>
    );
}

export default App
