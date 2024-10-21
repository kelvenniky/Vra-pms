import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post('/signup',(req, res) => {
  const sql = "INSERT INTO admin (`name`,`email`,`password`,`locationID`) VALUES (?)" 
  const values =[
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.locationID
  ]
  con.query(sql, [values], (err, data) => {
    if (err) {
      return res.json( "Error" );
    }
    return res.json(data);
  })

})


router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});


router.get('/admin_records', (req, res) => {
  // Extract token from cookies
  const token = req.cookies.token; // Assuming you are using cookies to store the token

  if (!token) {
    return res.status(401).json({ Status: false, Error: "Unauthorized" });
  }

  // Verify the token and extract user information
  jwt.verify(token, "jwt_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ Status: false, Error: "Token is not valid" });
    }

    const email = user.email; // Extract the email from the token payload

    // SQL query to select records based on the user's email
    const sql = "SELECT * FROM admin WHERE email = ?";
    con.query(sql, [email], (err, result) => {
      if (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
      }
      if (result.length > 0) {
        return res.json({ Status: true, Result: result }); // Return the user records
      } else {
        return res.json({ Status: false, Error: "No records found" });
      }
    });
  });
});


router.get('/alladmin_records', (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, data) => {
    if (err) {
      return res.json({ Error: "Error fetching visitors" });
    }
    return res.json(data);
  });
});



//add
router.post('/add', (req, res) => {
  const sql = "INSERT INTO cars ( number, name, contact, type,  date, time, locationID) VALUES (?)";
  const values = [
    req.body.number,
    req.body.name,
    req.body.contact,
    req.body.type,
    req.body.date,
    req.body.time,
    req.body.locationID
  ];
  con.query(sql, [values], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error adding Vehicle" });
    }
    return res.status(201).json({ message: "Vehicle added successfully!" });
  });
});

router.put('/update/:id', (req, res) => {
  const sql = "UPDATE cars SET number = ?, name = ?, contact = ?, type = ?, date = ?, time = ?, locationID = ? WHERE id = ?";
  const values = [
    req.body.number,
    req.body.name,
    req.body.contact,
    req.body.type,
    req.body.date,
    req.body.time,
    req.body.locationID
  ];

  const id = req.params.id;
  con.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ message: "Error updating visitor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    return res.status(200).json({ message: "Visitor updated successfully!" });
  });
});
//display

router.get('/', (req, res) => {
  const sql = "SELECT * FROM cars";
  con.query(sql, (err, data) => {
    if (err) {
      console.error(err); // Log the error to the console
      return res.status(500).json({ Error: "Error fetching calls" });
    }
    return res.json(data);
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});


router.get('/getrecord/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM cars WHERE id = ?";
  con.query(sql, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching record" });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    return res.json(data);
  });
});



router.delete('/delete/:id', (req, res) => {
  const sql = "DELETE FROM cars WHERE id = ?";
  const id = req.params.id;
  con.query(sql, [id], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "Error deleting cars" });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Car not found" });
      }
      return res.json({ message: "Car deleted successfully!" });
  });
});







export {router as adminRouter};