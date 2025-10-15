import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  // URL do vídeo padrão
  private readonly defaultVideoUrl = 'https://srv448021.hstgr.cloud/vinheta.mp4';

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  setCourseMetaTags(course: any): void {
    const currentUrl = this.doc.location.href;
    
    // Title
    this.title.setTitle(`${course.titulo} - Eco Cursos`);

    // Open Graph Meta Tags básicas
    this.meta.updateTag({ property: 'og:title', content: course.titulo });
    this.meta.updateTag({ property: 'og:description', content: course.descricao });
    this.meta.updateTag({ property: 'og:image', content: course.capa });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Eco Cursos' });

    // Meta Tags para Vídeo
    this.meta.updateTag({ property: 'og:video', content: this.defaultVideoUrl });
    this.meta.updateTag({ property: 'og:video:url', content: this.defaultVideoUrl });
    this.meta.updateTag({ property: 'og:video:secure_url', content: this.defaultVideoUrl });
    this.meta.updateTag({ property: 'og:video:type', content: 'video/mp4' });
    this.meta.updateTag({ property: 'og:video:width', content: '1280' });
    this.meta.updateTag({ property: 'og:video:height', content: '720' });

    // Meta Tags alternativas para imagem (fallback)
    this.meta.updateTag({ property: 'og:image:url', content: course.capa });
    this.meta.updateTag({ property: 'og:image:secure_url', content: course.capa });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    // Twitter Card Meta Tags (opcional)
    this.meta.updateTag({ name: 'twitter:card', content: 'player' }); // Mude para 'player' se quiser vídeo no Twitter
    this.meta.updateTag({ name: 'twitter:title', content: course.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: course.descricao });
    this.meta.updateTag({ name: 'twitter:image', content: course.capa });
    this.meta.updateTag({ name: 'twitter:player', content: this.defaultVideoUrl });
    this.meta.updateTag({ name: 'twitter:player:width', content: '1280' });
    this.meta.updateTag({ name: 'twitter:player:height', content: '720' });
  }

  // Método específico para quando você quer priorizar o vídeo
  setCourseMetaTagsWithVideoPriority(course: any): void {
    const currentUrl = this.doc.location.href;
    
    // Title
    this.title.setTitle(`${course.titulo} - Eco Cursos`);

    // Para priorizar vídeo, mudamos o og:type para video.movie
    this.meta.updateTag({ property: 'og:type', content: 'video.movie' });
    this.meta.updateTag({ property: 'og:title', content: course.titulo });
    this.meta.updateTag({ property: 'og:description', content: course.descricao });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:site_name', content: 'Eco Cursos' });

    // Meta Tags para Vídeo (prioridade)
    this.meta.updateTag({ property: 'og:video', content: this.defaultVideoUrl });
    this.meta.updateTag({ property: 'og:video:url', content: this.defaultVideoUrl });
    this.meta.updateTag({ property: 'og:video:secure_url', content: this.defaultVideoUrl });
    this.meta.updateTag({ property: 'og:video:type', content: 'video/mp4' });
    this.meta.updateTag({ property: 'og:video:width', content: '1280' });
    this.meta.updateTag({ property: 'og:video:height', content: '720' });

    // Imagem como fallback
    this.meta.updateTag({ property: 'og:image', content: course.capa });
    this.meta.updateTag({ property: 'og:image:url', content: course.capa });
    this.meta.updateTag({ property: 'og:image:secure_url', content: course.capa });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'player' });
    this.meta.updateTag({ name: 'twitter:title', content: course.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: course.descricao });
    this.meta.updateTag({ name: 'twitter:player', content: this.defaultVideoUrl });
    this.meta.updateTag({ name: 'twitter:player:width', content: '1280' });
    this.meta.updateTag({ name: 'twitter:player:height', content: '720' });
    this.meta.updateTag({ name: 'twitter:image', content: course.capa });
  }

  clearMetaTags(): void {
    // Remove todas as meta tags que podemos ter adicionado
    const tagsToRemove = [
      'property="og:title"',
      'property="og:description"',
      'property="og:image"',
      'property="og:url"',
      'property="og:type"',
      'property="og:site_name"',
      'property="og:video"',
      'property="og:video:url"',
      'property="og:video:secure_url"',
      'property="og:video:type"',
      'property="og:video:width"',
      'property="og:video:height"',
      'property="og:image:url"',
      'property="og:image:secure_url"',
      'property="og:image:type"',
      'property="og:image:width"',
      'property="og:image:height"',
      'name="twitter:card"',
      'name="twitter:title"',
      'name="twitter:description"',
      'name="twitter:image"',
      'name="twitter:player"',
      'name="twitter:player:width"',
      'name="twitter:player:height"'
    ];

    tagsToRemove.forEach(tag => {
      this.meta.removeTag(tag);
    });
  }

  // Método para atualizar apenas o vídeo se necessário
  updateVideoMetaTags(videoUrl?: string): void {
    const videoToUse = videoUrl || this.defaultVideoUrl;
    
    this.meta.updateTag({ property: 'og:video', content: videoToUse });
    this.meta.updateTag({ property: 'og:video:url', content: videoToUse });
    this.meta.updateTag({ property: 'og:video:secure_url', content: videoToUse });
    this.meta.updateTag({ name: 'twitter:player', content: videoToUse });
  }
}