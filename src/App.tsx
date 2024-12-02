import { AppContextProvider } from "./modules/core/appContext";
import { MainPage } from "./modules/core/pages/MainPage";

function App() {
  return (
    <AppContextProvider>
      <MainPage />
    </AppContextProvider>
  )
}

export default App
