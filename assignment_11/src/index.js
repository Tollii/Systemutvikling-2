// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column } from './widgets';
import { CourseDetails, CourseList, courses, addCourse, CourseEdit} from './courses';
import {StudentDetails, StudentEdit, students, StudentList, addStudent} from './students';

import { createHashHistory } from 'history';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


/* Add dummy data, add students to courses, and courses have corresponding students*/
let notDivisble = courses.filter((e,i)=> i%2 != 0);
notDivisble.map(a => students[1].attendCourse(a));
notDivisble.map(a => a.addStudent(students[1]));

let divisible =  courses.filter((e,i)=> i%2 == 0);
divisible.map(a => students[0].attendCourse(a));
divisible.map(a => a.addStudent(students[0]));




class Menu extends Component {
  render() {
    return (
      <NavBar brand="React example">
        <NavBar.Link to="/students">Students</NavBar.Link>
        <NavBar.Link to ="/courses">Courses</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <Card title="React example with component state">Client-server communication will be covered next week.</Card>
    );
  }
}




const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route path="/students" component={StudentList} />
        <Route exact path="/students/:id" component={StudentDetails} />
        <Route exact path="/students/:id/edit" component={StudentEdit} />
        <Route path="/courses" component={CourseList} />
        <Route exact path="/courses/:courseCode" component={CourseDetails}/>
        <Route path="/addStudent" component={addStudent}/>
        <Route path="/addCourse" component={addCourse}/>
        <Route exact path="/courses/:courseCode/edit" component={CourseEdit}/>
      </div>
    </HashRouter>,
    root
  );
