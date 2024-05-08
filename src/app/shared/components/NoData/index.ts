import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  standalone: true,
  template: `
    <div
      class="min-h-15rem flex flex-column w-full justify-content-center align-items-center"
    >
      <h1>{{ message }}</h1>
      <img
        class="max-h-20rem"
        src="../../../../assets/images/no-data.png"
        alt="no-data"
      />
    </div>
  `
})
export class NoDataComponent {
  @Input() message: string = 'Sem dados';
}
