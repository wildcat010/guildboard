import Image from "next/image";
import styles from "./page.module.css";
import Feature from "../components/home/feature/feature";
import Hero from "../components/home/hero/hero";

export default function Home() {
  return (
    <>
      <Hero></Hero>
      <Feature></Feature>
    </>
  );
}
