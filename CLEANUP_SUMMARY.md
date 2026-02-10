# Unbrowse Cleanup — Quick Reference

**Generated:** 2026-02-09  
**Full Plan:** See `REF_CLEANUP_PLAN.md`

---

## 🎯 Quick Stats

| Metric | Value |
|--------|-------|
| **Files to Delete** | ~15 (entire `server/web/` dir) |
| **Tools to Remove** | 3 (`unbrowse_wallet`, `unbrowse_publish`, `unbrowse_search`) |
| **Dependencies to Remove** | 4 (all Solana/crypto libs) |
| **Lines to Delete** | ~4,300 |
| **Code Reduction** | 35% (12,400 → 8,100 lines) |

---

## 🗑️ Delete List (Priority Order)

### 1. Entire Directories
```bash
rm -rf server/web/
```

### 2. NPM Dependencies
```json
// Remove from package.json
"@solana/spl-token": "^0.4.0",
"@solana/web3.js": "^1.95.0",
"bs58": "^5.0.0",
"tweetnacl": "^1.0.3"
```

### 3. Tools from `index.ts`

| Tool | Lines | Function |
|------|-------|----------|
| `unbrowse_wallet` | 2575-2805 | Wallet management |
| `unbrowse_publish` | 2066-2210 | Marketplace publishing |
| `unbrowse_search` | 2203-2400 | Marketplace search/download |

### 4. Helper Functions from `index.ts`

| Function | Lines | Purpose |
|----------|-------|---------|
| `generateNewWallet()` | 578-625 | Solana keypair generation |
| `ensureWallet()` | 631-633 | Wallet initialization |
| `autoPublishSkill()` | 655-735 | Auto-publish to marketplace |

### 5. File: `src/skill-index.ts`

**Option A:** Delete entirely (if no marketplace)  
**Option B:** Simplify to read-only (search/metadata only, 706 → ~150 lines)

Remove these sections:
- `buildAndSignPayment()` — x402 payment builder
- `download()` — Payment handling
- `publish()`, `update()`, `delete()` — Publishing methods
- `signMessage()` — Solana signatures
- Installation/execution tracking
- Trending/featured endpoints

---

## 🔧 Key Refactoring Opportunities

### 1. Modularize `index.ts` (4,686 lines → separate files)
```
src/tools/
├── capture.ts      // unbrowse_capture
├── learn.ts        // unbrowse_learn
├── replay.ts       // unbrowse_replay
├── auth.ts         // unbrowse_auth
├── skills.ts       // unbrowse_skills
├── interact.ts     // unbrowse_interact
├── login.ts        // unbrowse_login
└── workflow.ts     // workflow tools
```

### 2. Simplify Browser Session Management
- Extract to `src/browser-manager.ts`
- Remove marketplace-specific CDP ports
- Simplify shared browser tracking

### 3. Clean Auto-Publish Hooks
Remove from these locations:
- Line 747: `onSkillGenerated` callback
- Line 1072: After `unbrowse_learn`
- Line 1222: After `unbrowse_capture`
- Line 3798: After `unbrowse_interact`

---

## 📋 Testing Checklist

### Core Functionality
- [ ] `unbrowse_capture` — Capture API from test site
- [ ] `unbrowse_learn` — Parse HAR → Generate skill
- [ ] `unbrowse_replay` — Call captured API
- [ ] `unbrowse_login` — Login flow works
- [ ] `unbrowse_interact` — Browser automation
- [ ] `unbrowse_auth` — Extract auth from browser

### Verification
```bash
# No marketplace references
grep -r "marketplace\|wallet\|solana\|usdc\|x402" src/

# No crypto imports
grep -r "@solana\|bs58\|tweetnacl" src/

# Clean build
npm install && npm run build
```

---

## 📝 Documentation Updates

### Files to Update

| File | Action |
|------|--------|
| `README.md` | Remove marketplace sections, simplify install |
| `package.json` | Remove marketplace keywords |
| `docs/ARCHITECTURE.md` | Remove "Marketplace & Payments" section |
| `docs/POSITIONING.md` | Remove monetization strategy |
| `openclaw.plugin.json` | Update description |

### Files to Create
- `MIGRATION.md` — v0.5 → v0.6 upgrade guide
- `CHANGELOG.md` — Document breaking changes

---

## 🚨 Breaking Changes

### Removed Features
1. Marketplace publishing
2. Marketplace search/download
3. Wallet management
4. Auto-publish to cloud
5. x402 payments

### Removed Config Options
```json
{
  "creatorWallet": "...",           // ❌ REMOVE
  "skillIndexSolanaPrivateKey": "...", // ❌ REMOVE
  "skillIndexUrl": "..."            // ❌ REMOVE
}
```

### Migration
- Users who need marketplace: Stay on v0.5.x
- Users who want clean API discovery: Upgrade to v0.6.0

---

## ✅ Success Criteria

- [ ] No Solana dependencies in `package.json`
- [ ] `npm run build` succeeds
- [ ] All 6 core tools tested and working
- [ ] No marketplace references in source code
- [ ] Documentation updated
- [ ] Version bumped to 0.6.0

---

## 🎉 Expected Benefits

### Users
- ✅ Simpler onboarding (no wallet setup)
- ✅ Faster install (fewer deps)
- ✅ Clearer purpose (API discovery)

### Developers
- ✅ 35% less code to maintain
- ✅ No Node version issues (Solana native bindings)
- ✅ Easier to understand architecture

### Project
- ✅ Focused mission
- ✅ Reduced attack surface
- ✅ Platform independent

---

**Full Details:** See `REF_CLEANUP_PLAN.md`
