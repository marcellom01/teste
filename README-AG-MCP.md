# Workflow AG MCP - Gerador Automático de Reportagens

## Descrição
O workflow "AG MCP" é um sistema automatizado que recebe o ID de uma notícia via webhook, busca o texto da reportagem no banco MySQL, analisa o conteúdo usando IA para identificar diferentes ganchos jornalísticos e gera múltiplas novas reportagens baseadas no texto original.

## Arquitetura do Fluxo

```
Webhook (POST) → MySQL Query → Análise IA → Processamento → Geração IA → Formatação → Resposta
```

## Nós do Workflow

### 1. **Webhook Receber ID**
- **Tipo**: `n8n-nodes-base.webhook`
- **Método**: POST
- **Path**: `/ag-mcp`
- **Função**: Recebe o `id_noticia` no body da requisição

### 2. **Buscar Reportagem**
- **Tipo**: `n8n-nodes-base.mySql`
- **Operação**: Execute SQL
- **Query**: `SELECT texto FROM noticias WHERE id = {{ $json.id_noticia }}`
- **Função**: Busca o texto da reportagem no banco de dados

### 3. **Analisar como Editor**
- **Tipo**: `@n8n/n8n-nodes-langchain.openAi`
- **Modelo**: GPT-4
- **Função**: Analisa o texto como um editor experiente de jornal, identificando ganchos jornalísticos

### 4. **Processar Ganchos**
- **Tipo**: `n8n-nodes-base.code`
- **Função**: Processa a resposta da IA e cria itens individuais para cada gancho identificado

### 5. **Gerar Novas Reportagens**
- **Tipo**: `@n8n/n8n-nodes-langchain.openAi`
- **Modelo**: GPT-4
- **Função**: Gera novas reportagens completas baseadas em cada gancho identificado

### 6. **Formatar Resultado Final**
- **Tipo**: `n8n-nodes-base.code`
- **Função**: Consolida todas as reportagens geradas em um formato estruturado

### 7. **Resposta Final**
- **Tipo**: `n8n-nodes-base.respondToWebhook`
- **Função**: Retorna o resultado final via webhook

## Como Usar

### 1. Pré-requisitos
- Instância n8n configurada
- Banco MySQL com tabela `noticias` contendo campos `id` e `texto`
- Credenciais OpenAI configuradas no n8n
- Credenciais MySQL configuradas no n8n

### 2. Importar o Workflow
1. Copie o conteúdo do arquivo `workflow-ag-mcp.json`
2. No n8n, vá em "Import from JSON"
3. Cole o conteúdo e importe

### 3. Configurar Credenciais
- Configure as credenciais MySQL para o nó "Buscar Reportagem"
- Configure as credenciais OpenAI para os nós de IA

### 4. Ativar o Workflow
- Ative o workflow no n8n
- O webhook estará disponível em: `https://seu-n8n.com/webhook/ag-mcp`

### 5. Fazer Requisição
```bash
curl -X POST https://seu-n8n.com/webhook/ag-mcp \
  -H "Content-Type: application/json" \
  -d '{"id_noticia": 123}'
```

## Formato da Resposta

```json
{
  "workflow": "AG MCP",
  "total_reportagens_geradas": 3,
  "reportagens": [
    {
      "gancho_id": 1,
      "gancho_original": "Impacto econômico da decisão",
      "angulo": "Análise dos efeitos no mercado local",
      "publico_alvo": "Empresários e investidores",
      "reportagem_gerada": "Título: ...\n\nLead: ...\n\nDesenvolvimento: ...",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "processado_em": "2024-01-15T10:30:00.000Z"
}
```

## Estrutura do Banco de Dados

```sql
CREATE TABLE noticias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  texto TEXT NOT NULL,
  titulo VARCHAR(255),
  data_publicacao DATETIME,
  autor VARCHAR(100)
);
```

## Funcionalidades

### Análise Inteligente
- Identifica múltiplos ganchos jornalísticos no texto original
- Determina ângulos específicos para cada nova reportagem
- Define público-alvo apropriado para cada abordagem

### Geração Automática
- Cria reportagens completas com título, lead e desenvolvimento
- Mantém qualidade jornalística profissional
- Gera entre 300-500 palavras por reportagem

### Tratamento de Erros
- Sistema robusto de fallback em caso de falha na análise
- Processamento resiliente de respostas da IA
- Logs detalhados para debugging

## Personalização

### Modificar Prompts da IA
Edite os prompts nos nós OpenAI para ajustar:
- Estilo de análise
- Tipo de ganchos identificados
- Formato das reportagens geradas
- Tom e linguagem

### Ajustar Query do Banco
Modifique a query SQL para:
- Incluir campos adicionais
- Filtrar por critérios específicos
- Juntar com outras tabelas

### Customizar Resposta
Altere o nó "Formatar Resultado Final" para:
- Incluir metadados adicionais
- Modificar estrutura de saída
- Adicionar validações

## Monitoramento

- Acompanhe execuções no painel do n8n
- Monitore logs de erro para debugging
- Analise métricas de performance e qualidade

## Suporte

Para dúvidas ou problemas:
1. Verifique logs de execução no n8n
2. Confirme configuração das credenciais
3. Teste conectividade com banco e OpenAI
4. Valide estrutura da tabela de notícias
