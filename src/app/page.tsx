import Header from "@/components/Header";
import HomeBeneficios from "@/components/HomeBeneficios";
import HomeText from "@/components/HomeText";

export default function Home() {
  return (
    <div className="flex flex-col gap-40 w-full">
      <Header/>
      <HomeText/>
      <HomeBeneficios/>
    </div>
  );
}
