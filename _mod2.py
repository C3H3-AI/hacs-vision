"""Modify panel.js line 22 - T3 API + T4 i18n."""
import sys, os, tempfile

sys.stdout.reconfigure(encoding='utf-8')
SRC = r'D:\ai-hub\integrations\hacs_enhanced\custom_components\hacs_enhanced\frontend\panel.js'

with open(SRC, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
line22 = lines[21]
print(f"Original line22 length: {len(line22)}")

# -- T3: request() --
old_req = 'async request(e,t,o){const r={method:e,headers:this._getHeaders(),credentials:"include"};o&&(r.body=JSON.stringify(o));const i=await fetch(`${le}/${t}`,r);if(!i.ok)throw new Error(`API error: ${i.status}`);return i.json()}'

new_req = 'async request(e,t,o){const r={method:e,headers:this._getHeaders(),credentials:"include"};o&&(r.body=JSON.stringify(o));try{const i=await fetch(`${le}/${t}`,r);if(!i.ok){const s=new Error(`API error: ${i.status}`);s.status=i.status;if(this._onNetworkStatus){if(429===i.status)this._onNetworkStatus("rate_limited");else if(502===i.status)this._onNetworkStatus("server_error")}throw s}this._onNetworkStatus&&this._onNetworkStatus("online");return i.json()}catch(e){if(!navigator.onLine&&this._onNetworkStatus)this._onNetworkStatus("offline");throw e}}'

assert old_req in line22, 'FAIL: old request not found!'
line22 = line22.replace(old_req, new_req)
print('T3: request() replaced')

# -- T3: constructor --
old_cons = 'constructor(){this._token=null,this._hassRef=null}'
new_cons = 'constructor(){this._token=null,this._hassRef=null,this._onNetworkStatus=null}'
assert old_cons in line22, 'FAIL: constructor not found!'
line22 = line22.replace(old_cons, new_cons)
print('T3: _onNetworkStatus added')

# -- T3: new methods --
marker = ',de=e=>class extends e{'
pos = line22.find(marker)
assert pos > 0, 'FAIL: de= marker not found!'

new_methods = 'getRepoStatus(e){return this.get(`repositories/${e}`)}async getChangelog(e){const t=`hacs_changelog_${e}`;try{const o=localStorage.getItem(t);if(o){const{data:r,timestamp:i}=JSON.parse(o);if(Date.now()-i<36e5)return r}}catch(e){}try{const o=await this.get(`changelog/${e}`);try{localStorage.setItem(t,JSON.stringify({data:o,timestamp:Date.now()}))}catch(e){}return o}catch(e){return console.error("Changelog fetch failed:",e),null}}'

line22 = line22[:pos] + new_methods + line22[pos:]
print('T3: getRepoStatus + getChangelog added')

# -- T4: i18n --
ue_pos = line22.find('function ue(e){')
assert ue_pos > 0, 'FAIL: ue function not found!'
he_end = line22.rfind('}}', 0, ue_pos)
assert he_end > 0, 'FAIL: he end not found!'

new_keys = ',shortcutEsc:{zh:"\u5173\u95ed\u5bf9\u8bdd\u6846",en:"Close dialog"},shortcutSearch:{zh:"\u641c\u7d22",en:"Search"},networkOffline:{zh:"\u7f51\u7edc\u8fde\u63a5\u5df2\u65ad\u5f00\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc",en:"Network disconnected \u2014 check your connection"},networkRestored:{zh:"\u7f51\u7edc\u5df2\u6062\u590d",en:"Network restored"},haRestarting:{zh:"Home Assistant \u6b63\u5728\u91cd\u542f\u2026",en:"Home Assistant is restarting\u2026"},rateLimited:{zh:"GitHub API \u9650\u6d41\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",en:"GitHub API rate limited \u2014 try again later"},installing:{zh:"\u5b89\u88c5\u4e2d\u2026",en:"Installing\u2026"},installComplete:{zh:"\u5df2\u5b89\u88c5",en:"Installed"},installFailed:{zh:"\u5b89\u88c5\u5931\u8d25",en:"Install failed"},updatingProgress:{zh:"\u66f4\u65b0\u4e2d\u2026",en:"Updating\u2026"},updateComplete:{zh:"\u5df2\u66f4\u65b0",en:"Updated"},quickInstall:{zh:"\u5feb\u6377\u5b89\u88c5",en:"Quick Install"},quickInstallPlaceholder:{zh:"\u7c98\u8d34 GitHub URL \u6216 owner/repo",en:"Paste GitHub URL or owner/repo"},quickInstallCategory:{zh:"\u5206\u7c7b",en:"Category"},quickInstallUrl:{zh:"\u4ed3\u5e93 URL",en:"Repository URL"},installRepo:{zh:"\u5b89\u88c5",en:"Install"},changelogTitle:{zh:"\u66f4\u65b0\u5185\u5bb9",en:"What\'s New"},viewFullChangelog:{zh:"\u67e5\u770b\u5b8c\u6574\u66f4\u65b0\u65e5\u5fd7",en:"View full changelog"},noChangelog:{zh:"\u6682\u65e0\u66f4\u65b0\u65e5\u5fd7",en:"No changelog available"}'

line22 = line22[:he_end] + new_keys + line22[he_end:]
print('T4: New i18n keys added')

# Write modified line22 only
lines[21] = line22
tmp = os.path.join(tempfile.gettempdir(), 'panel_modified.js')
with open(tmp, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print(f'Written to {tmp}, {len(lines)} lines, line22={len(line22)} chars')
