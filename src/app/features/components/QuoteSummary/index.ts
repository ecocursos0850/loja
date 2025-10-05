  private calculateTotalPayment(): void {
    try {
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
      const totalAntesCupom = totalCalculado;
      totalCalculado = this.applyCouponDiscount(totalCalculado);
      
      // Atualiza o valor do desconto do cupom para exibição
      const descontoCupom = totalAntesCupom - totalCalculado;
      this.couponDiscountValue.set(descontoCupom);
    
      // 3) atualiza o signal do total
      this.total.set(totalCalculado);
    } catch (error) {
      console.error('❌ Error in calculateTotalPayment:', error);
      this.total.set(this.totalPrice());
    }
  }
  
  private applyCouponDiscount(total: number): number {
    if (!this.hasCouponDiscount()) {
      return total;
    }

    const coupon = this.couponDiscount();
    const percentual = coupon!.valor!;
    
    if (percentual <= 0 || percentual > 100) {
      return total;
    }
  
    const desconto = (percentual / 100) * total;
    const totalComDesconto = total - desconto;
    
    return Math.max(0, totalComDesconto);
  }
