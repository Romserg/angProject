import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees: IEmployee[];

  constructor(private employeeService: EmployeeService) {
  }


  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      listEmployee => this.employees = listEmployee,
      err => console.log(err)
    );
  }

}
