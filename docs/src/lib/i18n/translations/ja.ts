import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { en } from './en'

export const ja = {
  // common
  common_download: 'ダウンロード',
  common_github: 'GitHub',
  common_footer_rights: 'All rights reserved.',

  // home - hero
  home_hero_title: 'AIエージェントスキルを視覚的にブラウズ、インストール、管理',
  home_hero_description:
    'SkillPadはskills.sh用のデスクトップGUIです。ギャラリーからスキルをブラウズし、ワンクリックで任意のエージェントにインストール。グローバルとプロジェクトスコープのスキルを一箇所で管理できます。',
  home_hero_whats_agent_skills: 'エージェントスキルとは？',

  // home - features
  home_feature_gallery_title: 'ギャラリーブラウジング',
  home_feature_gallery_description: 'skills.shギャラリーから新しいスキルを発見しましょう。',
  home_feature_install_title: 'ワンクリックインストール',
  home_feature_install_description: 'ターミナルを使わずにお好みのエージェントにインストール。',
  home_feature_scope_title: '柔軟なスコープ',
  home_feature_scope_description: 'グローバルとプロジェクトスコープのスキルを並べて管理。',
  home_feature_updates_title: '自動アップデート',
  home_feature_updates_description: '内蔵のアップデートチェックで常に最新の状態を維持。',

  // home - what is agent skills
  home_whats_title: 'エージェントスキルとは？',
  home_whats_description_1:
    'エージェントスキルは、AIコーディングエージェントに標準装備されていない専門知識を提供するマークダウンファイルです。AIのプラグインと考えてください — スキルをインストールすると、エージェントが即座に新しいことができるようになります。',
  home_whats_plugins_label: 'AIのプラグイン',
  home_whats_description_2:
    '例えば、スキルはエージェントに、より良いReactコンポーネントの書き方、チームのコーディング規約の遵守、ブラウザタスクの自動化、Slackワークスペースの管理などを教えることができます。',
  home_whats_markdown_title: 'マークダウンだけ',
  home_whats_markdown_description:
    '各スキルは、エージェントがランタイムに読む焦点を絞った構造化された指示を含むSKILL.mdファイルです。',
  home_whats_agents_title: 'あらゆるエージェントに対応',
  home_whats_agents_description: 'Claude Code、Cursor、Windsurfなど。スキルはオープンなskills.sh標準を使用。',
  home_whats_scope_title: 'グローバルまたはプロジェクトスコープ',
  home_whats_scope_description:
    'スキルをすべてのプロジェクトにグローバルにインストールするか、特定のプロジェクトにスコープできます。',
  home_whats_community_title: 'コミュニティ主導',
  home_whats_community_description: 'skills.shで数百のスキルをブラウズするか、自分で作成して他の人と共有しましょう。',

  // home - badge
  home_badge_title: 'Available on SkillPadバッジ',
  home_badge_description: 'READMEにこのバッジを埋め込んでワンクリックインストールを実現。',
  home_badge_try: '例:',
  home_badge_clear: 'クリア',

  // home - cta
  home_cta_title: 'SkillPadをダウンロード',
  home_cta_description: '無料でオープンソース。macOSとWindowsに対応。',

  // download
  download_title: 'SkillPadをダウンロード',
  download_description: 'macOSとWindowsに対応。無料でオープンソース。',
  download_version: 'バージョン {tag} \u00b7 {date} リリース',
  download_error: 'リリース情報を読み込めませんでした。',
  download_error_cta: 'GitHubでリリースを見る',
  download_macos: 'macOS',
  download_macos_requirement: 'macOS 10.15以降',
  download_windows: 'Windows',
  download_windows_requirement: 'Windows 10以降（64ビット）',
  download_recommended: 'おすすめ',
  download_not_available: '利用不可',
  download_all_releases: 'GitHubですべてのリリースを見る',

  // install
  install_opening: 'SkillPadを開いています...',
  install_opening_description: 'アプリで{skillId}を開いています。',
  install_not_installed: 'SkillPadがインストールされていません',
  install_not_installed_description:
    'SkillPadを使えば、AIエージェントスキルをビジュアルインターフェースでブラウズ・インストールできます。',
  install_skill_id: 'スキルID',
  install_download: 'SkillPadをダウンロード',
  install_try_again: '再試行',
} as const satisfies TranslationMap<Locale, typeof en>[Locale]
