import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const TestEmail = ({ userFirstname, url }) => (
  <Html>
    <Head />
    <Preview>Akib Meal Management System</Preview>
    <Body style={main}>
      <Container style={container}>
        <Hr style={hr} />
        <Text style={heading}>Manager Expo</Text>
        <Hr style={hr} />
        <Img
          src={
            "https://cdn.templates.unlayer.com/assets/1636808300229-Security_system.jpg"
          }
          width="500"
          height="250"
          alt="Koala"
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Welcome to Akib&apos;s Digital Meal Management System. To begin your
          culinary journey, simply click the inviting button below
        </Text>
        <Text style={paragraph}>
          Unlocking the potential for streamlined and scalable meal system
          management demands a digital solution of unparalleled efficiency and
          elegance. Crafting an exquisite digital ecosystem ensures not only
          enhanced efficiency but also scalability. With the right digital
          tools, meal management transcends mere functionality, blossoming into
          a symphony of seamless operations and boundless scalability
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={url}>
            Verify
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          Developer Team - Akib Rahman
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Kamarpara, Uttara Sector - 10, Dhaka, Bangladesh
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TestEmail;

const main = {
  borderRadius: "4px",
  color: "#fff",
  backgroundColor: "#10131A",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const heading = {
  color: "#fff",
  fontWeight: "bold",
  textAlign: "center",
  padding: "2px 0",
  fontSize: "20px",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#fff",
};

const btnContainer = {
  textAlign: "center",
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center",
};
