import Header from "@/components/Header";
import HomeExemplo from "@/components/HomeExemplo";
import HomeText from "@/components/HomeText";
import Footer from "@/components/Footer";
import VideoComponent from "@/components/VideoComponent";
import { HomeFeatures } from "@/components/HomeFeatures";
import { HomeHowWorks } from "@/components/HomeHowWorks";

export default function Home() {
  return (
    <div className="flex flex-col gap-35 w-full min-h-screen">
      <Header />
      <div className="flex flex-row flex-grow w-full justify-center items-center gap-32">
        <HomeText />
        <VideoComponent />
      </div>
      <HomeFeatures/>
      <HomeHowWorks/>
      <HomeExemplo />
      <Footer />
    </div>
  );
}
