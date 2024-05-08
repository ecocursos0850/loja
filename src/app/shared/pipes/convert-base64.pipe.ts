import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'directory_image',
  standalone: true
})
export class GetDirectoryImage implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(image: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://srv448021.hstgr.cloud/Cursos/${image}`
    );
  }
}
