import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  setCourseMetaTags(course: any): void {
    const currentUrl = this.doc.location.href;
    
    // Title
    this.title.setTitle(`${course.titulo} - Eco Cursos`);

    // Open Graph Meta Tags
    this.meta.updateTag({ property: 'og:title', content: course.titulo });
    this.meta.updateTag({ property: 'og:description', content: course.descricao });
    this.meta.updateTag({ property: 'og:image', content: course.capa });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Eco Cursos' });

    // Twitter Card Meta Tags (opcional)
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: course.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: course.descricao });
    this.meta.updateTag({ name: 'twitter:image', content: course.capa });
  }

  clearMetaTags(): void {
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('property="og:type"');
    this.meta.removeTag('property="og:site_name"');
    
    this.meta.removeTag('name="twitter:card"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');
  }
}