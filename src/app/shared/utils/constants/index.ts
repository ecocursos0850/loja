export const Constants = {
  FooterConstants: {
    attendences: [
      {
        description:
          'Em caso de divergência, o preço válido será o da finalização da compra'
      },
      {
        description: 'Razão social: ECOCURSOS EDUCAÇÃO A DISTÂNCIA LTDA-EIRELI'
      },
      { description: 'CNPJ: 10.930.297/0001-48' },
      {
        description:
          'End: Rua Ponta Porã n. 3011, Sala 01 - Santa Luzia - Votuporanga, SP - CEP: 15500-090.'
      },
      { description: 'Email: contato@ecocursos.com.br' }
    ],
    services: [
      { link: '/categorias', label: 'Cursos Online' }
    ],
     institutional: [
    ],
    contactUs: [
      { link: 'tel:+551734223725', label: 'Telefone (17) 3422-3725' },
      { link: 'https://wa.me/5517997245237', label: 'WhatsApp +55 17 99724-5237' },
      { link: 'https://wa.me/5517997245237', label: 'Afiliado ECOCURSOS' }
    ],
    routersFooter: [
      { link: 'simulados', label: 'Simulados' }
    ],
    socialMedias: [
      {
        image: './../../../assets/images/icon-facebook.svg',
        link: 'https://www.facebook.com/ecocursos/'
      },
      {
        image: './../../../assets/images/icon-instagram.svg',
        link: 'https://www.instagram.com/ecocursosead/'
      },
      {
        image: './../../../assets/images/icon-linkedin.svg',
        link: 'https://www.linkedin.com/company/ecocursoseducacaoead/'
      },
      {
        image: './../../../assets/images/icon-twitter.svg',
        link: 'https://www.facebook.com/ecocursos/'
      }
    ]
  },
  InforCardConstants: [
    {
      image: '../../../assets/images/icone01-red.png',
      label: 'Cursos Online',
      description: 'Conheça uma variedade de temas atuais.'
    },
    {
      image: '../../../assets/images/icone02-red.png',
      label: 'Especialistas do Mercado',
      description: 'Instrutores capacitados para lhe atender.'
    },
    {
      image: '../../../assets/images/icone03-red.png',
      label: 'Acesso 24x7',
      description: 'Aprenda no seu tempo.'
    }
  ],
  masks: {
    creditCard:
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
  },
  portalLink: 'https://portalhmg.ecocursos.com.br/',
  SalesRepLink: 'https://linktr.ee/ecocursosposgraduacao',
SlidesConstants: [
  {
    headline: 'Novo',
    src: '../../../assets/images/novo.png',
    index: 1
  }
],
  EventsInformationConstants: [
    {
      status: '01. ENTRE EM CONTATO COM OS NOSSOS CONSULTORES ESPECIALISTAS!', 
      icon: 'pi pi-angle-right',
      color: 'var(--red-600)',
      iconColor: 'text-white',
      description:
        'Comprar pelo site é prático, porém, falando com um dos nossos consultores, você pode garantir desconto especial para a compra do curso desejado.'
    },
    {
      status:
        '02. APÓS REALIZAR O SEU CADASTRO AQUI NO SITE, VOCÊ PODE EXPLORAR E COMPRAR ALGUNS DOS NOSSOS CURSOS!',
      icon: 'pi pi-angle-right',
      iconColor: 'text-900',
      color: 'var(--gray-100)',
      description:
        'Após a confirmação de compra, o sistema irá habilitar seu acesso imediatamente ao portal do aluno, assim você terá acesso aos conteúdos dos cursos adquiridos, e o acesso é vitalício. Contudo, para uma melhor experiência em nossa plataforma, informe no cadastro um email válido que você utiliza com frequência.'
    },
    {
      status: '03. PRECISA DE ALGUMA AJUDA? ',
      icon: 'pi pi-angle-right',
      color: 'var(--gray-100)',
      iconColor: 'text-900',
      description: 'Estamos muitos felizes em ter você aqui conosco! Qualquer dúvida você pode nos chamar por meio de um dos nossos canais de atendimento e suporte.'
    }
  ]
};
