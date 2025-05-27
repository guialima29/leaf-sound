import Header from "@/components/Header";
import HomeBeneficios from "@/components/HomeBeneficios";
import HomeExemplo from "@/components/HomeExemplo";
import HomeText from "@/components/HomeText";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col gap-35 w-full">
      <Header/>
      <HomeText/>
      <HomeBeneficios/>
      <HomeExemplo/>
      <Footer/>
    </div>
  );
}
