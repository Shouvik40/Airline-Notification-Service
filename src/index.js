const express = require("express");
const cors = require("cors"); // Import the cors package
const { EmailService } = require("./services");

const amqplib = require("amqplib");
async function connectQueue() {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("noti-queue");
    channel.consume("noti-queue", async (data) => {
      console.log(`${Buffer.from(data.content)}`);
      const object = JSON.parse(`${Buffer.from(data.content)}`);
      // const object = JSON.parse(Buffer.from(data).toString());
      await EmailService.sendEmail("pShouvik37@gmail.com", object.recepientEmail, object.subject, object.text);
      channel.ack(data);
    });
  } catch (error) {
    console.log(error);
  }
}

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const mailsender = require("./config/email-config");
const app = express();

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
  await connectQueue();
  console.log("queue is up");
});
