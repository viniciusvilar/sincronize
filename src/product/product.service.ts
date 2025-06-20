import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Database } from 'node-firebird';

@Injectable()
export class ProductService {

  constructor(@Inject('FIREBIRD_CONNECTION') private db: Database) {}

  @Interval(30_000)
  async executarConsultaPeriodica() {
    try {
      const produtos = await this.listarProdutos();
      console.log(`Produtos alterados/inseridos nos últimos 30 segundos: ${produtos.length}`);

    } catch (error) {
      console.error('Erro ao consultar produtos:', error);
    }
  }

  async listarProdutos(): Promise<any[]> {
    const agora = new Date();
    const dataCorte = new Date(agora.getTime() - 30_000);

    const sql = `
      SELECT * FROM PRODUTO
      WHERE DATAALTERACAO > ? OR DATACADASTRO > ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(sql, [dataCorte, dataCorte], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
