import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollToTop]',
  standalone: true
})
export class ScrollToTopDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click') onClick(): void {
    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
