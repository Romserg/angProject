import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  validationMessages = {
    fullName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 2 characters',
      maxlength: 'Full Name must be less than 30 characters'
    },
    email: {
      required: 'Email is required.',
      emailDomain: 'Email domain should be google.com'
    },
    phone: {
      required: 'Phone is required.'
    },
    skillName: {
      required: 'Skill Name is required.'
    },
    experienceInYears: {
      required: 'Experience is required.'
    },
    proficiency: {
      required: 'Proficiency is required.'
    }
  };

  formErrors = {
    fullName: '',
    email: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    proficiency: ''
  };

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      contactPreference: ['email'],
      email: ['', [Validators.required, emailDomain]],
      phone: [''],
      skills: this.fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    this.employeeForm.valueChanges.subscribe(() => {
      this.logValidationErrors(this.employeeForm);
    });
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });
  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (abstractControl.errors.hasOwnProperty(errorKey)) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  onLoadDataClick(): void {
    // this.logValidationErrors(this.employeeForm);
    // console.log(this.formErrors);
  }

  onSubmit(): void {
    console.log(this.employeeForm.value);
  }

}

function emailDomain(control: AbstractControl): ValidationErrors | null {
  const email: string = control.value;
  const domain = email.substring(email.lastIndexOf('@') + 1);
  if (email === '' || domain.toLowerCase() === 'google.com') {
    return null;
  } else {
    return {
      emailDomain: true
    };
  }
}
