import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const de = {
  // common
  common_download: 'Herunterladen',
  common_github: 'GitHub',
  common_footer_rights: 'Alle Rechte vorbehalten.',

  // home - hero
  home_hero_title: 'KI-Agenten-Skills visuell durchsuchen, installieren und verwalten',
  home_hero_description:
    'SkillPad ist eine Desktop-GUI für skills.sh. Durchsuchen Sie Skills in der Galerie, installieren Sie sie mit einem Klick auf jedem Agenten und verwalten Sie globale und projektbezogene Skills an einem Ort.',
  home_hero_whats_agent_skills: 'Was sind Agenten-Skills?',

  // home - features
  home_feature_gallery_title: 'Galerie durchsuchen',
  home_feature_gallery_description: 'Entdecken Sie neue Skills direkt aus der skills.sh-Galerie.',
  home_feature_install_title: 'Ein-Klick-Installation',
  home_feature_install_description: 'Installieren Sie auf Ihrem bevorzugten Agenten ohne Terminal.',
  home_feature_scope_title: 'Flexibler Geltungsbereich',
  home_feature_scope_description: 'Verwalten Sie globale und projektbezogene Skills nebeneinander.',
  home_feature_updates_title: 'Automatische Updates',
  home_feature_updates_description: 'Bleiben Sie aktuell mit integrierten Update-Prüfungen.',

  // home - what is agent skills
  home_whats_title: 'Was sind Agenten-Skills?',
  home_whats_description_1:
    'Agenten-Skills sind Markdown-Dateien, die KI-Coding-Agenten spezialisiertes Wissen vermitteln, das sie nicht standardmäßig haben. Betrachten Sie sie als Plugins für Ihre KI — installieren Sie einen Skill, und Ihr Agent kann sofort etwas Neues.',
  home_whats_plugins_label: 'Plugins für Ihre KI',
  home_whats_description_2:
    'Zum Beispiel kann ein Skill Ihrem Agenten beibringen, bessere React-Komponenten zu schreiben, die Coding-Konventionen Ihres Teams zu befolgen, Browser-Aufgaben zu automatisieren oder Ihren Slack-Workspace zu verwalten.',
  home_whats_markdown_title: 'Nur Markdown',
  home_whats_markdown_description:
    'Jeder Skill ist eine SKILL.md-Datei mit fokussierten, strukturierten Anweisungen, die Ihr Agent zur Laufzeit liest.',
  home_whats_agents_title: 'Funktioniert mit jedem Agenten',
  home_whats_agents_description:
    'Claude Code, Cursor, Windsurf und mehr. Skills nutzen den offenen skills.sh-Standard.',
  home_whats_scope_title: 'Global oder projektbezogen',
  home_whats_scope_description:
    'Installieren Sie Skills global für alle Projekte oder begrenzen Sie sie auf ein bestimmtes Projekt.',
  home_whats_community_title: 'Community-getrieben',
  home_whats_community_description:
    'Durchsuchen Sie Hunderte von Skills auf skills.sh oder erstellen Sie Ihre eigenen und teilen Sie sie.',

  // home - badge
  home_badge_title: 'Available on SkillPad-Badge',
  home_badge_description: 'Betten Sie dieses Badge in Ihre README für Ein-Klick-Installation ein.',
  home_badge_try: 'Probieren:',
  home_badge_clear: 'Löschen',

  // home - cta
  home_cta_title: 'SkillPad herunterladen',
  home_cta_description: 'Kostenlos und Open Source. Verfügbar für macOS und Windows.',

  // download
  download_title: 'SkillPad herunterladen',
  download_description: 'Verfügbar für macOS und Windows. Kostenlos und Open Source.',
  download_version: 'Version {tag} \u00b7 Veröffentlicht am {date}',
  download_error: 'Release-Informationen konnten nicht geladen werden.',
  download_error_cta: 'Releases auf GitHub ansehen',
  download_macos: 'macOS',
  download_macos_requirement: 'macOS 10.15 oder neuer',
  download_windows: 'Windows',
  download_windows_requirement: 'Windows 10 oder neuer (64-Bit)',
  download_recommended: 'Empfohlen',
  download_not_available: 'Nicht verfügbar',
  download_all_releases: 'Alle Releases auf GitHub ansehen',

  // install
  install_opening: 'SkillPad wird geöffnet...',
  install_opening_description: '{skillId} wird in der App geöffnet.',
  install_not_installed: 'SkillPad ist nicht installiert',
  install_not_installed_description:
    'Mit SkillPad können Sie KI-Agenten-Skills über eine visuelle Oberfläche durchsuchen und installieren.',
  install_skill_id: 'Skill-ID',
  install_download: 'SkillPad herunterladen',
  install_try_again: 'Erneut versuchen',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
