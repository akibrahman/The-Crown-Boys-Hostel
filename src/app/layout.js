import Footer from "@/Components/Footer/Footer";
import NavBar from "@/Components/NavBar/NavBar.jsx";
import ContextProvider from "@/providers/ContextProvider";
import TanstackProvider from "@/providers/TanstackProvider";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";
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
    "The Crown Boys Hostel | Mijanur Rahman | Phone No.:01788-422002 | Created by Md. Akib Rahman | A completed solution for mess meal management | Best hostel in Uttara",
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
