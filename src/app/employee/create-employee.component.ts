import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';

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
    confirmEmail: {
      required: 'Confirm email is required.'
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm email do not match'
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
    confirmEmail: '',
    emailGroup: '',
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
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('google.com')]],
        confirmEmail: ['', Validators.required]
      }, {validator: matchEmail}),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
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

  addSkillButtonClick(): void {
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    const emailControl = this.employeeForm.get('emailGroup.email');
    const emailConfirmControl = this.employeeForm.get('emailGroup.confirmEmail');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
      emailControl.clearValidators();
      emailConfirmControl.clearValidators();
    } else {
      phoneControl.clearValidators();
      emailControl.setValidators([Validators.required, CustomValidators.emailDomain('google.com')]);
      emailConfirmControl.setValidators(Validators.required);
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
    emailConfirmControl.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

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

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }
      }
    });
  }

  onLoadDataClick(): void {
    const formArray = new FormArray([
      new FormControl('John', Validators.required),
      new FormGroup({
        country: new FormControl('', Validators.required)
      }),
      new FormArray([])
    ]);

    const formArray1 = this.fb.array([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required)
    ]);
    formArray1.push(new FormControl('Mark', Validators.required));

    console.log(formArray1.at(3).value);
  }

  onSubmit(): void {
    console.log(this.employeeForm.value);
  }

}

function matchEmail(group: AbstractControl): ValidationErrors | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine) {
    return null;
  } else {
    return {
      emailMismatch: true
    };
  }
}
