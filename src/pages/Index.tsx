import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import HomepageEditorial from "@/components/HomepageEditorial";
import Footer from "@/components/Footer";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ShoeStore",
    name: "Gary Shoes",
    description: "Premium footwear boutique in Bourj Hammoud, Lebanon. Curated collection of heels, ballerinas, mules, loafers and more.",
    url: "https://garyshoes.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bourj Hammoud",
      addressCountry: "LB",
    },
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Gary Shoes — Premium Footwear Boutique</title>
        <meta name="description" content="Discover our curated collection of elegant heels, sandals, boots and more. Premium footwear at Gary Shoes, Bourj Hammoud, Lebanon." />
        <link rel="canonical" href="https://garyshoes.com" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <HomepageEditorial />
      <Footer />
    </div>
  );
};

export default Index;
