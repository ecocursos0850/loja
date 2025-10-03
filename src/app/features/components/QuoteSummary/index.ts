private calculateTotalPayment(): void {
  let totalCalculado = this.totalPrice();

  // 1) aplica regras de desconto de parceiro / pós
  if (this.hasFreeCourses()) {
    totalCalculado =
      this.otherCategoriesTotal() +
      (this.posGraduacaoSubtotal() - this.posGraduacaoDiscountValue());
  } else if (this.hasAffiliatedDiscount() || this.hasPosGraduacaoDiscount()) {
    totalCalculado =
      this.otherCategoriesTotal() +
      (this.direitoOnlineSubtotal() - this.affiliatedDiscountValue()) +
      (this.posGraduacaoSubtotal() - this.posGraduacaoDiscountValue());
  }

  // 2) aplica cupom de desconto sobre o total já calculado
  if (this.couponDiscount()?.valor) {
    const percentual = this.couponDiscount().valor;
    const desconto = (percentual / 100) * totalCalculado;
    totalCalculado = totalCalculado - desconto;
  }

  // 3) atualiza o signal do total
  this.total.set(totalCalculado);
}
