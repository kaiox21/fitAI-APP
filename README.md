# FitAI — App de Fitness com Inteligência Artificial

> App mobile-first de fitness onde IA generativa é o motor principal — não uma feature adicional.
> Construído com React 19, Supabase e Gemini 2.5 Flash.

🔗 **[Acesse o app em produção](https://fit-ai-app-omega.vercel.app)**

![Image](https://github.com/user-attachments/assets/8491ce66-1d2a-480b-b944-68c0c92883ec)

## Sobre o projeto

O FitAI nasceu como um projeto pessoal para resolver um problema real: acompanhar alimentação e treinos de forma inteligente, sem a burocracia dos apps tradicionais.

A proposta central é usar IA em pontos críticos do fluxo — não como feature decorativa, mas como motor do produto:

- **Foto → Macros**: o usuário tira uma foto do prato e a IA identifica o alimento e estima calorias, proteínas, carboidratos e gorduras
- **Treino → Calorias**: após registrar séries, repetições e peso de cada exercício, a IA calcula as calorias queimadas com base no volume e intensidade real do treino
- **Cardio inteligente**: tempo e velocidade do cardio são considerados no cálculo total

## Stack tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Vite 5 |
| Estilização | Tailwind CSS |
| Roteamento | React Router v7 |
| Backend / Auth | Supabase (PostgreSQL + RLS) |
| IA | Google Gemini 2.5 Flash |
| Deploy | Vercel |
| Mobile | PWA (instalável) |

---

## Funcionalidades

### Alimentação
- Análise de alimento por foto via IA
- Registro de refeições por tipo (café, almoço, jantar, lanche)
- Acompanhamento de macronutrientes (proteína, carbs, gordura)
- Histórico completo com exclusão de registros
  
![Image](https://github.com/user-attachments/assets/2202ab93-17ec-4b5f-8ddc-693eea12842d)

### Treinos
- Plano semanal com 4 treinos (A/B/C/D)
- Registro de séries, repetições e carga por exercício
- Cardio com tempo e velocidade
- Cálculo de calorias queimadas via IA
- Feedback motivacional pós-treino
  
![Image](https://github.com/user-attachments/assets/8af8696e-1ab8-45b8-ad1f-636395ad1cb8)

### Métricas
- Cálculo de TMB (Taxa Metabólica Basal) via Harris-Benedict
- TDEE personalizado por nível de atividade
- Meta calórica ajustada por objetivo (emagrecer, ganhar massa, manter)
- Déficit/superávit calórico diário e semanal
- Gráfico de evolução de peso e medidas corporais
  
![Image](https://github.com/user-attachments/assets/176e9a4a-a6c0-4499-938e-3d8726c118c3)
[Image](https://github.com/user-attachments/assets/2201446b-a669-482e-aadc-27487c0e4c5a)
![Image](https://github.com/user-attachments/assets/4e594212-5d4a-427a-b568-b49fe5a54c5d)
![Image](https://github.com/user-attachments/assets/f1bd3783-4bd1-424a-813d-900b78be111e)

### Autenticação
- Cadastro e login com Supabase Auth
- Dados isolados por usuário via Row Level Security (RLS)
- Sessão persistente entre dispositivos
- 
[Image](https://github.com/user-attachments/assets/5a202724-dd92-4a49-880b-4031ad238535)


---

## Decisões técnicas

**Por que Gemini e não OpenAI?**
O Gemini 2.5 Flash tem tier gratuito generoso, suporta análise de imagem com excelente custo-benefício e a qualidade para identificação de alimentos é equivalente para o caso de uso.

**Por que Supabase?**
Auth + banco de dados + RLS em um único serviço. A Row Level Security garante que cada usuário acessa apenas seus próprios dados diretamente no banco, sem precisar de middleware.

**Por que PWA e não app nativo?**
O app roda no navegador e pode ser instalado na tela inicial do celular. Elimina o ciclo de aprovação das lojas e mantém o código único para todas as plataformas.

**Cálculo de calorias queimadas**
O card "Queimado" mostra o TDEE base (TMB × 1.2) — o que o corpo gasta só existindo. As calorias do treino são somadas separadamente no déficit real, refletindo o gasto total honesto do dia.

**Prompts estruturados para retorno confiável**
Os prompts enviados ao Gemini especificam retorno exclusivamente em JSON, sem texto livre. Isso elimina parsing frágil e garante consistência entre chamadas — é engenharia de contexto aplicada ao produto.

**Fallback quando a IA falha**
Se a chamada ao Gemini retornar erro, o app calcula as calorias por fórmula local (volume total × peso corporal) e registra o treino normalmente. O usuário nunca perde o dado por falha de API.

---

## Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/kaiox21/fitAI-APP.git
cd fitAI-APP

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Preencha VITE_GEMINI_API_KEY e VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# Rode o projeto
npm run dev
```

### Variáveis de ambiente necessárias

```env
VITE_GEMINI_API_KEY=        # Google AI Studio
VITE_SUPABASE_URL=          # Painel do Supabase → Settings → API
VITE_SUPABASE_ANON_KEY=     # Painel do Supabase → Settings → API
```

---

## Estrutura do projeto

```
src/
├── components/
│   └── BottomNav.jsx       # Navegação inferior
├── context/
│   └── AppContext.jsx       # Estado global + integração Supabase
├── lib/
│   └── supabase.js          # Cliente Supabase
└── pages/
    ├── Home.jsx             # Dashboard + análise de foto com IA
    ├── Workouts.jsx         # Treinos + cálculo de calorias com IA
    ├── Diary.jsx            # Histórico de refeições e treinos
    ├── Measures.jsx         # Medidas corporais
    ├── Profile.jsx          # Perfil e métricas calóricas
    ├── Register.jsx         # Cadastro em 3 etapas
    └── Login.jsx            # Autenticação
```

---

## Autor

**Kaio Xavier**
[LinkedIn](https://www.linkedin.com/public-profile/settings?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact-info%3By3x178ZoQeS%2BCjkykcrMKg%3D%3D) 

· [GitHub](https://github.com/kaiox21)
