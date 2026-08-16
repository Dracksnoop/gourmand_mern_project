import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
  return (
    // No outer margin: the sticky navbar and the footer need to reach the edges, and
    // each section handles its own horizontal padding.
    <div className="flex flex-col min-h-screen">
        {/* Navbar  */}
        <header>
            <Navbar/>
        </header>
        {/* Main content  */} 
        <div className="flex-1">
            <Outlet/>
        </div>

        {/* Footer  */}
        <footer>
            <Footer/>
        </footer>
    </div>
  )
}

export default MainLayout