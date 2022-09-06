import Head from "next/head";
import FooterContent from "@components/Footer";
import FeedbackForm from "@components/FeedbackForm";
import JokeBlock from "@components/JokeBlock";
import { BlockSearchForm } from "@components/BlockSearchForm"
import { Card, Col, Divider, PageHeader, Row, Typography } from "antd";
import { Footer } from "antd/lib/layout/layout";


export default function Home() {
  return (
    <>
      <Head>
        <title>Timestamp to Cosmos Block Height Converter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Row justify="center"> */}
        {/* <Col xs={12}> */}
          <Card title={<>
            Convert any timestamp to a Cosmos block height
          </>}>
            <BlockSearchForm></BlockSearchForm>
          </Card>
        {/* </Col> */}
      {/* </Row> */}
      {/* <Footer>
        <FooterContent/>
      </Footer> */}
    </>
  );
}
