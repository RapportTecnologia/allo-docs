# AlloStarterFacade

O `AlloStarterFacade` é um *Facade* acadêmico criado para simplificar a interação do usuário com `Registry` e `Allo`. A primeira versão continha um problema crítico de identidade (SEC-002), corrigido no branch `refatoracao-gof-revisao-facade`.

## Problema original

A Facade tentava criar um perfil e se auto-adicionar como membro em uma única chamada. Entretanto, `Registry.createProfile` exige que o criador seja o owner quando membros são fornecidos. Como resultado, a Facade não conseguia concluir o fluxo e ainda assumia erroneamente o papel de pagador/administrador.

## Redesign em duas fases

1. **O usuário cria o perfil** no `Registry`, listando a `AlloStarterFacade` como membro.
2. **O usuário chama `initializeCampaign`** na Facade, que então cria o pool e financia os ativos.

Com isso:

* O usuário permanece **owner do perfil**.
* O usuário recebe a role de **Pool Manager**.
* A Facade recebe a role imutável de **Pool Admin**, exercida apenas por funções restritas ao owner do perfil (`addPoolManager` / `removePoolManager`).
* ETH é encaminhado 1:1 via `msg.value`.
* ERC-20 é debitado diretamente do usuário, puxando exatamente `_amount` e zerando a allowance ao final.

## Trust residual

A Facade retém `POOL_ADMIN_ROLE` e pode adicionar/remover managers quando o owner do perfil autoriza. Ela **não** pode:

* Criar perfis em nome do usuário.
* Administrar pools de perfis que não a incluíram como membro.
* Alterar endereços de fee/strategy/factory.

> **Atenção:** a Facade continua sendo um artefato experimental. Não deve ser publicada em produção sem auditoria externa independente.
