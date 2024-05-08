import { Component } from '@angular/core';

@Component({
  selector: 'app-no-image',
  standalone: true,
  template: `
    <div>
      <img
        class="w-full max-h-10rem border-round-xl border-noround-bottom image-hover"
        src="../../../../assets/images/no-image.svg"
        alt="no-data"
      />
    </div>
  `
})
export class NoImageComponent {}
