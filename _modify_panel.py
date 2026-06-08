"""Modify panel.js line 22 for T3 (API) and T4 (i18n)."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

PANEL_PATH = r'custom_components\hacs_enhanced\frontend\panel.js'

with open(PANEL_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
line22 = lines[21]

# =============================================
# T3: Modify API client - request() method
# =============================================

# Old request method:
old_request = (
    'async request(e,t,o){'
    'const r={method:e,headers:this._getHeaders(),credentials:"include"};'
    'o&&(r.body=JSON.stringify(o));'
    'const i=await fetch(`${le}/${t}`,r);'
    'if(!i.ok)throw new Error(`API error: ${i.status}`);'
    'return i.json()}'
)

# New request method with network callbacks:
new_request = (
    'async request(e,t,o){'
    'const r={method:e,headers:this._getHeaders(),credentials:"include"};'
    'o&&(r.body=JSON.stringify(o));'
    'try{const i=await fetch(`${le}/${t}`,r);'
    'if(!i.ok){const s=new Error(`API error: ${i.status}`);s.status=i.status;'
    'if(this._onNetworkStatus){if(429===i.status)this._onNetworkStatus("rate_limited");'
    'else if(502===i.status)this._onNetworkStatus("server_error")}throw s}'
    'this._onNetworkStatus&&this._onNetworkStatus("online");return i.json()}'
    'catch(e){if(!navigator.onLine&&this._onNetworkStatus)this._onNetworkStatus("offline");throw e}}'
)

if old_request in line22:
    line22 = line22.replace(old_request, new_request)
    print("✓ T3: request() method replaced")
else:
    print("✗ T3: Could not find old request() method!")
    idx = line22.find('async request(')
    if idx >= 0:
        print(f"  Found 'async request(' at pos {idx}")
        print(f"  Context: {line22[idx:idx+200]}")

# =============================================
# T3: Add _onNetworkStatus in constructor and new methods
# =============================================

# Init constructor: constructor(){this._token=null,this._hassRef=null}
old_constructor = 'constructor(){this._token=null,this._hassRef=null}'
new_constructor = 'constructor(){this._token=null,this._hassRef=null,this._onNetworkStatus=null}'

if old_constructor in line22:
    line22 = line22.replace(old_constructor, new_constructor)
    print("✓ T3: _onNetworkStatus added to constructor")
else:
    print("✗ T3: Could not find constructor!")
    idx = line22.find('constructor(){this._token=null')
    if idx >= 0:
        print(f"  Found at pos {idx}: {line22[idx:idx+100]}")

# =============================================
# T3: Add getRepoStatus() and getChangelog() methods
# Insert after getReadme method, before closing },de=
# =============================================

# The getReadme method ends with: ...catch(e){return console.error("Failed to fetch README:",e),null}}}
# Then: },de=e=>class extends e{
# We need to insert between the }} and ,de=

# Find the end of getReadme and insert new methods
get_readme_end = line22.find(',de=e=>class extends e{')
if get_readme_end > 0:
    # Find the part just before ,de=
    # The getReadme ends with: ...catch(e){return console.error("Failed to fetch README:",e),null}}}
    # We need to find the exact endpoint

    # Insert new methods after getReadme closing
    new_methods = (
        'getRepoStatus(e){return this.get(`repositories/${e}`)}'
        'async getChangelog(e){'
        'const t=`hacs_changelog_${e}`;'
        'try{const o=localStorage.getItem(t);'
        'if(o){const{data:r,timestamp:i}=JSON.parse(o);'
        'if(Date.now()-i<36e5)return r}}catch(e){}'
        'try{const o=await this.get(`changelog/${e}`);'
        'try{localStorage.setItem(t,JSON.stringify({data:o,timestamp:Date.now()}))}catch(e){}'
        'return o}catch(e){return console.error("Changelog fetch failed:",e),null}}'
    )

    # Insert before ,de=
    line22 = line22[:get_readme_end] + new_methods + line22[get_readme_end:]
    print("✓ T3: getRepoStatus() and getChangelog() added")
else:
    print("✗ T3: Could not find ',de=e=>class extends e{' marker")

# =============================================
# T4: Add i18n keys
# =============================================

# Find the he dict and add new keys before the closing }
# The dict ends with: readmeTitle:{zh:"说明文档",en:"README"}}
# Then: ;function ue(e){

ue_func_pos = line22.find('function ue(e){')
if ue_func_pos > 0:
    # Find the closing }} before function ue
    # The pattern is: ...,readmeTitle:{zh:"说明文档",en:"README"}};function ue(e){
    # Find the exact insertion point
    he_end = line22.rfind('}}', 0, ue_func_pos)
    if he_end > 0:
        insert_pos = he_end  # Insert before the }} that closes he dict

        new_i18n_keys = (
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

        line22 = line22[:insert_pos] + new_i18n_keys + line22[insert_pos:]
        print("✓ T4: New i18n keys added")
    else:
        print("✗ T4: Could not find closing }} before function ue")
else:
    print("✗ T4: Could not find 'function ue(e){'")

# Write modified line 22 back
lines[21] = line22
modified_content = '\n'.join(lines)

with open(PANEL_PATH, 'w', encoding='utf-8') as f:
    f.write(modified_content)

print("\n✓ panel.js line 22 modifications saved")
print(f"  Line 22 length: {len(line22)} chars")
