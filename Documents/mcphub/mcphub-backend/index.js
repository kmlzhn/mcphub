/**
 * MCPHub — REST API Server
 * Port 3000 | All endpoints designed for AI agent consumption
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const { tools, sanitizeTool } = require("./tools-data");

const app = express();
const PORT = process.env.PORT || 3000;
const VALID_API_KEY = process.env.API_KEY || "demo-key-123";

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logger — every request is visible in console
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}${
    Object.keys(req.query).length ? " query=" + JSON.stringify(req.query) : ""
  }`);
  next();
});

// Global response headers — agent-friendly
app.use((_req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Platform", "MCPHub");
  res.setHeader("X-Agent-Guide", "https://mcphub.com/llms.txt");
  next();
});

// ── Auth middleware (for protected routes) ────────────────────────────────────
function requireApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key) {
    return res.status(401).json({
      error: "Missing API key",
      message: "Add the header 'X-API-Key: YOUR_KEY' to authenticate.",
      get_key: "https://mcphub.com/signup",
      docs: "GET /llms.txt for full usage guide"
    });
  }
  if (key !== VALID_API_KEY) {
    return res.status(401).json({
      error: "Invalid API key",
      message: `The key '${key}' is not valid. Use 'demo-key-123' for testing.`,
      get_key: "https://mcphub.com/signup"
    });
  }
  next();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function callId() {
  return "call_" + crypto.randomBytes(4).toString("hex");
}

function simulateLatency(tool) {
  // Slightly randomize around the tool's stated avg
  const base = tool.stats.avg_latency_ms;
  return Math.floor(base * (0.8 + Math.random() * 0.4));
}

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC DISCOVERY ENDPOINTS (no auth)
// ══════════════════════════════════════════════════════════════════════════════

// GET / — Platform overview, first stop for any agent
app.get("/", (req, res) => {
  res.json({
    platform: "MCPHub",
    description: "Tool marketplace for AI agents. Discover and call developer-built tools via REST or MCP protocol.",
    version: "1.0",
    total_tools: tools.length,
    docs: "https://mcphub.com/llms.txt",
    agent_guide: `${req.protocol}://${req.get("host")}/llms.txt`,
    endpoints: {
      platform_info:  "GET /",
      agent_guide:    "GET /llms.txt",
      list_tools:     "GET /api/tools",
      filter_tools:   "GET /api/tools?category=finance&sort=calls",
      search_tools:   "GET /api/tools/search?q=email",
      get_tool:       "GET /api/tools/:id",
      call_tool:      "POST /api/tools/:id/call  [requires X-API-Key header]",
      key_info:       "GET /api/keys/me          [requires X-API-Key header]"
    },
    auth: {
      method: "Header",
      header: "X-API-Key",
      demo_key: "demo-key-123",
      note: "Use demo-key-123 for testing all endpoints"
    },
    mcp_server: {
      description: "Native MCP protocol access for MCP-compatible agents",
      host: "localhost",
      port: 3001,
      sse_endpoint: "http://localhost:3001/sse"
    }
  });
});

// GET /llms.txt — Machine-readable guide for AI agents
app.get("/llms.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.sendFile(path.join(__dirname, "llms.txt"));
});

// GET /robots.txt — Let agents know what's crawlable
app.get("/robots.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send("User-agent: *\nAllow: /api/\nAllow: /llms.txt\nAllow: /\n");
});

// GET /api/tools — Full tool catalog with optional filters
app.get("/api/tools", (req, res) => {
  let result = tools.map(sanitizeTool);

  // Filter by category
  if (req.query.category) {
    const cat = req.query.category.toLowerCase();
    result = result.filter(t => t.category === cat);
    if (result.length === 0) {
      return res.status(404).json({
        error: "No tools found",
        message: `No tools in category '${cat}'.`,
        available_categories: ["data", "communication", "finance", "ai"],
        suggestion: "Try GET /api/tools without ?category to see all tools."
      });
    }
  }

  // Sort by calls_today descending
  if (req.query.sort === "calls") {
    result.sort((a, b) => b.stats.calls_today - a.stats.calls_today);
  }

  res.json({
    total: result.length,
    tools: result,
    next_step: "Call any tool via POST /api/tools/:id/call with header X-API-Key: demo-key-123"
  });
});

// GET /api/tools/search?q= — Semantic name + description search
app.get("/api/tools/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();

  if (!q) {
    return res.status(400).json({
      error: "Missing query",
      message: "Provide a search term: GET /api/tools/search?q=email",
      example: "/api/tools/search?q=translate"
    });
  }

  const matches = tools
    .map(sanitizeTool)
    .filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description_agent.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );

  res.json({
    query: q,
    total: matches.length,
    tools: matches,
    tip: matches.length === 0
      ? "No matches. Try broader terms like 'email', 'finance', 'translate', or 'scrape'."
      : `Found ${matches.length} tool(s). Use GET /api/tools/:id for full details on any tool.`
  });
});

// GET /api/tools/:id — Full single tool details
app.get("/api/tools/:id", (req, res) => {
  const tool = tools.find(t => t.id === req.params.id);

  if (!tool) {
    return res.status(404).json({
      error: "Tool not found",
      message: `No tool with id '${req.params.id}'.`,
      suggestion: "GET /api/tools to see all available tool IDs."
    });
  }

  res.json({
    ...sanitizeTool(tool),
    how_to_call: {
      method: "POST",
      url: `/api/tools/${tool.id}/call`,
      headers: { "X-API-Key": "demo-key-123", "Content-Type": "application/json" },
      body: tool.example_call.input
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATED ENDPOINTS (require X-API-Key)
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/tools/:id/call — Execute a tool call
app.post("/api/tools/:id/call", requireApiKey, (req, res) => {
  const tool = tools.find(t => t.id === req.params.id);

  if (!tool) {
    return res.status(404).json({
      error: "Tool not found",
      message: `No tool with id '${req.params.id}'.`,
      suggestion: "GET /api/tools to list all available tool IDs."
    });
  }

  const body = req.body || {};

  // Validate required parameters
  const missing = [];
  for (const [paramName, paramDef] of Object.entries(tool.parameters)) {
    if (paramDef.required && (body[paramName] === undefined || body[paramName] === "")) {
      missing.push({
        parameter: paramName,
        type: paramDef.type,
        description: paramDef.description
      });
    }
  }

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required parameters",
      missing_parameters: missing,
      example_body: tool.example_call.input,
      tip: `Send all required fields as JSON in the request body.`
    });
  }

  // Simulate realistic result using the tool's fake_response function
  const result = tool.fake_response(body);
  const duration = simulateLatency(tool);

  res.json({
    tool_id: tool.id,
    tool_name: tool.name,
    status: "success",
    result,
    usage: {
      call_id: callId(),
      duration_ms: duration,
      cost_usd: tool.price_per_call,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /api/keys/me — API key info & balance
app.get("/api/keys/me", requireApiKey, (req, res) => {
  res.json({
    key_id: req.headers["x-api-key"],
    plan: "pro",
    calls_today: 142,
    calls_this_month: 4821,
    calls_limit_day: 100000,
    calls_limit_month: 3000000,
    balance_usd: 48.50,
    billing_email: "alex@acme.dev",
    created_at: "2025-01-15T09:00:00Z",
    next_billing_date: "2025-05-01",
    tip: "GET /api/tools to browse available tools."
  });
});

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
    message: "This endpoint does not exist.",
    suggestion: "GET / to see all available endpoints."
  });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✦ MCPHub REST API running on http://localhost:${PORT}`);
  console.log(`  ✦ Agent guide:  http://localhost:${PORT}/llms.txt`);
  console.log(`  ✦ Tool catalog: http://localhost:${PORT}/api/tools`);
  console.log(`  ✦ Demo API key: demo-key-123\n`);
});

module.exports = app;
