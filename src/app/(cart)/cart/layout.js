import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";

export default function CartLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-8 lg:px-16 py-6">
        <Navbar />
      </div>
      
      <main className="flex-1 px-8 lg:px-16 py-10">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
