
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ================================
// DATABASE
// ================================

const db = new sqlite3.Database("timetable_system.db");

const SECRET = "sit_timetable_secret_key";

// ================================
// CREATE TABLES
// ================================

// Faculty Preferences
 db.run(`
CREATE TABLE IF NOT EXISTS faculty_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// HOD Assignments
 db.run(`
CREATE TABLE IF NOT EXISTS hod_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Generated Timetables
 db.run(`
CREATE TABLE IF NOT EXISTS timetables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Faculty Master Data
 db.run(`
CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Subjects
 db.run(`
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Rooms
 db.run(`
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Sections
 db.run(`
CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

console.log("✅ Tables Created Successfully");

// ================================
// ENCRYPT FUNCTION
// ================================

function encryptData(data) {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET
    ).toString();
}

// ================================
// DECRYPT FUNCTION
// ================================

function decryptData(encrypted) {

    const bytes = CryptoJS.AES.decrypt(
        encrypted,
        SECRET
    );

    return JSON.parse(
        bytes.toString(CryptoJS.enc.Utf8)
    );
}

// ================================
// GENERIC SAVE FUNCTION
// ================================

function saveData(table, data, res) {

    const encrypted = encryptData(data);

    db.run(
        `INSERT INTO ${table}(data) VALUES(?)`,
        [encrypted],
        function(err) {

            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

            res.send({
                success: true,
                table,
                id: this.lastID
            });

        }
    );
}

// ================================
// GENERIC GET FUNCTION
// ================================

function getData(table, res) {

    db.all(
        `SELECT * FROM ${table}`,
        [],
        (err, rows) => {

            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

            const result = rows.map(r => {
                return {
                    id: r.id,
                    created_at: r.created_at,
                    data: decryptData(r.data)
                };
            });

            res.send(result);

        }
    );
}

// ================================
// SAVE ROUTES
// ================================

app.post("/saveFacultyPreference", (req, res) => {
    saveData("faculty_preferences", req.body, res);
});

app.post("/saveHODAssignment", (req, res) => {
    saveData("hod_assignments", req.body, res);
});

app.post("/saveTimetable", (req, res) => {
    saveData("timetables", req.body, res);
});

app.post("/saveFaculty", (req, res) => {
    saveData("faculty", req.body, res);
});

app.post("/saveSubject", (req, res) => {
    saveData("subjects", req.body, res);
});

app.post("/saveRoom", (req, res) => {
    saveData("rooms", req.body, res);
});

app.post("/saveSection", (req, res) => {
    saveData("sections", req.body, res);
});

// ================================
// GET ROUTES
// ================================

app.get("/getFacultyPreferences", (req, res) => {
    getData("faculty_preferences", res);
});

app.get("/getHODAssignments", (req, res) => {
    getData("hod_assignments", res);
});

app.get("/getTimetables", (req, res) => {
    getData("timetables", res);
});

app.get("/getFaculty", (req, res) => {
    getData("faculty", res);
});

app.get("/getSubjects", (req, res) => {
    getData("subjects", res);
});

app.get("/getRooms", (req, res) => {
    getData("rooms", res);
});

app.get("/getSections", (req, res) => {
    getData("sections", res);
});

// ================================
// DELETE ALL DATA
// ================================

app.delete("/clear/:table", (req, res) => {

    const table = req.params.table;

    db.run(`DELETE FROM ${table}`, [], function(err) {

        if (err) {
            return res.status(500).send(err);
        }

        res.send({
            success: true,
            cleared: table
        });

    });

});

// ================================
// ROOT ROUTE
// ================================

app.get("/", (req, res) => {

    res.send({
        message: "🚀 Timetable Backend Running Successfully"
    });

});

// ================================
// START SERVER
// ================================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running at http://localhost:${PORT}`);

});
