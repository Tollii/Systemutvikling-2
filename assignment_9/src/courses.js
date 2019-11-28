
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Card } from './cards';


class Course{
  static nextCourseId = 1;
  attendingStudents = [];
  constructor(title, code){
    this.id = Course.nextCourseId++;
    this.title = title;
    this.code = code;
  }

    addStudent(student){
    this.attendingStudents.push(student);
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
    return <div className="card-body">
      <h5>Courses</h5>
      {courses.map(course=>
        <div className="list-group ">
          <li key={course.code} className="list-group">
            <NavLink activeStyle={{color: 'white'}} to={"/courses/"+course.code} className="list-group-item">
              {course.title}
            </NavLink>
          </li>
        </div>
      )}
    </div>
  }
}

export class CourseDetails extends Component{
  render(){
    let course = courses.find(course => course.code == this.props.match.params.code);
    let studentsInCourse = course.attendingStudents;

    if(!course){
      console.error("Course not found");
      return null;
    }
    return <div className="card-body">
      <h5>Course Details:</h5>
      <div>
        <Card>Course code: {course.code}</Card>
        <Card>Title: {course.title}</Card>

        <Card>
        <h5>Students:</h5>
        {studentsInCourse.map(e =>
          <Card>{`${e.firstName} ${e.lastName}`}</Card>
       )}
        </Card>
      </div>
    </div>
  }
}

