import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const fr = {
  // agent-checkbox-list
  agent_list_show_fewer: 'Afficher moins',
  agent_list_show_more: 'Afficher encore {count}',

  // add-skill-dialog
  add_skill_agents: 'Agents',
  add_skill_button: 'Ajouter',
  add_skill_button_loading: 'Ajout en cours...',
  add_skill_cancel: 'Annuler',
  add_skill_error_fallback: 'Impossible d\'ajouter la skill',
  add_skill_error_global: 'Global : {message}',
  add_skill_error_partial: 'Ajoutée à {successCount} destination(s), mais échec pour : {errors}',
  add_skill_error_project: '{project} : {message}',
  add_skill_global: 'Global',
  add_skill_install_to: 'Installer dans',
  add_skill_loading_projects: 'Chargement des projets...',
  add_skill_success: 'Skill ajoutée à {count} destination(s) !',
  add_skill_title: 'Ajouter {name}',

  // batch-add-skill-dialog
  batch_add_button: 'Ajouter',
  batch_add_button_loading: 'Ajout en cours... ({progress})',
  batch_add_cancel: 'Annuler',
  batch_add_error_fallback: 'Impossible d\'ajouter les skills',
  batch_add_error_global: 'Global/{source} : {message}',
  batch_add_error_partial: '{successCount} installation(s) terminée(s), mais {errorCount} ont échoué : {errors}',
  batch_add_error_project: '{project}/{source} : {message}',
  batch_add_global: 'Global',
  batch_add_install_to: 'Installer dans',
  batch_add_loading_projects: 'Chargement des projets...',
  batch_add_success: '{skillCount} skill(s) ajoutée(s) à {targetCount} destination(s) !',
  batch_add_title_one: 'Ajouter {count} skill',
  batch_add_title_other: 'Ajouter {count} skills',
  batch_agents: 'Agents',

  // command-palette
  command_palette_actions: 'Actions',
  command_palette_check_for_update: 'Vérifier les mises à jour',
  command_palette_empty: 'Aucun résultat trouvé.',
  command_palette_navigation: 'Navigation',
  command_palette_placeholder: 'Rechercher...',
  command_palette_preferences: 'Préférences',
  command_palette_skills: 'Skills',

  // common
  common_cancel: 'Annuler',
  common_global: 'Global',

  // error-boundary
  error_boundary_message: 'Une erreur inattendue est survenue',
  error_boundary_reload: 'Recharger l\'application',
  error_boundary_title: 'Un problème est survenu',

  // gallery-view
  gallery_no_repo_skills: 'Aucune skill trouvée dans ce dépôt',
  gallery_no_skills: 'Aucune skill disponible',
  gallery_no_skills_match: 'Aucune skill ne correspond à votre recherche',
  gallery_refresh: 'Actualiser',
  gallery_repo_section: 'Skills dans {repo}',
  gallery_search_placeholder: 'Rechercher des skills...',
  gallery_select_mode_exit: 'Quitter le mode sélection',
  gallery_select_mode_start: 'Sélectionner des skills',
  gallery_subtitle: 'Parcourez et découvrez les skills disponibles',
  gallery_title: 'Répertoire de skills',

  // inline-error
  inline_error_retry: 'Réessayer',
  inline_error_title: 'Erreur',

  // installed-skills-view
  installed_add_from_directory: 'Ajouter des skills depuis le Répertoire de skills à ce projet',
  installed_all_up_to_date: 'Tout est à jour',
  installed_check_errors_count: '{count} n\'ont pas pu être vérifiée(s)',
  installed_check_errors_title: 'Impossible de vérifier les mises à jour',
  installed_check_for_updates: 'Vérifier les mises à jour',
  installed_failed_to_remove: 'Impossible de supprimer : {names}',
  installed_failed_to_remove_skill: 'Impossible de supprimer la skill',
  installed_no_skills: 'Aucune skill installée',
  installed_no_skills_match: 'Aucune skill ne correspond à votre recherche',
  installed_project_skills: 'Skills du projet',
  installed_refresh: 'Actualiser',
  installed_remove_selected: 'Supprimer la sélection',
  installed_search_placeholder: 'Rechercher des skills...',
  installed_select_mode_exit: 'Quitter le mode sélection',
  installed_select_mode_start: 'Sélectionner des skills',
  installed_skill_count: '{count} skill(s) installée(s)',
  installed_skill_count_label: '{count} skill(s)',
  installed_title: 'Skills globaux',
  installed_update_all: 'Mettre à jour tout ({count})',

  // preferences-dialog
  preferences_agents_auto_hide: 'Masquer automatiquement',
  preferences_agents_description: 'Présélectionnés lors de l\'ajout de skills. Cliquez sur l\'oeil pour les masquer.',
  preferences_agents_hide: 'Masquer {name}',
  preferences_agents_hide_all: 'Tout masquer',
  preferences_agents_show: 'Afficher {name}',
  preferences_agents_show_all: 'Tout afficher',
  preferences_agents_title: 'Agents par défaut',
  preferences_auto_update_check: 'Activer la vérification automatique des mises à jour',
  preferences_auto_update_description: 'Vérifier les nouvelles versions au lancement',
  preferences_auto_update_title: 'Mise à jour automatique',
  preferences_cancel: 'Annuler',
  preferences_github: 'GitHub',
  preferences_language_de: 'Deutsch',
  preferences_language_en: 'English',
  preferences_language_es: 'Español',
  preferences_language_fr: 'Français',
  preferences_language_ja: '日本語',
  preferences_language_ko: '한국어',
  preferences_language_title: 'Langue',
  preferences_language_zh_cn: '中文(简体)',
  preferences_language_zh_tw: '中文(繁體)',
  preferences_package_manager_description: 'Outil d\'exécution de paquets utilisé lors de l\'ajout de skills',
  preferences_package_manager_label: 'Gestionnaire de paquets',
  preferences_package_manager_title: 'Gestionnaire de paquets',
  preferences_save: 'Enregistrer',
  preferences_title: 'Préférences',

  // search-input
  search_clear: 'Effacer la recherche',
  search_placeholder: 'Rechercher...',

  // selection-action-bar
  selection_action_add: 'Ajouter la sélection',
  selection_count: '{count} skill(s) sélectionnée(s)',
  selection_deselect: 'Désélectionner',
  selection_select_all: 'Tout sélectionner',

  // sidebar
  sidebar_click_to_confirm: 'Cliquez pour confirmer',
  sidebar_fallback_notice: '{from} introuvable - utilisation de {to}',
  sidebar_global_skills: 'Skills globaux',
  sidebar_import_project: 'Importer un projet',
  sidebar_loading: 'Chargement...',
  sidebar_no_projects: 'Aucun projet',
  sidebar_preferences: 'Préférences',
  sidebar_projects: 'Projets',
  sidebar_remove: 'Supprimer',
  sidebar_remove_project: 'Supprimer le projet',
  sidebar_skills_directory: 'Répertoire de skills',

  // skill-card
  skill_card_add: 'Ajouter la skill',
  skill_card_checking: 'Vérification en cours...',
  skill_card_click_to_confirm: 'Cliquez pour confirmer',
  skill_card_error: 'Erreur',
  skill_card_remove: 'Supprimer',
  skill_card_remove_skill: 'Supprimer la skill',
  skill_card_select: 'Sélectionner {name}',
  skill_card_update: 'Mettre à jour',
  skill_card_updating: 'Mise à jour en cours...',

  // skill-detail-view
  detail_about: 'À propos',
  detail_add: 'Ajouter',
  detail_error_description: 'Cette skill peut faire partie d\'un dépôt multi-skills dont le contenu ne peut pas être localisé automatiquement.',
  detail_error_title: 'Impossible de charger le contenu de la skill',
  detail_from_source: 'depuis {source}',
  detail_go_back: 'Retour',
  detail_installed: 'Installée',
  detail_installed_locally: 'installée localement',
  detail_installs: '{count} installation(s)',
  detail_not_found: 'Impossible de trouver la skill "{id}"',
  detail_not_found_title: 'Skill introuvable',
  detail_view_on_github: 'Voir sur GitHub',
  detail_view_source: 'Voir la source',

  // update-banner
  update_banner_available: 'v{version} disponible',
  update_banner_download: 'Télécharger',
  update_banner_downloading: 'Téléchargement de la mise à jour...',
  update_banner_error: 'Erreur : {message}',
  update_banner_ready: 'Prêt pour la mise à jour',
  update_banner_restart: 'Redémarrer',
  update_banner_retry: 'Réessayer',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
