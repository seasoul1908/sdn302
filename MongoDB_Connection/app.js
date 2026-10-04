const express = require('express');
const crud = require('./crud');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/courses', crud.createCourse);
app.get('/courses', crud.getCourses);
app.get('/courses/:courseCode', crud.getCourseByCode);
app.put('/courses/:courseCode', crud.updateCourse);
app.delete('/courses/:courseCode', crud.deleteCourse);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
