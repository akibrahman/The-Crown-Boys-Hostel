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

export const MonthlyBillEmail = ({
  name,
  email,
  month = "January",
  year = 2024,
  date,
  billId,
  userId,
  totalBreakfast,
  totalLunch,
  totalDinner,
  totalDeposit,
  totalBill,
  isRestDeposite,
}) => (
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
                style={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "100%",
                }}
                src={`https://i.ibb.co/vBb8Q8x/logo-black.png`}
                width="85"
                height="85"
                alt="Apple Logo"
              />
            </Column>

            <Column align="right" style={{ display: "table-cell" }}>
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "300",
                  color: "#888888",
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
              fontSize: "14px",
              fontWeight: "500",
              color: "#111111",
            }}
          >
            Your Monthly Bill of &quot;The Crown Boys Hostel&quot;
          </Text>
          {isRestDeposite && (
            <Text
              style={{
                textAlign: "center",
                margin: "36px 0 40px 0",
                fontSize: "14px",
                fontWeight: "500",
                color: "#111111",
              }}
            >
              N.B. : Rest Deposite of this month added to the next month
            </Text>
          )}
        </Section>
        <Section
          style={{
            borderCollapse: "collapse",
            borderSpacing: "0px",
            color: "rgb(51,51,51)",
            backgroundColor: "rgb(250,250,250)",
            borderRadius: "3px",
            fontSize: "12px",
          }}
        >
          <Row
            style={{
              height: "70px",
            }}
          >
            <Column colSpan={2}>
              <Section>
                <Row>
                  <Column
                    style={{
                      paddingLeft: "20px",
                      borderStyle: "solid",
                      borderColor: "white",
                      borderWidth: "0px 1px 1px 0px",
                      height: "44px",
                    }}
                  >
                    <Text
                      style={{
                        margin: "0",
                        padding: "0",
                        lineHeight: 1.4,
                        color: "rgb(102,102,102)",
                        fontSize: "10px",
                      }}
                    >
                      E-MAIL:
                    </Text>
                    <Link
                      style={{
                        fontSize: "12px",
                        margin: "0",
                        padding: "0",
                        lineHeight: 1.4,
                        color: "#15c",
                        textDecoration: "underline",
                      }}
                    >
                      {email}
                    </Link>
                  </Column>
                </Row>

                <Row>
                  <Column
                    style={{
                      paddingLeft: "20px",
                      borderStyle: "solid",
                      borderColor: "white",
                      borderWidth: "0px 1px 1px 0px",
                      height: "44px",
                    }}
                  >
                    <Text
                      style={{
                        margin: "0",
                        padding: "0",
                        lineHeight: 1.4,

                        color: "rgb(102,102,102)",
                        fontSize: "10px",
                      }}
                    >
                      INVOICE DATE
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        margin: "0",
                        padding: "0",
                        lineHeight: 1.4,
                      }}
                    >
                      {date}
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column
                    style={{
                      paddingLeft: "20px",
                      borderStyle: "solid",
                      borderColor: "white",
                      borderWidth: "0px 1px 1px 0px",
                      height: "44px",
                    }}
                  >
                    <Text
                      style={{
                        margin: "0",
                        padding: "0",
                        lineHeight: 1.4,

                        color: "rgb(102,102,102)",
                        fontSize: "10px",
                      }}
                    >
                      BILL ID
                    </Text>
                    <Link
                      style={{
                        fontSize: "12px",
                        margin: "0",
                        padding: "0",
                        lineHeight: 1.4,
                        color: "#15c",
                        textDecoration: "underline",
                      }}
                    >
                      {billId}
                    </Link>
                  </Column>
                </Row>
                <Row>
                  <Column
                    style={{
                      paddingLeft: "20px",
                      borderStyle: "solid",
                      borderColor: "white",
                      borderWidth: "0px 1px 1px 0px",
                      height: "44px",
                    }}
                  >
                    <Text
                      style={{
                        margin: "0",
                        padding: "0",
                        lineHeight: 1.4,

                        color: "rgb(102,102,102)",
                        fontSize: "10px",
                      }}
                    >
                      USER ID
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        margin: "0",
                        padding: "0",
                        lineHeight: 1.4,
                      }}
                    >
                      {userId}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Column>
            <Column
              style={{
                paddingLeft: "20px",
                borderStyle: "solid",
                borderColor: "white",
                borderWidth: "0px 1px 1px 0px",
                height: "44px",
              }}
              colSpan={3}
            >
              <Text
                style={{
                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                  color: "rgb(102,102,102)",
                  fontSize: "10px",
                }}
              >
                BILLED TO
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                }}
              >
                Name : {name}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                }}
              >
                Month : {month}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                }}
              >
                Uttara, Dhaka, 1230
              </Text>
              {/* <Text
                style={{
                  fontSize: "12px",
                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                }}
              >
                San Francisco, CA 94123
              </Text> */}
              <Text
                style={{
                  fontSize: "12px",
                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                }}
              >
                Bangladesh
              </Text>
            </Column>
          </Row>
        </Section>
        <Section
          style={{
            borderCollapse: "collapse",
            borderSpacing: "0px",
            color: "rgb(51,51,51)",
            backgroundColor: "rgb(250,250,250)",
            borderRadius: "3px",
            fontSize: "12px",
            margin: "30px 0 15px 0",
            height: "24px",
          }}
        >
          <Text
            style={{
              background: "#fafafa",
              paddingLeft: "10px",
              fontSize: "16px",
              fontWeight: "800",
              margin: "0",
            }}
          >
            Details
          </Text>
        </Section>
        <Section>
          <Text
            style={{
              margin: "0",
              // padding: "0",
              lineHeight: 1.4,
              color: "rgb(102,102,102)",
              fontSize: "14px",
              paddingLeft: "15px",
            }}
          >
            Breakfast: {totalBreakfast}
          </Text>
          <Text
            style={{
              margin: "0",
              // padding: "0",
              lineHeight: 1.4,
              color: "rgb(102,102,102)",
              fontSize: "14px",
              paddingLeft: "15px",
            }}
          >
            Lunch: {totalLunch}
          </Text>
          <Text
            style={{
              margin: "0",
              // padding: "0",
              lineHeight: 1.4,
              color: "rgb(102,102,102)",
              fontSize: "14px",
              paddingLeft: "15px",
            }}
          >
            Dinner: {totalDinner}
          </Text>
          <Text
            style={{
              marginTop: "25px",
              color: "rgb(102,102,102)",
              fontSize: "14px",
              paddingLeft: "15px",
              fontWeight: "600",
            }}
          >
            Deposit: {totalDeposit} BDT
          </Text>
          <Text
            style={{
              marginTop: "-15px",
              color: "rgb(102,102,102)",
              fontSize: "14px",
              paddingLeft: "15px",
              fontWeight: "600",
            }}
          >
            Bill: {totalBill} BDT
          </Text>
        </Section>
        <Hr style={{ margin: "30px 0 0 0" }} />
        <Section align="right">
          <Row>
            <Column style={{ display: "table-cell" }} align="right">
              <Text
                style={{
                  margin: "0",
                  color: "rgb(102,102,102)",
                  fontSize: "10px",
                  fontWeight: "600",
                  padding: "0px 30px 0px 0px",
                  textAlign: "right",
                }}
              >
                TOTAL DUE
              </Text>
            </Column>
            <Column
              style={{
                height: "48px",
                borderLeft: "1px solid",
                borderColor: "rgb(238,238,238)",
              }}
            ></Column>
            <Column style={{ display: "table-cell", width: "90px" }}>
              <Text
                style={{
                  margin: "0px 20px 0px 0px",
                  fontSize: "16px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  textAlign: "right",
                  color: "rgb(102,102,102)",
                }}
              >
                {parseInt(totalBill) - parseInt(totalDeposit)} BDT
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr style={{ margin: "0 0 10px 0" }} />
        <Section>
          <Row>
            <Column
              align="center"
              style={{ display: "block", margin: "40px 0 0 0" }}
            >
              <Img
                style={{
                  backgroundColor: "#fff",
                  padding: "6px",
                  borderRadius: "100%",
                }}
                src={`https://i.ibb.co/vBb8Q8x/logo-black.png`}
                width="50"
                height="50"
                alt="Apple Card"
              />
            </Column>
          </Row>
        </Section>
        <Text
          style={{
            margin: "8px 0 0 0",
            textAlign: "center",
            fontSize: "12px",
            color: "rgb(102,102,102)",
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
            color: "rgb(102,102,102)",
          }}
        >
          Copyright © 2024 The Crown Boys Hostel Inc. <br />{" "}
          <Link href="https://www.apple.com/legal/">All rights reserved</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default MonthlyBillEmail;
