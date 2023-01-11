const interfaceConfig = {
	APP_NAME: 'Jitsi Meet',
	AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
	AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',

	AUTO_PIN_LATEST_SCREEN_SHARE: 'remote-only',
	BRAND_WATERMARK_LINK: '',

	CLOSE_PAGE_GUEST_HINT: false,

	CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,

	CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,

	CONNECTION_INDICATOR_DISABLED: false,

	DEFAULT_BACKGROUND: '#474747',
	DEFAULT_LOCAL_DISPLAY_NAME: 'me',

	DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Jitster',

	DISABLE_DOMINANT_SPEAKER_INDICATOR: false,

	DISABLE_FOCUS_INDICATOR: false,

	DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,

	DISABLE_PRESENCE_STATUS: false,

	DISABLE_RINGING: false,

	DISABLE_TRANSCRIPTION_SUBTITLES: false,

	DISABLE_VIDEO_BACKGROUND: false,

	DISPLAY_WELCOME_FOOTER: true,
	DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD: false,
	DISPLAY_WELCOME_PAGE_CONTENT: false,
	DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,

	ENABLE_DIAL_OUT: true,

	ENABLE_FEEDBACK_ANIMATION: false,

	FILM_STRIP_MAX_HEIGHT: 120,

	GENERATE_ROOMNAMES_ON_WELCOME_PAGE: true,

	HIDE_DEEP_LINKING_LOGO: false,

	HIDE_INVITE_MORE_HEADER: false,

	INITIAL_TOOLBAR_TIMEOUT: 20000,
	JITSI_WATERMARK_LINK: 'https://jitsi.org',

	LANG_DETECTION: true,
	LIVE_STREAMING_HELP_LINK: 'https://jitsi.org/live',
	LOCAL_THUMBNAIL_RATIO: 16 / 9,

	MAXIMUM_ZOOMING_COEFFICIENT: 1.3,

	MOBILE_APP_PROMO: true,

	MOBILE_DOWNLOAD_LINK_ANDROID: 'https://play.google.com/store/apps/details?id=org.jitsi.meet',

	MOBILE_DOWNLOAD_LINK_F_DROID: 'https://f-droid.org/en/packages/org.jitsi.meet/',

	MOBILE_DOWNLOAD_LINK_IOS: 'https://itunes.apple.com/us/app/jitsi-meet/id1165103905',

	NATIVE_APP_NAME: 'Jitsi Meet',

	OPTIMAL_BROWSERS: ['chrome', 'chromium', 'firefox', 'nwjs', 'electron', 'safari'],

	POLICY_LOGO: null,
	PROVIDER_NAME: 'Jitsi',

	RECENT_LIST_ENABLED: true,
	REMOTE_THUMBNAIL_RATIO: 1,

	SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
	SHOW_BRAND_WATERMARK: false,

	SHOW_CHROME_EXTENSION_BANNER: false,

	SHOW_DEEP_LINKING_IMAGE: false,
	SHOW_JITSI_WATERMARK: false,
	SHOW_POWERED_BY: false,
	SHOW_PROMOTIONAL_CLOSE_PAGE: false,

	SUPPORT_URL: 'https://community.jitsi.org/',

	TOOLBAR_ALWAYS_VISIBLE: false,

	TOOLBAR_BUTTONS: [
		'microphone',
		'camera',
		'closedcaptions',
		'desktop',
		'embedmeeting',
		'fullscreen',
		'fodeviceselection',
		'hangup',
		'profile',
		'chat',
		'recording',
		'livestreaming',
		'etherpad',
		'sharedvideo',
		'settings',
		'raisehand',
		'videoquality',
		'filmstrip',
		'invite',
		'feedback',
		'stats',
		'shortcuts',
		'tileview',
		'videobackgroundblur',
		'download',
		'help',
		'mute-everyone',
		'security',
	],

	TOOLBAR_TIMEOUT: 4000,
	UNSUPPORTED_BROWSERS: [],
	VERTICAL_FILMSTRIP: true,
	VIDEO_LAYOUT_FIT: 'both',
	VIDEO_QUALITY_LABEL_DISABLED: false,
	makeJsonParserHappy: 'even if last key had a trailing comma',
};

export default interfaceConfig;
