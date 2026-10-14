# Upgrade Seguro

A refatoração GoF introduziu novos slots de storage (`feeStrategy` e `strategyFactory`) em `Allo.sol`. Para que proxies já implantados não fiquem com esses slots zerados, o upgrade deve executar a migração atomicamente.

## `initializeGoFPatterns()`

A função de migração:

* É protegida por `reinitializer(2)` (single-use).
* Não recebe parâmetros externos.
* É chamada pelo `ProxyAdmin` durante `upgradeAndCall`.
* Inicializa `feeStrategy` e `strategyFactory` com implementações padrão auditadas.

## Fluxo de upgrade via governança

Quando a governança multisig/timelock está ativa, o upgrade do Allo segue os passos:

1. **Preparar nova implementação** com `upgrades.prepareUpgrade`.
2. **Validar storage layout** com `upgrades.validateUpgrade`.
3. **Codificar a migração** (`initializeGoFPatterns`).
4. **Agendar no timelock** uma chamada a `ProxyAdmin.upgradeAndCall(proxy, newImpl, migrationData)`.
5. **Confirmar** no multisig até atingir `threshold`.
6. **Esperar 48h** de delay.
7. **Executar** a operação no timelock.

O script `scripts/governance/upgradeAlloViaGovernance.ts` automatiza o passo 1 ao 4.

## Checklist antes de mainnet

- [ ] `forge build --sizes` dentro dos limites.
- [ ] `upgrades.validateUpgrade` aprovado.
- [ ] Teste em fork com estado real do proxy.
- [ ] Teste em testnet com governança ativa.
- [ ] Verificação de código-fonte no explorador.
- [ ] `Allo.owner()`, `Registry.ALLO_OWNER` e `ProxyAdmin.owner()` transferidos para o timelock.
