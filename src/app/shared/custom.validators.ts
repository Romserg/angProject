import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static emailDomain(domainName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);
      if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
        return null;
      } else {
        return {
          emailDomain: true
        };
      }
    };
  }
}
