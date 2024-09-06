require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const ticketRoutes = require("./routes/tickets.routes");
const connectToMongoDB = require("./db/connectToMongoDB");
const auth = require("./routes/auth");
const authRoutes = require("./controllers/authController");
const adminRoutes = require("./routes/admin.routes");
const authMiddleware = require("./middlewares/authMiddleware");
const { updateEmails } = require("./db/updateEmails");
const emailRoutes = require("./routes/departmentEmailsRoutes");
const editUserTicket = require("./controllers/editTicketUser");
const storeEmployee = require("./db/storeEmployee");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const coreOptions = {
  origin: ["http://localhost:3000"], // Allow requests from any origin, replace with specific origins if needed
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(coreOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", auth);
app.use("/api", emailRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);

//admin routes
app.use("/admin", authMiddleware("SystemAdmin"), adminRoutes);
//test route
app.get("/", (req, res) => {
  res.send("Hello Word");
});
const startServer = async () => {
  try {
    await connectToMongoDB();
    console.log("Successfully connected to MongoDB");

    //uncomment for updating department head and employee emails
    //await updateEmails();

    //storing employee
     //storeEmployee();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with failure
  }
};
startServer();
