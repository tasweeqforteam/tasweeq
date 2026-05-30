import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import Process from "@/components/Process";
import Showcase from "@/components/Showcase";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Metrics />
        <Process />
        <Showcase />
        <FinalCTA />
      </main>
    </>
  );
}
