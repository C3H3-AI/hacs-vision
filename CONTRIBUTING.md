# 贡献指南 / Contributing

本文件说明本仓库 PR 的硬性要求，以及新增/修改集成时的基本约定。CI 会逐条校验，不满足直接失败。

This file documents the hard requirements for pull requests in this repository and the basic conventions for integration code. CI checks each one and fails on violation.

---

## 一、PR 必须满足的四条 / Four mandatory PR rules

`.github/workflows/pr-validate.yml` 依次校验以下四项。**任何一项不满足，CI 直接失败。**

### 1. 分支 / Branch

禁止从 `main` 或 `master` 直接发 PR。请从功能分支发起。

Do not open a pull request from `main` or `master`. Use a feature branch.

```text
✅ feat/marketplace-backend
✅ fix/issue63-remote-path
✅ fix-repo-hacs-vision-ghsa-cg2g-xh64-v4q7-dompurify
❌ main
```

### 2. 标题 / Title

标题不能为空。**如果标题里含冒号 `:`**，必须满足 `<类型>: <描述>`，且冒号后要有实际内容。

The title must not be empty. If it contains a colon, it must read `<type>: <description>` with real content after the colon.

```text
✅ fix: 按 ref 安装集成时不清空 content.path.remote
✅ feat: 适配 HA 2026.11 内置 Marketplace
✅ fix: upgrade dompurify to 3.4.17
❌ fix:              （冒号后为空）
❌ : something       （冒号前为空）
```

> 注意：不含冒号的标题不会被校验格式，但请仍然遵守 `类型: 描述` 的写法，便于自动生成 release notes。

### 3. 描述段 / Description section

正文必须包含一个以 `## Description` 开头的二级标题段，且该段**在去掉注释和空行后仍有内容**。

The body must contain a level-2 section starting with `## Description`, and that section must have content after comments and blank lines are stripped.

校验逻辑是提取 `## Description` 到下一个 `## ` 之间的文本。所以：

```text
✅ ## Description / 变更描述
✅ ## Description
❌ ## 背景                （抓不到，报 "Description is empty"）
❌ ## What changed        （同上）
❌ ## Summary             （同上）
```

**这是最常见的失败原因。** 自动化工具生成的 PR 经常用 `## What changed`、`## Summary` 之类的标题，全部会挂。

### 4. 变更类型 / Change type

必须**恰好勾选一个**类型，格式为 `- [x] <类型>: ...`。

Exactly one change type must be checked, as `- [x] <type>: ...`.

可用类型：`bugfix`、`new feature`、`refactor`、`breaking`、`docs`。

```text
✅ - [x] bugfix: Bug fix / 问题修复
❌ - [ ] bugfix: ...          （未勾选）
❌ - [x] bugfix: ...
   - [x] refactor: ...        （勾了两个）
❌ - [X] bugfix: ...          （大写 X 不被识别）
```

> 注意最后一条：正则只认小写 `[x]`，`[X]` 会被判为「未勾选」。

---

## 二、直接使用模板 / Use the template

`.github/PULL_REQUEST_TEMPLATE.md` 已包含上述全部结构。**新建 PR 时保持模板原样，只填写内容，不要改结构。**

The template already contains every required structure. Keep it as-is and only fill in the content.

```markdown
## Description / 变更描述

<!-- 描述改了什么、为什么 -->

## Type of change / 变更类型

- [ ] bugfix: Bug fix / 问题修复
- [x] new feature: New feature / 新功能      ← 选一个改 [x]
- [ ] refactor: ...
- [ ] breaking: ...
- [ ] docs: ...

## Testing / 测试

- HA Version / HA版本: 
- Integration Version / 集成版本: 
- Test Result / 测试结果: 

## Checklist / 自检清单

- [x] Code follows project standards / 代码符合项目规范
- [x] No debug code or unrelated files / 无调试代码或无关文件
```

### 给自动化工具作者 / For maintainers of automated tools

如果你是自动提交 PR 的机器人（安全扫描、依赖升级等），请：

1. 正文**第一行**就是 `## Description / 变更描述`，不要用 `## Summary` 或 `## What changed`
2. 在变更类型区块中，把你对应的那一项改成 `- [x]`，其余保持 `- [ ]`
3. 如果你的改动无法运行测试，在 `Test Result` 里**如实说明**「未验证」，而不是留空或省略

如果一项改动未经验证，写清楚比假装验证过更有价值，维护者会自己补验。

---

## 三、代码约定 / Code conventions

### 版本号同步 / Version sync

改版本号时，以下**四处必须一致**：

1. `custom_components/hacs_vision/const.py` → `VERSION`
2. `custom_components/hacs_vision/manifest.json` → `version`
3. `CHANGELOG.md` → 新增对应条目
4. `frontend_src/package.json` → `version`（如涉及前端）

`frontend_src/package-lock.json` 顶层的 `version` 曾长期停留在 `3.0.0`，与 `package.json` 不一致。改前端依赖时请一并核对。

### 前端产物 / Frontend artifacts

`custom_components/hacs_vision/frontend/` 下的 `panel.js`、`index.html`、`build.json` 是构建产物。

- **不要手工编辑**这三个文件
- 改了 `frontend_src/` 之后运行 `npm run build` 重新生成
- 产物与源码请分开提交，便于 review

### 兼容性 / Compatibility

自 v7.1.0 起，本集成同时支持两种后端：

| HA 版本 | 后端 |
|---|---|
| 2026.11+ | 内置 `marketplace` |
| ≤2026.10 | HACS（旧） |

新增功能时，**两个后端都要考虑**。后端差异集中在 `custom_components/hacs_vision/backend.py`，业务代码通过 `self._backend` 访问，不要直接读 `hass.data["hacs"]`。

改动后端相关逻辑时，请至少说明在哪个后端上验证过。

### 安全相关 / Security

- 不要在 PR 里提交 Cookie、token、密码、密钥
- 依赖漏洞告警请说明**本仓库是否真的可达**，只写「升级到 X 版本」信息不足

---

## 四、提交前自检 / Pre-submit checklist

- [ ] 从功能分支发起，不是 `main`
- [ ] 标题符合 `类型: 描述`
- [ ] 正文有 `## Description / 变更描述` 段且有内容
- [ ] 变更类型恰好勾选一个（小写 `x`）
- [ ] 本地 `python -m py_compile` 通过
- [ ] 改了前端则 `npm run build` 通过
- [ ] 涉及两种后端时说明验证环境
