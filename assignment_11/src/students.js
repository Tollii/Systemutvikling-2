import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component} from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import {Alert, Card, NavBar, Button, Row, Column, ListGroup} from './widgets';
import { CourseDetails, CourseList, courses } from './courses';

import { createHashHistory } from 'history';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student




class Student {
  id: number;
  static nextId = 1;
  courseList = [];

  firstName: string;
  lastName: string;
  email: string;

  attendCourse(course){
    this.courseList.push(course);
  }

  removeCourse(course){
    let index = this.courseList.indexOf(course);
    if(index >-1){
      this.courseList.splice(index,1);
    }
  }


  constructor(firstName: string, lastName: string, email: string) {
    this.id = Student.nextId++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
export let students = [
  new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no'),
  new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no')
];

export class addStudent extends Component{
  render(){
    return (
      <div>
        <Card title="Add student">
          <form>
            <Row>
              <Column width={4}>
              <input type="text" placeholder="Firstname" id="addStudentFirstName"></input>
              </Column>
            </Row>
            <Row>
              <Column width={4}>
            <input type="text" placeholder="Lastname" id="addStudentLastName"></input>
              </Column>
            </Row>
            <Row>
              <Column width={4}>
                <input type="text" placeholder="Email" id="addStudentEmail"></input>
              </Column>
            </Row>
            <Row>
              <Column width={4}>
                <Button.Success onClick={this.addNewStudent}>Add</Button.Success>
              </Column>
            </Row>
          </form>
        </Card>
      </div>
    )
  }

  addNewStudent(){
    let firstName = document.querySelector("#addStudentFirstName").value;
    let lastName = document.querySelector("#addStudentLastName").value;
    let email = document.querySelector("#addStudentEmail").value;

    let student = new Student(firstName,lastName,email);
    students.push(student);
    history.push('/students/');


  }
}

export class StudentList extends Component {
  render() {
    return (
      <div>
      <Card title="Students">
        {students.map(student => (
          <Row key={student.id}>
            <Column width={4}>

              <NavLink activeStyle={{ color: 'white' }} exact to={'/students/' + student.id} className="list-group-item">
                <ListGroup>
                {student.firstName} {student.lastName}
                </ListGroup>
              </NavLink>

            </Column>
            <Column>
              <NavLink activeStyle={{ color: 'darkblue' }} to={'/students/' + student.id + '/edit'} className="btn-dark">
                <Button.Light>edit</Button.Light>
              </NavLink>
            </Column>
          </Row>

        ))}
        <Row>
          <Column width={2}>
            <NavLink to={"/addStudent"}>
          <Button.Success>Add student</Button.Success>
            </NavLink>
          </Column>

        </Row>
      </Card>

      </div>
    );
  }
}

export class StudentDetails extends Component<{ match: { params: { id: number } } }> {
  render() {
    let student = students.find(student => student.id == this.props.match.params.id);
    let courses = student.courseList;
    if (!student) {
      Alert.danger('Student not found: ' + this.props.match.params.id);
      return null; // Return empty object (nothing to render)
    }
    return (
      <div className="bg-">
        <Card title={student.firstName + " " +student.lastName}>
        <Card title="Details">
          <Row>
            <Column width={2}>First name</Column>
            <Column>{student.firstName}</Column>
          </Row>
          <Row>
            <Column width={2}>Last name</Column>
            <Column>{student.lastName}</Column>
          </Row>
          <Row>
            <Column width={2}>Email</Column>
            <Column>{student.email}</Column>
          </Row>
        </Card>
        <Card title={"Attends courses"}>
          {courses.map(e =>
            <Row>
              <Column width={6}>{e.title}</Column>
              <Column width={4}>{e.courseCode}</Column>
            </Row>
          )}
        </Card>
        </Card>
      </div>
    );
  }
}

export class StudentEdit extends Component<{ match: { params: { id: number } } }> {
  firstName = ''; // Always initialize component member variables
  lastName = '';
  email = '';
  attendsCourses = [];



  // TODO: `This does not update because the DOM is not refreshed, only works once`



  render() {
    let student = students.find(student => student.id == this.props.match.params.id);
    let attendsCourses = student.courseList;
    let availableCourses = courses.filter(e => ! attendsCourses.includes(e));

    return (
      <Card title={this.firstName + " " + this.lastName}>
        <Card title="Edit">
          <form>
            <Row>
              <Column width={2}>First name</Column>
              <Column width={4}>
                <input
                  type="text"
                  value={this.firstName}
                  onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.firstName = event.target.value)}
                />
              </Column>
            </Row>
            <Row>
              <Column width={2}>Last name</Column>
              <Column width={4}>
                <input
                  type="text"
                  value={this.lastName}
                  onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.lastName = event.target.value)}
                />
              </Column>
            </Row>
            <Row>
              <Column width={2}>Email</Column>
              <Column width={4}>
                <input
                  type="text"
                  value={this.email}
                  onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.email = event.target.value)}
                />
              </Column>
            </Row>
            <Row>
              <Column width={6}>
                <Button.Success onClick={this.save}>Save</Button.Success>
                <Button.Danger onClick={this.deleteStudent}>Delete student</Button.Danger>
              </Column>
            </Row>

          </form>
        </Card>
        <Card title={"Courses"}>
          {this.attendsCourses.map(e =>
            <Row>
              <Column width={6}>
                {e.title}
              </Column>
              <Column width={2}>
                {e.courseCode}
              </Column>
              <Column width={2}>
                <Button.Danger id={e.courseCode} onClick={a => this.removeStudent(e.courseCode)}>X</Button.Danger>
              </Column>
            </Row>
          )}
        </Card>
        <Card title="Add course">
          <Row>
            <Column width={4}>
          <form>
            <select id={"selectCourse"}>
              {availableCourses.map((e,index)=> <option>{e.title}</option>)}
            </select>
          </form>
            </Column>
            <Column width={4}>
              <Button.Success onClick={this.addCourse}>Add</Button.Success>
            </Column>
          </Row>
        </Card>
      </Card>
    );
  }

  // Initialize component state (firstName, lastName, email) when the component has been inserted into the DOM (mounted)
  mounted() {
    let student = students.find(student => student.id == this.props.match.params.id);
    this.attendsCourses = student.courseList;


    if (!student) {
      Alert.danger('Student not found: ' + this.props.match.params.id);
      return;
    }

    this.firstName = student.firstName;
    this.lastName = student.lastName;
    this.email = student.email;

  }

  save() {
    let student = students.find(student => student.id == this.props.match.params.id);
    if (!student) {
      Alert.danger('Student not found: ' + this.props.match.params.id);
      return;
    }

    student.firstName = this.firstName;
    student.lastName = this.lastName;
    student.email = this.email;

    // Go to StudentDetails after successful save
    history.push('/students/' + student.id);
  }

  removeStudent(id){
    let courseCode = id;
    let student = students.find(student => student.id == this.props.match.params.id);
    let course = courses.find(course => course.courseCode == courseCode);

    //remove course from student's list
    student.removeCourse(course);

    //remove student from course's list
    course.removeStudent(student);

    //go back to details
    history.push('/students/' + student.id);

  }

  deleteStudent(){
    let student = students.find(student => student.id == this.props.match.params.id);
    let index = students.indexOf(student);

    //remove student from studentlist
    students.splice(index,1);

    //remove student from courses
    courses.map(e => e.removeStudent(student));


    history.push('/students/');


  }

  addCourse(){
    let student = students.find(student => student.id == this.props.match.params.id);
    let selection = document.querySelector("#selectCourse").value;
    let course = courses.find(course => course.title == selection);
    student.attendCourse(course);
    course.addStudent(student);
    history.push('/students/' + student.id);
  }
}