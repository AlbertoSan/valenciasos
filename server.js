const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a la base de datos MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos MongoDB:", error);
  });

// Define user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define location schema
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  description: { type: String },
  contact: { type: String },
  services: { type: String },
});
const Location = mongoose.model("Location", locationSchema);

const User = mongoose.model("User", userSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Usuario y contraseña son requeridos" });
  }

  console.log("Login request:", username, password);

  try {
    // Buscar el usuario en la base de datos usando el userschema
    const user = await User.findOne({ username });

    if (!user) {
      // si no existe se crea un nuevo usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      console.log("New user created:", newUser);
    } else {
      console.log("User found:", user);
    }

    // Comparar la contraseña hasheada
    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    console.log("Password match:", isMatch);

    if (isMatch) {
      // Generar el token JWT
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        user: { id: user._id, username: user.username },
        token,
      });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Health check endpoint
app.get("/api/health", authenticateToken, (req, res) => {
  res.json({ status: "ok", user: req.user });
});

// Locations endpoints
app.get("/api/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/locations", async (req, res) => {
  try {
    const locationData = req.body;
    const newLocation = new Location(locationData);
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/locations/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    address,
    lat,
    lng,
    description,
    contact,
    hours,
    services,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE locations 
       SET name = $1, type = $2, address = $3, lat = $4, lng = $5,
           description = $6, contact = $7, hours = $8, services = $9
       WHERE id = $10 RETURNING *`,
      [name, type, address, lat, lng, description, contact, hours, services, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Error al actualizar ubicación" });
  }
});

app.delete("/api/locations/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM locations WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }
    res.json({ message: "Ubicación eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Error al eliminar ubicación" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
