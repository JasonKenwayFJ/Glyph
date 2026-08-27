import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";






function App() {
    return (
        <main className="App">
            <RouterProvider router={router} />
        </main>
    );
}

export default App;