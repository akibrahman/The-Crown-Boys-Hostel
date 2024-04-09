import ContextProvider from "@/providers/ContextProvider";
import TanstackProvider from "@/providers/TanstackProvider";

import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import NavBar from "../Components/NavBar/NavBar";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Home",
  description:
    "Akib Meal management system, Created by Md. Akib Rahman, A completed solution for mess meal management",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} duration-300 transition-all ease-in-out`}
      >
        <TanstackProvider>
          <ContextProvider>
            <NavBar />
            <hr className="border-sky-500" />
            <Toaster />
            <div className="">{children}</div>
          </ContextProvider>
        </TanstackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
