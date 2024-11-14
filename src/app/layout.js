import Footer from "@/Components/Footer/Footer";
import ContextProvider from "@/providers/ContextProvider";
import TanstackProvider from "@/providers/TanstackProvider";
import { Toaster } from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";
import "./globals.css";
import NavBar from "@/Components/NavBar/NavBar";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: {
    default: "Home || The Crown Boys Hostel",
    template: "%s || The Crown Boys Hostel",
  },
  description:
    "'The Crown Boys Hostel' is the best mess in Uttara, Dhaka. Boasting of a very high meal and living quality, the The Crown Boys Hostel aims to offer the best meal for its customers, especially the students and professionals, to ensure that the meals and the living are both clean and healthy. In preparing food, adequate amount of proper food is used, thus making the meals tasty and healthy. Also, the living facilities are well designed and hygienically maintained with comfortable furniture and layouts, ideally creating a home away from home atmosphere, perfect for studying or even taking a break. Proving this notion right, the Crown Boys Hostel is the epitome of top-tier quality for all students or workers in Uttara seeking a quality mess.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={`relative`}>
        <NextTopLoader />
        <TanstackProvider>
          <ContextProvider>
            <Toaster />
            <NavBar />
            {/* <FloodHelpComponent /> */}
            <div className="">{children}</div>
            <Footer />
          </ContextProvider>
        </TanstackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
