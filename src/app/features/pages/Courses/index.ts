shareOnFacebook(course: CourseType): void {
  const currentUrl = window.location.origin + '/cursos/' + course.titulo + '/' + course.id;
  const shareText = `Confira este curso: ${course.titulo} - ${course.descricao}`;
  
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(shareText);
  
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  
  window.open(
    facebookShareUrl,
    'facebook-share-dialog',
    'width=800,height=600,top=100,left=100'
  );
}