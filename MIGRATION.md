# Migration Guide: v0.5.x → v0.6.0

## Breaking Changes

### Marketplace Features Removed

**As of v0.6.0, all marketplace and payment features have been removed.**

This affects:
- Skill publishing (`unbrowse_publish`)
- Skill searching/downloading (`unbrowse_search`, `unbrowse_install`)
- Wallet management (`unbrowse_wallet`)
- x402 payment protocol integration
- Solana/USDC payment handling

### Why?

Unbrowse now focuses exclusively on its core value: **API capture, skill generation, and replay**. 

The marketplace added complexity and dependencies (Solana SDK, x402 protocol) without delivering proportional value to most users. By removing it, we've simplified the codebase and made Unbrowse more maintainable and reliable.

## What Still Works

✅ **Core functionality is unchanged:**
- API traffic capture (`unbrowse_capture`)
- Skill generation (`unbrowse_generate_skill`)
- API replay (`unbrowse_replay`)
- Browser automation (`unbrowse_browse`, `unbrowse_act`)
- Session management (`unbrowse_login`, `unbrowse_session`)
- Workflow recording and execution
- All authentication handling (Bearer tokens, cookies, OAuth)

## Configuration Changes

### Removed Config Options

The following config options are **no longer recognized**:

```json
{
  "skillIndexUrl": "...",              // REMOVED
  "marketplace": {                     // REMOVED SECTION
    "creatorWallet": "...",
    "solanaPrivateKey": "...",
    "defaultPrice": "..."
  }
}
```

### Valid Config (v0.6.0+)

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
          "credentialSource": "none",
          "enableChromeCookies": false,
          "enableOtpAutoFill": false,
          "enableDesktopAutomation": false
        }
      }
    }
  }
}
```

## Removed Tools

| Tool (v0.5.x) | Status | Alternative |
|---------------|--------|-------------|
| `unbrowse_publish` | ❌ Removed | Share skills manually (zip + send) |
| `unbrowse_search` | ❌ Removed | N/A |
| `unbrowse_install` | ❌ Removed | Import skills from filesystem |
| `unbrowse_wallet` | ❌ Removed | N/A |

## Removed Dependencies

The following npm packages have been removed:
- `@solana/web3.js`
- `@solana/spl-token`
- `bs58` (Solana key encoding)
- `axios` (marketplace API client)

This reduces installation size and eliminates Node.js v24+ compatibility issues that were caused by Solana's native bindings.

## Skill Sharing (Post-Marketplace)

Without the marketplace, you can still share skills:

### Option 1: Filesystem Copy
```bash
# Export a skill
tar -czf twitter-skill.tar.gz ~/.openclaw/skills/twitter

# Import on another machine
tar -xzf twitter-skill.tar.gz -C ~/.openclaw/skills/
```

### Option 2: Git Repository
```bash
cd ~/.openclaw/skills/twitter
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:you/twitter-skill.git
git push -u origin main
```

### Option 3: Manual Distribution
Skills are just directories with:
- `SKILL.md` (documentation)
- `auth.json` (optional, sensitive)
- `scripts/` (optional, TypeScript wrappers)

Zip and share however you like. **Warning:** `auth.json` contains sensitive tokens — sanitize before sharing.

## Upgrading

1. **Update the plugin:**
   ```bash
   openclaw plugins update @getfoundry/unbrowse-openclaw
   ```

2. **Remove old config:**
   Edit `~/.openclaw/openclaw.json` and remove `marketplace` and `skillIndexUrl` keys.

3. **Restart the gateway:**
   ```bash
   openclaw gateway restart
   ```

4. **Test core functionality:**
   ```bash
   unbrowse_capture urls=["https://example.com"]
   ```

## Questions?

- Open an issue: https://github.com/lekt9/unbrowse-openclaw/issues
- Core capture/replay functionality remains fully supported
- Skills you've already generated will continue to work

---

**TL;DR:** Marketplace gone. Core API capture/replay unchanged. Update config, restart gateway, keep browsing.
