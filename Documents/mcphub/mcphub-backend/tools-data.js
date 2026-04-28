/**
 * MCPHub — In-memory tools database
 * Each tool has a machine-readable description_agent designed to give
 * AI agents the exact schema they need to call the tool correctly.
 */

const tools = [
  {
    id: "web-scraper-pro",
    name: "Web Scraper Pro",
    category: "data",
    description_human: "Extract data from any website easily",
    description_agent:
      "Extracts structured JSON from any public URL with optional CSS selector targeting. " +
      "Input: {url: string (required, full URL including https://), selector: string (optional, CSS selector to target specific elements)}. " +
      "Output: {data: array of strings, status: 'success'|'error', items_found: number}. " +
      "Avg response: 800ms. Rate limit: 100 calls/min. " +
      "Use this when you need to pull text, links, or structured content from a webpage.",
    price_per_call: 0.002,
    parameters: {
      url: { type: "string", required: true, description: "Target URL to scrape (must include protocol, e.g. https://)" },
      selector: { type: "string", required: false, description: "CSS selector to target specific elements (e.g. 'h1', '.price', '#content')" }
    },
    output_schema: {
      data: "array of extracted strings or objects",
      status: "success | error",
      items_found: "number of items extracted"
    },
    example_call: {
      input: { url: "https://example.com", selector: "h1" },
      output: { data: ["Example Domain"], status: "success", items_found: 1 }
    },
    fake_response: (params) => ({
      data: [`Content from ${params.url}`, "Second extracted item", "Third extracted item"],
      status: "success",
      items_found: 3
    }),
    stats: { calls_today: 34200, avg_latency_ms: 800, uptime_percent: 99.9 },
    badge: "hot"
  },

  {
    id: "email-sender",
    name: "Email Sender",
    category: "communication",
    description_human: "Send emails programmatically",
    description_agent:
      "Sends transactional or bulk emails via SMTP with open and click tracking. " +
      "Input: {to: string (required, recipient email address), subject: string (required, email subject line), body: string (required, plain text or HTML body), from: string (optional, sender name, defaults to 'MCPHub Mailer'), reply_to: string (optional)}. " +
      "Output: {message_id: string, status: 'sent'|'failed', delivered_to: string, timestamp: string}. " +
      "Avg response: 320ms. Rate limit: 100 calls/min. " +
      "Use this when you need to send notifications, confirmations, or automated emails.",
    price_per_call: 0.001,
    parameters: {
      to: { type: "string", required: true, description: "Recipient email address" },
      subject: { type: "string", required: true, description: "Email subject line" },
      body: { type: "string", required: true, description: "Email body (plain text or HTML)" },
      from: { type: "string", required: false, description: "Sender display name (default: MCPHub Mailer)" },
      reply_to: { type: "string", required: false, description: "Reply-to email address" }
    },
    output_schema: {
      message_id: "unique message identifier string",
      status: "sent | failed",
      delivered_to: "recipient email address",
      timestamp: "ISO 8601 timestamp of send time"
    },
    example_call: {
      input: { to: "user@example.com", subject: "Hello from MCPHub", body: "Your order has shipped!" },
      output: { message_id: "msg_7f3k2m9x", status: "sent", delivered_to: "user@example.com", timestamp: "2025-04-27T10:23:11Z" }
    },
    fake_response: (params) => ({
      message_id: `msg_${Math.random().toString(36).slice(2, 10)}`,
      status: "sent",
      delivered_to: params.to,
      timestamp: new Date().toISOString()
    }),
    stats: { calls_today: 28100, avg_latency_ms: 320, uptime_percent: 99.8 },
    badge: "new"
  },

  {
    id: "credit-checker",
    name: "Credit Checker",
    category: "finance",
    description_human: "Instant credit score lookup",
    description_agent:
      "Returns a real-time credit score and summary via aggregated bureau data (Equifax, Experian, TransUnion). " +
      "Input: {full_name: string (required, first and last name), ssn_last4: string (required, last 4 digits of SSN as string), dob: string (required, date of birth in YYYY-MM-DD format)}. " +
      "Output: {score: number (300-850), rating: string, open_accounts: number, derogatory_marks: number, total_debt_usd: number, report_id: string}. " +
      "Avg response: 1200ms. Rate limit: 50 calls/min. " +
      "Use this for loan pre-qualification, rental applications, or risk assessment workflows.",
    price_per_call: 0.005,
    parameters: {
      full_name: { type: "string", required: true, description: "Full legal name (first and last)" },
      ssn_last4: { type: "string", required: true, description: "Last 4 digits of Social Security Number" },
      dob: { type: "string", required: true, description: "Date of birth in YYYY-MM-DD format" }
    },
    output_schema: {
      score: "credit score number between 300 and 850",
      rating: "Excellent | Good | Fair | Poor",
      open_accounts: "number of open credit accounts",
      derogatory_marks: "number of negative marks",
      total_debt_usd: "total outstanding debt in USD",
      report_id: "unique report identifier string"
    },
    example_call: {
      input: { full_name: "Jane Doe", ssn_last4: "4321", dob: "1990-06-15" },
      output: { score: 742, rating: "Good", open_accounts: 5, derogatory_marks: 0, total_debt_usd: 14820, report_id: "rpt_abc123" }
    },
    fake_response: (params) => ({
      score: Math.floor(Math.random() * 200) + 620,
      rating: "Good",
      open_accounts: Math.floor(Math.random() * 8) + 2,
      derogatory_marks: 0,
      total_debt_usd: Math.floor(Math.random() * 40000) + 5000,
      report_id: `rpt_${Math.random().toString(36).slice(2, 10)}`
    }),
    stats: { calls_today: 12400, avg_latency_ms: 1200, uptime_percent: 99.7 },
    badge: "pro"
  },

  {
    id: "translator-ai",
    name: "Translator AI",
    category: "ai",
    description_human: "Translate text to 50+ languages",
    description_agent:
      "Translates text between 50+ languages with cultural context awareness using neural machine translation. " +
      "Input: {text: string (required, text to translate, max 5000 chars), target_language: string (required, ISO 639-1 code e.g. 'es', 'fr', 'zh', 'ar'), source_language: string (optional, auto-detected if omitted)}. " +
      "Output: {translated_text: string, source_language: string, target_language: string, confidence: number (0-1), character_count: number}. " +
      "Avg response: 280ms. Rate limit: 100 calls/min. " +
      "Supports: es, fr, de, it, pt, zh, ja, ko, ar, ru, hi, and 40+ more.",
    price_per_call: 0.001,
    parameters: {
      text: { type: "string", required: true, description: "Text to translate (max 5000 characters)" },
      target_language: { type: "string", required: true, description: "Target language as ISO 639-1 code (e.g. 'es' for Spanish, 'fr' for French, 'zh' for Chinese)" },
      source_language: { type: "string", required: false, description: "Source language ISO 639-1 code (auto-detected if omitted)" }
    },
    output_schema: {
      translated_text: "translated string in target language",
      source_language: "detected or specified source language code",
      target_language: "target language code",
      confidence: "translation confidence score 0.0 to 1.0",
      character_count: "number of characters translated"
    },
    example_call: {
      input: { text: "Hello, how are you?", target_language: "es" },
      output: { translated_text: "Hola, ¿cómo estás?", source_language: "en", target_language: "es", confidence: 0.99, character_count: 19 }
    },
    fake_response: (params) => ({
      translated_text: `[Translated to ${params.target_language}]: ${params.text}`,
      source_language: params.source_language || "en",
      target_language: params.target_language,
      confidence: 0.97,
      character_count: params.text ? params.text.length : 0
    }),
    stats: { calls_today: 19800, avg_latency_ms: 280, uptime_percent: 99.95 },
    badge: "new"
  },

  {
    id: "market-data",
    name: "Market Data",
    category: "finance",
    description_human: "Real-time stock prices and financial data",
    description_agent:
      "Returns real-time and historical stock prices, options chains, and earnings data from NYSE, NASDAQ, and global exchanges. " +
      "Input: {ticker: string (required, stock ticker symbol e.g. 'AAPL', 'TSLA', 'MSFT'), period: string (optional, '1d'|'5d'|'1mo'|'3mo'|'1y', defaults to '1d')}. " +
      "Output: {ticker: string, price: number, change: number, change_percent: number, volume: number, market_cap: number, high_52w: number, low_52w: number, history: array of {date, close} objects}. " +
      "Avg response: 95ms. Rate limit: 100 calls/min. " +
      "Use this for portfolio tracking, investment research, or financial reporting workflows.",
    price_per_call: 0.003,
    parameters: {
      ticker: { type: "string", required: true, description: "Stock ticker symbol (e.g. AAPL, TSLA, GOOGL, BTC-USD)" },
      period: { type: "string", required: false, description: "Historical period: '1d' | '5d' | '1mo' | '3mo' | '1y' (default: '1d')" }
    },
    output_schema: {
      ticker: "ticker symbol string",
      price: "current price in USD",
      change: "price change from previous close",
      change_percent: "percentage change from previous close",
      volume: "trading volume today",
      market_cap: "total market capitalization in USD",
      high_52w: "52-week high price",
      low_52w: "52-week low price",
      history: "array of {date: string, close: number} for requested period"
    },
    example_call: {
      input: { ticker: "AAPL", period: "1d" },
      output: { ticker: "AAPL", price: 189.30, change: 2.14, change_percent: 1.14, volume: 54200000, market_cap: 2930000000000, high_52w: 199.62, low_52w: 164.08, history: [{ date: "2025-04-27", close: 189.30 }] }
    },
    fake_response: (params) => {
      const price = (Math.random() * 400 + 50).toFixed(2);
      return {
        ticker: params.ticker ? params.ticker.toUpperCase() : "AAPL",
        price: parseFloat(price),
        change: parseFloat((Math.random() * 10 - 5).toFixed(2)),
        change_percent: parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
        volume: Math.floor(Math.random() * 80000000) + 5000000,
        market_cap: Math.floor(Math.random() * 2000000000000) + 50000000000,
        high_52w: parseFloat((parseFloat(price) * 1.3).toFixed(2)),
        low_52w: parseFloat((parseFloat(price) * 0.7).toFixed(2)),
        history: [{ date: new Date().toISOString().split("T")[0], close: parseFloat(price) }]
      };
    },
    stats: { calls_today: 41200, avg_latency_ms: 95, uptime_percent: 99.99 },
    badge: "hot"
  },

  {
    id: "property-lookup",
    name: "Property Lookup",
    category: "data",
    description_human: "Real estate property data and records",
    description_agent:
      "Returns property records, ownership history, tax assessments, and real estate comps for any US address. " +
      "Input: {address: string (required, full street address), zip_code: string (required, 5-digit US ZIP code)}. " +
      "Output: {property_id: string, address: string, owner_name: string, assessed_value_usd: number, last_sale_price: number, last_sale_date: string, bedrooms: number, bathrooms: number, sq_ft: number, year_built: number, zestimate_usd: number}. " +
      "Avg response: 650ms. Rate limit: 100 calls/min. " +
      "Use for real estate research, mortgage pre-qualification, or property due diligence.",
    price_per_call: 0.004,
    parameters: {
      address: { type: "string", required: true, description: "Full street address (e.g. '123 Main St')" },
      zip_code: { type: "string", required: true, description: "5-digit US ZIP code" }
    },
    output_schema: {
      property_id: "unique property identifier",
      address: "normalized full address string",
      owner_name: "current owner full name",
      assessed_value_usd: "tax assessed value in USD",
      last_sale_price: "price of last recorded sale in USD",
      last_sale_date: "date of last sale in YYYY-MM-DD",
      bedrooms: "number of bedrooms",
      bathrooms: "number of bathrooms",
      sq_ft: "total square footage",
      year_built: "year the property was built",
      zestimate_usd: "estimated current market value in USD"
    },
    example_call: {
      input: { address: "123 Main St", zip_code: "90210" },
      output: { property_id: "prop_9x1r4p", address: "123 Main St, Beverly Hills, CA 90210", owner_name: "John Smith", assessed_value_usd: 1200000, last_sale_price: 1450000, last_sale_date: "2021-08-12", bedrooms: 4, bathrooms: 3, sq_ft: 2800, year_built: 1998, zestimate_usd: 1620000 }
    },
    fake_response: (params) => ({
      property_id: `prop_${Math.random().toString(36).slice(2, 8)}`,
      address: `${params.address}, ZIP ${params.zip_code}`,
      owner_name: "Sarah Johnson",
      assessed_value_usd: Math.floor(Math.random() * 800000) + 200000,
      last_sale_price: Math.floor(Math.random() * 900000) + 250000,
      last_sale_date: "2022-03-14",
      bedrooms: Math.floor(Math.random() * 4) + 2,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      sq_ft: Math.floor(Math.random() * 2000) + 1000,
      year_built: Math.floor(Math.random() * 60) + 1960,
      zestimate_usd: Math.floor(Math.random() * 1000000) + 300000
    }),
    stats: { calls_today: 8900, avg_latency_ms: 650, uptime_percent: 99.6 },
    badge: "pro"
  },

  {
    id: "gpt-wrapper",
    name: "GPT Wrapper",
    category: "ai",
    description_human: "Optimized LLM calls with caching and fallbacks",
    description_agent:
      "Executes optimized GPT-4o calls with automatic caching (saves ~40% cost on repeated prompts), model fallbacks, and usage controls. " +
      "Input: {prompt: string (required, the user or system prompt), max_tokens: number (optional, max output tokens, default 512, max 4096), temperature: number (optional, 0.0-2.0, default 0.7), model: string (optional, 'gpt-4o'|'gpt-4o-mini'|'gpt-3.5-turbo', default 'gpt-4o-mini')}. " +
      "Output: {response: string, model_used: string, prompt_tokens: number, completion_tokens: number, total_tokens: number, cached: boolean, cost_usd: number}. " +
      "Avg response: 1400ms (uncached), 80ms (cached). Rate limit: 100 calls/min. " +
      "Use this when you need to run LLM inference without managing your own API keys or rate limits.",
    price_per_call: 0.008,
    parameters: {
      prompt: { type: "string", required: true, description: "The prompt to send to the model" },
      max_tokens: { type: "number", required: false, description: "Maximum number of tokens to generate (default: 512, max: 4096)" },
      temperature: { type: "number", required: false, description: "Sampling temperature 0.0 to 2.0 (default: 0.7)" },
      model: { type: "string", required: false, description: "Model to use: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo' (default: gpt-4o-mini)" }
    },
    output_schema: {
      response: "generated text string from the model",
      model_used: "actual model that processed the request",
      prompt_tokens: "number of tokens in the input prompt",
      completion_tokens: "number of tokens in the generated response",
      total_tokens: "total tokens used",
      cached: "boolean, true if response was served from cache",
      cost_usd: "cost of this call in USD"
    },
    example_call: {
      input: { prompt: "Summarize quantum computing in 2 sentences.", max_tokens: 100 },
      output: { response: "Quantum computing uses quantum mechanical phenomena like superposition and entanglement to process information in ways classical computers cannot. It promises exponential speedups for specific problems like cryptography, drug discovery, and optimization.", model_used: "gpt-4o-mini", prompt_tokens: 12, completion_tokens: 38, total_tokens: 50, cached: false, cost_usd: 0.008 }
    },
    fake_response: (params) => ({
      response: `This is a simulated GPT response to: "${params.prompt ? params.prompt.slice(0, 60) : "your prompt"}..."`,
      model_used: params.model || "gpt-4o-mini",
      prompt_tokens: params.prompt ? Math.floor(params.prompt.length / 4) : 10,
      completion_tokens: params.max_tokens ? Math.floor(params.max_tokens * 0.6) : 80,
      total_tokens: params.prompt ? Math.floor(params.prompt.length / 4) + 80 : 90,
      cached: false,
      cost_usd: 0.008
    }),
    stats: { calls_today: 22100, avg_latency_ms: 1400, uptime_percent: 99.85 },
    badge: "hot"
  },

  {
    id: "kyc-verify",
    name: "KYC Verify",
    category: "finance",
    description_human: "Identity verification with AML screening",
    description_agent:
      "Performs KYC (Know Your Customer) identity verification with liveness detection, document OCR, and AML/sanctions screening. " +
      "Input: {full_name: string (required), id_number: string (required, passport or driver license number), country: string (required, ISO 3166-1 alpha-2 code e.g. 'US', 'GB', 'DE'), id_type: string (optional, 'passport'|'drivers_license'|'national_id', default 'passport')}. " +
      "Output: {verified: boolean, risk_level: string, aml_clear: boolean, watchlist_match: boolean, verification_id: string, checks_passed: array, timestamp: string}. " +
      "Avg response: 2100ms. Rate limit: 30 calls/min. " +
      "Required for financial onboarding, crypto exchanges, and regulated industry workflows.",
    price_per_call: 0.010,
    parameters: {
      full_name: { type: "string", required: true, description: "Full legal name as it appears on the ID document" },
      id_number: { type: "string", required: true, description: "Passport or driver's license number" },
      country: { type: "string", required: true, description: "ISO 3166-1 alpha-2 country code (e.g. US, GB, DE, AU)" },
      id_type: { type: "string", required: false, description: "Document type: 'passport' | 'drivers_license' | 'national_id' (default: passport)" }
    },
    output_schema: {
      verified: "boolean, true if identity confirmed",
      risk_level: "low | medium | high",
      aml_clear: "boolean, true if no AML matches found",
      watchlist_match: "boolean, true if name appears on sanctions lists",
      verification_id: "unique verification record ID",
      checks_passed: "array of check names that passed",
      timestamp: "ISO 8601 timestamp of verification"
    },
    example_call: {
      input: { full_name: "Alice Brown", id_number: "P123456789", country: "US", id_type: "passport" },
      output: { verified: true, risk_level: "low", aml_clear: true, watchlist_match: false, verification_id: "kyc_2b8n5q", checks_passed: ["document_valid", "name_match", "aml_screen", "sanctions_check"], timestamp: "2025-04-27T10:23:11Z" }
    },
    fake_response: (params) => ({
      verified: true,
      risk_level: "low",
      aml_clear: true,
      watchlist_match: false,
      verification_id: `kyc_${Math.random().toString(36).slice(2, 8)}`,
      checks_passed: ["document_valid", "name_match", "aml_screen", "sanctions_check"],
      timestamp: new Date().toISOString()
    }),
    stats: { calls_today: 6300, avg_latency_ms: 2100, uptime_percent: 99.5 },
    badge: "pro"
  }
];

// Safe export — strip fake_response function before sending to clients
function sanitizeTool(tool) {
  const { fake_response, ...safe } = tool;
  return safe;
}

module.exports = { tools, sanitizeTool };
