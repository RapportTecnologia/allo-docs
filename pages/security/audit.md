# Auditoria Comparativa

A auditoria comparativa avaliou o estado original (`main`), o branch de refatoração GoF (`origin/refatoracao-gof`) e as correções aplicadas nos branches de revisão.

## Achados principais

| ID | Severidade | Descrição | Situação |
|---|---|---|---|
| AUD-001 | Crítica | Proxy existente ficaria com `feeStrategy` e `strategyFactory` zerados após upgrade. | Mitigado com `initializeGoFPatterns()` (`reinitializer(2)`). |
| AUD-002 | Alta | `AlloStarterFacade` não preservava identidade do usuário, não encaminhava ETH e não debitava ERC-20. | Corrigido com fluxo em duas fases (SEC-002). |
| AUD-003 | Alta | Fee Strategy podia retornar taxa maior que o aporte. | Mitigado com `INVALID_FEE`. |
| AUD-004 | Média | Fee Strategy / Strategy Factory aceitavam EOAs. | Mitigado com validação de bytecode. |
| AUD-005 | Média | Toolchain quebrada (PATH do Forge, Node 18, peer deps). | Corrigido; build e testes executam. |
| AUD-006 | Média | Administração concentrada em owner único. | Mitigado com multisig + timelock (SEC-005/009). |
| AUD-008 | Alta | Upgrade do Allo não executava migração atomicamente. | Corrigido com `upgradeAndCall`. |
| AUD-009 | Alta | Script `upgradeRegistry.ts` carregava endereço errado. | Corrigido com `getRegistry()`. |

## Invariantes documentadas

* A taxa cobrada nunca excede o valor financiado.
* Dependências críticas (`FeeStrategy`, `StrategyFactory`) devem possuir bytecode.
* A migração GoF só pode ser inicializada uma vez.
* Após a ativação da governança, `Allo.owner()`, `Registry.ALLO_OWNER` e `ProxyAdmin.owner()` devem ser o timelock.
* Toda ação administrativa passa por M-of-N confirmações e 48h de delay.

## Evidências

Os relatórios completos estão em:

* `docs/audit-report.md`
* `docs/security-checklist.md`
* `REQUIREMENTS.md`
* `docs/secure-tests/2026-10-14-10-11.md`
