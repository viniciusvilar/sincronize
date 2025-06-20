import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Database } from 'node-firebird';

@Injectable()
export class ProductService {

  constructor(@Inject('FIREBIRD_CONNECTION') private db: Database) {}

  @Interval(30_000)
  async executarConsultaPeriodica() {
    try {
      const alterados = await this.buscarProdutosAlterados();
      const cadastrados = await this.buscarProdutosCadastrados();

      console.log(`Alterados nos últimos 30s: ${alterados.length}`);
      console.log(`Cadastrados nos últimos 30s: ${cadastrados.length}`);

    } catch (error) {
      console.error('Erro ao consultar produtos:', error);
    }
  }

  private async buscarProdutosAlterados(): Promise<any[]> {
    const dataCorte = new Date(Date.now() - 30_000);

    const sql = `
      SELECT * FROM PRODUTO
      WHERE DATAALTERACAO > ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(sql, [dataCorte], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  private async buscarProdutosCadastrados(): Promise<any[]> {
    const dataCorte = new Date(Date.now() - 30_000);

    const sql = `
      SELECT * FROM PRODUTO
      WHERE DATACADASTRO > ?
    `;

    return new Promise((resolve, reject) => {
      this.db.query(sql, [dataCorte], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}
