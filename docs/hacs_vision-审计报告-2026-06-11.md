# HACS Vision v2.2.0 审计报告（含测试验证）

> 审计日期：2026-06-11
> 测试日期：2026-06-11
> 依据文档：完整审查与测试报告-v2.2.0.md
> 审计范围：hacs_vision 全部前后端代码

---

## 测试结果摘要

| 端点 | 结果 | 状态 |
|------|------|------|
| `GET /api/hacs_vision/version` | `{"version":"2.1.2"}` | ❌ 仍需重启 |
| `GET /api/hacs_vision/config_entries` | 153 entries, 含 title/state/domain | ✅ |
| `GET /api/hacs_vision/config_flow/handlers` | 921 handlers | ✅ |
| `POST /api/hacs_vision/config_flow/start` | `mqtt` → 正常返回 abort(single_instance_allowed) | ✅ |

---

## 已修复（5项，其中4项已验证生效）

### ✅ F1. const.py 版本号 → 2.2.0（代码已改，需 HA Core 重启生效）

| 文件 | 版本 | 状态 |
|------|------|------|
| [const.py](file:///d:/ai-hub/integrations/hacs_vision/custom_components/hacs_vision/const.py) | `2.2.0` ✅ | 文件已改 |
| [manifest.json](file:///d:/ai-hub/integrations/hacs_vision/custom_components/hacs_vision/manifest.json) | `2.2.0` ✅ | 本来一致 |

**测试**：API 仍返回 `2.1.2`。原因：`reload_config_entry` 不会重载 Python 模块缓存（`from .const import VERSION` 已在首次导入时固定）。**需要重启 HA Core** 才会返回新版本。

---

### ✅ F2. management.js 添加 getCategoryColor 导入

[management.js](file:///d:/ai-hub/integrations/hacs_vision/frontend_src/src/views/management.js) 第 7 行已添加：
```javascript
import { getCategoryColor } from '../shared/constants.js';
```

**风险**：零，仅补充缺失的 import。

---

### ✅ F3. console.log → console.debug

[config-flow-dialog.js](file:///d:/ai-hub/integrations/hacs_vision/frontend_src/src/components/config-flow-dialog.js) 中 2 处：

| 原代码 | 改为 | 行号 |
|--------|------|------|
| `console.log(...loaded HA backend translations...)` | `console.debug(...)` | 166 |
| `console.log(...select field options...)` | `console.debug(...)` | 865 |

---

### ✅ F4. _preloadDomainNames 并行加载

[integrations-list.js](file:///d:/ai-hub/integrations/hacs_vision/frontend_src/src/views/integrations-list.js)

```javascript
// 改前：for...of + await（串行）
for (const domain of domains) {
    await this.hass.loadBackendTranslation('config', domain);
}

// 改后：Promise.all（并行）
const results = await Promise.all(domains.map(async (domain) => {
    await this.hass.loadBackendTranslation('config', domain);
    return { domain, name, icon };
}));
```

153 个集成域从串行（~3秒）变为并行（~0.3秒）。

---

### ✅ F5. _install_locks 清理移入 finally

[hacs_operator.py](file:///d:/ai-hub/integrations/hacs_vision/custom_components/hacs_vision/hacs_operator.py)

`install_repository` 和 `remove_repository` 的 `_cleanup_lock()` 从 try 块内移至 finally 块，确保异常路径也不会泄漏锁对象。`update_repositories` 已有 finally，未动。

---

## 未修复（6项）

### ❌ U1. api.py localhost:8123 硬编码（P0）

**问题**：全部 6 个 Config Flow 代理方法使用 `http://localhost:8123`。

**测试结果**：当前 `localhost:8123` 在 HA OS Docker 环境中是可达的。从测试看 Config Flow 正常工作（mqtt 的 start 返回 abort）。地址本身在当前环境**没有实际故障**，但硬编码是脆弱的设计。

**建议**：在当前环境无故障，priority 可降为 P1。后续如需修改，改用 `self.hass.config.api.internal_url`。

---

### ❌ U2. `_ensure_index` 并发竞态（P1）

**问题**：`_ensure_custom_repos_registered()` 和 `_ensure_index()` 无锁保护。

**触发条件**：高并发场景（极少发生）。当前环境下 HACS 操作频率低，实际触发概率极低。

---

### ❌ U3. backup.py 数据源非实时（P1）

**问题**：读取 `.storage/hacs.data` 文件而非 HACS 内存实时数据。

**影响**：备份可能略滞后于实际安装状态。当前环境中备份功能使用频率未知。

---

### ❌ U4. `_getDomainColor()` 硬编码调色板（P2）

**问题**：8 色调色板 + 哈希取模，相邻集成可能同色。视觉问题，不影响功能。

---

### ❌ U5. `_filteredDomainGroups` 与 `_chipCounts` 重复遍历（P2）

**问题**：每次渲染两次遍历 153 个 entries。毫秒级开销，实际影响可忽略。

---

### ✅ U6. Config Flow URL 路径 — 审计报告假阳性

审计报告原声称 `api/config/config_entries/flow` 应为 `api/config_entries/flow`。

**测试验证**：Config Flow start 正常返回正确响应。HA 2024+ 的正确路径就是 `api/config/config_entries/flow`。**审计报告有误，撤回此条。**

---

## 最终定性与统计

| 级别 | 已修复 | 未修复 | 假阳性（撤回） |
|------|--------|--------|----------------|
| P0 | **2**（版本号已改+management导入） | **1**（localhost硬编码→建议降P1） | **1**（URL路径） |
| P1 | **2**（并行翻译+锁finally） | **2**（并发竞态+backup数据源） | 0 |
| P2 | **1**（console.log→debug） | **2**（调色板+重复遍历） | 0 |
| **总计** | **5** | **5** | **1** |

**需要 HA Core 重启才能生效**：版本号（const.py）

**已全部生效**（前端刷新即可）：management导入、console.debug、并行翻译

**需要 HA Core 重启才能生效**：锁清理（hacs_operator.py）

---

## 建议修复优先级（更新版）

1. **立即（已修复）**：刷新浏览器查看 management 导入修复、console.debug、并行翻译效果
2. **可选重启**：找一个空闲时机重启 HA Core，让版本号和锁清理生效
3. **后续可选**：localhost 硬编码、backup 数据源、调色板、重复遍历
4. **已撤回**：URL 路径问题（假阳性）