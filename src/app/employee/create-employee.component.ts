import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.employeeForm = new FormGroup({
      fullName: new FormControl(),
      email: new FormControl(),
      skills: new FormGroup({
        skillName: new FormControl(),
        experienceInYears: new FormControl(),
        proficiency: new FormControl()
      })
    });
  }

  onLoadDataClick(): void {
    this.employeeForm.setValue({
      fullName: 'Test name',
      email: 'email@test.com',
      skills: {
        skillName: 'Web',
        experienceInYears: '2',
        proficiency: 'advanced'
      }
    });
  }

  onSubmit(): void {
    console.log(this.employeeForm.value);
  }

}
