# HACS Vision v6.4.2 — 审计报告 + 修复交付（2026-07-16）

> 本文档为 `D:\ai-hub\integrations\hacs_vision` 项目审计（2026-07-15 晚）的后续修复交付。
> 用户指令「123推进」= 修 P2 项 + 清 P3 死代码 + 落盘本报告。

---

## 一、审计发现回顾（2026-07-15）

| # | 严重度 | 位置 | 问题 |
|---|--------|------|------|
| 1 | 🟠 P2 | `services.yaml` | 缺失 `auto_update_*` 4 个服务定义（`__init__.py:422-425` 已注册但 yaml 无声明） |
| 2 | 🟠 P2 | `api_mixins/github_actions.py:539` | 截图 URL 兜底硬编码个人域名 `<个人HA域名:8443>` |
| 3 | 🟠 P2 | `hacs_operator.py` | 3 处 `self._hacs.hass` 访问 HACS 内部实例（轻微私有 API 耦合） |
| 4 | 🟡 P3 | `api_mixins/gitee.py` | 孤儿模块，`GiteeMixin` 未被继承/导入，纯遗留死代码 |
| 5 | 🟡 P3 | `translations/zh-Hans.json` | `options` 段引用 `{version}` 但 `config_flow.py` 无 OptionsFlow，翻译永不加载 |

> ⚠️ **审计结论修正**：原审计将 `entity_ref_finder.py` 中 `source="storage"` 列为「非公开 API」**属于误判**。
> `async_set_automation_config / async_set_script_config / async_set_scene_config` 的 `source="storage"` 是 **HA 公开标准参数**（用于区分 storage / yaml 来源），无需改动。本次仅修正真正的私有耦合（#3）。

---

## 二、本轮修复清单（实际改动）

### ✅ P2-1 · `services.yaml` 补全 auto_update 服务定义
新增 4 个服务段（无字段，handler 不读参）：
- `auto_update_start` / `auto_update_stop` / `auto_update_trigger` / `auto_update_reload_settings`
- 效果：开发者工具→服务 中现可看到名称/描述，YAML 调用有提示。

### ✅ P2-2 · `github_actions.py` 去除硬编码域名
- 旧：`ha_url = "<个人HA域名:8443>"`（个人域名兜底）
- 新：当 HA 无 external/internal URL 时，从 `self.hass.config.host` + `self.hass.http.server_port` 派生 `http://host:port`
- 效果：代码可移植，换环境不再失效。

### ✅ P2-3 · `hacs_operator.py` 降耦 HACS 内部实例
- 将 3 处 `self._hacs.hass` → `self.hass`：
  - L461 `config_entries.async_entries()`
  - L876 `async_get_clientsession(self._hacs.hass)` → `async_get_clientsession(self.hass)`
  - L898 `config_entries.async_entries()`
- 依据：同一类中 L665 已用 `self.hass.config_entries` 且运行正常，证明 `self._hacs.hass` 与 `self.hass` 指向同一 HA 实例，替换安全。

### ✅ P3-4 · 删除孤儿 `api_mixins/gitee.py`
- `GiteeMixin`（349 行/14KB）全项目零引用（含前端 grep 无匹配），永不加载。
- 已 `git rm`，git 历史可恢复，运行时零影响。

### ✅ P3-5 · 清理 `zh-Hans.json` 孤儿 `options` 段
- 删除 `options.step.init`（含 `{version}` 引用），因 `config_flow.py` 明确无 OptionsFlow。

---

## 三、验证结果（QA 阶段）

| 检查项 | 结果 |
|--------|------|
| 全部 `.py` 编译（`py_compile`） | ✅ 通过 |
| `zh-Hans.json` / `manifest.json` JSON 合法 | ✅ 通过 |
| 既有测试套件 `tests/test_init.py` | ✅ 32 passed（初始 6 个失败为环境缺 `pytest-asyncio` 插件，安装后全绿） |
| `gitee` 残留引用（.py） | ✅ 无 |
| 回归（我的改动引入） | ✅ 零回归 |

**智能路由判定**：源码改动无 Bug，测试环境缺陷（缺插件）已自行修复 → `NoOne`（无需回派工程师）。

---

## 四、重要说明：hacs_operator.py 存在本次会话前的未提交改动

`git diff` 显示 `hacs_operator.py` 除我的 3 行替换外，还包含一段 **~80 行、早于本次会话的未提交改动**（HACS "not compliant/structure" 校验失败后的 `check=False` + `repository_id` 重试逻辑，及其顶部 `async_get_clientsession` import）。

- 这段逻辑**不是本次审计修复的一部分**，也非我所写；属于该文件此前的待提交工作。
- 它与我的修改无冲突，且现有测试全部通过。
- **建议**：在提交 hacs_vision 前，先 `git diff` 复核这段预存改动，确认其意图后再统一 commit，避免把无关逻辑混入本次修复。

---

## 五、文件清单

| 文件 | 操作 |
|------|------|
| `custom_components/hacs_vision/services.yaml` | 修改（补 4 个 auto_update 服务定义） |
| `custom_components/hacs_vision/api_mixins/github_actions.py` | 修改（去硬编码域名） |
| `custom_components/hacs_vision/hacs_operator.py` | 修改（3 处 `self._hacs.hass`→`self.hass`；另含预存未提交改动） |
| `custom_components/hacs_vision/translations/zh-Hans.json` | 修改（删 options 段） |
| `custom_components/hacs_vision/api_mixins/gitee.py` | 删除（孤儿模块） |

---

## 六、用户下一步建议

1. **部署验证**：将改动 SCP 到 HA 宿主 `/config/custom_components/hacs_vision/`，`docker restart` 后硬刷面板，确认 auto_update 服务出现在开发者工具。
2. **复核预存改动**：提交前先 `git diff custom_components/hacs_vision/hacs_operator.py` 确认那段 ~80 行重试逻辑是否要一起提交。
3. **版本号**：若本次视为功能补完，建议 bump `const.py` + `manifest.json` 版本（如 6.4.3）并打 tag（遵循 `~/.workbuddy/MEMORY.md` 发布清单）。
4. **可选增强**：`_save_screenshot` 现兜底为 `http://host:port`，若 HA 在反向代理后，可进一步从请求头 `X-Forwarded-Proto/Host` 取真实外网地址。
5. **回归测试**：建议在真机执行一次「创建 GitHub issue 带截图」，验证 URL 生成正确。
