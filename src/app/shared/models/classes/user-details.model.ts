type SexType = 'masculino' | 'feminino';

interface PartnerType {
  id: number;
  nome: string;
  porcentagemDesconto: string;
  horasDisponiveis: number;
  isParceiro: boolean;
}

export class UserDetailsModel {
  id: number;
  nome: string;
  status: number;
  dataCadastro: string;
  email: string;
  sexo: SexType;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  nomePai: string;
  nomeMae: string;
  faculdade: string;
  anoConclusao: string;
  telefoneFixo: string | null;
  idade: string;
  dataNascimento: string;
  celular: string;
  receberEmail: boolean;
  horasDisponiveis: number;
  cep: string;
  logradouro: string;
  cidade: string;
  estado: string;
  bairro: string;
  numero: string;
  referencia: string;
  emailAniversario: boolean;
  tentativas: number;
  parceiro: PartnerType;
}
