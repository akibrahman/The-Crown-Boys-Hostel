import Footer from "@/Components/Footer/Footer";
import ContextProvider from "@/providers/ContextProvider";
import TanstackProvider from "@/providers/TanstackProvider";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";
import NavBar from "../Components/NavBar/NavBar";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  // variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Home || The Crown Boys Hostel",
    template: "%s || The Crown Boys Hostel",
  },
  description:
    "The Crown Boys Hostel - Mijan Meal management system - 01709605097 - Created by Md. Akib Rahman - A completed solution for mess meal management",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} duration-300 transition-all ease-in-out`}
      >
        <TanstackProvider>
          <ContextProvider>
            <Toaster />
            <NavBar />
            <hr className="border-sky-500" />
            <div className="">{children}</div>
            <hr className="border-sky-500" />
            <Footer />
          </ContextProvider>
        </TanstackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
