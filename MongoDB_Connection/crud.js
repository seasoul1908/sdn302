const { MongoClient } = require('mongodb');

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
let courses;

async function connectDB() {
  if (!courses) {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("se1990_db");
    courses = db.collection("Courses");
  }
}

async function createCourse(req, res) {
  try {
    await connectDB();
    const newCourse = req.body;
    const result = await courses.insertOne(newCourse);
    res.status(201).json({ message: "Course created successfully", _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Error creating course" });
  }
}

async function getCourses(req, res) {
  try {
    await connectDB();
    const allCourses = await courses.find({}).toArray();
    res.status(200).json(allCourses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching courses" });
  }
}

async function getCourseByCode(req, res) {
  try {
    await connectDB();
    const courseCode = req.params.courseCode;
    const course = await courses.findOne({ courseCode });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching course" });
  }
}

async function updateCourse(req, res) {
  try {
    await connectDB();
    const courseCode = req.params.courseCode;
    const updateData = req.body;
    const result = await courses.updateOne(
      { courseCode },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Course not found or no changes made" });
    }
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating course" });
  }
}

async function deleteCourse(req, res) {
  try {
    await connectDB();
    const courseCode = req.params.courseCode;
    const result = await courses.deleteOne({ courseCode });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting course" });
  }
}

module.exports = {
  createCourse,
  getCourses,
  getCourseByCode,
  updateCourse,
  deleteCourse
};
