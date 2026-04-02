import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const fr = {
  // common
  common_download: 'Télécharger',
  common_github: 'GitHub',
  common_footer_rights: 'Tous droits réservés.',

  // home - hero
  home_hero_title: "Parcourez, installez et gérez les compétences d'agents IA visuellement",
  home_hero_description:
    "SkillPad est une interface graphique de bureau pour skills.sh. Parcourez les compétences depuis la galerie, installez-les sur n'importe quel agent en un clic et gérez les compétences globales et par projet au même endroit.",
  home_hero_whats_agent_skills: "Qu'est-ce que les compétences d'agent ?",

  // home - features
  home_feature_gallery_title: 'Exploration de la galerie',
  home_feature_gallery_description: 'Découvrez de nouvelles compétences directement depuis la galerie skills.sh.',
  home_feature_install_title: 'Installation en un clic',
  home_feature_install_description: 'Installez sur votre agent préféré sans toucher au terminal.',
  home_feature_scope_title: 'Portée flexible',
  home_feature_scope_description: 'Gérez les compétences globales et par projet côte à côte.',
  home_feature_updates_title: 'Mises à jour automatiques',
  home_feature_updates_description: 'Restez à jour avec les vérifications de mise à jour intégrées.',

  // home - what is agent skills
  home_whats_title: "Qu'est-ce que les compétences d'agent ?",
  home_whats_description_1:
    "Les compétences d'agent sont des fichiers markdown qui fournissent aux agents de codification IA des connaissances spécialisées qu'ils ne possèdent pas nativement. Considérez-les comme des extensions pour votre IA — installez une compétence et votre agent sait instantanément faire quelque chose de nouveau.",
  home_whats_plugins_label: 'des extensions pour votre IA',
  home_whats_description_2:
    'Par exemple, une compétence peut apprendre à votre agent à écrire de meilleurs composants React, suivre les conventions de code de votre équipe, automatiser des tâches de navigateur ou gérer votre espace de travail Slack.',
  home_whats_markdown_title: 'Juste du markdown',
  home_whats_markdown_description:
    "Chaque compétence est un fichier SKILL.md contenant des instructions ciblées et structurées que votre agent lit à l'exécution.",
  home_whats_agents_title: "Compatible avec n'importe quel agent",
  home_whats_agents_description:
    'Claude Code, Cursor, Windsurf et plus. Les compétences utilisent le standard ouvert skills.sh.',
  home_whats_scope_title: 'Global ou par projet',
  home_whats_scope_description:
    'Installez des compétences globalement pour tous les projets, ou limitez-les à un projet spécifique.',
  home_whats_community_title: 'Porté par la communauté',
  home_whats_community_description:
    "Parcourez des centaines de compétences sur skills.sh, ou créez les vôtres et partagez-les avec d'autres.",

  // home - badge
  home_badge_title: 'Badge Available on SkillPad',
  home_badge_description: 'Intégrez ce badge dans votre README pour une installation en un clic.',
  home_badge_try: 'Essayez :',
  home_badge_clear: 'Effacer',

  // home - cta
  home_cta_title: 'Télécharger SkillPad',
  home_cta_description: 'Gratuit et open source. Disponible pour macOS et Windows.',

  // download
  download_title: 'Télécharger SkillPad',
  download_description: 'Disponible pour macOS et Windows. Gratuit et open source.',
  download_version: 'Version {tag} \u00b7 Publié le {date}',
  download_error: 'Impossible de charger les informations de version.',
  download_error_cta: 'Voir les versions sur GitHub',
  download_macos: 'macOS',
  download_macos_requirement: 'macOS 10.15 ou ultérieur',
  download_windows: 'Windows',
  download_windows_requirement: 'Windows 10 ou ultérieur (64 bits)',
  download_recommended: 'Recommandé',
  download_not_available: 'Non disponible',
  download_all_releases: 'Voir toutes les versions sur GitHub',

  // install
  install_opening: 'Ouverture de SkillPad...',
  install_opening_description: "Tentative d'ouverture de {skillId} dans l'application.",
  install_not_installed: "SkillPad n'est pas installé",
  install_not_installed_description:
    "SkillPad vous permet de parcourir et d'installer des compétences d'agents IA avec une interface visuelle.",
  install_skill_id: 'ID de compétence',
  install_download: 'Télécharger SkillPad',
  install_try_again: 'Réessayer',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
