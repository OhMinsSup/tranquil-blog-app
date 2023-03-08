import { type NextPage } from "next";
import Head from "next/head";
import Layout from "~/components/shared/layouts/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>Home</Layout>
    </>
  );
};

export default Home;
