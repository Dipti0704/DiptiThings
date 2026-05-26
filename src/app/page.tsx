import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Shipped } from "@/components/shipped";
import { Obsessions } from "@/components/obsessions";
import { Toolbox } from "@/components/toolbox";
import { SayHello } from "@/components/say-hello";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative mx-auto max-w-[1440px]">
      <Nav />
      <Hero />
      <Shipped />
      <Obsessions />
      <Toolbox />
      <SayHello />
      <Footer />
    </div>
  );
}
