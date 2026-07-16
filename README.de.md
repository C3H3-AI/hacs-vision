# HACS Vision

[![HACS Validation](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml/badge.svg)](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/releases)
[![Downloads](https://img.shields.io/github/downloads/C3H3-AI/hacs-vision/total)](https://github.com/C3H3-AI/hacs-vision/releases)
[![Stars](https://img.shields.io/github/stars/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/stargazers)
[![License](https://img.shields.io/github/license/C3H3-AI/hacs-vision)](LICENSE)

[![中文](https://img.shields.io/badge/lang-zh--CN-blue.svg)](README.md)
[![English](https://img.shields.io/badge/lang-en-red.svg)](README.en.md)
[![Deutsch](https://img.shields.io/badge/lang-de-green.svg)](#)

> **Aktuelle Version**: v6.5.1 | **Minimale HA-Version**: 2024.1.0

> **⚠️ Voraussetzung**: [HACS](https://hacs.xyz) muss installiert und konfiguriert sein.

---

## Einführung

**HACS Vision** ist ein modernes visuelles Panel für HACS mit integrierter Shop-Oberfläche. Durchsuchen, installieren, aktualisieren und verwalten Sie Home-Assistant-Integrationen, Plugins und Themes wie in einem App Store. Konfigurieren Sie jede HA-Integration (Config Flow / Options Flow) direkt im Panel – mit automatischer deutscher Lokalisierung.

---

## Funktionen

- **🛒 Shop-Durchsuchen** — Suche, Kategorie-Filter, mehrdimensionale Sortierung, Favoriten. Karten-/Listenansicht, **Filter+Sortierung in einer Zeile**. Filterung nach **Favoriten**. Versionsauswahl mit Changelog-Vorschau
- **⭐ Repository-Star** — Lokale Favoriten und GitHub-Stars unabhängig voneinander. Ein-Klick Star/Unstar
- **🔑 GitHub-Anmeldung** — Eigenständige Token-Eingabe in den Einstellungen, getrennter Speicher, automatische Login-Wiederherstellung
- **📦 Batch-Repo-Hinzufügen** — GitHub-Organisations-/Benutzer-URL eingeben, alle Repositorys auflisten und per Auswahlbox hinzufügen
- **🔄 Update-Verwaltung** — Alle ausstehenden Updates mit Fortschrittsverfolgung, einzeln oder stapelweise. **Ignorieren** unerwünschter Repositorys
- **📦 Repo-Verwaltung** — Verwaltung installierter Repos, Versionshistorie, **erneuter Download** (fehlerhafte Installationen reparieren) oder entfernen. **Status/Typ/Repo**-Dreifachfilter + Sortierung
- **⚙️ Integrationskonfiguration** — Options Flow jeder installierten HA-Integration direkt im Panel konfigurieren (z. B. xiaomi_home, xiaomi_miot, haier), mit automatischer deutscher Lokalisierung
- **🔌 Integration hinzufügen** — HA-Config-Flow direkt aus dem Panel starten
- **📊 Statistiken** — Echtzeit-Anzeige von installierten/aktualisierbaren/Favoriten-Zahlen
- **🔔 Benachrichtigungen** — Automatische Benachrichtigung bei verfügbaren Updates, optimiertes Caching
- **📱 Responsives Design** — Für Desktop und Mobil optimiert, 44px Touch-Ziele
- **🧩 Integrationsverwaltung** — Kartenraster aller installierten Integrationen mit deutscher Suche, Statusfilter, Kategoriegruppierung
- **🔍 Geräte- & Entität-Drilldown** — Integrationskarte klicken → nach Bereich gruppierte Geräteliste → Echtzeit-Entitätsstatus & -Attribute
- **🎮 Ein-Klick-Entitätssteuerung** — Schalter, Lampen, Schlösser, Jalousien, Lüfter direkt im Panel steuern
- **🏷️ Deutsche Namensübersetzung** — Automatische Anzeige deutscher Namen für offizielle & benutzerdefinierte Integrationen
- **🎨 Symbole** — CDN → lokales Symbol → Erstbuchstabe-Fallback, dreistufiges Laden
- **🔗 EntityRefFinder** — Alle Verweise auf eine Entity-ID in HA finden (Automationen, Skripte, Szenen, Dashboards), mit Ein-Klick-Ersetzung
- **🔄 Erneuter Download** — Ein-Klick-Neuinstallation für installierte Repos (Deinstallation + Neuinstallation) zur Reparatur defekter Installationen
- **⛔ Repo ignorieren** — Repositorys zur Ignorierliste hinzufügen, aus Suchergebnissen und Update-Benachrichtigungen ausblenden
- **🖼️ Konfigurationsseite einbetten** — Integrationskarte klicken, um native HA-Konfigurationsseite im Iframe-Modal zu öffnen, Doppelklick für Vollbild
- **🧩 Config-Flow-Formular** — Dropdown-Menü als Radio-Buttons mit Weiter-Button dargestellt, intuitivere Konfiguration
- **🤖 Automatische Updates** — Geplante Hintergrundupdates mit Whitelist, konfigurierbare Intervalle (1h/3h/6h/12h/24h), Update-Benachrichtigungen, Pro-Repo-Schalter

---

## Screenshots

| Store | Detail | Config Flow |
|:-----:|:------:|:-----------:|
| ![store](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/store.png) | ![detail](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/detail.png) | ![config-flow](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/config-flow.png) |
| **Management** | **Updates** | **Settings** |
| ![management](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/management.png) | ![updates](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/updates.png) | ![settings](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/settings.png) |
| **Integrations** | **Integration Config** | |
| ![integrations](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/integrations.png) | ![integration-config](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/integration-config.png) | |

---

## Installation

### Über HACS-Benutzerrepository installieren (Empfohlen)

> ⚠️ **HACS Vision ist NICHT im standardmäßigen HACS-Store enthalten** und kann nicht über die Storesuche installiert werden. Fügen Sie dieses Repository über „Benutzerdefinierte Repositorys“ mit der unten stehenden URL hinzu.

1. Stellen Sie sicher, dass [HACS](https://hacs.xyz) installiert ist
2. Gehen Sie zu **HACS → Integrationen → Benutzerdefinierte Repositorys** (Menü oben rechts)
3. Fügen Sie die Repository-URL hinzu: `https://github.com/C3H3-AI/hacs-vision`
4. Kategorie: **Integration**
5. Klicken Sie auf **Installieren**
6. **Home Assistant neu starten**

### Manuelle Installation

1. Laden Sie die neueste [Version](https://github.com/C3H3-AI/hacs-vision/releases) herunter
2. Kopieren Sie das Verzeichnis `custom_components/hacs_vision` in das `custom_components/`-Verzeichnis von HA
3. Starten Sie Home Assistant neu

---

## Konfiguration

1. Gehen Sie zu **Einstellungen → Geräte & Dienste → Integration hinzufügen**
2. Suchen Sie nach **HACS Vision**
3. Klicken Sie auf **Absenden** (keine zusätzliche Konfiguration erforderlich)
4. Das Panel erscheint in der Seitenleiste

---

## Verwendung

### 🛒 Shop

Durchsuchen Sie alle verfügbaren HACS-Repositorys. Filtern Sie mit der Suchleiste und den kombinierten Filter-Chips (Status/Tags/Typ/Sortierung in einer Zeile). Klicken Sie auf das Herz-Symbol, um Favoriten zu setzen. Erneuter Download und Ignorieren möglich. Zwischen Karten- und Listenansicht umschaltbar.

### 🔄 Aktualisierungen

Zeigt alle Repositorys mit ausstehenden Updates an. Verwenden Sie **Alle aktualisieren** für ein Upgrade aller Repositorys oder **Auswahl aktualisieren** für bestimmte. Stapelverarbeitung unterstützt.

### 📦 Verwaltung

Verwalten Sie installierte Repositorys mit **Status** (installiert/aktualisierbar/nicht installiert), **Typ** (Integration/Plugin/Theme) und **Repo** (alle/archiviert/unbenannt/ignoriert) Dreifachfilter + Sortierung. Stapelverarbeitung unterstützt. Archivierte und umbenannte Repositorys werden als Karten mit Aktionsschaltflächen unten angezeigt.

### 🧩 Integrationsverwaltung

Durchsuchen Sie alle installierten HA-Integrationen in einem Kartenraster mit deutscher Namenssuche, Statusfilter und Stapeloperationen. **Karte klicken**, um die native HA-Konfigurationsseite zu öffnen (Iframe-eingebettet, Seitenleiste per CSS beschnitten), Doppelklick für Vollbild. Die Schaltfläche **⚙ Konfigurieren** öffnet den Options-Flow-Dialog mit automatischer deutscher Übersetzung.

### ⚙️ Einstellungen

Konfigurieren Sie das Panel-Verhalten, prüfen Sie Versionsinformationen, starten Sie HA neu oder fügen Sie neue HA-Integrationen hinzu.

---

## Änderungsprotokoll
### v6.5.1 (2026-07-16) — Lokale Persistenz der Übersetzungsergebnisse
- **Optimiert**: **Übersetzungsergebnisse lokal zwischengespeichert** — Die übersetzte README wird im `localStorage` des Browsers gespeichert (standardmäßig 7 Tage, max. 1 MB pro Eintrag, 50 Einträge LRU). Nach dem Schließen des Fensters, Aktualisieren oder Neustart von HA wird eine zwischengespeicherte Übersetzung **sofort ohne LLM-Aufruf** angezeigt — keine Latenz, keine Token-Kosten.
- **Zusatznutzen**: Bereits übersetzte Repositorys lassen sich auch ohne konfigurierten Übersetzungs-Assistenten in den Einstellungen ansehen (Cache-Treffer benötigt keine Backend-Anfrage und umgeht so das GitHub-Token-404-Problem bei Drittrepos).

### v6.5 (2026-07-16) — README-KI-Übersetzung (Stabil) & UX-Optimierung
- **Neu**: **README-KI-Übersetzung** — Sprachumschalter (Original / Chinesisch / Englisch / Deutsch, optional Japanisch / Koreanisch) im Repo-Dialog; nutzt den in HA («Einstellungen → Sprachassistenten») konfigurierten Konversations-Assistenten (z. B. MiMo / GPT / Ollama), keine zusätzlichen API-Schlüssel nötig
- **Neu**: **Übersetzungs-Engine konfigurierbar** — Neues Dropdown «README-Übersetzungs-KI» in den Grundeinstellungen, listet automatisch alle `conversation.*`-Entitäten
- **Neu**: **Übersetzungs-Cache** — Ergebnisse werden serverseitig 6 Stunden zwischengespeichert
- **Optimierung**: **Übersetzungs-Buttons ausgeblendet ohne konfigurierte KI** — Ist keine Übersetzungs-KI eingestellt, wird die Sprachleiste durch einen Hinweis ersetzt
- **Stabilität**: **Auf stabilem 6.4.4-Kern** — Entfernt den fehlerhaften Timeout-Parameter, Rückkehr zur stabilen Übersetzung

### v6.4.3 (2026-07-16) — Dienstvervollständigung & Portabilität
- **Verbesserung**: **auto_update-Dienstdefinitionen vervollständigt** — Hinzugefügt `auto_update_start` / `auto_update_stop` / `auto_update_trigger` / `auto_update_reload_settings`; Namen und Beschreibungen erscheinen nun in den Entwicklerwerkzeugen
- **Verbesserung**: **Screenshot-URL-Erzeugung optimiert** — Der Screenshot-URL-Fallback leitet die Basisadresse nun dynamisch aus der externen/internalen HA-URL-Konfiguration ab, was die Portabilität über Umgebungen hinweg verbessert
- **Verbesserung**: **Geringere HACS-interne Kopplung** — Einige interne Aufrufe von `self._hacs.hass` auf `self.hass` geändert, weniger Abhängigkeit von privaten APIs
- **Bereinigung**: **Nicht genutztes Gitee-Modul entfernt** — Gelöscht das nie referenzierte `api_mixins/gitee.py`, um den Code zu verschlanken
- **Bereinigung**: **Redundante Übersetzung entfernt** — Entfernt den `options`-Abschnitt aus `zh-Hans.json`, der keinem OptionsFlow entsprach
### v6.4.2 (2026-07-10) — Markenicon-Aktualisierung
- **UI**: **Markenicon aktualisiert** — Übernommen das offizielle HACS-Store-Icon (Markise + Shop + Tür + HACS-Wortbild), mit einem kleinen „VISION"-Label unten zur Unterscheidung des Projekts
- **Chore**: Versionen in `manifest.json` / `const.py` / trilingual README auf 6.4.2 synchronisiert
### v6.4.1 (2026-07-06) — Kompatibilitätsfixes & Sicherheitshärtung
- **Fix**: **Erkennung benutzerdefinierter Repositories behoben** — Umstellung auf `is_default()` zur Erkennung benutzerdefinierter Repositories, kompatibel mit HACS 2.0, das das Feld `custom_repositories` entfernt hat
- **Fix**: **Integrationsverwaltungsansicht wird nicht angezeigt** — Erzwungene Aktualisierung des Config-Entry-Caches (`force_refresh=True`), sodass neu hinzugefügte Integrationen sofort erscheinen
- **Fix**: **Synchronisieren ausgewählter Repos gab 500** — Nun kompatibel mit sowohl String- als auch Objektdatenformaten, einheitliche Behandlung Frontend/Backend
- **Fix**: **Repos nach Sync nicht gefunden** — Vereinfachung von `_ensure_custom_repos_registered`, basierend auf HACS' eigener Registrierungsmechanik
- **Chore**: **API-Sicherheitshärtung** — Whitelist-Filterung für Config und Einstellungen, Parametervalidierung, Schutz vor Pfad-Traversal bei Sprachparametern
- **Chore**: **OAuth gibt kein Token mehr zurück** — Eliminiert das Risiko eines Token-Leaks
### v6.4.0 (2026-07-06) — Vereinheitlichte Suche & Hinzufügen
- **New**: **Vereinheitlichte Suche & Hinzufügen** — Das Suchfeld in der Store- und Repository-Verwaltungsansicht unterstützt nun das direkte Hinzufügen von Repositories: Eingabe von `owner/repo` oder einer GitHub-URL zeigt eine Inline-Hinzufügen-Leiste; Eingabe eines Org-Namens lädt dessen Repos zur Batch-Auswahl. Die eigenständige „+ Repo hinzufügen"-Schaltfläche und das Formular wurden entfernt
- **New**: **Erweiterte Suche** — Alle Ansichten unterstützen nun einheitlich GitHub-URL-Parsing, Autorensuche und Org-Suche
- **New**: **Klickbarer Repo-Name im Detaildialog** — Der Repo-Name im Detaildialog ist nun ein klickbarer Link, der zur GitHub-Repo-Seite springt
- **Fix**: **Registrierung benutzerdefinierter Repos fehlgeschlagen** — `add_custom_repository` verwendet nun `check=False`, um Registrierungsfehler durch GitHub-API-Ratenbegrenzungen zu vermeiden
### v6.3.0 (2026-07-05) — Drei-Abschnitts-Updates-Panel
- **New**: **Drei-Abschnitts-Aufklappbares Updates-Panel** — Aktualisierbar (standardmäßig aufgeklappt), Aktualisiert (eingeklappt, 30-Tage-Verlauf), Übersprungen (eingeklappt), klar kategorisiert
- **New**: **Update-Verlaufsverfolgung** — Jedes Update wird automatisch erfasst (Repo-Name, Versionsänderung, Zeit), nach 30 Tagen automatisch bereinigt, per API abfragbar
- **New**: **Echtzeit-Update-Fortschritt** — Update-Karten zeigen Fortschrittsbalken + Prozentsatz (5%→75%→100%), per Polling aktualisiert
- **Chore**: Versionssprung auf v6.3.0
### v6.2.1 (2026-07-04) — Optimierung & Fixes
- **New**: **Geplanter Neustart** — Eine Zeitsauswahl im Einstellungspanel startet HA zu einer angegebenen Zeit neu, nachdem die Auto-Update-Installation abgeschlossen ist; leer = kein Neustart
- **New**: **Whitelist-Dialog-Paginierung** — Whitelist in Einstellungen geändert zu Schaltfläche + Modal-Dialog mit paginierter Suche, Chips, Alle auswählen/abwählen, Speichern/Abbrechen
- **New**: **HACS-Datenaktualisierung** — Aktualisiert HACS-Repository-Daten vor dem Auto-Update, um neueste Versionen sicherzustellen, keine verpassten Updates mehr
- **Fix**: **Zusammengeführte Einstellungspeicherung** — Backend `_update_settings` auf `{**existing, **body}`-Merge geändert, um zu vermeiden, dass Teilaktualisierungen andere Einstellungen überschreiben
- **Fix**: **Frontend-Lade-Schutz** — Hinzugefügt `_installedLoaded`-Flag, um unendlichen Ladezustand zu verhindern
### v6.2.0 (2026-07-04) — Auto-Update
- **New**: **Auto-Update-Engine** — Hintergrund-geplante Erkennung und automatische Installation von Updates weißgelisteter Repos. Nicht überlappende Läufe, Coalescing zur Vermeidung von Wettläufen. Erster Lauf 60s nach Einstellungsladung, dann periodisch im konfigurierten Intervall. Dual-Channel-Event-Dispatch (`async_dispatcher_send` + `async_fire`) für Echtzeit-Status in Einstellungen
- **New**: **Whitelist-Verwaltung** — Modal-Dialog mit Paginierung (15/Seite), Suche, Chip-Anzeige, Alle auswählen/abwählen, Speichern/Abbrechen
- **New**: **Pro-Repo-Auto-Update-Schalter** — Schiebeschalter auf jeder Repo-Karte in Browser- und Update-Ansichten, optimistisches Update + Rollback bei API-Fehler
- **New**: **Konfigurierbare Prüffrequenz** — Intervalle 1h / 3h / 6h / 12h / 24h
- **New**: **Update-Benachrichtigungen** — HA-persistente Benachrichtigung bei abgeschlossenem Auto-Update (umschaltbar), feste Benachrichtigungs-ID zur Vermeidung von Stapelung
- **New**: **4 Backend-Dienste** — `trigger_auto_update` (manuell), `reload_auto_update_settings` (neu laden), `start_auto_update`/`stop_auto_update` (Scheduler start/stop)
- **Chore**: Versionssprung auf v6.2.0
### v6.0.0b1 (2026-07-01) — Architektur-Split-Beta
- **New**: **api.py-Split** — Die 3.717-zeilige api.py wurde in `api.py` + `api_config_flow.py` + `api_repos.py` via Mixin-Komposition aufgeteilt
- **Fix**: **Sprachumschaltung greift überall** — Behoben, dass Filter-Chips/Spaltenköpfe nach Sprachumschaltung nicht aktualisiert wurden; Options-Arrays werden nun bei Sprachwechsel neu aufgebaut
- **Fix**: **3 Übersetzungsschlüssel hinzugefügt + 1 Tippfehler behoben** — `loadingUpdates`/`processing`/`inputRepoPlaceholder` hinzugefügt, `verifing`→`verifying`
- **Fix**: **6 hartcodierte Chinesisch ersetzt** — Hartcodiertes Chinesisch in repo-card/browse/management/integrations-list durch `t()`-Aufrufe ersetzt
- **Fix**: **Sofortige Aktualisierung bei Sprachumschaltung während Navigation** — Kindansichten hören auf das `hacs-lang-changed`-Event, sodass Text nach Tab-Wechsel in der gewählten Sprache bleibt
- **Docs**: **Dreisprachiges README** — Deutsche Version zu allen Abschnitten hinzugefügt
- **Chore**: Versionssprung auf v6.0.0b1
### v6.0.0b0 (2026-06-30) — Mehrsprachigkeits-Beta
- **New**: **Mehrsprachigkeits-Engine** — i18n-Engine refactored; Spracherkennung von hartcodiert binär auf erweiterbare `LANG_MAP` aktualisiert
- **New**: **Deutsche Übersetzung** — Community-beigesteuert, 200+ Frontend-Schlüssel vollständig übersetzt + Backend-`de.json`
- **New**: **Sprachauswahl im Einstellungspanel** — Sprache manuell in Einstellungen wählbar, überschreibt HA-System-Spracherkennung
- **New**: **Spracherweiterung durch Dritte** — Neue Sprache in 2 Schritten: `LANG_MAP`-Eintrag + Übersetzungsschlüssel hinzufügen. Keine Änderung der Erkennungslogik
- **Chore**: Versionssprung auf v6.0.0b0
### v5.2.0 (2026-06-30) — Version überspringen + volle Optimierung
- **New**: **Ein-Klick-GitHub-Issue** — Issues aus Karten und Detail-Dialogen einreichen, automatische Erfassung von Logs, Systeminfos, Screenshots; GitHub-Screenshot-Einfügen unterstützt
- **New**: **Versions-Level-Überspringen** — Bestimmte Versionen überspringen; die nächste neue Version benachrichtigt erneut. Synchronisiert mit nativem HA `update.skip`/`update.clear_skipped`, Vision-Panel + HA-Einstellungen → Updates vollständig konsistent
- **New**: **Panel für übersprungene Updates** — Update-Filterleiste zeigt `🔇 Übersprungene Updates anzeigen/verbergen (N)`, Aufklappen/Zuklappen übersprungener Versionskarten, unterstützt „nicht überspringen"
- **New**: **Updates-Datenquelle auf HA-Entities umgestellt** — Liest `update.*`-Entities direkt aus der HA-Zustandsmaschine statt der HACS-internen API. Schneller, genauer; HACS als Fallback
- **New**: **Batch-Überspringen** — „Batch-Überspringen"-Schaltfläche in der Aktionsleiste nach Auswahl mehrerer Repos
- **Optimize**: **Store/Repo-Verwaltung Sync-Überspringen** — Alle List-Endpunkte prüfen den HA-Entity-Überspringungsstatus; übersprungene Repos zeigen keine Update-Schaltfläche mehr
- **Optimize**: **HA-Neustart-Zuverlässigkeit** — Behoben, dass hängengebliebene Supervisor-Jobs Neustartfehler verursachten; verwendet `docker restart homeassistant`, um hängende Jobs zu umgehen
- **Optimize**: **Issue-Dialog-Bereinigung** — Entfernte tote `_showIssueDialog`-Lit-Template-Codes, vereinheitlicht auf `_handleIssueReport`, editierbare Log-Vorschau
- **Fix**: **Überspringen-Version 500-Fehler** — `release_url` konnte `None` sein und `None.startswith()`-Ausnahme verursachen
- **Fix**: **Update-Anzahl nach Überspringen unverändert** — Schließt `pending_restart`-Repos aus
- **Fix**: **Render-Absturz übersprungener Karte** — `<img>` + `@error` brach Lit-Rendering; geändert zu Plain-Text-Initial-Avatar
- **Chore**: Versionssprung auf v5.2.0
### v5.1.0 (2026-06-21) — Optimierung
- **New**: **Integrationskarten zeigen Geräte/Entity-Anzahlen** — Jede Integrationskarte und Listzeile zeigt Geräte- und Entity-Anzahlen
- **New**: **GitHub-Login Auto-Star** — Automatischer Star dieses Repos nach Token/OAuth/HACS-Import
- **New**: **Sidebar + Titel-Icon vereinheitlicht** — Alle verwenden `hacs:hacs`-Icon, blauer Hintergrund entfernt
- **Fix**: **130+ redundante Fallbacks entfernt** — Alle `|| '中文'`-ungültigen Fallbacks entfernt, i18n-Schicht vertraut
- **Fix**: **5 fehlende i18n-Schlüssel hinzugefügt** — githubTokenRequired, pendingRestart, selectAction, zoom, restarting
- **Fix**: **Emoji zu SVG-Icons vereinheitlicht** — GitHub/OAuth-Bereich-Emoji in Einstellungen ersetzt
- **Fix**: **Hartcodierte Farben zu CSS-Variablen geändert** — `#f44336` → `var(--error-color)` usw.
- **Fix**: **Hinweis bei Standardansichtsänderung** — Toast-Hinweis bei Erfolg nach Auswahl
- **Fix**: **Integrations-Icon-Avatar refactored** — Lifecycle + RAF + complete-Fallback, einheitliche Icons für Dialog und Karten
- **Fix**: **28 Inline-Styles → CSS-Utility-Klassen** — config-view GitHub-Bereich
- **Chore**: Versionssprung auf v5.1.0
### v5.0.1 (2026-06-21) — Patch
- **New**: **OAuth-Inkognito-Login** — Direkte Autorisierung via GitHub-OAuth-Device-Flow, keine manuelle Token-Eingabe
- **New**: **OAuth umgeht SSRF** — Verwendet unabhängige aiohttp-Session, nicht von HA-SSRF-Middleware abgefangen
- **New**: **Org/User-Repos offener Zugriff** — Org-Namen eingeben, um Repos ohne Login aufzulisten, direkter GitHub-Public-API-Zugriff
- **New**: **Sofortige Einstellungspeicherung** — Auto-Speichern und Hinweis nach Änderung des Aktualisierungsintervalls / der Standardansicht, Speichern-Schaltfläche entfernt
- **New**: **Schnell-Schaltfläche für ausstehende Neustart-Karten** — Neustart-Schaltfläche direkt unter Repo-Karten im `pending_restart`-Zustand in der Verwaltungsansicht
- **Fix**: **Tote `save-bar`-CSS bereinigt**
- **Chore**: Versionssprung auf v5.0.1
### v5.0.0 (2026-06-20) — Offizielle Veröffentlichung
- **Arch**: Architektur refactored — Migration von Lovelace-iframe zu panel_custom embed_iframe=False
- **New**: Config-System refactored (M1-M6) — Store-Button-Smart-Logik, Integrationsverwaltungsdialog, Backend-Dynamische-Feld-Aktualisierung
- **New**: Mobile Vollbildschirm-Anpassung — vier Ansichten einheitliches Mobile-Layout, Aktionsschaltflächen in aufklappbaren Bereichen
- **New**: Sidebar-Schaltfläche linksbündig — 48px Standard-Touch-Ziel auf Mobile, bündig mit Bildschirmrand
- **New**: Karte/Liste-Einzel-Schaltflächen-Umschalter — zwei Schaltflächen zusammengeführt, Klick zum Umschalten spart Platz
- **New**: Intelligentes Suchfeld — Standard-Icon, klappt bei Fokus auf volle Zeile auf
- **Fix**: Favoritenanzahl-Sync — Kopf-Zahl aktualisiert sofort nach Favorisieren
- **Fix**: Versionskanal-Isolation — Pre-Release und Stable unabhängige Update-Kanäle
- **Fix**: Einheitlicher Icon-Schaltflächenstil — 36x36px einheitlicher Rahmenradius
- **Fix**: Paginierungs-Bug — GitHub-Org-Repos unendliche Paginierung behoben
- **Fix**: Tastenwettbewerb — e.preventDefault-Timing behoben
- **Fix**: scoped CE registry Kompatibilität — HA 2025.7+ Anpassung
- **Fix**: Changelog-Anzeige — changelog API tag-Parameter behoben
- **Fix**: Vorschauversions-Downgrade-Schutz
- **Fix**: Dialog-System refactored — unterstützt Maximieren/Doppelklick-Vollbild/URL-Klick
- **Perf**: HA-API-Sitzungswiederverwendung, N+1-Abfrage behoben, Backend-Cache-Obergrenze
- **Chore**: Versionssprung auf v5.0.0
### v4.1.0 (2026-06-17) — Offizielle Veröffentlichung
- **New**: **Integrations-Config-Seite eingebettet** — Klick auf Integrationskarte in Verwaltungsansicht, iframe lädt HA-native Config-Seite im Dialog, CSS beschneidet Sidebar
- **New**: **Doppelklick-Vollbild** — Doppelklick im iframe-Dialog → Vollbild-Config-Inhalt im Frame, Doppelklick erneut zum Wiederherstellen
- **New**: **Chinesischer Titel** — Dialogtitel verwendet übersetzten chinesischen Integrationsnamen
- **New**: **Versionsauswahl zeigt Update-Inhalt** — Klick auf eine Version in der Versionsliste lädt der Bereich unterhalb die Release Notes dieser Version
- **Fix**: **Versionsauswahl zeigte nur neueste** — Nun beliebige Version klickbar zum Laden entsprechenden Update-Inhalts
- **Fix**: **HA-Theme-Sync** — Light-DOM-Test-Fallback, CSS-Variablen-Schema weiterhin
- **Chore**: Versionssprung auf v4.1.0
- **Refactor**: Entfernte Test-Schaltflächen und WS-Config-Flow-Form-Prototyp-Codes
- **Perf**: Ursprüngliche Detail-Baumansicht bedingtes Rendering, null Performance-Overhead
### v4.0.2 (2026-06-17) — Patch
- **Refactor**: **Star-Sync vom Frontend ans Backend verschoben** — Hinzugefügt `/github/sync-favorites`-API, Komplettlösung Token-Validierung + GitHub-Star-Abruf + Favoriten-Vergleich + fehlendes Anhängen, synchronisiert nur HACS-bekannte Repos, sichert Favoritenanzahl- und Filterkonsistenz
- **Fix**: **Favoriten-Stern-Status-Typkonflikt** — String vs Number ließ alle Stern-Icons grau erscheinen
- **Fix**: **Stern-Status-dirty-Cache** — `_starredMap`-alter Wert nicht aktualisiert
- **Fix**: **Render-Ausnahme Schwarzbild** — Error-Boundary-Fallback
- **Fix**: **„Neustart"-Banner nach HA-Neustart nicht verschwunden** — Reset bei `_loadStats`-Erfolg + 5s-Poll-Retry
- **Fix**: **GitHub-Star-Sync funktionierte nie** — `hasGitHubToken()` existierte nicht, still verschlungen
### v4.0.1 (2026-06-17) — Patch
- **Fix**: Favoritenfilter-Client-seitige Paginierung verursachte unvollständige Anzeige (zeigte 26, Filter nur 4)
- **Chore**: Versionssprung auf v4.0.1
### v4.0.0 (2026-06-17) — Offizielle Veröffentlichung
- **New**: **Org/User-Repo-Batch-Hinzufügen** — GitHub-Org- oder User-URL eingeben, Repos zur Batch-Mehrfachauswahl auflisten
- **New**: **GitHub-HACS-Token-Import** — Einstellungen unterstützen Import vorhandener HACS-Token, Auto-Login-Wiederherstellung
- **New**: **GitHub-Avatar-Anzeige** — Eingeloggter Benutzer zeigt Avatar
- **New**: **Repo-Star-System** — Lokale Favoriten und GitHub-Stars unabhängig verwaltet
- **New**: **Updates-Seite Sofort-Öffnen** — Cache-Beschleunigung + manuelle Aktualisierung + pro-Karte verzögertes Laden
- **New**: **Batch-Star-Laden** — Parallele Anfragen, weniger API-Aufrufe
- **New**: **Drei-Spalten-Raster-Layout** — Nutzt breiten Bildschirmplatz voll aus
- **New**: **i18n-Vollabdeckung** — 30+ Internationalisierungstextschlüssel
- **New**: **Responsive Anpassung** — Mobile/Tablet/Desktop adaptiv
- **UI**: **Farbsystem optimiert** — Dark-Mode-kompatibel, Filter-Tag-UI vereinheitlicht
- **UI**: **CSS-Mask-Token-Eingabe** — Ersetzt type=password, sicherer und hübscher
- **Chore**: Versionssprung auf v4.0.0
- **Fix**: Favoritenfilter-Client-seitige Paginierung verursachte unvollständige Anzeige (zeigte 26, Filter nur 4)
### v3.0.0 (2026-06-13) — Offizielle Veröffentlichung
- **New**: **Integrations-Entity/Geräte-Übersicht** — Integrations-Detail-Dialog oben zeigt „N Geräte · M Entities"-Zusammenfassung
- **New**: **Repo-Abhängigkeitsprüfung** — Repository-Verwaltungsansicht fügt „Abhängigkeiten prüfen"-Schaltfläche hinzu, visualisiert fehlende Abhängigkeitspakete
- **New**: **Suchverlauf** — Store-Suchfeld zeichnet automatisch die letzten 10 Suchen auf, unterstützt Klick-zum-Ausfüllen und Einzel-löschen
- **New**: **Letzten Tab merken** — Seitenaktualisierung stellt automatisch zuletzt geöffneten Tab wieder her (Store/Integrationsverwaltung/Updates/Repo-Verwaltung/Einstellungen)
- **New**: **Repo-Verwaltungsfilter-Persistenz** — Filter/Sortier-Status nach Aktualisierung beibehalten
- **New**: **Dialog vollständig aufgerüstet** — Alle Dialoge unterstützen Drag-Verschieben, Escape-Schließen, slideUp-Animation, einheitliche Schließen-Schaltfläche
- **New**: **Plugin/Theme-Stilles Neuladen** — Auto-Neuladen der Config nach Installation, kein Bestätigungsdialog
- **New**: **Integrations-Installations-Smart-Hinweis** — Nach Installation Dialog-Hinweis [Neustart] [Später], muss neu starten zum Konfigurieren
- **UI**: **Vier-Ansichten-Layout vollständig vereinheitlicht**
- **UI**: **Config-Seite Drei-Spalten-Layout** — PC: Einstellungen/Wartung/Datenverwaltung drei Spalten; Mobile Einzelspalte
- **UI**: **Markenicon Drei-Ebenen-Laden** — CDN → GitHub raw (brand dir) → lokal → Org-Avatar → Initial
- **UI**: **Filter-Tag Blau-Hervorhebung** — Filterbereich-Tags verwenden primary-color, erhöhter Trennerabstand
- **UI**: **Karte/Listen-Ansicht** — Integrationsverwaltung fügt Karte/Liste-Umschalter hinzu, Listenmodus zeigt Domain-Feld
- **UI**: **Geräteansicht Geräte-Einklappen** — Jeder Geräte-Header klappbar/aufklappbar Entity-Liste
- **UI**: **Schriftgröße gesamt angehoben** — Alle 8-9px-Schriften entfernt, Minimum einheitlich 10px
- **UI**: **Chinesisch/Englisch-Übersetzung vollständig abgeschlossen** — 25+ Übersetzungsschlüssel hinzugefügt, alle fehlenden Übersetzungen behoben
- **Fix**: Konstruktor `this._loadSearchHistory()` undefiniert verursachte leeren Store
- **Fix**: `makeDraggable` von Rollup tree-shaken verursachte Dialog-Drag-Versagen
- **Fix**: Kind-Dialog-CSS-Selektor falsch verursachte Mobile-Layout-Fehler
- **Fix**: Integrationsverwaltung host padding verursachte inkonsistenten Label-zu-Suche-Abstand
- **Chore**: Versionssprung auf v3.0.0
### v2.3.3 (2026-06-13)
- **New**: **Erneut herunterladen** — Ein-Klick-erneut-Herunterladen für installierte Repos (Deinstallieren + Neuinstallieren), behebt defekte Installationen. Unterstützt `POST`-API
- **New**: **Repo ignorieren** — Repos zur Ignore-Liste hinzufügen, erscheinen nicht mehr in Suchergebnissen und Update-Erinnerungen. Unterstützt `POST`-API
- **New**: **Hinweisinformationen vollständig optimiert** — Alle Bestätigungsdialoge fügen Operationsfolge-Beschreibungen hinzu (Deinstallieren, Löschen, Entfernen, Ignorieren usw.), damit Benutzer jeden Operations-Einfluss klar kennen
- **New**: **UI vollständig refactored** — Store/Repo-Verwaltung/Integrationsverwaltung/Updates vier-Ansichten-Layout vereinheitlicht
- **New**: **Filter+Sort zusammengeführt** — Filter und Sort aller Ansichten in eine Zeile zusammengeführt, redundante Label-Texte entfernt
- **New**: **Filter-Annotation** — Blau-Hervorhebungs-Label vor jeder Filter-Chip-Gruppe (Status/Tag/Typ/Sort/Repo)
- **New**: **Repo-Verwaltung Status+Typ-Filter** — Hinzugefügt Filter nach Installationsstatus und Kategorie
- **New**: **Repo-Verwaltung Batch-Operationen** — Alle-auswählen-Checkbox + Batch-Entfernen, konsistent mit Store
- **New**: **Statistiken** — Repo-Verwaltung zeigt „N Repos insgesamt"
- **New**: **Aktualisierungsschaltfläche** — Repo-Verwaltung fügt Aktualisierungsschaltfläche hinzu
- **New**: ▲/▼ **Sort-Richtungsanzeiger** — Alle Sort-Chips fügen Richtungspfeile hinzu
- **New**: **Leerzustands-Icons** — Alle vier Repo-Verwaltungs-Leerzustände erhalten SVG-Icons
- **New**: **Neuladen** — Config-Seite fügt Neuladen-Schaltfläche hinzu (ruft `homeassistant.reload_core_config`), Plugins/Themes brauchen nach Installation keinen Neustart
- **New**: **Backup/Wiederherstellen** — Config-Seite fügt Export/Import HACS-Config-Backup hinzu
- **New**: 🟠 **Ausstehendes-Laden-Marker** — Nach Installation Plugin/Theme „Später" wählen → Karte zeigt 🟠 ausstehendes-Laden-Tag, automatisch nach Neuladen gelöscht
- **New**: **Install/Update-Smart-Hinweis** — Integration→Neustart vorschlagen, Plugin/Theme→Neuladen vorschlagen, Popup nach 1,5s
- **New**: **Markenicon Drei-Ebenen-Laden** — CDN → GitHub raw (brand dir) → lokal → Org-Avatar → Initial
- **New**: **Integrationsverwaltung Listenansicht** — Karte/Liste-Umschalter hinzugefügt, Listenmodus zeigt Domain-Feld
- **New**: **Chinesisch/Englisch-Übersetzung vollständig abgeschlossen** — 20+ Übersetzungsschlüssel hinzugefügt, fehlende Übersetzungen wie `catPython`/`flowStartFailed`/`statusDisabled`/`delete` behoben
- **UI**: **Alle Schaltflächenhöhen auf 36px vereinheitlicht**
- **UI**: **Suchfeld vereinheitlicht** — Store/Verwaltung/Updates/Integrationsverwaltung Suchfelder verwenden alle gemeinsamen Stil (40px Höhe, flex auto-breite)
- **UI**: **Abstand vereinheitlicht** — Behoben Integrationsverwaltung `:host padding` verursachte inkonsistenten Label-zu-Suche-Abstand
- **UI**: **Hintergrund vereinheitlicht** — Store-Inhaltsbereich in card-background-color gewrappt, eliminiert „Bruchlinie"-Gefühl
- **UI**: **Avatar-Hintergrund entfernt** — Icons nicht mehr von Kategorie-Farbe-Hintergrund abgedeckt, nur Initials zeigen Hintergrund
- **UI**: **Config-Seite Drei-Spalten-Layout** — PC drei Spalten, Mobile Einzelspalte
- **Fix**: **README- und Ignorieren-Schaltfläche aus Store-Karten entfernt**, nur in Repo-Verwaltung angezeigt
- **Fix**: **Batch-Auswahl aus Updates-Seite entfernt** (keine praktische Bedeutung)
- **Fix**: **Doppeltes „Custom"-Badge in Verwaltungsmodus entfernt** (alle sind custom)
- **Fix**: `_handleIgnore` missbrauchte „Bestätigen Sie Deinstallation" als Ignore-Bestätigungstext → geändert zu korrektem `confirmIgnore`-Übersetzung
- **Fix**: **Update-Bestimmungstext-Chaos** — Alle-Update und Update-ausgewählte verwenden unterschiedliche Bestätigungsvorlagen
- **Fix**: **Integrations-Lösch-Bestimmung fehlte Integrationsname** → hinzugefügt `{domain}`-Template-Parameter
- **Fix**: `multi_select`-Feld als Checkbox statt Multi-Select-Dropdown gerendert (z.B. xiaomi_home Config)
- **Fix**: `is_custom`-Feld Frontend/Backend-Inkonsistenz verursachte Custom-Repo-Filter nicht verfügbar
- **Fix**: Tag-Filter in Backend-API verschoben, Paginierung normal
- **Fix**: `entity_ref_finder` Drei-Ebenen-Fallback: `state.attributes` → `hass.data` → `.storage`-Datei, kompatibel mit HA 2025.7+
- **Fix**: Umbenanntes Label überlappt mit rechtsseitigen Tags (in `right-tags`-Container zusammengeführt)
- **Fix**: Repo-Karte-Entfernen-Schaltfläche von oben-rechts nach unten-Aktionsleiste verschoben
- **Fix**: Doppelten „Integrationsverwaltung"-Seitentitel im Verwaltungsmodus ausgeblendet
- **Fix**: Skeleton-Screen auf 6 Karten vereinheitlicht
- **Fix**: number-Feld `valueMin/valueMax`-Fallback-Unterstützung
- **Fix**: boolean kompatibel mit `true`/`1`/`"1"`
- **Fix**: Alle `_LOGGER.error` um `exc_info=True` ergänzt
- **Chore**: Terminologie an HACS-offizielle Übersetzung angeglichen, `remove` von „Deinstallieren" zu „Entfernen" geändert
- **Chore**: `delete`-Serien-Schlüssel hinzugefügt, Integrationsverwaltungsoperationen verwenden „Löschen"
- **Chore**: Integrationsverwaltung doppelten „Integrationsverwaltung"-Seitentitel entfernt
- **Chore**: Versionnummer v2.3.3 synchronisiert
### v2.3.2 (2026-06-12)
- **Fix**: Custom-Repo-Filter ungültig — Backend zurückgegebenes Feld `"custom"` inkonsistent mit Frontend-Lesen `is_custom`, nun ausgerichtet (Dual-Feld-kompatibel)
- **Chore**: Versionnummer v2.3.2 synchronisiert
### v2.3.1 (2026-06-12)
- **Fix**: Fehlendes `entity_ref_finder.py` aus v2.3.0-Release wiederhergestellt, behoben Integrationsladung `ModuleNotFoundError`
- **Chore**: Versionnummer v2.3.1 synchronisiert, README aktualisiert
### v2.3.0 (2026-06-12)
- **New**: **Integrationsverwaltungsansicht** — Kartengitter zeigt alle installierten Integrationen, chinesische Suche, Statusfilter, Integrationstyp-Gruppierung
- **New**: **Geräte- & Entity-Drilldown** — Klick auf Integrationskarte → nach Bereich gruppierte Geräteliste → Entity-Echtzeitstatus
- **New**: **Ein-Klick-Entity-Steuerung** — Schalter, Lichter, Schlösser, Covers, Fans und andere gängige Domänen direkt im Panel gesteuert
- **New**: **Chinesischer Namen-Übersetzung** — Offizielle & custom Integrationen zeigen automatisch chinesische Namen (aus brands oder manifest)
- **New**: **Markenicons** — Drei-Ebenen-Laden: CDN → lokales custom Icon (`custom_components/{domain}/brand/`) → Initial-Fallback
- **New**: **EntityRefFinder** — `EntityRefFinder`-Klasse scannt alle Referenzen zu einer angegebenen entity_id in HA (Automatisierungen/Scripts/Szenen/Panels), unterstützt Preview-Ersetzungsmodus und Ein-Klick-Ersetzen
- **Enhance**: HACSBrandIconView unterstützt `/icon`, `/logo` Subpath-Parsing, behoben Pfad-Extraktion wenn Domain `_` hat
- **Enhance**: `get_all_repos_from_hacs()` Rückgabefeld fügt `default_branch` hinzu
- **Fix**: `api.py` Markenicon-Static-Resource-Pfad optimiert, verwendet `actual_domain` statt rohem `safe_domain`
- **Chore**: `const.py` Version → 2.3.0 aktualisiert, `manifest.json` synchronisiert
### v2.1.2 (2026-06-11)
- **New**: Integrations-Config-Dialog lädt automatisch chinesische Lokalisierung — liest `custom_components/{domain}/translations/zh-Hans.json` via Backend-API, unterstützt alle Übersetzungspunkte in Config-Flow und Options-Flow (Feld-Labels, Beschreibungen, Platzhalter, Menüoptionen, Schritt-Titel)
- **Fix**: `_handleDetail` unendliche Rekursion verursachte `Maximum call stack size exceeded`-Absturz
- **Fix**: Browse-Ansicht Event-Weiterleitung optimiert, redundante Event-Listener eliminiert
- **Chore**: Frontend-Debug-Logs bereinigt
### v2.1.1 (2026-06-10)
- **Fix**: Config-Flow-Dialog chinesische Lokalisierungskanal behoben — Backend `get_config_entries_map()` gab Array statt Objekt zurück
- **Fix**: `_loadConfigEntries()` entpackt korrekt `resp.entries`
- **Fix**: `updated()`-Lebenszyklus `this.domain` falsch geleert
### v2.1.0 (2026-06-10)
- **New**: Einstellungsseite zeigt dynamisch Versionsnummer (aus API)
- **New**: Config-Flow-Form erweitert — unterstützt Passwortmaske, mehrzeiliges Textfeld, Feld-Beschreibungstext
- **New**: Browser-Cache-Auto-Lösch-Mechanismus
- **UI**: Update-Details unterstützen Aufklappen/Zuklappen Changelog-Vorschau, Mobile-Touch-Optimierung
### v2.0.2 (2026-06-09)
- Fix: Eigen-Update-Erkennung und HACS-In-Memory-Registrierung
### v2.0.1 (2026-06-09)
- Fix: Config-Flow-Dialog `.hass`-Eigenschaftsübergabe
- Fix: HA 2026.6.0-Upgrade verursachte `.pyc`-Cache führte zu API 404
### v2.0.0 (2026-06-09)
- Komplettes UI-Redesign, modernes Kartenlayout
- Eingebauter Config-Flow-Dialog
- Sprache folgt automatisch HA-Systemeinstellungen
### v1.1.2 (2026-06-07)
- HTTP-Proxy-Modus Config-Flow
### v1.1.1
- Favoriten-System
- Installations-Tracking
### v1.1.0
- Ursprüngliche öffentliche Version
---

## Projektstruktur

```
hacs-vision/
├── custom_components/hacs_vision/    # HA-Integration (Produktionscode)
│   ├── __init__.py                    # Einstiegspunkt — Panel-Registrierung, API-Routen
│   ├── api.py                         # REST-API — Store, Installation, Config Flow, Übersetzungen
│   ├── hacs_operator.py               # HACS-Operationsebene — Installieren/Aktualisieren/Entfernen
│   ├── hacs_data.py                   # Datenebene — Repo-Index, Favoriten, Einstellungen
│   ├── config_flow.py                 # HA-Config-Flow
│   ├── backup.py                      # Backup/Wiederherstellung
│   ├── dependency_checker.py          # Abhängigkeitsprüfung
│   ├── entity_ref_finder.py           # Entity-ID-Referenzsuche und -Ersetzung
│   ├── const.py                       # Konstanten (VERSION, Speicherpfade usw.)
│   ├── frontend/                      # Frontend-Build-Artefakte
│   │   ├── panel.js                   # IIFE-Einzeldatei
│   │   └── index.html                 # iframe-Einstieg
│   ├── translations/                  # Übersetzungen dieser Integration selbst
│   │   ├── zh-Hans.json
│   │   └── en.json
│   └── brand/                         # Markenressourcen
├── frontend_src/                      # Frontend-Quellcode (Lit Element)
│   ├── src/                           # Komponentenquellcode
│   │   ├── hacs-vision-panel.js       # Hauptpanel
│   │   ├── api.js                     # Frontend-API-Client
│   │   ├── i18n.js                    # Frontend-Internationalisierung
│   │   ├── components/                # Unterkomponenten
│   │   │   ├── config-flow-dialog.js  # Config-Flow-Dialog (mit Übersetzungs-Engine)
│   │   │   └── repo-card.js           # Repo-Karte
│   │   ├── views/                     # Einzelansichten
│   │   │   ├── browse.js
│   │   │   ├── updates.js
│   │   │   ├── management.js
│   │   │   ├── integrations-list.js   # Integrationsverwaltungsansicht (v2.3.0)
│   │   │   └── config-view.js
│   │   └── shared/                    # Gemeinsame Werkzeuge
│   ├── package.json
│   └── rollup.config.js
├── assets/                            # Screenshots usw.
├── hacs.json                          # HACS-Metainformationen
└── README.md
```

---

## Entwicklung

### Frontend-Build

```bash
cd frontend_src
npm install
npm run build
```

Die Build-Artefakte werden in `custom_components/hacs_vision/frontend/` ausgegeben.

### Übersetzungsmechanismus

Die Übersetzung im Konfigurationsdialog erfolgt über die Backend-API `/api/hacs_vision/translations/{domain}?lang=de`, die die Übersetzungsdateien aus dem Verzeichnis `custom_components/{domain}/translations/` jeder Integration liest. Die Frontend-Methode `_t()` passt sich automatisch an die duale Config/Options-Schlüsselstruktur von HA an.

---

## FAQ

**F: Was ist der Unterschied zwischen HACS und HACS Vision?**
A: HACS Vision ist ein modernes visuelles Frontend-Panel für HACS. Es ersetzt HACS nicht, sondern nutzt HACS als Backend.

**F: Kann ich Repositorys aus HACS Vision installieren?**
A: Ja. Durchsuchen Sie den Shop und klicken Sie auf Installieren.

**F: Warum werden Felder im Konfigurationsdialog auf Englisch angezeigt?**
A: Die Übersetzung hängt davon ab, ob der Integrationsautor eine `de.json`-Datei bereitgestellt hat. Manche Autoren schreiben weiterhin Englisch in ihren Übersetzungsdateien – das ist normales Verhalten.

**F: Das Panel zeigt "HACS not available" an?**
A: Stellen Sie sicher, dass HACS korrekt installiert und konfiguriert ist.

**F: Wie aktualisiere ich HACS Vision?**
A: Bei Installation über HACS erscheinen Updates auf der Update-Seite. Bei manueller Installation ersetzen Sie die Dateien durch die neueste Version.

---

## Support

- [Issue melden](https://github.com/C3H3-AI/hacs-vision/issues)
- [Diskussionen](https://github.com/C3H3-AI/hacs-vision/discussions)

## Lizenz

MIT License — siehe [LICENSE](LICENSE)

---

<p align="center">
  Mit ❤️ gemacht von <a href="https://github.com/C3H3-AI">C3H3-AI</a>
</p>
