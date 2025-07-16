const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Database connection details (replace with your actual details)
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel_mgt",
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Middleware to log incoming requests to /api
app.use("/api", (req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Hotel Management Backend is running!");
});

// API endpoint to get all rooms
app.get("/api/rooms", (req, res) => {
  pool.query("SELECT * FROM rooms", (err, results) => {
    if (err) {
      console.error("Error fetching rooms:", err);
      res.status(500).json({ message: "Error fetching rooms" });
      return;
    }
    res.json(results);
  });
});

// API endpoint to get a single room by ID
app.get("/api/rooms/:id", (req, res) => {
  const roomId = req.params.id;

  pool.query("SELECT * FROM rooms WHERE id = ?", [roomId], (err, results) => {
    if (err) {
      console.error("Error fetching room:", err);
      res.status(500).json({ message: "Error fetching room" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(results[0]);
  });
});

// API endpoint to update a room
app.put("/api/rooms/:id", (req, res) => {
  const roomId = req.params.id;
  const { room_type, capacity, price_per_night, amenities, image_url } =
    req.body;

  if (!room_type || !capacity || !price_per_night) {
    return res
      .status(400)
      .json({ message: "Room type, capacity, and price are required" });
  }

  const updatedRoom = {
    room_type,
    capacity,
    price_per_night,
    amenities,
    image_url,
  };

  pool.query(
    "UPDATE rooms SET ? WHERE id = ?",
    [updatedRoom, roomId],
    (err, results) => {
      if (err) {
        console.error("Error updating room:", err);
        res.status(500).json({ message: "Error updating room" });
        return;
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.status(200).json({ message: "Room updated successfully" });
    }
  );
});

// API endpoint to add a new room
app.post("/api/rooms", (req, res) => {
  console.log("Received POST request to /api/rooms");
  const { room_type, capacity, price_per_night, amenities, image_url } =
    req.body;

  if (!room_type || !capacity || !price_per_night) {
    return res
      .status(400)
      .json({ message: "Room type, capacity, and price are required" });
  }

  const newRoom = {
    room_type,
    capacity,
    price_per_night,
    amenities,
    image_url,
  };

  pool.query("INSERT INTO rooms SET ?", newRoom, (err, results) => {
    if (err) {
      console.error("Error adding room:", err);
      res.status(500).json({ message: "Error adding room" });
      return;
    }
    res
      .status(201)
      .json({ message: "Room added successfully", roomId: results.insertId });
  });
});

// API endpoint to delete a room
app.delete("/api/rooms/:id", (req, res) => {
  const roomId = req.params.id;

  pool.query("DELETE FROM rooms WHERE id = ?", [roomId], (err, results) => {
    if (err) {
      console.error("Error deleting room:", err);
      res.status(500).json({ message: "Error deleting room" });
      return;
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  });
});

// API endpoints for bookings
app.get("/api/bookings", (req, res) => {
  pool.query("SELECT * FROM bookings", (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).send("Error fetching bookings");
      return;
    }
    res.json(results);
  });
});

app.post("/api/bookings", (req, res) => {
  const {
    user_id,
    room_id,
    checkin_date,
    checkout_date,
    number_of_guests,
    total_price,
  } = req.body;

  if (
    !user_id ||
    !room_id ||
    !checkin_date ||
    !checkout_date ||
    !number_of_guests ||
    !total_price
  ) {
    return res.status(400).json({ message: "All booking fields are required" });
  }

  const newBooking = {
    user_id,
    room_id,
    checkin_date,
    checkout_date,
    number_of_guests,
    total_price,
  };

  pool.query("INSERT INTO bookings SET ?", newBooking, (err, results) => {
    if (err) {
      console.error("Error creating booking:", err);
      res.status(500).send("Error creating booking");
      return;
    }
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: results.insertId,
    });
  });
});

app.put("/api/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const {
    user_id,
    room_id,
    checkin_date,
    checkout_date,
    number_of_guests,
    total_price,
  } = req.body;

  if (
    !user_id ||
    !room_id ||
    !checkin_date ||
    !checkout_date ||
    !number_of_guests ||
    !total_price
  ) {
    return res.status(400).json({ message: "All booking fields are required" });
  }

  const updatedBooking = {
    user_id,
    room_id,
    checkin_date,
    checkout_date,
    number_of_guests,
    total_price,
  };

  pool.query(
    "UPDATE bookings SET ? WHERE id = ?",
    [updatedBooking, bookingId],
    (err, results) => {
      if (err) {
        console.error("Error updating booking:", err);
        res.status(500).send("Error updating booking");
        return;
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(200).json({ message: "Booking updated successfully" });
    }
  );
});

app.delete("/api/bookings/:id", (req, res) => {
  const bookingId = req.params.id;

  pool.query(
    "DELETE FROM bookings WHERE id = ?",
    [bookingId],
    (err, results) => {
      if (err) {
        console.error("Error deleting booking:", err);
        res.status(500).send("Error deleting booking");
        return;
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(200).json({ message: "Booking deleted successfully" });
    }
  );
});

// API endpoints for users
// TODO: Implement POST (register), GET (login) for users
app.post("/api/users/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if user already exists
  pool.query(
    "SELECT id FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error checking for existing user:", err);
        return res.status(500).send("Error registering user");
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Username already exists" });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).send("Error registering user");
        }

        // Insert new user into the database
        pool.query(
          "INSERT INTO users (username, password) VALUES (?, ?)",
          [username, hashedPassword],
          (err, results) => {
            if (err) {
              console.error("Error inserting new user:", err);
              return res.status(500).send("Error registering user");
            }

            res.status(201).json({
              message: "User registered successfully",
              userId: results.insertId,
            });
          }
        );
      });
    }
  );
});

app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Find the user by username
  pool.query(
    "SELECT id, password FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error finding user:", err);
        return res.status(500).send("Error logging in");
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const user = results[0];

      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Error logging in");
        }

        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        // Passwords match, login successful
        res.status(200).json({ message: "Login successful", userId: user.id });
      });
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Error handling for database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database as ID", connection.threadId);
  connection.release(); // Release the connection back to the pool
});
