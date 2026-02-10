# Unbrowse Cleanup Plan — Remove Crypto/Marketplace Features

**Goal:** Strip out all crypto wallet, token gating, and marketplace features to create a clean, focused API skill generator.

**Scope:** This plan identifies all marketplace/crypto code, unnecessary dependencies, and refactoring opportunities to simplify the codebase down to core functionality: API discovery → Skill generation.

---

## 📋 Executive Summary

The unbrowse project has accumulated marketplace/crypto features (Solana wallets, USDC payments, x402 protocol) that are orthogonal to its core value proposition: reverse-engineering APIs and generating skills.

**What to Remove:**
- 3 tools (`unbrowse_wallet`, `unbrowse_publish`, `unbrowse_search`)
- 4 npm dependencies (Solana libs)
- 1 entire directory (`server/web/` - React marketplace frontend)
- ~1,200 lines from `index.ts` (wallet, publish, search tools)
- ~400 lines from `src/skill-index.ts` (x402 payment logic)
- Auto-publish hooks throughout the codebase

**What to Keep:**
- Core API capture (HAR parsing, CDP interception)
- Skill generation (SKILL.md, auth.json, api.ts)
- Authentication extraction
- Browser automation (login, replay, interact)
- Token refresh detection
- Workflow recording/learning
- Credential providers (vault, 1Password, keychain)

---

## 🗑️ Features to Remove

### 1. **Wallet Management** (`unbrowse_wallet` tool)

**Files/Sections to Delete:**

#### `index.ts`
- **Lines 578-633:** `generateNewWallet()` function and `ensureWallet()` wrapper
- **Lines 2575-2805:** Entire `unbrowse_wallet` tool definition and execute handler
- **Lines 638-648:** Wallet config variables and initialization
  ```typescript
  let creatorWallet = (cfg.creatorWallet as string) ?? ...
  let solanaPrivateKey = (cfg.skillIndexSolanaPrivateKey as string) ?? ...
  ```
- **Lines 186-191:** `WALLET_SCHEMA` definition
- **Line 19:** Tool description mention of wallet

**Impact:** Removes all Solana keypair generation, wallet configuration, and balance checking.

---

### 2. **Marketplace Publishing** (`unbrowse_publish` tool)

**Files/Sections to Delete:**

#### `index.ts`
- **Lines 2066-2210:** Entire `unbrowse_publish` tool definition
- **Lines 655-735:** `autoPublishSkill()` function
- **Lines 740-748:** Auto-publish hooks in skill generation callbacks
- **Lines 1072, 1222, 3798:** Auto-publish calls scattered throughout
- **Lines 161-178:** `PUBLISH_SCHEMA` definition
- **Line 17:** Tool description mention

**Context:** This tool allows publishing skills to a cloud marketplace with pricing. Completely unnecessary for local-only API skill generation.

**Side Effects to Clean:**
- Remove "publishedVersion" tracking in capture/learn tools
- Remove marketplace reachability checks
- Remove server health check infrastructure

---

### 3. **Marketplace Search/Download** (`unbrowse_search` tool)

**Files/Sections to Delete:**

#### `index.ts`
- **Lines 2203-2400:** Entire `unbrowse_search` tool definition
- **Lines 180-196:** `SEARCH_SCHEMA` definition
- **Line 18:** Tool description mention

**Impact:** Removes ability to search cloud marketplace and download paid skills via x402 payments.

---

### 4. **Skill Index Client** (Marketplace API Client)

**File:** `src/skill-index.ts` (706 lines)

**What to Remove:**
- **Lines 249-346:** `buildAndSignPayment()` — x402 Solana payment transaction builder
- **Lines 186-246:** `download()` — x402 payment handling
- **Lines 354-372:** `publish()` method
- **Lines 387-449:** `update()` and `delete()` methods (require wallet signatures)
- **Lines 451-483:** `signMessage()` — Solana signature creation
- **Lines 576-637:** Installation/execution tracking (marketplace analytics)
- **Lines 658-708:** Trending/featured skills (marketplace discovery)
- **Lines 20-22, 90, 113-128:** Wallet/payment-related types and constructor params
- All Solana/payment imports

**What to Keep:**
- Basic types (SkillSummary, SkillPackage, etc.) — useful for metadata
- `search()` method (if you want optional remote skill discovery without payments)
- `getSkillSummary()` (metadata lookup)
- `healthCheck()` (server connectivity check)

**Recommendation:** Either:
1. **Delete entirely** if marketplace is completely removed
2. **Simplify to read-only client** (search/metadata only, no downloads/publishing)

---

### 5. **Web Frontend** (React Marketplace UI)

**Directory:** `server/web/` (entire directory)

**Contents:**
- React SPA with marketplace browsing, skill management, analytics
- Pages: Analytics, Skills, Search, Docs, Dashboard
- References to pricing, USDC, wallet-based ownership
- Vite build config, vercel.json deployment

**Action:** Delete entire `server/web/` directory

**Files:**
```
server/web/
├── src/
│   ├── pages/
│   │   ├── Analytics.jsx (references priceUsdc, formatUSDC)
│   │   ├── Skills.jsx (marketplace search, pricing filters)
│   │   ├── Docs.jsx (wallet ownership docs)
│   │   └── ...
│   ├── components/
│   └── lib/auth-client.js
├── package.json (React dependencies)
├── vite.config.js
├── vercel.json
└── README.md
```

**Impact:** ~2,000+ lines of frontend code removed.

---

### 6. **Auto-Publish Infrastructure**

**Scattered Throughout Codebase:**

#### `index.ts`
- **Lines 747-749:** Auto-publish callback in `AutoDiscovery` constructor
  ```typescript
  onSkillGenerated: async (service, result) => {
    if (result.changed) {
      await autoPublishSkill(service, result.skillDir);
    }
  }
  ```
- **Lines 1072-1076, 1222-1226:** Auto-publish in capture/learn success paths
- **Lines 3798:** Auto-publish in interact tool

**Action:** Remove all `autoPublishSkill()` calls and related "publishedVersion" tracking.

---

### 7. **Documentation References**

**Files to Update:**

#### `README.md`
- **Lines 1-24:** Remove marketplace/USDC branding from header
- **Lines 88-106:** Remove "Setting Up Marketplace" section
- **Lines 90-106:** Remove wallet setup instructions
- Update feature comparison table (remove marketplace rows)

#### `package.json`
- **Lines 22-28:** Remove marketplace-related keywords
  ```json
  "keywords": [
    "skill-marketplace",  // REMOVE
    "x402",              // REMOVE
    "solana",            // REMOVE
    "usdc"               // REMOVE
  ]
  ```
- **Line 7:** Update description (remove "monetizable")

#### `docs/ARCHITECTURE.md`
- **Section 7:** Remove "Marketplace & Payments" section entirely
- Update data flow diagrams (remove publish/auto-publish steps)

#### `docs/POSITIONING.md`
- Remove marketplace positioning/monetization strategy

---

## 📦 Dependencies to Remove

**File:** `package.json`

**Remove These Dependencies:**

```json
"dependencies": {
  "@solana/spl-token": "^0.4.0",        // ❌ REMOVE
  "@solana/web3.js": "^1.95.0",         // ❌ REMOVE
  "bs58": "^5.0.0",                     // ❌ REMOVE (only used for Solana)
  "tweetnacl": "^1.0.3"                 // ❌ REMOVE (only used for Solana signatures)
}
```

**Keep These Dependencies:**

```json
"dependencies": {
  "playwright": "^1.58.0"               // ✅ KEEP (core browser automation)
}
```

**Justification:**
- `@solana/spl-token` - Only used for USDC token transfers (x402 payments)
- `@solana/web3.js` - Only used for keypair generation and transaction signing
- `bs58` - Only used for base58 encoding Solana keys
- `tweetnacl` - Only used for Ed25519 signatures on marketplace requests

**Grep Verification:**
```bash
# Verify Solana imports are only in wallet/marketplace code
grep -r "@solana" src/
# Result: Only in skill-index.ts (payments)

grep -r "bs58" src/
# Result: Only in skill-index.ts (key encoding)

grep -r "tweetnacl" src/
# Result: Only in skill-index.ts (signatures)
```

---

## 🔧 Refactoring Opportunities

### 1. **Simplify `index.ts` (Main Plugin File)**

**Current Issues:**
- **4,686 lines** — monolithic, hard to navigate
- Crypto wallet code interleaved with core features
- Auto-publish hooks scattered throughout

**Refactor Plan:**

**Phase 1: Extract Tools to Separate Files**

Create `src/tools/` directory:
```
src/tools/
├── capture.ts       (unbrowse_capture)
├── learn.ts         (unbrowse_learn)
├── replay.ts        (unbrowse_replay)
├── auth.ts          (unbrowse_auth)
├── skills.ts        (unbrowse_skills)
├── interact.ts      (unbrowse_interact)
├── login.ts         (unbrowse_login)
├── workflow.ts      (workflow_record, workflow_learn, workflow_execute)
└── index.ts         (tool registry)
```

**Benefits:**
- Each tool in ~200-300 lines (vs 4,686 monolith)
- Clear separation of concerns
- Easier testing and maintenance
- Remove marketplace tools without touching core

**Example Structure:**
```typescript
// src/tools/capture.ts
export const captureTool = {
  name: "unbrowse_capture",
  description: "...",
  parameters: CAPTURE_SCHEMA,
  async execute(toolCallId, params) {
    // Implementation
  }
};

// index.ts (simplified)
import { captureTool } from "./src/tools/capture.js";
import { learnTool } from "./src/tools/learn.js";

const tools = (ctx) => [
  captureTool,
  learnTool,
  // ... no marketplace tools
];
```

**Phase 2: Simplify Browser Session Management**

Current code has complex CDP cascade and shared browser tracking. Opportunities:
- Extract to `src/browser-manager.ts`
- Simplify CDP connection strategy (remove marketplace-specific ports)
- Document the cascade clearly

**Phase 3: Remove Auto-Publish Hooks**

After deleting marketplace code, remove:
- `serverReachable` tracking
- `lastReachabilityCheck` timestamps
- `onSkillGenerated` callbacks with publish logic
- "publishedVersion" return values

---

### 2. **Simplify `src/skill-index.ts`**

**Current State:** 706 lines with payment logic, wallet signatures, marketplace analytics

**Option A: Delete Entirely**
- If marketplace is completely removed, delete the file
- Move any useful types (SkillSummary, SkillPackage) to `src/types.ts`

**Option B: Convert to Read-Only Client (Recommended)**
- Keep search/metadata functionality for discovering community skills
- Remove all payment/wallet code
- Rename to `src/skill-discovery.ts`

**Simplified Interface:**
```typescript
// src/skill-discovery.ts
export class SkillDiscoveryClient {
  async search(query: string): Promise<SkillSummary[]>
  async getSkillMetadata(id: string): Promise<SkillSummary>
  // NO download (requires payment)
  // NO publish (requires wallet)
}
```

**Benefits:**
- Users can still discover/browse community skills
- No crypto dependencies
- Simple fetch-based API
- ~150 lines instead of 706

---

### 3. **Cleanup HAR Parser**

**File:** `src/har-parser.ts` (495 lines)

**Current Issues:**
- Some complexity around OpenAPI merging
- Skip domains list could be externalized

**Minor Refactors:**
- Extract `SKIP_DOMAINS` to separate config file
- Add unit tests for `parseHar()` with sample HAR fixtures
- Document the filtering logic better

**Not urgent** — this file is relatively clean already.

---

### 4. **Simplify Workflow Features**

**Files:**
- `src/workflow-learner.ts` (822 lines)
- `src/workflow-executor.ts` (693 lines)
- `src/workflow-recorder.ts` (301 lines)

**Current State:** Feature-rich but complex

**Refactor Opportunities:**
- Extract common patterns to shared utilities
- Add JSDoc comments for public APIs
- Potentially split executor into separate strategy files

**Priority:** Low (not related to marketplace cleanup)

---

### 5. **Credential Providers Cleanup**

**File:** `src/credential-providers.ts` (459 lines)

**Current State:** Supports vault, 1Password, macOS Keychain

**Refactor Ideas:**
- Split each provider into separate files:
  ```
  src/credentials/
  ├── vault-provider.ts
  ├── onepassword-provider.ts
  ├── keychain-provider.ts
  └── index.ts
  ```
- Add tests for each provider
- Document credential schemas

**Priority:** Medium (improves maintainability)

---

## 📐 Architecture Improvements

### 1. **Remove Marketplace Concepts from Core**

**Current Problem:** Marketplace concepts leak into core skill generation:
- Skills track "publishedVersion"
- Auto-publish hooks in capture pipeline
- Wallet configuration required for full feature set

**Solution:**
- Skill generation should be pure: HAR → Skill files
- No external publishing in core flow
- Remove all marketplace state tracking

---

### 2. **Simplify Configuration**

**Current Config Options (marketplace-related):**

```typescript
{
  creatorWallet: string
  skillIndexSolanaPrivateKey: string
  skillIndexUrl: string
  // ... 15+ other options
}
```

**After Cleanup:**
```typescript
{
  skillsOutputDir: string
  autoDiscover: boolean
  browserPort: number
  credentialSource: string
  // Security opt-ins
  enableChromeCookies: boolean
  enableOtpAutoFill: boolean
  enableDesktopAutomation: boolean
}
```

**Impact:** Simpler onboarding, fewer required fields.

---

### 3. **Flatten Tool Hierarchy**

**Current:**
- 9 tools total
- 3 marketplace tools (wallet, publish, search)
- 6 core tools

**After Cleanup:**
- 6 tools (all core)
- Clearer purpose (API discovery only)

---

## 🔍 Testing & Validation Strategy

### Phase 1: Code Removal
1. Delete `server/web/` directory
2. Remove wallet/publish/search tools from `index.ts`
3. Remove Solana dependencies from `package.json`
4. Run `npm install` to verify clean dep tree

### Phase 2: Integration Tests
1. Test `unbrowse_capture` on a sample site
2. Verify skill generation (SKILL.md, auth.json, api.ts)
3. Test `unbrowse_replay` with generated skill
4. Test `unbrowse_login` flow

### Phase 3: Cleanup Verification
```bash
# Verify no marketplace references remain
grep -r "marketplace\|wallet\|solana\|usdc\|x402" src/
# Should return nothing (except maybe docs/archive)

# Verify no crypto imports
grep -r "@solana\|bs58\|tweetnacl" src/
# Should return nothing

# Check for orphaned config
grep -r "creatorWallet\|skillIndexUrl" .
# Should only appear in docs/migration notes
```

### Phase 4: Documentation Update
1. Update README with simplified install/usage
2. Remove marketplace sections from ARCHITECTURE.md
3. Add MIGRATION.md for users transitioning from marketplace version
4. Update plugin description in openclaw.plugin.json

---

## 📊 Impact Summary

### Lines of Code Removed

| Component | Lines | Status |
|-----------|-------|--------|
| `server/web/` (frontend) | ~2,500 | DELETE |
| `index.ts` (wallet/publish tools) | ~1,200 | DELETE |
| `src/skill-index.ts` (x402 payments) | ~400 | DELETE or SIMPLIFY |
| Documentation | ~200 | UPDATE |
| **Total Removed** | **~4,300** | |

### Lines of Code Remaining (Core)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `index.ts` (after refactor) | ~2,500 | Core tools + plugin registration |
| `src/har-parser.ts` | 495 | HAR parsing logic |
| `src/skill-generator.ts` | 592 | Skill file generation |
| `src/workflow-learner.ts` | 822 | Workflow recording/learning |
| `src/workflow-executor.ts` | 693 | Workflow execution |
| Other core modules | ~3,000 | Auth, browser, credentials, etc. |
| **Total Core** | **~8,100** | |

**Net Impact:** ~35% code reduction (from ~12,400 to ~8,100 lines)

---

## 🎯 Implementation Roadmap

### Step 1: Create Feature Branch
```bash
git checkout -b cleanup/remove-marketplace
```

### Step 2: Delete Marketplace Code (Day 1)
- [ ] Delete `server/web/` directory
- [ ] Remove `unbrowse_wallet` tool from `index.ts`
- [ ] Remove `unbrowse_publish` tool from `index.ts`
- [ ] Remove `unbrowse_search` tool from `index.ts`
- [ ] Remove `generateNewWallet()` and `ensureWallet()` functions
- [ ] Remove `autoPublishSkill()` function and all call sites
- [ ] Remove wallet config variables

### Step 3: Clean Dependencies (Day 1)
- [ ] Remove Solana deps from `package.json`
- [ ] Run `npm install` and verify build
- [ ] Test basic capture/learn flow

### Step 4: Refactor `skill-index.ts` (Day 2)
- [ ] Decision: Delete or simplify to read-only?
- [ ] If simplify: Remove payment/wallet/signature code
- [ ] If delete: Move types to `src/types.ts`
- [ ] Update imports throughout codebase

### Step 5: Documentation Cleanup (Day 2)
- [ ] Update README (remove marketplace sections)
- [ ] Update ARCHITECTURE.md
- [ ] Remove marketplace keywords from package.json
- [ ] Update tool descriptions

### Step 6: Testing (Day 3)
- [ ] Manual test: Capture API from test site
- [ ] Manual test: Generate skill
- [ ] Manual test: Replay captured API
- [ ] Manual test: Login flow
- [ ] Verify no marketplace references remain

### Step 7: (Optional) Refactor to Modular Tools (Week 2)
- [ ] Create `src/tools/` directory
- [ ] Extract each tool to separate file
- [ ] Update imports and test
- [ ] Document new structure

### Step 8: Release
- [ ] Bump version to `0.6.0` (breaking change)
- [ ] Add MIGRATION.md for users
- [ ] Update CHANGELOG.md
- [ ] Publish to npm

---

## 🚨 Breaking Changes for Users

### Removed Features
1. **Marketplace publishing** — `unbrowse_publish` no longer exists
2. **Marketplace search** — `unbrowse_search` no longer exists
3. **Wallet management** — `unbrowse_wallet` no longer exists
4. **Auto-publish** — Skills no longer auto-sync to cloud

### Migration Path
For users who relied on marketplace features:
1. **Keep using v0.5.x** if marketplace is critical
2. **Upgrade to v0.6.0** for clean, local-only API discovery
3. **Export skills manually** (copy from `~/.openclaw/skills/` to share)

### Config Changes
Remove these from your config (no longer used):
```json
{
  "creatorWallet": "...",
  "skillIndexSolanaPrivateKey": "...",
  "skillIndexUrl": "..."
}
```

---

## 📝 Post-Cleanup Verification Checklist

### Code Quality
- [ ] No marketplace/wallet/crypto references in core files
- [ ] All tools have clear, focused purpose
- [ ] No dead code or unused imports
- [ ] `npm run build` succeeds
- [ ] No Solana dependencies in `package.json`

### Functionality
- [ ] `unbrowse_capture` works on test site
- [ ] `unbrowse_learn` generates valid skill
- [ ] `unbrowse_replay` executes captured API
- [ ] `unbrowse_login` captures session auth
- [ ] `unbrowse_interact` browser automation works
- [ ] Workflow tools functional

### Documentation
- [ ] README accurately describes features
- [ ] No outdated marketplace references
- [ ] Installation instructions clear
- [ ] ARCHITECTURE.md updated

### Testing
- [ ] Manual smoke tests pass
- [ ] No errors in OpenClaw logs
- [ ] Skills install correctly to `~/.openclaw/skills/`

---

## 🎉 Expected Benefits

### For Users
1. **Simpler onboarding** — No wallet setup required
2. **Clearer value prop** — API discovery, not marketplace
3. **Faster installation** — Fewer dependencies
4. **Better privacy** — No external publish by default

### For Developers
1. **Easier to understand** — 35% less code
2. **Faster tests** — No Solana native binding issues
3. **Clear boundaries** — Core vs marketplace features separated
4. **Better documentation** — Focus on core functionality

### For the Project
1. **Focused mission** — API reverse engineering, not payments
2. **Reduced surface area** — Fewer dependencies to maintain
3. **Platform independence** — No Node version issues with Solana libs
4. **Easier contributions** — Simpler codebase for new developers

---

## 📚 Related Documentation

After cleanup, create these docs:

1. **MIGRATION.md** — Guide for v0.5 → v0.6 users
2. **CONTRIBUTING.md** (update) — Remove marketplace development info
3. **SECURITY.md** (update) — Remove wallet security sections
4. **ARCHITECTURE.md** (update) — Remove marketplace flow diagrams

---

## ✅ Final Checklist

Before merging cleanup branch:

- [ ] All marketplace code removed
- [ ] All crypto dependencies removed
- [ ] All tools tested manually
- [ ] Documentation updated
- [ ] CHANGELOG.md entry added
- [ ] Version bumped to 0.6.0
- [ ] No remaining TODOs in code
- [ ] MIGRATION.md created
- [ ] README simplified
- [ ] Clean `git diff` review

---

## 🔗 References

- Original repo: `unbrowse-openclaw-cleaned`
- Cloned to: `/home/ubuntu/.openclaw/workspace/projects/unbrowse`
- This plan: `projects/unbrowse/REF_CLEANUP_PLAN.md`

---

**Author:** Research Architect Subagent  
**Date:** 2026-02-09  
**Version:** 1.0  
**Target:** Unbrowse v0.6.0 (Clean)
