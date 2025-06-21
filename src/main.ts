import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as crypto from 'crypto';


(global as any).crypto = crypto;


console.log("Iniciei");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  console.log("Aplicação iniciada, terminal ficará aberto.");

  // Mantém o processo vivo para o terminal não fechar
  setInterval(() => {
    // pode colocar um log opcional se quiser
    // console.log("Executando...");
  }, 1000 * 60 * 10); // 10 minutos

  // Ou pode usar um loop infinito, mas setInterval é mais elegante
}

bootstrap().catch(err => {
  console.error("Erro ao iniciar aplicação:", err);

  // Mantém o terminal aberto mesmo em erro
  setInterval(() => {}, 1000 * 60 * 10);
});
