/**
 * MCPHub — MCP Server
 * Port 3001 | Native MCP protocol access for MCP-compatible agents
 *
 * Transport: SSE (Server-Sent Events) over HTTP
 *   GET  /sse      → establishes the SSE stream
 *   POST /messages → agent sends MCP messages here
 *
 * Exposes 5 MCP tools:
 *   search_tools, get_tool_details, call_tool, list_categories, check_balance
 */

require("dotenv").config();
const http = require("http");
const express = require("express");
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
// Import the Zod schemas the SDK expects for setRequestHandler
const {
  ListToolsRequestSchema,
  CallToolRequestSchema
} = require(
  require.resolve("@modelcontextprotocol/sdk/server/index.js")
    .replace("/server/index.js", "/types.js")
);
const { tools, sanitizeTool } = require("./tools-data");
const crypto = require("crypto");

const MCP_PORT = process.env.MCP_PORT || 3001;
const VALID_API_KEY = process.env.API_KEY || "demo-key-123";

// ── Helpers ───────────────────────────────────────────────────────────────────

function ok(data) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}

function fail(message, hint) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({ error: message, hint: hint || null }, null, 2)
    }],
    isError: true
  };
}

function callId() {
  return "call_" + crypto.randomBytes(4).toString("hex");
}

// ── Build the MCP Server ──────────────────────────────────────────────────────

const mcpServer = new Server(
  {
    name: "MCPHub",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// ── List tools handler ────────────────────────────────────────────────────────

mcpServer.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [
      {
        name: "search_tools",
        description:
          "Search the MCPHub marketplace for tools by keyword. Returns matching tools with full agent-readable schemas, pricing, and example calls.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Keyword to search (e.g. 'email', 'credit', 'translate', 'scrape')"
            },
            category: {
              type: "string",
              description: "Optional: filter by category — 'data' | 'communication' | 'finance' | 'ai'"
            }
          },
          required: ["query"]
        }
      },
      {
        name: "get_tool_details",
        description:
          "Get the full specification for a specific MCPHub tool: parameters, output schema, example call, pricing, and live stats.",
        inputSchema: {
          type: "object",
          properties: {
            tool_id: {
              type: "string",
              description: "Tool ID (e.g. 'email-sender', 'market-data', 'kyc-verify'). Use search_tools to find IDs."
            }
          },
          required: ["tool_id"]
        }
      },
      {
        name: "call_tool",
        description:
          "Execute a tool from the MCPHub marketplace. Provide the tool_id, your api_key, and the tool's required parameters. Returns the tool output plus billing info.",
        inputSchema: {
          type: "object",
          properties: {
            tool_id: {
              type: "string",
              description: "ID of the tool to call (e.g. 'web-scraper-pro')"
            },
            parameters: {
              type: "object",
              description: "Tool input parameters as a JSON object. Use get_tool_details to see required fields."
            },
            api_key: {
              type: "string",
              description: "Your MCPHub API key. Demo key: demo-key-123"
            }
          },
          required: ["tool_id", "parameters", "api_key"]
        }
      },
      {
        name: "list_categories",
        description:
          "List all available tool categories on MCPHub with the count of tools in each category.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "check_balance",
        description:
          "Check your MCPHub API key balance, usage stats, and plan limits.",
        inputSchema: {
          type: "object",
          properties: {
            api_key: {
              type: "string",
              description: "Your MCPHub API key. Demo key: demo-key-123"
            }
          },
          required: ["api_key"]
        }
      }
    ]
  })
);

// ── Call tool handler ─────────────────────────────────────────────────────────

mcpServer.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {
    const { name, arguments: args = {} } = request.params;

    console.log(`[MCP] tools/call → ${name}`, args);

    // ── search_tools ──────────────────────────────────────────────────────────
    if (name === "search_tools") {
      const q = (args.query || "").toLowerCase().trim();
      const cat = (args.category || "").toLowerCase().trim();

      if (!q) return fail("query is required", "Provide a keyword like 'email' or 'finance'.");

      let matches = tools.map(sanitizeTool).filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description_agent.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );

      if (cat) matches = matches.filter(t => t.category === cat);

      return ok({
        query: args.query,
        category_filter: args.category || null,
        total_matches: matches.length,
        tools: matches,
        next_step: matches.length > 0
          ? `Use get_tool_details with tool_id to get full schema, then call_tool to execute.`
          : `No matches found. Try: list_categories to see available categories.`
      });
    }

    // ── get_tool_details ──────────────────────────────────────────────────────
    if (name === "get_tool_details") {
      const tool = tools.find(t => t.id === args.tool_id);
      if (!tool) {
        return fail(
          `Tool '${args.tool_id}' not found.`,
          "Use search_tools to find valid tool IDs."
        );
      }

      const safe = sanitizeTool(tool);
      return ok({
        ...safe,
        how_to_call: {
          mcp_tool: "call_tool",
          required_args: {
            tool_id: tool.id,
            parameters: tool.example_call.input,
            api_key: "demo-key-123"
          }
        }
      });
    }

    // ── call_tool ─────────────────────────────────────────────────────────────
    if (name === "call_tool") {
      if (args.api_key !== VALID_API_KEY) {
        return fail(
          "Invalid API key.",
          `Use api_key: "demo-key-123" for testing. Get a real key at https://mcphub.com/signup`
        );
      }

      const tool = tools.find(t => t.id === args.tool_id);
      if (!tool) {
        return fail(
          `Tool '${args.tool_id}' not found.`,
          "Use search_tools or list_categories to find valid tool IDs."
        );
      }

      const params = args.parameters || {};

      // Validate required parameters
      const missing = [];
      for (const [pName, pDef] of Object.entries(tool.parameters)) {
        if (pDef.required && (params[pName] === undefined || params[pName] === "")) {
          missing.push({ parameter: pName, type: pDef.type, description: pDef.description });
        }
      }

      if (missing.length > 0) {
        return fail(
          "Missing required parameters.",
          JSON.stringify({ missing_parameters: missing, example: tool.example_call.input })
        );
      }

      const result = tool.fake_response(params);
      const duration = Math.floor(tool.stats.avg_latency_ms * (0.8 + Math.random() * 0.4));

      return ok({
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
    }

    // ── list_categories ───────────────────────────────────────────────────────
    if (name === "list_categories") {
      const counts = {};
      for (const t of tools) {
        counts[t.category] = (counts[t.category] || 0) + 1;
      }

      const categories = Object.entries(counts).map(([category, count]) => ({
        category,
        tool_count: count,
        browse: `Use search_tools with query="" and category="${category}" to list all tools.`
      }));

      return ok({
        total_categories: categories.length,
        categories,
        tip: "Use search_tools with a category filter to browse tools in a specific category."
      });
    }

    // ── check_balance ─────────────────────────────────────────────────────────
    if (name === "check_balance") {
      if (args.api_key !== VALID_API_KEY) {
        return fail(
          "Invalid API key.",
          `Use api_key: "demo-key-123" for testing.`
        );
      }

      return ok({
        key_id: args.api_key,
        plan: "pro",
        calls_today: 142,
        calls_this_month: 4821,
        calls_limit_day: 100000,
        calls_limit_month: 3000000,
        balance_usd: 48.50,
        billing_email: "alex@acme.dev",
        next_billing_date: "2025-05-01",
        tip: "Use call_tool to execute tools. Each call deducts price_per_call from your balance."
      });
    }

    return fail(`Unknown tool: '${name}'`, "Use tools/list to see available MCP tools.");
  }
);

// ── Express app for SSE transport ─────────────────────────────────────────────

const app = express();
app.use(express.json());

// Track active transports by session (required for SSE multi-client)
const transports = {};

// GET /sse — agent connects here to establish the SSE stream
app.get("/sse", async (req, res) => {
  console.log(`[MCP] New SSE connection from ${req.ip}`);

  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;

  res.on("close", () => {
    console.log(`[MCP] SSE connection closed: ${transport.sessionId}`);
    delete transports[transport.sessionId];
  });

  await mcpServer.connect(transport);
  await transport.start();
});

// POST /messages — agent sends MCP protocol messages here
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];

  if (!transport) {
    return res.status(400).json({
      error: "No active SSE session",
      message: `Session '${sessionId}' not found. Connect to GET /sse first.`
    });
  }

  await transport.handlePostMessage(req, res, req.body);
});

// GET / — Info endpoint for agents landing here
app.get("/", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({
    server: "MCPHub MCP Server",
    protocol: "Model Context Protocol (MCP)",
    transport: "SSE (Server-Sent Events)",
    sse_endpoint: `http://localhost:${MCP_PORT}/sse`,
    messages_endpoint: `http://localhost:${MCP_PORT}/messages?sessionId=SESSION_ID`,
    mcp_tools: ["search_tools", "get_tool_details", "call_tool", "list_categories", "check_balance"],
    rest_api: `http://localhost:3000`,
    agent_guide: `http://localhost:3000/llms.txt`
  });
});

// ── Start MCP HTTP server ─────────────────────────────────────────────────────

const server = http.createServer(app);

server.listen(MCP_PORT, () => {
  console.log(`\n  ✦ MCPHub MCP Server running on http://localhost:${MCP_PORT}`);
  console.log(`  ✦ SSE endpoint:      http://localhost:${MCP_PORT}/sse`);
  console.log(`  ✦ Messages endpoint: http://localhost:${MCP_PORT}/messages?sessionId=SESSION_ID`);
  console.log(`  ✦ MCP tools: search_tools, get_tool_details, call_tool, list_categories, check_balance\n`);
});
