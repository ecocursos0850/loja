import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private readonly baseUrl = 'https://srv448021.hstgr.cloud/Cursos/';
  private readonly defaultImage = 'https://srv448021.hstgr.cloud/logo-ecocursos.jpg';

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  // Para a página de listagem de cursos
  setCoursesListMetaTags(): void {
    this.clearMetaTags();
    
    const currentUrl = this.getCurrentUrl();
    
    this.title.setTitle('Todos os Cursos - ECOCURSOS');
    
    // Meta Tags para listagem geral
    this.updateMetaTag('property="og:title"', 'Todos os Cursos - ECOCURSOS');
    this.updateMetaTag('property="og:description"', 'Explore nossa lista completa de cursos online. Pós-graduação, MBA, cursos técnicos e muito mais.');
    this.updateMetaTag('property="og:image"', this.defaultImage);
    this.updateMetaTag('property="og:url"', currentUrl);
    this.updateMetaTag('property="og:type"', 'website');
    this.updateMetaTag('property="og:site_name"', 'ECOCURSOS');

    // Twitter
    this.updateMetaTag('name="twitter:card"', 'summary_large_image');
    this.updateMetaTag('name="twitter:title"', 'Todos os Cursos - ECOCURSOS');
    this.updateMetaTag('name="twitter:description"', 'Explore nossa lista completa de cursos online');
    this.updateMetaTag('name="twitter:image"', this.defaultImage);
  }

  // Para cursos específicos na LISTAGEM
  setCourseMetaTags(course: any): void {
    this.clearMetaTags();
    
    const courseSlug = this.createSlug(course.titulo);
    const courseUrl = `${this.getBaseUrl()}/cursos/${courseSlug}/${course.id}`;
    const courseImage = course.capa ? `${this.baseUrl}${course.capa}` : this.defaultImage;
    
    this.title.setTitle(`${course.titulo} - ECOCURSOS`);
    
    // Open Graph
    this.updateMetaTag('property="og:title"', course.titulo);
    this.updateMetaTag('property="og:description"', course.descricao);
    this.updateMetaTag('property="og:image"', courseImage);
    this.updateMetaTag('property="og:url"', courseUrl);
    this.updateMetaTag('property="og:type"', 'website');
    this.updateMetaTag('property="og:site_name"', 'ECOCURSOS');

    // Twitter
    this.updateMetaTag('name="twitter:card"', 'summary_large_image');
    this.updateMetaTag('name="twitter:title"', course.titulo);
    this.updateMetaTag('name="twitter:description"', course.descricao);
    this.updateMetaTag('name="twitter:image"', courseImage);
  }

  // Para a página de DETALHES do curso
  setCourseDetailsMetaTags(course: any): void {
    this.clearMetaTags();
    
    const currentUrl = this.getCurrentUrl();
    const courseImage = course.capa ? `${this.baseUrl}${course.capa}` : this.defaultImage;
    
    this.title.setTitle(`${course.titulo} - ECOCURSOS`);
    
    // Open Graph
    this.updateMetaTag('property="og:title"', course.titulo);
    this.updateMetaTag('property="og:description"', course.descricao);
    this.updateMetaTag('property="og:image"', courseImage);
    this.updateMetaTag('property="og:url"', currentUrl);
    this.updateMetaTag('property="og:type"', 'website');
    this.updateMetaTag('property="og:site_name"', 'ECOCURSOS');

    // Twitter
    this.updateMetaTag('name="twitter:card"', 'summary_large_image');
    this.updateMetaTag('name="twitter:title"', course.titulo);
    this.updateMetaTag('name="twitter:description"', course.descricao);
    this.updateMetaTag('name="twitter:image"', courseImage);
  }

  // Método auxiliar para atualizar meta tags de forma segura
  private updateMetaTag(selector: string, content: string): void {
    try {
      this.meta.updateTag({ [this.getSelectorType(selector)]: content }, selector);
    } catch (error) {
      console.warn(`Erro ao atualizar meta tag ${selector}:`, error);
      // Tenta adicionar a tag se não existir
      const tag = this.createMetaTag(selector, content);
      if (tag) {
        this.meta.addTag(tag);
      }
    }
  }

  // Método auxiliar para criar meta tags
  private createMetaTag(selector: string, content: string): any {
    const selectorType = this.getSelectorType(selector);
    return { [selectorType]: content };
  }

  // Determina se é property ou name
  private getSelectorType(selector: string): string {
    return selector.startsWith('property=') ? 'property' : 'name';
  }

  // Limpa meta tags de forma segura
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
      try {
        this.meta.removeTag(tag);
      } catch (error) {
        // Ignora erros ao remover tags que não existem
      }
    });
  }

  // Métodos auxiliares
  private getCurrentUrl(): string {
    return this.doc.location?.href || window.location.href;
  }

  private getBaseUrl(): string {
    return window.location.origin;
  }

  private createSlug(text: string): string {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  }
}