import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'errorToMessage',
  standalone: true,
})
export class ErrorToMessagePipe implements PipeTransform {
  public transform(errors: ValidationErrors): unknown {
    const [errorKey] = Object.keys(errors);

    return (
      {
        required: 'This field is required',
        email: 'Must be an valid email',
        atLeastOneDigit: 'Must have at least one digit',
        atLeastOneUppercase: 'Must have at least one uppercase',
        atLeastOneNonAlphanumeric:
          'Must have at least one non alphanumeric character',
      }[errorKey] ?? 'Unknown error'
    );
  }
}
