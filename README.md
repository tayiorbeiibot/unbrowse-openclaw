# Unbrowse

**Open source API reverse engineering for OpenClaw.**

Unbrowse is an [OpenClaw](https://github.com/lekt9/openclaw) extension that captures API traffic from any website and turns it into reusable skills for AI agents. Browse a site, capture the API calls, generate skills, and replay them instantly.

> **🔒 Security Note:** Unbrowse runs locally and accesses browser sessions to automate logins. All data stays on your machine. See [SECURITY.md](SECURITY.md) for full details on what's accessed and why.

```
┌─────────────────────────────────────────────────────────────┐
│                        UNBROWSE                             │
│          Open Source API Reverse Engineering                │
│                                                             │
│   Capture ──► Generate ──► Replay                          │
│       │          │           │                              │
│       ▼          ▤           ▼                              │
│   API traffic  skills    Direct HTTP                       │
│   auth headers schemas   0.3s response                     │
│   payloads     docs      95% reliable                      │
└─────────────────────────────────────────────────────────────┘
```

## Installation

### One-liner (Recommended)

```bash
openclaw plugins install @getfoundry/unbrowse-openclaw
```

That's it. Downloads, extracts, enables, and loads automatically.

---

### Alternative: Manual Config

Add to `~/.openclaw/openclaw.json` (or `~/.clawdbot/clawdbot.json`):

```json
{
  "plugins": {
    "entries": {
      "unbrowse-openclaw": { "enabled": true }
    }
  }
}
```

Then restart:
```bash
openclaw gateway restart
```

### Option C: GitHub Source

```json
{
  "plugins": {
    "entries": {
      "unbrowse-openclaw": {
        "enabled": true,
        "source": "github:lekt9/unbrowse-openclaw"
      }
    }
  }
}
```

### Option D: Manual Clone

```bash
git clone https://github.com/lekt9/unbrowse-openclaw ~/.openclaw/extensions/unbrowse-openclaw
cd ~/.openclaw/extensions/unbrowse-openclaw && npm install
npm run build
openclaw gateway restart
```

### Option E: Local Source Build (Development/Testing) ⭐

This method is ideal when you have a local clone of the repository and want to develop or test changes:

#### Step-by-Step Installation

```bash
# 1. Navigate to the plugin directory
cd /home/ubuntu/Projects/unbrowse

# 2. Ensure dependencies are installed (using bun or npm)
bun install
# or
npm install

# 3. Build the plugin from TypeScript source
# The plugin must be compiled before it can be loaded
bun run tsc -p tsconfig.json

# Verify the dist directory was created
ls -la dist/
# Should show: index.js, index.d.ts, and src/ directory

# 4. Update ~/.openclaw/openclaw.json configuration
# Add the plugin path to plugins.load.paths and enable it in entries
```

**Config file example (~/.openclaw/openclaw.json):**

```json
{
  "plugins": {
    "load": {
      "paths": [
        "/home/ubuntu/Projects/unbrowse"
      ]
    },
    "entries": {
      "unbrowse-openclaw": {
        "enabled": true
      }
    }
  }
}
```

**Important notes:**
- The plugin manifest ID is `unbrowse-openclaw` (from openclaw.plugin.json), not `unbrowse`
- The `load.paths` points to the **source directory** containing the built `dist/` folder
- The `entries.unbrowse-openclaw.enabled: true` enables the plugin
- The `dist/` directory must exist and contain the compiled JavaScript files

#### Step 5: Restart the Gateway

```bash
openclaw gateway restart
```

**Expected output:**
```
[plugins] [unbrowse] Auto-discover: 31 existing skills loaded
[plugins] [unbrowse] Plugin registered (13 tools, auto-discover)
Restarted systemd service: openclaw-gateway.service
```

#### Step 6: Verify Installation

```bash
# List all installed plugins
openclaw plugins list

# Look for unbrowse in the list with status "loaded":
# Name: Unbrowse
# ID: unbrowse
# Status: loaded
# Version: 0.5.6
```

**Full plugin list example:**
```
Plugins (7/35 loaded)
┌──────────────┬──────────┬──────────┬──────────────────────────────────────────────────┬──────────┐
│ Name         │ ID       │ Status   │ Source                                    │ Version  │
├──────────────┼──────────┼──────────┼──────────────────────────────────────────────────┼──────────┤
│ Unbrowse     │ unbrowse │ loaded   │ ~/Projects/unbrowse/dist/index.js          │ 0.5.6    │
│ ...          │ ...      │ ...      │ ...                                      │ ...      │
└──────────────┴──────────┴──────────┴──────────────────────────────────────────────────┴──────────┘
```

#### Viewing Gateway Logs

```bash
# Follow the logs in real-time
tail -f ~/.openclaw/logs/gateway.log | grep unbrowse

# Check recent logs
tail -100 ~/.openclaw/logs/gateway.log | grep unbrowse
```

#### Development Workflow

When making changes to the plugin:

```bash
# 1. Edit TypeScript source files
# 2. Rebuild the plugin
cd /home/ubuntu/Projects/unbrowse
bun run tsc -p tsconfig.json

# 3. Restart gateway to reload
openclaw gateway restart

# 4. Check logs for errors
tail -f ~/.openclaw/logs/gateway.log | grep unbrowse
```

### Quick Installation Summary

| Method | When to Use | Commands |
|--------|--------------|-----------|
| **One-liner** | Production, quick install | `openclaw plugins install @getfoundry/unbrowse-openclaw` |
| **Manual Clone** | Want extension in ~/.openclaw/extensions/ | `git clone ... && npm install && npm run build` |
| **Local Source** | Development, testing, custom changes | `cd /path/to/unbrowse && bun run tsc` then add to config paths |

## Quick Start — No Config Needed! 🚀

**Unbrowse works immediately after installation.** No API key required:

```bash
# Install and start using right away
openclaw plugins install @getfoundry/unbrowse-openclaw

# Start capturing immediately - no config needed
"Capture the API from airbnb.com"
```

### What You Can Do

| Feature | Requirements |
|---------|-------------|
| **Capture APIs** | ✅ Nothing — works out of box |
| **Generate skills** | ✅ Nothing — works out of box |
| **Replay captured APIs** | ✅ Nothing — uses your captured auth |
| **Browse & login** | ✅ Nothing — uses your Chrome profile |

## How It Works

### 1. Capture

Browse any website normally. Unbrowse intercepts all API traffic:
- Endpoint URLs and methods
- Request/response payloads
- Authentication headers
- Cookies and tokens

```bash
# Using the agent
"Browse twitter.com and capture the API"

# Or directly
unbrowse_capture url="twitter.com"
```

### 2. Generate

AI analyzes captured traffic and generates production-ready skills:
- OpenAPI-style schemas
- Auth handling (Bearer, cookies, etc.)
- Documentation and examples
- TypeScript wrapper code

```bash
# Auto-generated from captured traffic
unbrowse_generate_skill domain="twitter.com"
```

### 3. Replay

Execute captured APIs directly via HTTP — no browser needed:
- 0.3 second response times
- 95% reliability
- Auto-refresh expired auth
- Works offline after capture

```bash
# Replay a captured endpoint
unbrowse_replay service="twitter" endpoint="GET /api/timeline"
```

## Tools

All unbrowse tools are available once the plugin is loaded and the gateway is restarted.

### Capture & Browse

| Tool | Description |
|------|-------------|
| `unbrowse_browse` | Open URL in browser with traffic capture |
| `unbrowse_capture` | Capture API traffic from a domain |
| `unbrowse_profile` | Record a browsing session with login |
| `unbrowse_act` | Execute browser actions (click, type, scroll) |

### Skill Generation

| Tool | Description |
|------|-------------|
| `unbrowse_generate_skill` | Generate skill from captured endpoints |
| `unbrowse_replay` | Execute API calls using captured skills |

### Session Management

| Tool | Description |
|------|-------------|
| `unbrowse_login` | Login to a service and save session |
| `unbrowse_session` | List/manage saved sessions |
| `unbrowse_cookies` | Export cookies for a domain |

### Workflow Skills (NEW)

| Tool | Description |
|------|-------------|
| `unbrowse_workflow_record` | Record multi-site browsing sessions for workflow learning |
| `unbrowse_workflow_learn` | Analyze recordings to generate api-package or workflow skills |
| `unbrowse_workflow_execute` | Execute workflow or api-package skills with success tracking |
| `unbrowse_workflow_stats` | View success rates, earnings, and leaderboards |

### Using Unbrowse Tools

Once the plugin is loaded, you can use unbrowse tools in your OpenClaw agents:

```bash
# Through the agent interface (natural language)
"Capture API traffic from github.com"
"Generate a skill from the captured github.com endpoints"
"List all unbrowse skills"

# Example agent commands:
unbrowse_capture url="github.com"
unbrowse_generate_skill domain="github.com"
unbrowse_replay service="github" endpoint="GET /user/repos"
unbrowse_login url="https://github.com/login"
unbrowse_session
unbrowse_cookies domain="github.com"
```

## Skill Categories

Unbrowse generates two types of skills:

### API Packages (`api-package`)
Single-site API collections. Simple endpoint capture with authentication.

```bash
# Capture and generate
unbrowse_capture url="api.twitter.com"
# Generates: twitter-api skill with endpoints
```

### Workflows (`workflow`)
Multi-site orchestration with decision points and data flow.

```bash
# Record a cross-site session
unbrowse_workflow_record action="start" intent="Compare prices across sites"
# Browse multiple sites, add annotations at key points
unbrowse_workflow_record action="annotate" note="Price comparison" noteType="decision"
unbrowse_workflow_record action="stop"
# Learn the workflow
unbrowse_workflow_learn sessionId="session-123..."
```

## Configuration

Full config example:

```json
{
  "plugins": {
    "entries": {
      "unbrowse-openclaw": {
        "enabled": true,
        "config": {
          "skillsOutputDir": "~/.openclaw/skills",
          "autoDiscover": true,
          "browser": {
            "useApiKey": "bu_...",
            "proxyCountry": "us"
          },
          "credentialSource": "none"
        }
      }
    }
  }
}
```

### Config Options

| Option | Default | Description |
|--------|---------|-------------|
| `skillsOutputDir` | `~/.openclaw/skills` | Where generated skills are saved |
| `autoDiscover` | `true` | Auto-generate skills when browsing APIs |
| `browser.useApiKey` | - | Browser Use API key for stealth |
| `browser.proxyCountry` | `"us"` | Proxy location for stealth browser |
| `credentialSource` | `"none"` | Password lookup: none/keychain/1password |

### Security Options (all disabled by default)

| Option | Default | Description |
|--------|---------|-------------|
| `enableChromeCookies` | `false` | Read cookies from Chrome's database |
| `enableOtpAutoFill` | `false` | Auto-fill OTP codes from SMS/clipboard |
| `enableDesktopAutomation` | `false` | Allow AppleScript desktop control |

See [SECURITY.md](SECURITY.md) for detailed explanations of each feature.

## Platform Support

Unbrowse works on all OpenClaw-compatible platforms:

| Platform | Config File | Install Command |
|----------|-------------|-----------------|
| OpenClaw | `~/.openclaw/openclaw.json` | `openclaw plugins install @getfoundry/unbrowse-openclaw` |
| Clawdbot | `~/.clawdbot/clawdbot.json` | `clawdbot plugins install @getfoundry/unbrowse-openclaw` |
| Moltbot | `~/.moltbot/moltbot.json` | `moltbot plugins install @getfoundry/unbrowse-openclaw` |

## Development

```bash
# Type check
npx tsc --noEmit

# Build from source (TypeScript → JavaScript)
bun run tsc -p tsconfig.json
# or
npm run build

# Test locally
openclaw gateway restart
tail -f ~/.openclaw/logs/gateway.log | grep unbrowse
```

### Development Workflow

```bash
# 1. Make changes to TypeScript source files
# 2. Rebuild the plugin
bun run tsc -p tsconfig.json

# 3. Restart the gateway to reload changes
openclaw gateway restart

# 4. Check logs for successful plugin loading
tail -f ~/.openclaw/logs/gateway.log | grep unbrowse
```

### Key Directories

```
~/.openclaw/skills/           — Generated skills
~/.openclaw/extensions/       — Extension code
~/.openclaw/logs/             — Gateway logs
```

## Skill Format

Generated skills follow the [Agent Skills](https://agentskills.io) open standard:

```
my-skill/
├── SKILL.md          # Skill definition and metadata
├── scripts/          # Executable scripts
│   └── run.ts        # Main execution script
└── references/       # Supporting documentation
    └── api.md        # API reference
```

## Troubleshooting

### Plugin not found: unbrowse

**Error:** `plugins.entries.unbrowse: plugin not found: unbrowse`

**Solution:** The plugin manifest uses the ID `unbrowse-openclaw`, not `unbrowse`. Update your config:

```json
{
  "plugins": {
    "entries": {
      "unbrowse-openclaw": {
        "enabled": true
      }
    }
  }
}
```

Then restart: `openclaw gateway restart`

### Build fails or dist directory not created

**Error:** Plugin source isn't compiled to JavaScript

**Solution:** Build the plugin before loading:

```bash
cd /path/to/unbrowse-openclaw

# Using bun (recommended)
bun run tsc -p tsconfig.json

# Or using npm
npm run build

# Verify dist directory was created
ls -la dist/

# Should show:
# index.js
# index.d.ts
# src/ (directory)
```

### Plugin loads but tools not available

**Symptom:** Plugin shows as "loaded" but tools don't work

**Solution:** Check gateway logs for registration details:

```bash
# Restart gateway
openclaw gateway restart

# Check logs
tail -50 ~/.openclaw/logs/gateway.log | grep unbrowse

# Should see:
# [plugins] [unbrowse] Plugin registered (13 tools, auto-discover)
```

If you see errors, check that the `dist/index.js` file exists and is valid.

### "Given napi value is not an array" or "Failed to convert JavaScript value"

This error occurred in older versions (v0.5.x and earlier) due to N-API compatibility issues with Solana native bindings. This has been fixed in v0.6.0+.

**Solution:** Update to the latest version:

```bash
openclaw plugins update @getfoundry/unbrowse-openclaw
openclaw gateway restart
```

### "Native module failed to load" (ESM Error)

Fixed in v0.4.0+. Update to the latest version:

```bash
openclaw plugins update @getfoundry/unbrowse-openclaw
```

### unbrowse_skills returns undefined

Usually a Node version issue. See the Node.js v24+ fix above.

### Chrome won't connect

Make sure Chrome is running with remote debugging enabled, or let Unbrowse launch it:

```bash
# Kill existing Chrome instances
pkill -f "Google Chrome"

# Try capture again (Unbrowse will launch Chrome)
unbrowse_capture urls=["https://example.com"]
```

## Changelog

### v0.6.0 (Breaking Changes)

**Security: All sensitive features now disabled by default**

The following capabilities now require explicit opt-in via config:

| Feature | Config to Enable |
|---------|------------------|
| Chrome cookie reading | `enableChromeCookies: true` |
| OTP auto-fill (SMS/clipboard) | `enableOtpAutoFill: true` |
| Desktop automation (AppleScript) | `enableDesktopAutomation: true` |
| Keychain/1Password credentials | `credentialSource: "keychain"` |

**Why:** These features access sensitive local data. While necessary for full automation, they should be opt-in so users understand what they're enabling.

**Migration:** Add to your config if you need these features:
```json
{
  "plugins": {
    "entries": {
      "unbrowse": {
        "config": {
          "enableChromeCookies": true,
          "enableOtpAutoFill": true,
          "enableDesktopAutomation": true
        }
      }
    }
  }
}
```

**Core capture/replay functionality is unaffected** — basic API capture and replay work without any config changes.

See [SECURITY.md](SECURITY.md) for full details on what each feature does.

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=lekt9/unbrowse-openclaw&type=Date)](https://star-history.com/#lekt9/unbrowse-openclaw&Date)

## License

MIT

---

*Built for OpenClaw.*
