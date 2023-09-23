const express = require("express");
const cors = require("cors"); // Import the cors package
const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();
const mailsender = require("./config/email-config");

// Use the cors middleware with the desired origin
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  // try {
  //   const response = await mailsender.sendMail({
  //     from: ServerConfig.GMAIL_EMAIL,
  //     to: "cetel40762@armablog.com",
  //     text: "Yes,it is working",
  //   });
  //   console.log(response);
  // } catch (error) {
  //   console.log(error);
  // }
});
