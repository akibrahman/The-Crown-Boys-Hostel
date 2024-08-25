import admin from "firebase-admin";
import { NextResponse } from "next/server";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  //   const serviceAccount = require("../../../../public/service_key_firebase_adminsdk_thecrownboyshostel.json");
  const data = {
    type: "service_account",
    project_id: "the-crown-boys-hostel",
    private_key_id: "74d0b9f7dbe524dd8d665dd25b8972a2489735b8",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQD7bbm201wBcgTs\nW83DwokY4cu/Ir18Cghc+5wXQFvNNvzMQShRpZpDBNvB20rQksdI1cr2ozFeiwnI\nJ888kzvbkNcaYJLy1IrO6rqIZ7Y/qdNTQeFrwmSjKl8bfH3YE9XrdJtCqXF5HHVH\nHMD6mqKYnNO1ntr9X2CjG18Eogveawm5JDA3p9s530/XnPWXEMo3b47dHf3spd0x\nxQ0pKzvZlf30G6Qv6WYMYYU6PVffZL7rHkCkNbv6LkKUEtd/4HdH6czhGcelUybE\nUr1FjELGbXQHreoU8h50InXl7t3sKjH06MgHjAgsSA0U7s4P2eJ8RikKqZZ2zW8s\niNLARRXvAgMBAAECggEAMI7LbCy7uye7Ha7JOYJrmduZzus1ryv824BYcAEk+agi\nAIyg7cvO1ByvGGxysX93b3CixylTUpAFrptJochJqij58gUuvCkiOb4Jkmh9QSRa\nRN0XXQlpCD4ZqiRL5ZxHFzco+SHiYWKGn9pExuFwf4riNFRetMpjznxtyGZHZofh\nlMvy89+ZPgR4LmL7lWveEGPGroH5AVux0SGkshfzQaaCDyt2a/3Z1t5aZ5zXoA20\nRKyfO8RdG66IY0aqGc8wmj50yMsYtF4rgd6AZgdlfc2BEJrUWopaqOeXJdLTnNRs\niKps/o2eKnEHUZUdZXJEp/YpbI/+xjmWgyt1Uepe4QKBgQD+XZCTPImvYIiHndx8\nJnvZeDFiQObR97TouMdV/SNYDcn3ofKGZ7hytDU2WdSvM4dwdjpt7Ne7rkQk0GPh\n002gnZfExR6y64vkjhulP8n2H0V7W/WV52hzSpv5oS935w2TV4D/UPPXtcXvxist\n05lb/RPyan9pLuF8QnQKdh0NkQKBgQD9C1RZ+dUc3or7N9joboJ23DWti4QPeNIQ\n/qe33XCc3yhxZ1jMFIS62+afx/iKo01fPIrpYbfoeC0ablQtjIJyejOhqOXAspnF\n4cq3vHbYl6SWESfGU2LujMThpyXA12us7tsuFhGhtPZMGSLpLdZ1VzFgVk+wcR1Y\nkzDoI1QrfwKBgE1vUGbyQ/wGyCl47jlBQezHQUlm9p2u6fz623wa7tqMgBKJ05oF\nE0qf/58HI88eQboD0+/I7TfuakJGylFiETy3HQ/C7oCLYm/2rwXUcHgjtvRB33Z+\nFvcaHHeXEStQRHq5ZcTT8ReW96Xxzw1JYGN3nM3si9MKeYxpcogIwvlxAoGAJMDz\nhIocITBVwX1wHPqIKpl7lnRwPwsOf/dtBvC7/Z0QM8CODj5gtP9htQ2HlSN5Bn81\nsgZGfxaNfoxN37vL6rLDMxTkIiQO38YW+q7+GCGWf1GIlG7iLMH3issLWcIwWpLq\n9Puxneo55/2yq2nD/5Elk9eVhYw4dfgTH3SaMiMCgYBuCRNLvJL9KMTmLe/zK57K\nWOr3PNFMRSf6r1YOE6g+leA7WKJ9BYfmiB1+p5HHSYhw5+HFz4pw8cAwvviCl0T1\nlU2+8vwekNUniuyMe9cnpIORGoFIykQUf0klDZKOsE9NevmlwwJIvicPNteoIBNF\nNa8ttpgj+wiUSBog7U7gTg==\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-rtmsy@the-crown-boys-hostel.iam.gserviceaccount.com",
    client_id: "116764068510856344684",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rtmsy%40the-crown-boys-hostel.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };

  admin.initializeApp({
    credential: admin.credential.cert(data),
  });
}

export async function POST(request) {
  const { token, title, message, image, link } = await request.json();
  const payload = {
    token,
    data: {
      title: title,
      body: message,
      image: image || "",
      link: link || "",
    },
    webpush: link && {
      fcmOptions: {
        link,
      },
    },
  };
  console.log(payload);

  try {
    await admin.messaging().send(payload);

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
