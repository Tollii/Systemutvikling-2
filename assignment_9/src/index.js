// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { CourseList, CourseDetails, courses} from './courses';
import { Card } from './cards';

class Student {
  id: number;
  static nextId = 1;
  attendingCourses = [];

  firstName: string;
  lastName: string;
  email: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.id = Student.nextId++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  addCourse(course){
    this.attendingCourses.push(course);
  }
}
let students = [
  new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no'),
  new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no')
];

courses.map((e,index)=> {
  e.addStudent(students[0]);
  students[0].addCourse(e);
  e.addStudent(students[1]);
  students[1].addCourse(e);
});             







class Menu extends Component {
  render() {
    return (
      <div className="navbar navbar-expand-lg navbar-light bg-light card-header">
      <table>
        <tbody>
          <tr>
            <td>
              <NavLink activeStyle={{ color: 'darkblue' }} exact to="/">
                <div className="navbar-brand">
                React example
                </div>
              </NavLink>
            </td>
            <td>
              <NavLink activeStyle={{ color: 'black' }} to="/students" className="nav-link">
                Students
              </NavLink>
            </td>

            <td>
              <NavLink activeStyle={{ color: 'black'}} to={"/courses"}className="nav-link">
                Courses
              </NavLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    );
  }
}

class Home extends Component {
  render() {
    return <div className="card-body"><Card>React example with static pages</Card></div>;
  }
}

class StudentList extends Component {
  render() {
    return (
      <div className="card-body">
        <h5>Students</h5>
      <ul className="list-group">
        {students.map(student => (
          <li key={student.id} className="list-group">
            <NavLink activeStyle={{ color: 'darkblue' }} to={'/students/' + student.id} className="list-group-item-action list-group-item">
              {student.firstName} {student.lastName}
            </NavLink>
          </li>
        ))}
      </ul>
      </div>
    );
  }
}

class StudentDetails extends Component<{ match: { params: { id: number } } }> {
  render() {
    let student = students.find(student => student.id == this.props.match.params.id);
    let studentsCourses = student.attendingCourses;
    if (!student) {
      console.error('Student not found'); // Until we have a warning/error system (next week)
      return null; // Return empty object (nothing to render)
    }
    return (
      <div className="card-body">
        <h5>Details:</h5>

          <Card>First name: {student.firstName}</Card>
          <Card>Last name: {student.lastName}</Card>
          <Card>Email: {student.email}</Card>

        <Card>
          <h5>Courses:</h5>
            {studentsCourses.map(course =>
              <Card>{course.title}</Card>
            )}
        </Card>
      </div>
    );
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Menu />
        <Route exact path="/" component={Home} />
        <Route path="/students" component={StudentList} />
        <Route path="/students/:id" component={StudentDetails} />
        <Route path="/courses" component={CourseList}/>
        <Route path="/courses/:code" component={CourseDetails}/>
      </div>
    </HashRouter>,
    root
  );
