"""Modify panel.js - T3 API + T4 i18n on line 22."""
import sys

sys.stdout.reconfigure(encoding='utf-8')

SRC = r'D:\ai-hub\integrations\hacs_enhanced\custom_components\hacs_enhanced\frontend\panel.js'
DST = r'D:\ai-hub\integrations\hacs_enhanced\_panel_modified.js'

with open(SRC, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
line22 = lines[21]

# === T3: Modify request() method ===
old_req = ('async request(e,t,o){const r={method:e,headers:this._getHeaders(),'
           'credentials:"include"};o&&(r.body=JSON.stringify(o));const i=await '
           'fetch(`${le}/${t}`,r);if(!i.ok)throw new Error(`API error: ${i.status}`);'
           'return i.json()}')

new_req = ('async request(e,t,o){const r={method:e,headers:this._getHeaders(),'
           'credentials:"include"};o&&(r.body=JSON.stringify(o));'
           'try{const i=await fetch(`${le}/${t}`,r);'
           'if(!i.ok){const s=new Error(`API error: ${i.status}`);s.status=i.status;'
           'if(this._onNetworkStatus){if(429===i.status)this._onNetworkStatus("rate_limited");'
           'else if(502===i.status)this._onNetworkStatus("server_error")}throw s}'
           'this._onNetworkStatus&&this._onNetworkStatus("online");return i.json()}'
           'catch(e){if(!navigator.onLine&&this._onNetworkStatus)this._onNetworkStatus("offline");throw e}}')

assert old_req in line22, 'FAIL: old request not found!'
line22 = line22.replace(old_req, new_req)
print('T3 OK: request() method replaced')

# === T3: _onNetworkStatus in constructor ===
old_cons = 'constructor(){this._token=null,this._hassRef=null}'
new_cons = 'constructor(){this._token=null,this._hassRef=null,this._onNetworkStatus=null}'
assert old_cons in line22, 'FAIL: constructor not found!'
line22 = line22.replace(old_cons, new_cons)
print('T3 OK: _onNetworkStatus added')

# === T3: New methods getRepoStatus + getChangelog ===
marker = ',de=e=>class extends e{'
pos = line22.find(marker)
assert pos > 0, 'FAIL: de= marker not found!'

new_methods = ('getRepoStatus(e){return this.get(`repositories/${e}`)}'
               'async getChangelog(e){const t=`hacs_changelog_${e}`;'
               'try{const o=localStorage.getItem(t);if(o){const{data:r,timestamp:i}=JSON.parse(o);'
               'if(Date.now()-i<36e5)return r}}catch(e){}'
               'try{const o=await this.get(`changelog/${e}`);'
               'try{localStorage.setItem(t,JSON.stringify({data:o,timestamp:Date.now()}))}catch(e){}'
               'return o}catch(e){return console.error("Changelog fetch failed:",e),null}}')

line22 = line22[:pos] + new_methods + line22[pos:]
print('T3 OK: getRepoStatus + getChangelog added')

# === T4: New i18n keys ===
ue_pos = line22.find('function ue(e){')
assert ue_pos > 0, 'FAIL: ue function not found!'

he_end = line22.rfind('}}', 0, ue_pos)
assert he_end > 0, 'FAIL: he dict end not found!'

new_keys = (
    ',shortcutEsc:{zh:"关闭对话框",en:"Close dialog"}'
    ',shortcutSearch:{zh:"搜索",en:"Search"}'
    ',networkOffline:{zh:"网络连接已断开，请检查网络",en:"Network disconnected \u2014 check your connection"}'
    ',networkRestored:{zh:"网络已恢复",en:"Network restored"}'
    ',haRestarting:{zh:"Home Assistant 正在重启\u2026",en:"Home Assistant is restarting\u2026"}'
    ',rateLimited:{zh:"GitHub API 限流，请稍后重试",en:"GitHub API rate limited \u2014 try again later"}'
    ',installing:{zh:"安装中\u2026",en:"Installing\u2026"}'
    ',installComplete:{zh:"已安装",en:"Installed"}'
    ',installFailed:{zh:"安装失败",en:"Install failed"}'
    ',updatingProgress:{zh:"更新中\u2026",en:"Updating\u2026"}'
    ',updateComplete:{zh:"已更新",en:"Updated"}'
    ',quickInstall:{zh:"快捷安装",en:"Quick Install"}'
    ',quickInstallPlaceholder:{zh:"粘贴 GitHub URL 或 owner/repo",en:"Paste GitHub URL or owner/repo"}'
    ',quickInstallCategory:{zh:"分类",en:"Category"}'
    ',quickInstallUrl:{zh:"仓库 URL",en:"Repository URL"}'
    ',installRepo:{zh:"安装",en:"Install"}'
    ',changelogTitle:{zh:"更新内容",en:"What\'s New"}'
    ',viewFullChangelog:{zh:"查看完整更新日志",en:"View full changelog"}'
    ',noChangelog:{zh:"暂无更新日志",en:"No changelog available"}'
)

line22 = line22[:he_end] + new_keys + line22[he_end:]
print('T4 OK: New i18n keys added')

lines[21] = line22
result = '\n'.join(lines)

with open(DST, 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Done. Written to {DST}')
print(f'Lines: {len(lines)}, Line22: {len(line22)} chars')
