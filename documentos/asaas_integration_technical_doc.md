# Documentação da Integração Asaas - VaultLink
Data: 20 de Março de 2026
Status: Implementação de Link de Pagamento Segura via Edge Functions

## Visão Geral
A integração foi projetada para ser segura e evitar erros de CORS ao processar pagamentos do Asaas em uma aplicação Vite/React.

## Arquitetura
A solução utiliza **Supabase Edge Functions** para ocultar a Chave de API de Produção e lidar com as chamadas de API do Asaas no lado do servidor.

### Componentes:
1. **Edge Function (`asaas-payment-checkout`)**:
   - Recebe dados do frontend (`name`, `value`, `returnUrl`).
   - Autentica com o Asaas usando o `access_token` de produção.
   - Gera um `paymentLink` configurado com `chargeType: 'DETACHED'`.
   - Retorna o `invoiceUrl` ou o erro detalhado.

2. **Serviço Frontend (`asaasService.ts`)**:
   - Fornece o método `getPaymentLink`.
   - Usa o cliente Supabase para invocar a função.
   - Trata erros e extrai descrições detalhadas para feedback ao usuário.

3. **Página de Obrigado (`/obrigado`)**:
   - Página de destino após o pagamento bem-sucedido.
   - Implementa rastreio de conversão (Google Ads e WhatsApp).

## Parâmetros Técnicos Utilizados
- **API Endpoint**: `https://www.asaas.com/api/v3/paymentLinks`
- **Campos Obrigatórios**: `name`, `value`, `billingType: 'UNDEFINED'`, `chargeType: 'DETACHED'`.
- **Desafio Encontrado**: Algumas contas Asaas exigem o parâmetro `dueLimitDays` (ou similar) configurado manualmente no Dashboard para permitir a criação de links que suportem Boleto.
- **Solução de Erro**: O sistema foi atualizado para capturar a mensagem exata do Asaas ("É necessário informar a quantidade de dias úteis...") e exibir via Toast no frontend.

## Credenciais
As credenciais de produção estão armazenadas no arquivo `.env` e na própria Edge Function para garantir persistência.
- `VITE_ASAAS_API_KEY`: $aact_prod_...
- `VITE_ASAAS_ENVIRONMENT`: production

## Como dar manutenção
Para atualizar a lógica de checkout, utilize os comandos de deploy do Supabase MCP:
`deploy_edge_function(name: 'asaas-payment-checkout', ...)`
