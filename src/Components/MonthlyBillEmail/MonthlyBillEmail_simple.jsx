import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export const MonthlyBillEmail_simple = ({ month = "January", year = 2024 }) => (
  <Html>
    <Head />
    <Preview>Mess-Receipt</Preview>

    <Body
      style={{
        fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
        backgroundColor: "#ffffff",
      }}
    >
      <Container
        style={{
          margin: "0 auto",
          padding: "20px 0 48px",
          width: "660px",
          maxWidth: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        <Section>
          <Row>
            <Column>
              <Img
                style={{}}
                src={
                  "https://cdn.glitch.global/0386827c-7a3c-4a82-b3fe-20c67f6f9f66/logo.png?v=1726675080378"
                }
                width="85"
                height="85"
                alt="The Crown Boys Hostel"
              />
            </Column>

            <Column align="right" style={{ display: "table-cell" }}>
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#517EBF",
                }}
              >
                Bill of {month} - {year}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section>
          <Text
            style={{
              textAlign: "center",
              margin: "36px 0 40px 0",
              fontSize: "15px",
              fontWeight: "600",
              color: "#517EBF",
              backgroundColor: "#DBEAFE",
              borderRadius: "4px",
              padding: "30px 20px",
            }}
          >
            Your Monthly Bill has been Calculated. Please check your Dashboard
          </Text>
        </Section>
        <Section
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#517EBF",
              backgroundColor: "#DBEAFE",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            <Link
              style={{ padding: "5px 15px", display: "inline-block" }}
              href="https://thecrownboyshostel.com/dashboard"
            >
              Dashboard
            </Link>
          </Text>
          <Text
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#517EBF",
              backgroundColor: "#DBEAFE",
              borderRadius: "4px",
              display: "inline-block",
              margin: "0px 10px",
            }}
          >
            <Link
              style={{ padding: "5px 15px", display: "inline-block" }}
              href="https://thecrownboyshostel.com/dashboard?displayData=myBills"
            >
              My Bills
            </Link>
          </Text>
          <Text
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#517EBF",
              backgroundColor: "#DBEAFE",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            <Link
              style={{ padding: "5px 15px", display: "inline-block" }}
              href="https://thecrownboyshostel.com/dashboard?displayData=myTransactions"
            >
              My Transactions
            </Link>
          </Text>
        </Section>
        <Hr style={{ margin: "30px 0 0 0" }} />
        <Hr style={{ margin: "0 0 10px 0" }} />
        <Section>
          <Row>
            <Column
              align="center"
              style={{ display: "block", margin: "40px 0 0 0" }}
            >
              <Img
                style={{}}
                src={`https://cdn.glitch.global/0386827c-7a3c-4a82-b3fe-20c67f6f9f66/logo.png?v=1726675080378`}
                width="50"
                height="50"
                alt="The crown Boys Hostel"
              />
            </Column>
          </Row>
        </Section>
        <Text
          style={{
            margin: "8px 0 0 0",
            textAlign: "center",
            fontSize: "12px",
            color: "#517EBF",
          }}
        >
          <Link href="https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/accountSummary?mt=8">
            Account Settings
          </Link>{" "}
          •{" "}
          <Link href="https://www.apple.com/legal/itunes/us/sales.html">
            Terms of Sale
          </Link>{" "}
          •{" "}
          <Link href="https://www.apple.com/legal/privacy/">
            Privacy Policy{" "}
          </Link>
        </Text>
        <Text
          style={{
            margin: "25px 0 0 0",
            textAlign: "center",
            fontSize: "12px",
            color: "#517EBF",
          }}
        >
          Copyright © 2024 The Crown Boys Hostel Inc. <br />{" "}
          <Link href="https://www.apple.com/legal/">All rights reserved</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default MonthlyBillEmail_simple;
