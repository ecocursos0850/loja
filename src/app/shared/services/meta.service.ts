import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private readonly baseUrl = 'https://srv448021.hstgr.cloud/Cursos/';

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  // Para a página de listagem de cursos
  setCoursesListMetaTags(): void {
    this.clearMetaTags();
    
    const currentUrl = this.doc.location.href;
    
    this.title.setTitle('Todos os Cursos - ECOCURSOS');
    
    // Meta Tags para listagem geral
    this.meta.updateTag({ property: 'og:title', content: 'Todos os Cursos - ECOCURSOS' });
    this.meta.updateTag({ property: 'og:description', content: 'Explore nossa lista completa de cursos online. Pós-graduação, MBA, cursos técnicos e muito mais.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://srv448021.hstgr.cloud/logo-ecocursos.jpg' });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'ECOCURSOS' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Todos os Cursos - ECOCURSOS' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Explore nossa lista completa de cursos online' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://srv448021.hstgr.cloud/logo-ecocursos.jpg' });
  }

  // Para cursos específicos na LISTAGEM
  setCourseMetaTags(course: any): void {
    this.clearMetaTags();
    
    const courseSlug = course.titulo.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const courseUrl = `${window.location.origin}/cursos/${courseSlug}/${course.id}`;
    const courseImage = course.capa ? `${this.baseUrl}${course.capa}` : 'https://srv448021.hstgr.cloud/logo-ecocursos.jpg';
    
    this.title.setTitle(`${course.titulo} - ECOCURSOS`);
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: course.titulo });
    this.meta.updateTag({ property: 'og:description', content: course.descricao });
    this.meta.updateTag({ property: 'og:image', content: courseImage });
    this.meta.updateTag({ property: 'og:url', content: courseUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'ECOCURSOS' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: course.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: course.descricao });
    this.meta.updateTag({ name: 'twitter:image', content: courseImage });
  }

  // Para a página de DETALHES do curso
  setCourseDetailsMetaTags(course: any): void {
    this.clearMetaTags();
    
    const currentUrl = this.doc.location.href;
    const courseImage = course.capa ? `${this.baseUrl}${course.capa}` : 'https://srv448021.hstgr.cloud/logo-ecocursos.jpg';
    
    this.title.setTitle(`${course.titulo} - ECOCURSOS`);
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: course.titulo });
    this.meta.updateTag({ property: 'og:description', content: course.descricao });
    this.meta.updateTag({ property: 'og:image', content: courseImage });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'ECOCURSOS' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: course.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: course.descricao });
    this.meta.updateTag({ name: 'twitter:image', content: courseImage });
  }

  clearMetaTags(): void {
    const tagsToRemove = [
      'property="og:title"',
      'property="og:description"',
      'property="og:image"',
      'property="og:url"',
      'property="og:type"',
      'property="og:site_name"',
      'name="twitter:card"',
      'name="twitter:title"',
      'name="twitter:description"',
      'name="twitter:image"'
    ];

    tagsToRemove.forEach(tag => {
      this.meta.removeTag(tag);
    });
  }
}