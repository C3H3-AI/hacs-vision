"""Apply T5-T11 component changes to panel.js via string replacements."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

SRC = r'D:\ai-hub\integrations\hacs_enhanced\custom_components\hacs_enhanced\frontend\panel.js'

with open(SRC, 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# ============================================================
# T5: F1 - Keyboard shortcuts
# ============================================================

# Add keyboard handler in connectedCallback
old_conn = ('async connectedCallback(){super.connectedCallback(),'
            'this.addEventListener("refresh-stats",()=>this._loadStats()),'
            'this.addEventListener("detail",e=>this._openDetail(e.detail.repo)),'
            'this.addEventListener("favorite",()=>this._updateFavoriteCount())}')

new_conn = ('async connectedCallback(){super.connectedCallback(),'
            'this.addEventListener("refresh-stats",()=>this._loadStats()),'
            'this.addEventListener("detail",e=>this._openDetail(e.detail.repo)),'
            'this.addEventListener("favorite",()=>this._updateFavoriteCount());'
            'this._keydownHandler=e=>{if("Escape"===e.key&&this._showDetail){e.preventDefault();this._closeDetail();return}'
            'if((e.ctrlKey||e.metaKey)&&"k"===e.key){e.preventDefault();'
            'const t=this.renderRoot?.querySelector(".search input");'
            'if(t){t.focus();t.select()}return}'
            'if(!this._showDetail&&document.activeElement?.tagName!=="INPUT"&&document.activeElement?.tagName!=="SELECT")'
            '{const t=["browse","favorites","installed","updates","config","backup"];'
            'const o=parseInt(e.key);if(o>=1&&o<=6){e.preventDefault();this.switchView(t[o-1])}}};'
            'window.addEventListener("keydown",this._keydownHandler)}')

assert old_conn in content, 'FAIL T5: connectedCallback not found!'
content = content.replace(old_conn, new_conn)
changes += 1
print('T5 OK: Keyboard shortcuts added to connectedCallback')

# Add disconnectedCallback cleanup
# Find the class definition end and add disconnectedCallback
# The main panel class has _closeDetail method, after which we should add disconnectedCallback
old_close = '_closeDetail(){this._showDetail=!1,this._detailRepo=null,this._readmeHtml=null,this._readmeLoading=!1}'
new_close = ('_closeDetail(){this._showDetail=!1,this._detailRepo=null,this._readmeHtml=null,this._readmeLoading=!1}'
             'disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}')

assert old_close in content, 'FAIL T5: _closeDetail not found!'
content = content.replace(old_close, new_close)
changes += 1
print('T5 OK: disconnectedCallback added')

# ============================================================
# T6: F2 - Network status banner (after waitingHA banner, before Header)
# ============================================================

old_header_comment = '<!-- Header -->'
# We need to add _networkStatus property and the banner
# First add the property
old_detail_repo = "static properties={currentView:{type:String},stats:{type:Object},_error:{type:String,state:!0},_showDetail:{type:Boolean,state:!0},_detailRepo:{type:Object,state:!0},_readmeHtml:{type:String,state:!0},_readmeLoading:{type:Boolean,state:!0},_viewTransition:{type:Boolean,state:!0},_apiReady:{type:Boolean,state:!0}}"

new_detail_repo = "static properties={currentView:{type:String},stats:{type:Object},_error:{type:String,state:!0},_networkStatus:{type:String,state:!0},_showDetail:{type:Boolean,state:!0},_detailRepo:{type:Object,state:!0},_readmeHtml:{type:String,state:!0},_readmeLoading:{type:Boolean,state:!0},_viewTransition:{type:Boolean,state:!0},_apiReady:{type:Boolean,state:!0},_showQuickInstall:{type:Boolean,state:!0},_quickInstallUrl:{type:String,state:!0},_quickInstallCategory:{type:String,state:!0},_quickInstallInstalling:{type:Boolean,state:!0}}"

assert old_detail_repo in content, 'FAIL T6: static properties not found!'
content = content.replace(old_detail_repo, new_detail_repo)
changes += 1
print('T6/T7 OK: Properties added (_networkStatus + quickInstall)')

# Add _networkStatus init in connectedCallback (already done via T5)

# Add network API callback registration 
# Find: async _loadStats(){try{this._error="",this.stats=await ce.getStats()
old_loadstats = 'async _loadStats(){try{this._error="",this.stats=await ce.getStats()'
new_loadstats = ('async _loadStats(){'
                 'ce._onNetworkStatus||(ce._onNetworkStatus=e=>{this._networkStatus=e});'
                 'try{this._error="",this.stats=await ce.getStats()')

assert old_loadstats in content, 'FAIL T6: _loadStats not found!'
content = content.replace(old_loadstats, new_loadstats)
changes += 1
print('T6 OK: Network callback registered in _loadStats')

# Add network banner after waitingHA banner, before Header
old_waiting_banner = ('${this._apiReady?"":H`\n'
                      '          <div class="error-banner">\n'
                      '            ${ue("waitingHA")}\n'
                      '          </div>\n'
                      '        `}\n'
                      '\n'
                      '        <!-- Header -->')

new_waiting_banner = ('${this._apiReady?"":H`\n'
                      '          <div class="error-banner">\n'
                      '            ${ue("waitingHA")}\n'
                      '          </div>\n'
                      '        `}\n'
                      '\n'
                      '        ${"offline"===this._networkStatus?H`<div class="network-banner offline">\\u26a0\\ufe0f ${ue("networkOffline")}</div>`:""}\n'
                      '        ${"rate_limited"===this._networkStatus?H`<div class="network-banner warning">\\u26a0\\ufe0f ${ue("rateLimited")}</div>`:""}\n'
                      '        ${"server_error"===this._networkStatus?H`<div class="network-banner warning">\\u26a0\\ufe0f ${ue("haRestarting")}</div>`:""}\n'
                      '\n'
                      '        <!-- Header -->')

assert old_waiting_banner in content, 'FAIL T6: waitingHA banner not found!'
content = content.replace(old_waiting_banner, new_waiting_banner)
changes += 1
print('T6 OK: Network status banners added')

# ============================================================
# T7: F4 - Quick install button in header + modal
# ============================================================

# Add quick install button to header-right
old_header_right = ('<div class="header-right">\n'
                    '            <div class="stat">\n'
                    '              <div class="stat-num">${this.stats.total_installed??0}</div>')

new_header_right = ('<div class="header-right">\n'
                    '            <button class="quick-install-btn" @click=${()=>{this._showQuickInstall=!0}} title="${ue("quickInstall")}">\n'
                    '              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>\n'
                    '            </button>\n'
                    '            <div class="stat">\n'
                    '              <div class="stat-num">${this.stats.total_installed??0}</div>')

assert old_header_right in content, 'FAIL T7: header-right not found!'
content = content.replace(old_header_right, new_header_right)
changes += 1
print('T7 OK: Quick install button added')

# Add quick install modal - insert before the Toast container
old_toast = '<!-- Toast container (supports queue) -->'
new_toast_section = (
    '${this._showQuickInstall?H`'
    '<div class="modal-overlay" @click=${e=>{e.target===e.currentTarget&&(this._showQuickInstall=!1)}}>'
    '<div class="modal" style="max-width:400px;">'
    '<div class="modal-header"><div class="modal-title">${ue("quickInstall")}</div>'
    '<button class="modal-close" @click=${()=>{this._showQuickInstall=!1}}>\\u2715</button></div>'
    '<div class="modal-body">'
    '<div style="margin-bottom:12px;">'
    '<label style="font-size:12px;color:var(--secondary-text-color);display:block;margin-bottom:6px;">${ue("quickInstallUrl")}</label>'
    '<input class="form-input" type="text" placeholder="${ue("quickInstallPlaceholder")}" .value=${this._quickInstallUrl} @input=${e=>{this._quickInstallUrl=e.target.value}} @keydown=${e=>{"Enter"===e.key&&this._doQuickInstall()}} style="width:100%;">'
    '</div>'
    '<div style="margin-bottom:16px;">'
    '<label style="font-size:12px;color:var(--secondary-text-color);display:block;margin-bottom:6px;">${ue("quickInstallCategory")}</label>'
    '<select class="form-select" .value=${this._quickInstallCategory} @change=${e=>{this._quickInstallCategory=e.target.value}} style="width:100%;">'
    '<option value="integration">${ue("catIntegration")}</option>'
    '<option value="plugin">${ue("catPlugin")}</option>'
    '<option value="theme">${ue("catTheme")}</option>'
    '<option value="appdaemon">${ue("catAppDaemon")}</option>'
    '<option value="python_script">${ue("catPython")}</option>'
    '<option value="template">${ue("catTemplate")}</option>'
    '</select></div>'
    '<button class="modal-btn primary" style="width:100%;" @click=${this._doQuickInstall} ?disabled=${this._quickInstallInstalling}>'
    '${this._quickInstallInstalling?ue("installing"):ue("installRepo")}</button>'
    '</div></div></div>`:""}\n'
    '\n'
    '      <!-- Toast container (supports queue) -->'
)

assert old_toast in content, 'FAIL T7: Toast container not found!'
content = content.replace(old_toast, new_toast_section)
changes += 1
print('T7 OK: Quick install modal added')

# Add _doQuickInstall method 
# Insert before the closing of the main class render
old_end_of_class = "}}let zt=null"
new_end_of_class = ("}async _doQuickInstall(){const e=(this._quickInstallUrl||\"\").trim();"
                    "if(!e)return;const t=e.match(/github\\.com\\/([^\\/]+\\/[^\\/\\s]+)/);"
                    "const o=t?t[1]:e;this._quickInstallInstalling=!0;"
                    "try{await ce.addCustomRepo(o,this._quickInstallCategory);"
                    "await ce.install(o,this._quickInstallCategory);"
                    "Ot(ue(\"installComplete\"),\"success\");"
                    "this._quickInstallUrl=\"\";this._showQuickInstall=!1;"
                    "this.dispatchEvent(new CustomEvent(\"refresh-stats\",{bubbles:!0,composed:!0}))}"
                    "catch(e){Ot(`${ue(\"installFailed\")}: ${e.message}`,\"error\")}"
                    "this._quickInstallInstalling=!1}}}let zt=null")

assert old_end_of_class in content, 'FAIL T7: end of class not found!'
content = content.replace(old_end_of_class, new_end_of_class)
changes += 1
print('T7 OK: _doQuickInstall method added')

# ============================================================
# T8: F5 - Category counts in browse-view
# ============================================================

# Find browse-view _load method and add categoryCounts
old_browse_load = ('async _load(){this.loading=!0;try{const e=await ce.listRepositories'
                   '({search:this.search,category:this.category,sort:this.sort,page:this.page,limit:this.limit});'
                   'this.items=e.repositories,this.total=e.total}')

new_browse_load = ('async _load(){this.loading=!0;try{const e=await ce.listRepositories'
                   '({search:this.search,category:this.category,sort:this.sort,page:this.page,limit:this.limit});'
                   'this.items=e.repositories,this.total=e.total,this.categoryCounts=e.category_counts||{}}')

assert old_browse_load in content, 'FAIL T8: _load not found!'
content = content.replace(old_browse_load, new_browse_load)
changes += 1
print('T8 OK: categoryCounts in _load')

# Add categoryCounts property to browse-view
old_browse_props = 'static properties={items:{type:Array},total:{type:Number},search:{type:String},category:{type:String},sort:{type:String},page:{type:Number},loading:{type:Boolean}}'

new_browse_props = 'static properties={items:{type:Array},total:{type:Number},categoryCounts:{type:Object},search:{type:String},category:{type:String},sort:{type:String},page:{type:Number},loading:{type:Boolean}}'

assert old_browse_props in content, 'FAIL T8: browse properties not found!'
content = content.replace(old_browse_props, new_browse_props)
changes += 1
print('T8 OK: categoryCounts property')

# Add category count in category tab rendering
old_cat_tab = '${e.icon} ${e.label}'
new_cat_tab = '${e.icon} ${e.label}${void 0!==this.categoryCounts[e.value]?H`<span class="cat-count">(${this.categoryCounts[e.value]})</span>`:""}'

assert old_cat_tab in content, 'FAIL T8: category tab not found!'
content = content.replace(old_cat_tab, new_cat_tab)
changes += 1
print('T8 OK: Category count rendering')

# ============================================================
# T9: F3 - Progress in updates-view + F6 Changelog
# ============================================================

# Add _installingIds property to updates-view
old_upd_props = 'class Vt extends ne{static properties={updates:{type:Array}}'

new_upd_props = ('class Vt extends ne{static properties={updates:{type:Array},'
                 '_installingIds:{type:Array,state:!0},_changelogs:{type:Object,state:!0}}')

assert old_upd_props in content, 'FAIL T9: updates properties not found!'
content = content.replace(old_upd_props, new_upd_props)
changes += 1
print('T9 OK: Updates properties')

# Modify _updateOne to add progress polling (F3)
# Find the _updateOne method
old_update_one = 'async _updateOne(e){await ce.update([e]),window.location.reload()}'
new_update_one = ('async _updateOne(e){const t=e.id||e.full_name;'
                  'this._installingIds=[...this._installingIds,t];'
                  'try{await ce.update([t]);const o=e.latest_version;let r=0;'
                  'const i=async()=>{if(r++>30){this._installingIds=this._installingIds.filter(e=>e!==t);'
                  'Ot(`${ue("installFailed")}: timeout`,"error");return}'
                  'try{const e=await ce.getRepoStatus(t);'
                  'if(e?.installed_version===o){this._installingIds=this._installingIds.filter(e=>e!==t);'
                  'Ot(`${ue("updateComplete")} ${e.full_name||e.name}`,"success");'
                  'this._load();this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}));return}}catch(e){}'
                  'setTimeout(i,2e3)};setTimeout(i,2e3)}'
                  'catch(e){this._installingIds=this._installingIds.filter(e=>e!==t);'
                  'Ot(`${ue("updateFailed")}: ${e.message}`,"error")}}')

assert old_update_one in content, 'FAIL T9: _updateOne not found!'
content = content.replace(old_update_one, new_update_one)
changes += 1
print('T9 OK: _updateOne with progress polling')

# Add _loadChangelogs method after _load
old_upd_load = 'async _load(){try{const e=await ce.getUpdates();this.updates=e.updates}catch(e){console.error("load updates error",e)}}'
new_upd_load = ('async _load(){try{const e=await ce.getUpdates();this.updates=e.updates}catch(e){console.error("load updates error",e)}'
                'this._loadChangelogs()}'
                'async _loadChangelogs(){const e={};'
                'for(const t of this.updates){const o=t.full_name;if(o)try{const r=await ce.getChangelog(o);'
                'if(r?.body)e[o]=r}catch(e){}}this._changelogs={...this._changelogs,...e}}')

assert old_upd_load in content, 'FAIL T9: _load not found in updates!'
content = content.replace(old_upd_load, new_upd_load)
changes += 1
print('T9 OK: _loadChangelogs added')

# Modify the update button to show progress
old_update_btn = '<button class="update-btn" @click=${()=>this._updateOne(t.full_name||t.id)}>更新</button>'
new_update_btn = ('<button class="update-btn" @click=${()=>this._updateOne(t)} '
                  '?disabled=${this._installingIds?.includes(t.id||t.full_name)}>'
                  '${this._installingIds?.includes(t.id||t.full_name)?'
                  'H`\\u23f3 ${ue("updatingProgress")}`:H`\\u2b06 ${ue("updateNow")}`}</button>')

assert old_update_btn in content, 'FAIL T9: update button not found!'
content = content.replace(old_update_btn, new_update_btn)
changes += 1
print('T9 OK: Progress button in updates')

# Add changelog preview in update item (F6)
old_update_item_end = '</div>\n        </div>\n      `)}'
new_update_item_end = ('</div>\n'
                       '          ${this._changelogs?.[t.full_name]?.body?H`'
                       '<div class="changelog-preview"><div class="changelog-title">${ue("changelogTitle")}</div>'
                       '<div class="changelog-body">${this._changelogs[t.full_name].body.split("\\n").slice(0,3).join("\\n")}</div>'
                       '<a class="changelog-link" href="${this._changelogs[t.full_name].url||`https://github.com/${t.full_name}/releases`}" target="_blank" rel="noopener">${ue("viewFullChangelog")}</a></div>`:""}\n'
                       '        </div>\n'
                       '      `)}')

assert old_update_item_end in content, 'FAIL T9: update item end not found!'
content = content.replace(old_update_item_end, new_update_item_end)
changes += 1
print('T9 OK: Changelog preview in updates')

# ============================================================
# T10: F3 - Progress in installed-view
# ============================================================

# Add _installingIds property
old_inst_props = 'class Wt extends ne{static properties={installed:{type:Array},selected:{type:Object}}'
new_inst_props = ('class Wt extends ne{static properties={installed:{type:Array},selected:{type:Object},'
                  '_installingIds:{type:Array,state:!0}}')

assert old_inst_props in content, 'FAIL T10: installed properties not found!'
content = content.replace(old_inst_props, new_inst_props)
changes += 1
print('T10 OK: Installed properties')

# Modify _updateSelected to show progress
old_update_sel = 'async _updateSelected(){const e=Array.from(this.selected);if(!e.length)return;await ce.update(e),this.selected.clear();const t=await ce.getInstalled();this.installed=t.installed}'
new_update_sel = ('async _updateSelected(){const e=Array.from(this.selected);if(!e.length)return;'
                  'this._installingIds=[...this._installingIds,...e];'
                  'try{await ce.update(e);const t=setInterval(async()=>{try{const t=await ce.getInstalled();'
                  'this.installed=t.installed;const o=e.every(e=>{const r=t.installed.find(t=>(t.id||t.full_name)===e);'
                  'return!r||!r.update_available});if(o){clearInterval(t);this._installingIds=[];'
                  'this.selected.clear();Ot(ue("updateComplete"),"success")}}catch(e){}},2e3);'
                  'setTimeout(()=>{clearInterval(t);this._installingIds=[]},6e4)}'
                  'catch(e){this._installingIds=[];Ot(`${ue("updateFailed")}: ${e.message}`,"error")}}')

assert old_update_sel in content, 'FAIL T10: _updateSelected not found!'
content = content.replace(old_update_sel, new_update_sel)
changes += 1
print('T10 OK: _updateSelected with progress')

# Update the button to show progress
old_update_sel_btn = '更新选中 (${this.selected.size})'
new_update_sel_btn = ('${this._installingIds?.length?H`\\u23f3 ${ue("updatingProgress")} (${this.selected.size})`'
                      ':H`\\u2b06 ${ue("update")} (${this.selected.size})`}')

assert old_update_sel_btn in content, 'FAIL T10: update button text not found!'
content = content.replace(old_update_sel_btn, new_update_sel_btn)
changes += 1
print('T10 OK: Progress button in installed')

# ============================================================
# T11: F3 - Progress in repo-card (install button)
# ============================================================

# Add _installing property to repo-card
old_card_props = 'class Pt extends ne{static properties={repo:{type:Object},_isFavorite:{type:Boolean,state:!0}}'
new_card_props = ('class Pt extends ne{static properties={repo:{type:Object},_isFavorite:{type:Boolean,state:!0},'
                  '_installing:{type:Boolean,state:!0}}')

assert old_card_props in content, 'FAIL T11: repo-card properties not found!'
content = content.replace(old_card_props, new_card_props)
changes += 1
print('T11 OK: repo-card properties')

# Replace install button in actions section with progress variant
old_install_btn = ('<button class="action-btn primary" @click=${e=>this._handleAction(e,"install")}>\n'
                   '              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>\n'
                   '              <span class="label">${ue("install")}</span>\n'
                   '            </button>')

new_install_btn = ('${this._installing?H`<button class="action-btn primary installing" disabled>'
                   '<span class="label">\\u23f3 ${ue("installing")}</span></button>`'
                   ':H`<button class="action-btn primary" @click=${e=>this._handleAction(e,"install")}>'
                   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
                   '<span class="label">${ue("install")}</span></button>`}')

assert old_install_btn in content, 'FAIL T11: install button not found!'
content = content.replace(old_install_btn, new_install_btn)
changes += 1
print('T11 OK: Progress on install button')

# Modify _handleAction to set _installing
old_handle_action = "_handleAction(e,t){e.stopPropagation(),this.dispatchEvent(new CustomEvent(t,{detail:{repo:this.repo},bubbles:!0,composed:!0}))}"
new_handle_action = ("_handleAction(e,t){e.stopPropagation(),"
                     '"install"===t&&(this._installing=!0,setTimeout(()=>{this._installing=!1},6e4)),'
                     "this.dispatchEvent(new CustomEvent(t,{detail:{repo:this.repo},bubbles:!0,composed:!0}))}")

assert old_handle_action in content, 'FAIL T11: _handleAction not found!'
content = content.replace(old_handle_action, new_handle_action)
changes += 1
print('T11 OK: _handleAction with installing flag')

# ============================================================
# Add CSS for new components (network banner, quick install, changelog, progress)
# ============================================================

# Add CSS after the responsive section (before the closing backtick of styles)
# Find the end of CSS section
old_css_end = '    @media (max-width: 768px) {\n      .img-container { height: 100px; }'
# Add new CSS before this

# Network banner CSS + quick install CSS + changelog CSS + progress CSS
new_css = (
    '    /* ===== Network Banner (F2) ===== */\n'
    '    .network-banner {\n'
    '      margin-bottom: 12px; padding: 12px 16px;\n'
    '      border-radius: 10px; font-size: 13px; text-align: center;\n'
    '      animation: slideDown 0.3s ease;\n'
    '    }\n'
    '    .network-banner.offline { background: #ffebee; border: 1px solid #f44336; color: #c62828; }\n'
    '    .network-banner.warning { background: #fff3e0; border: 1px solid #ff9800; color: #e65100; }\n'
    '    @keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }\n'
    '\n'
    '    /* ===== Quick Install Button (F4) ===== */\n'
    '    .quick-install-btn {\n'
    '      width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--primary-color);\n'
    '      background: transparent; color: var(--primary-color); cursor: pointer;\n'
    '      display: flex; align-items: center; justify-content: center;\n'
    '      transition: all 0.2s; flex-shrink: 0;\n'
    '    }\n'
    '    .quick-install-btn:hover { background: var(--primary-color); color: #fff; }\n'
    '    .quick-install-btn svg { width: 18px; height: 18px; }\n'
    '\n'
    '    /* ===== Form inputs (F4) ===== */\n'
    '    .form-input, .form-select {\n'
    '      padding: 10px 12px; border: 1px solid var(--divider-color);\n'
    '      border-radius: 8px; font-size: 13px; background: var(--card-background-color);\n'
    '      color: var(--primary-text-color); outline: none;\n'
    '      box-sizing: border-box;\n'
    '    }\n'
    '    .form-input:focus, .form-select:focus { border-color: var(--primary-color); }\n'
    '\n'
    '    /* ===== Category Count (F5) ===== */\n'
    '    .cat-count { font-size: 10px; opacity: 0.7; margin-left: 2px; }\n'
    '\n'
    '    /* ===== Changelog Preview (F6) ===== */\n'
    '    .changelog-preview {\n'
    '      margin-top: 8px; padding: 10px 12px;\n'
    '      background: var(--secondary-background-color);\n'
    '      border-radius: 8px; font-size: 12px;\n'
    '    }\n'
    '    .changelog-title { font-weight: 600; margin-bottom: 6px; color: var(--primary-text-color); }\n'
    '    .changelog-body { color: var(--secondary-text-color); white-space: pre-wrap; line-height: 1.5; }\n'
    '    .changelog-link { color: var(--primary-color); font-size: 11px; text-decoration: none; display: inline-block; margin-top: 6px; }\n'
    '    .changelog-link:hover { text-decoration: underline; }\n'
    '\n'
    '    /* ===== Progress Animation (F3) ===== */\n'
    '    .action-btn.installing {\n'
    '      opacity: 0.7; cursor: not-allowed;\n'
    '      animation: pulse 1.5s infinite;\n'
    '    }\n'
    '    @keyframes pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.4; } }\n'
    '\n'
    '    @media (max-width: 768px) {\n      .img-container { height: 100px; }'
)

assert old_css_end in content, 'FAIL CSS: end marker not found!'
content = content.replace(old_css_end, new_css)
changes += 1
print('CSS OK: New CSS rules added')

# ============================================================
# Write the result
# ============================================================
import os, tempfile
tmp = os.path.join(tempfile.gettempdir(), 'panel_final.js')
with open(tmp, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\n=== SUMMARY ===')
print(f'Total changes applied: {changes}')
print(f'Written to: {tmp}')
print(f'File size: {len(content)} chars, {content.count(chr(10))+1} lines')
