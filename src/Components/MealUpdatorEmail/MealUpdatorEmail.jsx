import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export const MealUpdatorEmail = ({
  userFirstName = "Akib Rahman",
  date = "02/05/2024",
  time = "05:30",
  loginLocation = "Dhaka",
  loginIp = "103.201.36.25.1",
}) => {
  return (
    <Html style={{ backgroundColor: "#000" }}>
      <Head />
      <Preview>Yelp recent login</Preview>
      <Body style={{ ...main, backgroundColor: "#1C1917" }}>
        <Container>
          <Section style={logo}>
            {/* <Img src={`${baseUrl}/static/yelp-logo.png`} /> */}
          </Section>

          <Section style={content}>
            <Row>
              <Img
                style={image}
                width={620}
                src={`https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/yelp-header.png`}
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {userFirstName},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  We noticed that manager has changed your meal order
                </Heading>

                <Text style={paragraph}>
                  <b>Time of Order Changing: </b>
                  {time}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5, color: "#0284C7" }}>
                  <b>Date of Changed Order: </b>
                  {date}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Location: </b>
                  {loginLocation}
                </Text>
                <Text
                  style={{
                    color: "rgb(100,100,100, 1)",
                    fontSize: 14,
                    marginTop: -5,
                  }}
                >
                  *Approximate geographic location based on IP address:
                  {loginIp}
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    fontWeight: "500",
                    backgroundColor: "#0284C7",
                    width: "120px",
                    margin: "0 auto 25px",
                    padding: "5px 0",
                    borderRadius: "2px",
                  }}
                >
                  Details
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  If this wasn&apos;t you or if you have additional questions,
                  please see our support page.
                </Text>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: "0" }}>
              <Column style={containerButton} colSpan={2}>
                <Button style={button}>Learn More</Button>
              </Column>
            </Row>
          </Section>

          <Section style={containerImageFooter}>
            <Img
              style={image}
              width={620}
              src={`https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/yelp-footer.png`}
            />
          </Section>

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgb(100,100,100, 1)",
            }}
          >
            © 2024 | Mijan Meal Management System, Kamarpara, Uttara Sector -
            10, Dhaka, Bangladesh
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MealUpdatorEmail;

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const logo = {
  padding: "30px 20px",
};

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const button = {
  backgroundColor: "#e00707",
  borderRadius: 3,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  cursor: "pointer",
  padding: "12px 30px",
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const image = {
  maxWidth: "100%",
};

const boxInfos = {
  padding: "20px",
};

const containerImageFooter = {
  padding: "45px 0 0 0",
};
