import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup } from './widgets';

import { createHashHistory } from 'history';
import { students } from './students';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


export class Course{
  static nextCourseId = 1;
  studentList = [];

  constructor(title, code){
    this.title = title;
    this.courseCode = code;
    this.id = Course.nextCourseId++;
  }

  addStudent(student){
    this.studentList.push(student);
  }

  removeStudent(student){
    let index = this.studentList.indexOf(student);
    if(index >-1){
      this.studentList.splice(index,1);
    }
  }
}

export let courses =[
  new Course('Systemutvikling 3', 'TDAT3001'),
  new Course('Sikkerhet i programvare og nettverk', 'TDAT3014'),
  new Course("Systemutviklingsprosjekt", "TDAT3105"),
  new Course("3D-grafikk med prosjekt", "TDAT3205"),
  new Course("Matematikk og fysikk valgfag","TDAT3010"),
  new Course("Anvendt maskinlæring med prosjekt","TDAT3004")
];



export class CourseList extends Component{
  render(){
    return(
      <Card title={"Courses"}>
        {courses.map(e =>
          <Row>
            <Column width={4}>
              <NavLink activeStyle={{ color: 'white' }} exact to={'/courses/' + e.courseCode} className="list-group-item">
                  <ListGroup>
          {e.title}
                  </ListGroup>
              </NavLink>
            </Column>
            <Column>
              <NavLink to={'/courses/' + e.courseCode + '/edit'}>
                <Button.Light onClick={""}>
              edit
                </Button.Light>
              </NavLink>
            </Column>
          </Row>)}
          <Row>
            <Column width={4}>
              <NavLink to="/addCourse">
        <Button.Success>Add course</Button.Success>
              </NavLink>
            </Column>
          </Row>
      </Card>
      )

  }
}

export class CourseDetails extends Component{
  render(){
    let course = courses.find(course => course.courseCode == this.props.match.params.courseCode);
    let studentsInCourse = course.studentList;


    if(!course){
      console.error("Course not found");
      return null;
    }
    return (
      <div>
          <Card title={course.courseCode}>
    <Card title="Course Details:">


        <Row>
          <Column width={2}>Course code:</Column>
          <Column width={6}>{course.courseCode}</Column>
        </Row>
        <Row>
          <Column width={2}>Title: </Column>
          <Column width={6}>{course.title}</Column>
        </Row>

    </Card>
        <Card title="Students">
          {studentsInCourse.map(e=>
              <Row>
                <Column width={4}>
                {e.firstName} {e.lastName}
                </Column>
                </Row>

          )}
        </Card>
          </Card>
      </div>
    )
  }
}

export class addCourse extends Component{
  render(){
    return (
      <div>
        <Card title="Add Course">
          <form>
            <Row>
              <Column width={4}>
                <input type="text" placeholder="Title" id="addCourseTitle"></input>
              </Column>
            </Row>
            <Row>
              <Column width={4}>
                <input type="text" placeholder="Course code" id="addCourseCode"></input>
              </Column>
            </Row>
            <Row>
              <Column width={4}>
                <Button.Success onClick={this.addCourse}>Add</Button.Success>
              </Column>
            </Row>
          </form>
        </Card>
      </div>
    )
  }

  addCourse(){
    let title = document.querySelector("#addCourseTitle").value;
    let courseCode = document.querySelector("#addCourseCode").value;
    let course = new Course(title,courseCode);
    courses.push(course);
    history.push('/courses/');
  }
}

export class CourseEdit  extends Component<{ match: { params: { id: number } } }> {
  title = ''; // Always initialize component member variables
  courseCode = '';


  render(){
    let course = courses.find(course => course.courseCode == this.props.match.params.courseCode);
    let studentsInCourse = course.studentList;
    let availableStudents = students.filter(e => ! studentsInCourse.includes(e));


    return(
      <div>
          <Card title={course.courseCode + " - Edit"}>
        <Card title={course.courseCode}>

            <form>
              <Row>
                <Column width={2}>Course code:</Column>
                <Column width={4}>
                  <input
                    type="text"
                    value={this.courseCode}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.courseCode = event.target.value)}
                  />
                </Column>
              </Row>
              <Row>
                <Column width={2}>Title:</Column>
                <Column width={4}>
                  <input
                    type="text"
                    value={this.title}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value)
                    }
                  />
                </Column>
              </Row>
              <Row>
                <Column width={6}>
                <Button.Success onClick={this.save}>Save</Button.Success>
                <Button.Danger onClick={this.deleteCourse}>Delete Course</Button.Danger>
                </Column>
              </Row>

            </form>

        </Card>

        <Card title="Attending students">
          {studentsInCourse.map(e=>
              <Row>
                <Column width={4}>
                  {e.firstName} {e.lastName}
                </Column>
                  <Column width={2}>
                      <Button.Danger onClick={a => this.removeStudentFromCourse(e.id)}>X</Button.Danger>
                  </Column>
              </Row>

          )}
        </Card>
        <Card title="Add student">
          <form>
            <select>
              {availableStudents.map(e=> <option id="addStudentFromCourses">{e.firstName + " " + e.lastName}</option>)}
            </select>
          </form>
          <Button.Success onClick={this.addStudentToCourse}>Add Student</Button.Success>
        </Card>
          </Card>
      </div>
    )
  }

  mounted() {
    let course = courses.find(course => course.courseCode == this.props.match.params.courseCode);

    if (!course) {
      Alert.danger('Student not found: ' + this.props.match.params.id);
      return;
    }

    this.title = course.title;
    this.courseCode = course.courseCode;

  }

  removeStudentFromCourse(id){
      let studentId = id;
      let student = students.find(e=> e.id == studentId);
      let course = courses.find(course => course.courseCode == this.props.match.params.courseCode);

      course.removeStudent(student);
      student.removeCourse(course);

      history.push('/courses/'+ course.courseCode);




  }

  addStudentToCourse(){
      let selectedStudent = document.querySelector("#addStudentFromCourses").value;
      let course = courses.find(course => course.courseCode === this.props.match.params.courseCode);
      let student = students.find(e => e.firstName + " " + e.lastName == selectedStudent);

      course.addStudent(student);
      student.attendCourse(course);
      history.push('/courses/'+ course.courseCode);
  }

  deleteCourse(){
    let course = courses.find(course => course.courseCode === this.props.match.params.courseCode);
    let index = courses.indexOf(course);

    //remove courses from courselist
    courses.splice(index,1);

    //remove students from courses
    students.map(e => e.removeCourse(course));

    history.push('/courses/');
  }


  save() {
    let course = courses.find(course => course.courseCode == this.props.match.params.courseCode);
    if (!course) {
      Alert.danger('Student not found: ' + this.props.match.params.id);
      return;
    }

    course.title = this.title;
    course.courseCode = this.courseCode;

    // Go to StudentDetails after successful save
    history.push('/courses/' + course.courseCode);
  }

}
