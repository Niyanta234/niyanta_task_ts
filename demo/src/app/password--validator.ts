import { FormGroup, ValidationErrors } from '@angular/forms';



export function samePass(){
  return (form: FormGroup): ValidationErrors | null => {
    if (form.get('confirmpass')?.value != form.get('password')?.value) {
      form.controls['confirmpass'].setErrors({ passdidntmatch: true });
      return { didntmatch: form.value };
    }
    form.controls['confirmpass'].setErrors(null);
    return null;
  };
}

