import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Database } from 'node-firebird';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  private readonly API_URL = 'https://nanuvem.app.br/api/v1/produtos/';
  private readonly TOKEN = '9a23440ac1b0b4e0113a6c16a2175d6cb0c5ccd8';
  private readonly LOJA = '19463479000120';

  constructor(
    @Inject('FIREBIRD_CONNECTION') private db: Database,
    private readonly httpService: HttpService,
  ) {}

  @Interval(30_000)
  async executarConsultaPeriodica() {
    try {
      const produtos = await this.listarProdutos();
      console.log(`Encontrados ${produtos.length} produtos alterados/inseridos nos últimos 30s`);

      for (const produto of produtos) {
        await this.enviarProduto(produto);
      }
    } catch (error) {
      console.error('Erro ao consultar ou enviar produtos:', error);
    }
  }

  private async listarProdutos(): Promise<any[]> {
    const dataCorte = new Date(Date.now() - 30_000);

    const sql = `
      SELECT * FROM PRODUTO
      WHERE DATAALTERACAO > ? OR DATACADASTRO > ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(sql, [dataCorte, dataCorte], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  private async enviarProduto(produto: any): Promise<void> {
  const payload = [
    {
      produto: {
        ativo: true,
        nome: produto.produto,
        sku: produto.cod1,
        estoque_tipo: 'prod',
        destaque: false,
        rastreavel: false,
        sazonal: false,
        balanca_rede: false,
        balanca_caixa: false,
        apelido: '',
        complemento: '',
        referencia: '',
        codigo_adicional: '',
        ncm: produto.ncm || '00000000',
        cest: '',
        unidade: produto.unidade || 'UN',
        anp: '',
        anvisa: '',
        tributacao_icms: 1,
        tributacao_pis_cofins: 1,
        departamentos: null,
        secoes: null,
        grupos: null,
        grupos_sub: null,
        validade: null,
        preco: {
          loja: 1,
          tabela: 'Padrão',
          compra: produto.compra,
          markup: 0,
          venda: produto.venda,
        },
        estoque: {
          loja: 1,
          minimo: 5.0,
          qtd_deposito: 0.0,
          qtd_loja: produto.estoquefisico || 0,
        },
      },
    },
  ];

  console.log(payload)

  try {
    const response = await firstValueFrom(
      this.httpService.post(this.API_URL, payload, {
        headers: {
          token: this.TOKEN,
          loja: this.LOJA,
        },
      })
    );

    console.log(`Produto enviado com sucesso (SKU: ${payload[0].produto.sku})`);
    console.log('Resposta da API:', response.data); // <- Aqui mostra todo o retorno da API
  } catch (error) {
    console.error(`Erro ao enviar produto SKU ${payload[0].produto.sku}:`, error?.response?.data || error.message);
  }

}

}
