import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';

import { of, Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
export class CPFGenericValidator {
  static isValidCpfAsync(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const cpf = control.value;

      if (!cpf || cpf.length !== 11) return of({ cpfNotValid: true });

      return timer(10).pipe(
        switchMap(() => {
          const isValid = CPFGenericValidator.validateCPF(cpf);
          return isValid ? of(null) : of({ cpfNotValid: true });
        })
      );
    };
  }

  private static validateCPF(cpf: string): boolean {
    const numbers = cpf.substring(0, 9);
    const digits = cpf.substring(9);
    let sum = 0;

    for (let i = 10; i > 1; i--) {
      sum += parseInt(numbers.charAt(10 - i), 10) * i;
    }

    const result1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (result1 !== parseInt(digits.charAt(0), 10)) return false;

    sum = 0;

    for (let i = 11; i > 1; i--) {
      sum += parseInt(cpf.charAt(11 - i), 10) * i;
    }

    const result2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return result2 === parseInt(digits.charAt(1), 10);
  }

  private static cleanCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }
}
