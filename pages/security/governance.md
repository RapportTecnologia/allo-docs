# Governança Multisig + Timelock

Para eliminar o risco de uma única EOA controlar o protocolo, o branch `refatoracao-gof-revisao-multisig-dao` introduz uma camada de governança on-chain composta por um **timelock de 48h** e uma **wallet M-of-N**.

## Contratos

### `AlloTimelockController`

Herda do `TimelockController` auditado da OpenZeppelin e fixa um delay mínimo de `2 days` (48h). É o único detentor dos papéis administrativos de:

* `Allo.owner()`
* `Registry.ALLO_OWNER`
* `ProxyAdmin.owner()`

### `AlloMultisigWallet`

Wallet M-of-N que é o único endereço com as roles `PROPOSER_ROLE`, `EXECUTOR_ROLE` e `CANCELLER_ROLE` no timelock. Ela implementa:

* Submissão de transações
* Confirmação e revogação de confirmações
* Execução apenas após atingir `threshold`
* Cancelamento de transações
* Gerenciamento interno de signers e threshold

## Hierarquia

```text
Signers (M-of-N)
   │
   ▼
AlloMultisigWallet
   │
   ▼
AlloTimelockController
   │
   ├─ Allo.owner()
   ├─ Registry.ALLO_OWNER
   └─ ProxyAdmin.owner()
```

## Scripts

Os scripts em `scripts/governance/` automatizam o fluxo sem expor chaves privadas:

| Script | Propósito |
|---|---|
| `deployGovernance.ts` | Cria timelock + multisig e configura roles. |
| `transferOwnershipToGovernance.ts` | Transfere `Allo`, `Registry` e `ProxyAdmin` para o timelock. |
| `proposeAdminCall.ts` | Agenda uma chamada administrativa via multisig + timelock. |
| `confirmProposal.ts` | Confirma uma transação do multisig. |
| `executeProposal.ts` | Executa uma transação após threshold e delay. |
| `upgradeAlloViaGovernance.ts` | Prepara upgrade de Allo via `ProxyAdmin.upgradeAndCall`. |

As chaves são lidas apenas das variáveis de ambiente `GOV_SIGNER_PRIVATE_KEY` ou `DEPLOYER_PRIVATE_KEY`; nunca de argumentos de linha de comando.

## Uso resumido

```bash
# 1. Deploy da governança
GOV_SIGNERS=0x...,0x...,0x... GOV_THRESHOLD=2 GOV_MIN_DELAY=172800 \
GOV_SIGNER_PRIVATE_KEY=0x... \
  npx hardhat run scripts/governance/deployGovernance.ts --network sepolia

# 2. Transferir ownership
GOV_SIGNER_PRIVATE_KEY=0x... \
  npx hardhat run scripts/governance/transferOwnershipToGovernance.ts --network sepolia

# 3. Propor uma ação
PROPOSAL_TARGET=0xAlloProxy PROPOSAL_DATA=0x... PROPOSAL_DELAY=172800 \
GOV_SIGNER_PRIVATE_KEY=0x... \
  npx hardhat run scripts/governance/proposeAdminCall.ts --network sepolia

# 4. Confirmar e executar após 48h
PROPOSAL_TX_ID=0 GOV_SIGNER_PRIVATE_KEY=0x... \
  npx hardhat run scripts/governance/confirmProposal.ts --network sepolia

PROPOSAL_TX_ID=0 GOV_SIGNER_PRIVATE_KEY=0x... \
  npx hardhat run scripts/governance/executeProposal.ts --network sepolia
```

O tutorial completo está em `docs/governance-tutorial.md` no repositório de contratos.
