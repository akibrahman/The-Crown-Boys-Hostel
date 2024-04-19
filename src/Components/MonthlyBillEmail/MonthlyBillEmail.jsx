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

export const MonthlyBillEmail = () => (
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
        }}
      >
        <Section>
          <Row>
            <Column>
              <Img
                src={`https://i.ibb.co/vBb8Q8x/logo-black.png`}
                width="85"
                height="85"
                alt="Apple Logo"
              />
            </Column>

            <Column align="right" style={{ display: "table-cell" }}>
              <Text
                style={{
                  fontSize: "32px",
                  fontWeight: "300",
                  color: "#888888",
                }}
              >
                Monthly Bill
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
            <Link href="https://www.apple.com/apple-card">
              Apply and use in minutes
            </Link>
          </Text>
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
              height: "46px",
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
                      akibrahman5200@gmail.com
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
                      18 Jan 2023
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
                      ML4F5L8522
                    </Link>
                  </Column>
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
                      186623754793
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
              colSpan={2}
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
                Akib Rahman
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
              fontSize: "14px",
              fontWeight: "500",
              margin: "0",
            }}
          >
            Details
          </Text>
        </Section>
        <Section>
          <Row>
            <Column style={{ width: "64px" }}>
              <Img
                src={`https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/apple-hbo-max-icon.jpeg`}
                width="64"
                height="64"
                alt="HBO Max"
                style={{
                  margin: "0 0 0 20px",
                  borderRadius: "14px",
                  border: "1px solid rgba(128,128,128,0.2)",
                }}
              />
            </Column>
            <Column style={{ paddingLeft: "50px" }}>
              <Text
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                }}
              >
                HBO Max: Stream TV &amp; Movies
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  color: "rgb(102,102,102)",
                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                }}
              >
                HBO Max Ad-Free (Monthly)
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  color: "rgb(102,102,102)",

                  margin: "0",
                  padding: "0",
                  lineHeight: 1.4,
                }}
              >
                Renews Aug 20, 2023
              </Text>
              <Link
                href="https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview?cc=us&amp;id=1497977514&amp;o=i&amp;type=Subscription%20Renewal"
                style={{
                  fontSize: "12px",
                  color: "rgb(0,112,201)",
                  textDecoration: "none",
                }}
                data-saferedirecturl="https://www.google.com/url?q=https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview?cc%3Dus%26id%3D1497977514%26o%3Di%26type%3DSubscription%2520Renewal&amp;source=gmail&amp;ust=1673963081204000&amp;usg=AOvVaw2DFCLKMo1snS-Swk5H26Z1"
              >
                Write a Review
              </Link>
              <span
                style={{
                  marginLeft: "4px",
                  marginRight: "4px",
                  color: "rgb(51,51,51)",
                  fontWeight: 200,
                }}
              >
                |
              </span>
              <Link
                href="https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/reportAProblem?a=1497977514&amp;cc=us&amp;d=683263808&amp;o=i&amp;p=29065684906671&amp;pli=29092219632071&amp;s=1"
                style={{
                  fontSize: "12px",
                  color: "rgb(0,112,201)",
                  textDecoration: "none",
                }}
                data-saferedirecturl="https://www.google.com/url?q=https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/reportAProblem?a%3D1497977514%26cc%3Dus%26d%3D683263808%26o%3Di%26p%3D29065684906671%26pli%3D29092219632071%26s%3D1&amp;source=gmail&amp;ust=1673963081204000&amp;usg=AOvVaw3y47L06B2LTrL6qsmaW2Hq"
              >
                Report a Problem
              </Link>
            </Column>

            <Column
              style={{
                display: "table-cell",
                padding: "0px 20px 0px 0px",
                width: "100px",
                verticalAlign: "top",
              }}
              align="right"
            >
              <Text
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                $14.99
              </Text>
            </Column>
          </Row>
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
                TOTAL
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
                }}
              >
                $14.99
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr style={{ margin: "0 0 75px 0" }} />
        <Section>
          <Row>
            <Column align="center" style={{ display: "block" }}>
              <Img
                src={`https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/apple-card-icon.png`}
                width="60"
                height="17"
                alt="Apple Card"
              />
            </Column>
          </Row>
        </Section>
        <Section>
          <Row>
            <Column
              align="center"
              style={{
                display: "block",
                margin: "15px 0 0 0",
              }}
            >
              <Text style={{ fontSize: "24px", fontWeight: "500" }}>
                Save 3% on all your Apple purchases.
              </Text>
            </Column>
          </Row>
        </Section>
        <Section>
          <Row>
            <Column
              align="center"
              style={{ display: "table-cell", margin: "10px 0 0 0" }}
            >
              <Link
                href="https://wallet.apple.com/apple-card/setup/feature/ccs?referrer=cid%3Dapy-120-100003"
                style={{ color: "rgb(0,126,255)", textDecoration: "none" }}
              >
                <Img
                  src={`https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/apple-wallet.png`}
                  width="28"
                  height="28"
                  alt="Apple Wallet"
                  style={{
                    display: "inherit",
                    paddingRight: "8px",
                    verticalAlign: "middle",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    textDecoration: "none",
                  }}
                >
                  Apply and use in minutes
                </span>
              </Link>
            </Column>
          </Row>
        </Section>
        <Hr style={{ margin: "65px 0 20px 0" }} />
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "0",
            lineHeight: "auto",
            marginBottom: "16px",
          }}
        >
          1. 3% savings is earned as Daily Cash and is transferred to your Apple
          Cash card when transactions post to your Apple Card account. If you do
          not have an Apple Cash card, Daily Cash can be applied by you as a
          credit on your statement balance. 3% is the total amount of Daily Cash
          earned for these purchases. See the Apple Card Customer Agreement for
          more details on Daily Cash and qualifying transactions.
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "0",
            lineHeight: "auto",
            marginBottom: "16px",
          }}
        >
          2. Subject to credit approval.
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "0",
            lineHeight: "auto",
            marginBottom: "16px",
          }}
        >
          To access and use all the features of Apple Card, you must add Apple
          Card to Wallet on an iPhone or iPad with iOS or iPadOS 13.2 or later.
          Update to the latest version of iOS or iPadOS by going to Settings
          &gt; General &gt; Software Update. Tap Download and Install.
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "0",
            lineHeight: "auto",
            marginBottom: "16px",
          }}
        >
          Available for qualifying applicants in the United States.
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "0",
            lineHeight: "auto",
            marginBottom: "16px",
          }}
        >
          Apple Card is issued by Goldman Sachs Bank USA, Salt Lake City Branch.
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "0",
            lineHeight: "auto",
            marginBottom: "16px",
          }}
        >
          If you reside in the US territories, please call Goldman Sachs at
          877-255-5923 with questions about Apple Card.
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "20px 0",
            lineHeight: "auto",
            textAlign: "center",
          }}
        >
          Privacy: We use a
          <Link
            href="http://support.apple.com/kb/HT207233"
            style={{ color: "rgb(0,115,255)" }}
          >
            {" "}
            Subscriber ID{" "}
          </Link>
          to provide reports to developers.
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "20px 0",
            lineHeight: "auto",
            textAlign: "center",
          }}
        >
          Get help with subscriptions and purchases.
          <Link
            href="https://support.apple.com/billing?cid=email_receipt"
            style={{ color: "rgb(0,115,255)" }}
          >
            Visit Apple Support.
          </Link>
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "20px 0",
            lineHeight: "auto",
            textAlign: "center",
          }}
        >
          Learn how to{" "}
          <Link href="https://support.apple.com/kb/HT204030?cid=email_receipt_itunes_article_HT204030">
            manage your password preferences
          </Link>{" "}
          for iTunes, Apple Books, and App Store purchases.
        </Text>

        <Text
          style={{
            fontSize: "12px",
            color: "rgb(102,102,102)",
            margin: "20px 0",
            lineHeight: "auto",
            textAlign: "center",
          }}
        >
          {" "}
          You have the option to stop receiving email receipts for your
          subscription renewals. If you have opted out, you can still view your
          receipts in your account under Purchase History. To manage receipts or
          to opt in again, go to{" "}
          <Link href="https://finance-app.itunes.apple.com/account/subscriptions?unsupportedRedirectUrl=https://apps.apple.com/US/invoice">
            Account Settings.
          </Link>
        </Text>
        <Section>
          <Row>
            <Column
              align="center"
              style={{ display: "block", margin: "40px 0 0 0" }}
            >
              <Img
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
          Copyright © 2023 Apple Inc. <br />{" "}
          <Link href="https://www.apple.com/legal/">All rights reserved</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default MonthlyBillEmail;
