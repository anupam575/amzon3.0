import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FetchItems from "./components/Fetchitems";
import Providers from "./providers"; // redux provider

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <FetchItems />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}