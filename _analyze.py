"""Analyze panel.js structure."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'D:\ai-hub\integrations\hacs_enhanced\custom_components\hacs_enhanced\frontend\panel.js', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
print(f"Total lines: {len(lines)}")
print(f"Line 22 (idx 21) length: {len(lines[21])}")

l = lines[21]

# Find key positions
for marker in ['const ce=new', ';const Ct=', 'statInstalled', 'let zt=null', 'const ue=', 'const Lt=', 'function Ot(']:
    p = l.find(marker)
    print(f"  '{marker}' at position: {p}")

# Print API client code
api_start = l.find('const ce=new class{')
api_end = l.find(';const Ct=', api_start)
if api_end < 0:
    api_end = l.find(';let zt=null', api_start)

if api_start >= 0:
    api_code = l[api_start:api_end] if api_end > 0 else l[api_start:api_start+3000]
    print(f"\nAPI client ({len(api_code)} chars):")
    print(api_code[:2000])
    if len(api_code) > 2000:
        print("... [truncated]")

# Find i18n function
ue_start = l.find('const ue=')
if ue_start >= 0:
    # Find end: look for next const or let declaration
    next_decl = min(
        [l.find(p, ue_start+10) for p in [';const Pt=', ';let zt=', ';const Lt='] if l.find(p, ue_start+10) > 0],
        default=ue_start+3000
    )
    ue_code = l[ue_start:next_decl]
    print(f"\ni18n function ({len(ue_code)} chars):")
    print(ue_code[:2000])
