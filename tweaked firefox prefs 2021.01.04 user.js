//// user.js tweaked preferences for Firefox by AveYo
//// place in your profile root directory (see about:profiles) & run prefsCleaner from github /arkenfox/user.js
//// must-have addons: uBlock Origin, LOCALCDN, ClearURLs, Never-Consent    + VPN users can add CanvasBlocker and set privacy.resistFingerprinting
//// must-have search: searx.space - opensource aggregator with multiple instances
//// 2021.01.04: Focus on safety, speed and reduced annoyances

////  ACCELERATED SMOOTH SCROLLING - now adjusted for migrationPercent 100                      Best to adjust only prefs having Fluid alternative
user_pref("general.smoothScroll.scrollbars.durationMaxMS", 600);                           // x ASS [150]       Fluid: 500 - 800
user_pref("general.smoothScroll.mouseWheel.durationMaxMS", 275);                           // x ASS [200]       Fluid: 250 - 500
user_pref("general.smoothScroll.other.durationMaxMS", 150);                                // x ASS [150]       Fluid: 200 - 400
user_pref("general.smoothScroll.pages.durationMaxMS", 150);                                // x ASS [150]       Fluid: 200 - 400
user_pref("general.smoothScroll.lines.durationMaxMS", 150);                                // x ASS [150]       Fluid: 200 - 400
user_pref("general.smoothScroll.pixels.durationMaxMS", 150);                               // x ASS [150]       Fluid: 200 - 400
user_pref("mousewheel.min_line_scroll_amount", 12);                                        // x ASS [5]         Fluid:  12 - 24
user_pref("toolkit.scrollbox.horizontalScrollDistance", 6);                                // x ASS [5]         Fluid:   3 - 12
user_pref("toolkit.scrollbox.verticalScrollDistance", 6);                                  // x ASS [3]         Fluid:   3 - 12
user_pref("mousewheel.acceleration.factor", 10);                                           // x ASS [10]        Fluid:   5 - 20
user_pref("mousewheel.acceleration.start", 0);                                             // o ASS [-1]        Fluid:   0
user_pref("mousewheel.default.delta_multiplier_x", 100);                                   // x ASS [100]
user_pref("mousewheel.default.delta_multiplier_y", 100);                                   // x ASS [100]
user_pref("mousewheel.default.delta_multiplier_z", 100);                                   // x ASS [100]
user_pref("mousewheel.system_scroll_override_on_root_content.enabled", false);             // o ASS [true]
user_pref("mousewheel.transaction.timeout", 2000);                                         // x ASS [1500]
user_pref("general.smoothScroll.scrollbars.durationMinMS", 0);                             // o ASS [150]
user_pref("general.smoothScroll.mouseWheel.durationMinMS", 0);                             // o ASS [50]
user_pref("general.smoothScroll.other.durationMinMS", 0);                                  // o ASS [150]
user_pref("general.smoothScroll.pages.durationMinMS", 0);                                  // o ASS [150]
user_pref("general.smoothScroll.lines.durationMinMS", 0);                                  // o ASS [150]
user_pref("general.smoothScroll.pixels.durationMinMS", 0);                                 // o ASS [150]
user_pref("general.smoothScroll.currentVelocityWeighting", "0");                           // o ASS [0.25]
user_pref("general.smoothScroll.stopDecelerationWeighting", "0.2");                        // x ASS [0.4]
user_pref("general.smoothScroll.durationToIntervalRatio", 2000);                           // x ASS [200]
user_pref("general.smoothScroll.msdPhysics.enabled", false);                               // o ASS [false]
user_pref("general.smoothScroll.mouseWheel.migrationPercent", 100);                        // o ASS [100] A pesky perf screwing low-level handling
user_pref("layers.async-pan-zoom.enabled", true);                                          // x ASS [true] reduces arrow scroll fps - awaiting fix

//// GENERAL
//user_pref("browser.altClickSave", true);                                                 // / ALT + click save target instead of 3x selects link
user_pref("browser.backspace_action", 0);                                                  // o Pressing Backspace does not open previous page [0]
user_pref("browser.bookmarks.editDialog.maxRecentFolders", 12);                            // x More recent folders in Bookmarks dialog [7]
user_pref("browser.bookmarks.max_backups", 2);                                             // x Bookmarks backup copies reduced [15]
user_pref("browser.bookmarks.openInTabClosesMenu", false);                                 // o close Bookmarks dialog after open in tab
user_pref("browser.bookmarks.showMobileBookmarks", true);                                  // x Show Mobile Bookmarks folder
user_pref("browser.bookmarks.showRecentlyBookmarked", true);                               // x Show Recent Bookmarks folder
user_pref("browser.cache.offline.enable", false);                                          // o Offline cache
user_pref("browser.defaultbrowser.notificationbar", false);                                // o Default browser notification
user_pref("browser.disableResetPrompt", true);                                             // x Prevent Reset Firefox prompt
user_pref("browser.download.autohideButton", false);                                       // o Hide Downloads button
user_pref("browser.download.folderList", 2);                                               // x Save files to last used folder = 2 / downloads = 1
user_pref("browser.download.hide_plugins_without_extensions", false);                      // o Allow applications (mime types) without a plugin
user_pref("browser.download.manager.addToRecentDocs", false);                              // o Adding downloads to os recent documents list
user_pref("browser.link.open_newwindow", 1);                                               // x Open new win link in most recent window or tab [3]
user_pref("browser.link.open_newwindow.override.external", 3);                             // x Open external links in active window new tab [-1]
user_pref("browser.link.open_newwindow.restriction", 0);                                   // o Divert links as in browser.link.open_newwindow [2]
//user_pref("browser.newtabpage.enabled", false);                                          // / Default New Tab page as empty
user_pref("browser.pagethumbnails.capturing_disabled", true);                              // x Page thumbnail collection
//user_pref("browser.region.network.url", "");                                             // / Clear region updates url
//user_pref("browser.region.update.enabled", false);                                       // / Disable region updates - for localized search etc.
user_pref("browser.search.context.loadInBackground", true);                                // x Search results open in the background, focus stays
user_pref("browser.sessionstore.cleanup.forget_closed_after", 86400000);                   // x Forget closed windows/tabs after 24h [1209600000]
user_pref("browser.sessionstore.interval", 1800000);                                       // x Save session to disk every 30m [15000]
user_pref("browser.sessionstore.interval.idle", 3600000);                                  // x Save session to disk when idle every 60m [3600000]
user_pref("browser.sessionstore.max_tabs_undo", 50);                                       // x History - Recently closed tabs count [25]
user_pref("browser.shell.checkDefaultBrowser", false);                                     // o Always check if Firefox is your default browser
user_pref("browser.slowStartup.notificationDisabled", true);                               // / Disable slow startup notification
user_pref("browser.slowStartup.maxSamples", 0);                                            // o Slow startup max samples [5]
user_pref("browser.slowStartup.samples", 0);                                               // o Slow startup min samples [2]
//user_pref("browser.startup.homepage", "about:home");                                     // / Preset homepage about:home / about:blank / custom
user_pref("browser.startup.homepage.abouthome_cache.enabled", true);                       // x Cache about:home to improve startup
user_pref("browser.startup.homepage_override.mstone", "ignore");                           // x "Your Firefox is up to date" homepage override
//user_pref("browser.startup.page", 1);                                                    // / Preset startup page - Home = 1 or Blank = 0
//user_pref("browser.startup.blankWindow", false);                                         // / Show blank window early on (wih RFP on flickers)
//user_pref("browser.startup.preXulSkeletonUI", false);                                    // / Show skeleton UI even before loading xul.dll
user_pref("browser.tabs.allowTabDetach", false);                                           // o Tab drag to detach in a new window
user_pref("browser.tabs.closeWindowWithLastTab", false);                                   // o Close window with last tab - annoyance with Ctrl+W
user_pref("browser.tabs.loadDivertedInBackground", true);                                  // x Open external links in background
user_pref("browser.tabs.loadBookmarksInBackground", true);                                 // x Open bookmarks in background (on middle-click)
user_pref("browser.tabs.tabMinWidth", 100);                                                // x Increase minimum tab width [76]
user_pref("browser.tabs.warnOnClose", false);                                              // o Tab close warning
user_pref("browser.tabs.warnOnCloseOtherTabs", false);                                     // o Multiple tabs close warning
user_pref("browser.tabs.warnOnOpen", false);                                               // o Opening multiple tabs slowdown warning
user_pref("browser.taskbar.lists.enabled", false);                                         // o Windows jumplist recent
user_pref("browser.taskbar.lists.frequent.enabled", false);                                // o Windows jumplist frequent
user_pref("browser.taskbar.lists.tasks.enabled", false);                                   // o Windows jumplist tasks
user_pref("browser.urlbar.clickSelectsAll", false);                                        // o Select all url on Click
user_pref("browser.urlbar.decodeURLsOnCopy", true);                                        // x Decode urlencoded link on copy
user_pref("browser.urlbar.doubleClickSelectsAll", true);                                   // x Select all url on doubleClick
user_pref("browser.urlbar.formatting.enabled", false);                                     // o Domain highlight that makes full url hard to read
user_pref("browser.urlbar.trimURLs", false);                                               // o Display all parts of the url in the urlbar
user_pref("browser.urlbar.update2.engineAliasRefresh", true);                              // x Enable Add button in Search engines options
user_pref("browser.xul.error_pages.expert_bad_cert", true);                                // x Display advanced info on Insecure Connection
//user_pref("browser.zoom.siteSpecific", false);                                           // / Disable remembering zoom per site
user_pref("dom.disable_beforeunload", true);                                               // x Confirm you want to leave dialog on page close
user_pref("dom.disable_window_move_resize", true);                                         // x Scripts moving and resizing open windows
user_pref("dom.popup_allowed_events", "click dblclick");                                   // o Limit events that can cause a popup
user_pref("dom.user_activation.transient.timeout", 500);                                   // x Reduce activation timeout - Autoplay uses [5000]
user_pref("dom.vibrator.enabled", false);                                                  // o Shaking the screen effect
//user_pref("extensions.screenshots.disabled", true);                                      // / Disable Screenshots extension - why, though?
//user_pref("extensions.screenshots.upload-disabled", true);                               // / Disable Screenshots upload
//user_pref("extensions.webcompat-reporter.enabled", false);                               // / Disable Web Compatibility Reporter
user_pref("findbar.highlightAll", true);                                                   // x Highlight All button selected on Ctrl+F search bar
user_pref("full-screen-api.approval-required", false);                                     // o Full-screen warning disable
//user_pref("full-screen-api.ignore-widgets", true);                                       // / Full-screen toggle does not maximize the window
user_pref("full-screen-api.warning.delay", 0);                                             // o Full-screen warning disable [500]
user_pref("full-screen-api.warning.timeout", 0);                                           // o Full-screen warning disable [3000]
user_pref("full-screen-api.transition-duration.enter", "0 0");                             // o Full-screen HTML5 transition on entering [200 200]
user_pref("full-screen-api.transition-duration.leave", "0 0");                             // o Full-screen HTML5 transition on leaving  [200 200]
user_pref("image.animation_mode", "once");                                                 // / GIF loop once - improves perf a lot
//user_pref("intl.accept_languages", "en-US, en");                                         // / Set preferred language for displaying web pages
//user_pref("javascript.use_us_english_locale", true);                                     // / Enforce US English regardless of system locale
user_pref("layout.spellcheckDefault", 2);                                                  // x Spellchecker for multi-line controls [1]
user_pref("media.autoplay.blocking_policy", 1);                                            // x Autoplay of HTML5 media policy 1 = new 2 = old [0]
user_pref("media.autoplay.default", 5);                                                    // x Autoplay block all by default [1]
user_pref("mousewheel.with_shift.action", 4);                                              // x Scroll horizontally on Shift+Mousewheel [4]
user_pref("media.memory_cache_max_size", 65536);                                           // x Increase media memory cache [8192]
user_pref("nglayout.enable_drag_images", false);                                           // o Tab drag without preview
user_pref("toolkit.winRegisterApplicationRestart", false);                                 // o Automatic reopen and session restore after reboot
user_pref("ui.prefersReducedMotion", 1);                                                   // x Reduce UI animations [0]
//user_pref("ui.key.menuAccessKey", 0);                                                    // / Alt key does not toggle the menu bar
//user_pref("ui.systemUsesDarkTheme", 1);                                                  // / Fake system dark theme - doesnt fix white flash :(

//// PRIVACY
user_pref("browser.contentblocking.category", "custom");                                   // x Enhanced Tracking Protection: custom
//user_pref("browser.formfill.enable", false);                                             // / Search and form history
user_pref("browser.privatebrowsing.forceMediaMemoryCache", true);                          // x Media cache writing to disk in Private Browsing
user_pref("dom.push.connection.enabled", false);                                           // o Push Notifications - make connections
//user_pref("dom.push.enabled", false);                                                    // / Push Notifications - needs service workers
//user_pref("dom.serviceWorkers.enabled", false);                                          // x Disable Service workers - unloaded sites listening
//user_pref("dom.webnotifications.enabled", false);                                        // / Web Notifications
//user_pref("dom.webnotifications.serviceworker.enabled", false);                          // / Web Notifications via service workers
user_pref("extensions.formautofill.heuristics.enabled", false);                            // o Form Autofill learning
//user_pref("extensions.formautofill.creditCards.enabled", false);                         // / Form Autofill credit cards
//user_pref("extensions.formautofill.addresses.enabled", false);                           // / Form Autofill addresses
//user_pref("extensions.formautofill.available", "off");                                   // / Form Autofill master toggle
//user_pref("gfx.font_rendering.opentype_svg.enabled", false);                             // / Rendering SVG OpenType fonts
user_pref("layout.css.font-visibility.level", 2);                                          // x Expose only system fonts OR Resist Fingerprinting
//user_pref("media.eme.enabled", false);                                                   // / Encryption Media Extension for DRM (Netflix etc)
//user_pref("media.gmp-gmpopenh264.autoupdate", false);                                    // / Cisco h264 decoder updating
//user_pref("media.gmp-widevinecdm.autoupdate", false);                                    // / Google widevine decryption for DRM (Netflix etc)
//user_pref("media.gmp-widevinecdm.enabled", false);                                       // / Google widevine decryption for DRM (Netflix etc)
//user_pref("media.gmp-widevinecdm.visible", false);                                       // / Google widevine decryption for DRM (Netflix etc)
//user_pref("media.navigator.enabled", false);                                             // / Disable media device enumeration
//user_pref("media.peerconnection.enabled", false);                                        // / Google WebRTC (Web Real-Time Communication)
user_pref("media.peerconnection.ice.default_address_only", true);                          // x Limit Google WebRTC IP leaks
user_pref("media.peerconnection.ice.no_host", true);                                       // x Limit Google WebRTC IP leaks
user_pref("media.peerconnection.ice.proxy_only_if_behind_proxy", true);                    // x limit Google WebRTC IP leaks
user_pref("network.cookie.cookieBehavior", 4);                                             // x Block Cross-site and social media trackers [4]
//user_pref("network.cookie.lifetimePolicy", 0);                                           // / Cookies and site data delete on close 2 / keep [0]
user_pref("network.cookie.thirdparty.nonsecureSessionOnly", true);                         // x Third-party cookies current session if nonsecure
user_pref("network.cookie.thirdparty.sessionOnly", false);                                 // o Third-party cookies current session all
user_pref("plugin.state.flash", 0);                                                        // o Flash - override per-site via site permissions [1]
user_pref("pref.privacy.disable_button.cookie_exceptions", false);                         // o Cookies exceptions
user_pref("pref.privacy.disable_button.view_passwords_exceptions", false);                 // o View passwords exceptions
user_pref("privacy.donottrackheader.enabled", true);                                       // x Send websites a Do Not Track signal
//user_pref("privacy.firstparty.isolate", true);                                           // / First Party Isolation toggle - breaks sites
user_pref("privacy.history.custom", true);                                                 // x Remember privacy history choices
//user_pref("privacy.resistFingerprinting", true);                                         // / RFP anti-fingerprint inefficiently - breaks sites
user_pref("privacy.trackingprotection.cryptomining.enabled", false);                       // o Block Cryptomining OR uBlock Origin
user_pref("privacy.trackingprotection.enabled", false);                                    // o Block Tracking OR uBlock Origin
user_pref("privacy.trackingprotection.fingerprinting.enabled", false);                     // o Block known fingerprinters OR uBlock Origin
user_pref("privacy.trackingprotection.pbmode.enabled", false);                             // o Block Tracking in Private browse OR uBlock Origin
user_pref("privacy.userContext.longPressBehaviour", true);                                 // x Long pressing new tab button shows Containers menu
user_pref("privacy.userContext.ui.enabled", true);                                         // x Enable Container Tabs choice in Options
//user_pref("webgl.disabled", true);                                                       // / WebGL high entropy,  breaks browser games if off
//user_pref("webgl.disable-fail-if-major-performance-caveat", true);                       // / WebGL do not auto-disable when low on resources
//user_pref("webgl.enable-debug-renderer-info", false);                                    // / WebGL debug info OR CanvasBlocker
//user_pref("webgl.enable-surface-texture", false);                                        // / WebGL texture info OR CanvasBlocker
//user_pref("webgl.enable-webgl2", false);                                                 // / WebGL v2 features OR CanvasBlocker
//user_pref("webgl.min_capability_mode", true);                                            // / WebGL limited capability OR CanvasBlocker

//// SECURITY
user_pref("accessibility.force_disabled", 1);                                              // x External accessibility services interactions [0]
user_pref("browser.fixup.alternate.enabled", false);                                       // o Location urlbar exploitable domain guessing
user_pref("browser.safebrowsing.allowOverride", true);                                     // x SafeBrowsing allows bypassing by user
//user_pref("browser.safebrowsing.blockedURIs.enabled", false);                            // / Block urls via Google rep OR uBlock Origin
//user_pref("browser.safebrowsing.downloads.enabled", false);                              // / Block downloads via Google rep OR uBlock Origin
user_pref("browser.safebrowsing.downloads.remote.block_uncommon", false);                  // o Block everything unsigned - 90's style dumb system
user_pref("browser.safebrowsing.downloads.remote.enabled", false);                         // o Dynamic lookup file hashes on Google's rep server
user_pref("browser.safebrowsing.malware.enabled", false);                                  // o Block Malware domains list OR uBlock Origin
user_pref("browser.safebrowsing.phishing.enabled", false);                                 // o Block Phishing domains list OR uBlock Origin
user_pref("browser.launcherProcess.enabled", true);                                        // x Block DLL Injections from antivirus & third-party
user_pref("browser.ssl_override_behavior", 1);                                             // x SSL Add Security Exception pre-populated url [2]
user_pref("browser.urlbar.dnsResolveSingleWordsAfterSearch", 0);                           // o DNS resolve single words after urlbar search [1]
//user_pref("dom.security.https_only_mode", false);                                        // x HTTPS-Only mode
user_pref("network.IDN_show_punycode", true);                                              // x Punycode for Int Domain Names anti-spoofing
user_pref("network.auth.subresource-http-auth-allow", 1);                                  // x Cross-origin sub-resources cant open HTTP auth [2]
user_pref("network.captive-portal-service.enabled", false);                                // o Captive Portal detection
user_pref("network.connectivity-service.enabled", false);                                  // o Network Connectivity checks
user_pref("network.dns.disableIPv6", true);                                                // x Disable IPv6
user_pref("network.dns.disablePrefetch", true);                                            // x Disable DNS prefetching
user_pref("network.dns.disablePrefetchFromHTTPS", true);                                   // x Disable DNS prefetching from HTTPS
user_pref("network.dns.echconfig.enabled", true);                                          // x Enable Encrypted Client Hello
user_pref("network.http.altsvc.enabled", false);                                           // / Disable HTTP Alternative Services OR enable FPI
user_pref("network.http.altsvc.oe", false);                                                // / Disable HTTP Alternative Services OR enable FPI
user_pref("network.http.http3.enabled", true);                                             // x Enable HTTP3
user_pref("network.http.redirection-limit", 10);                                           // x HTTP redirects (except HTML meta tags or JS) [20]
user_pref("network.http.referer.spoofSource", false);                                      // o Referer spoof - breaks sites
user_pref("network.http.referer.XOriginPolicy", 1);                                        // x Referer cross origin if base domains match [0]
user_pref("network.http.referer.XOriginTrimmingPolicy", 1);                                // x Don't sent full URI cross origin [0]
user_pref("network.http.speculative-parallel-limit", 0);                                   // o Link-mouseover open connection to link server [6]
user_pref("network.manage-offline-status", false);                                         // o Guess whether you are offline
user_pref("network.predictor.enable-prefetch", false);                                     // o Predictor prefetching
user_pref("network.predictor.enabled", false);                                             // o Predicator toggle
user_pref("network.prefetch-next", false);                                                 // o Link prefetching
user_pref("network.proxy.socks_remote_dns", true);                                         // x Enforce the proxy server to do any DNS lookups
user_pref("permissions.delegation.enabled", false);                                        // o Permissions delegation
//user_pref("permissions.manager.defaultsUrl", "");                                        // / Clear extra permissions for mozilla domains - dont
user_pref("security.OCSP.enabled", 1);                                                     // x Confirm current validity of certificates on OCSP
user_pref("security.OCSP.require", true);                                                  // x Require complete OCSP fetching
user_pref("security.cert_pinning.enforcement_level", 2);                                   // x Strict Public Key Pinning
user_pref("security.dialog_enable_delay", 1000);                                           // x Security delay on dialogs like install,  open/save
user_pref("security.disable_button.openCertManager", false);                               // o Allow override open certificate
//user_pref("security.external_protocol_requires_permission", false);                      // / v84 per-site confirm open protocol: magnet zoommtg
user_pref("security.family_safety.mode", 0);                                               // x Don't allow MitM by Microsoft Family Safety [2]
user_pref("security.insecure_connection_icon.enabled", true);                              // x Display "insecure" icon on HTTP sites
user_pref("security.mixed_content.block_object_subrequest", true);                         // x Block unencrypted Flash requests on encrypted page
user_pref("security.osclientcerts.autoload", true);                                        // x Use client certificates from the operating system
user_pref("security.pki.sha1_enforcement_level", 1);                                       // x SHA-1 certificates deprecated [3]
user_pref("security.ssl.disable_session_identifiers", true);                               // x Disable SSL session tracking
user_pref("security.ssl.require_safe_negotiation", true);                                  // x Require safe SSL negotiation
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);                        // x Display warning on the padlock for broken security
user_pref("security.tls.enable_0rtt_data", false);                                         // o TLS1.3 0-RTT (round-trip time)
user_pref("security.tls.version.enable-deprecated", false);                                // o Enforce TLS 1.0 and 1.1 downgrades as session only
user_pref("signon.autofillForms", false);                                                  // o Auto-filling username & password - OR click box
//user_pref("signon.formlessCapture.enabled", false);                                      // / Formless login capture for Password Manager
//user_pref("signon.generation.enabled", false);                                           // / Suggest and generate strong passwords
//user_pref("signon.management.page.breach-alerts.enabled", false);                        // / Show alerts about passwords for breached websites

//// TELEMETRY
user_pref("app.normandy.api_url", "");                                                     // o Normandy (Heartbeat) blank url
user_pref("app.normandy.enabled", false);                                                  // o Normandy (Heartbeat) for studies, feature rollouts
user_pref("app.normandy.optoutstudies.enabled", false);                                    // o Normandy (Heartbeat) running experiments
user_pref("app.normandy.user_id", "");                                                     // o cafecafe-cafe-cafe-cafe-cafecafecafe
user_pref("app.shield.optoutstudies.enabled", false);                                      // o Shield extension installing and running studies
user_pref("beacon.enabled", false);                                                        // o Sending additional analytics to web servers
user_pref("breakpad.reportURL", "");                                                       // o Crash Reports url
user_pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false);                     // o Auto send backlogged crash reports
user_pref("browser.crashReports.unsubmittedCheck.enabled", false);                         // o Unsent crash report prompt bar
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);                    // o New Tab page remote activity stream telemetry
user_pref("browser.newtabpage.activity-stream.impressionId", "");                          // o cafecafe-cafe-cafe-cafe-cafecafecafe
user_pref("browser.newtabpage.activity-stream.telemetry", false);                          // o New Tab page local activity stream telemetry
user_pref("browser.ping-centre.telemetry", false);                                         // o Telemetry for ping centre system
user_pref("browser.send_pings", false);                                                    // o Hyperlink Auditing aka click tracking
user_pref("browser.send_pings.require_same_host", true);                                   // x Hyperlink Auditing aka click tracking hardening
user_pref("browser.tabs.crashReporting.sendReport", false);                                // o Crash Reports for tabs
user_pref("datareporting.healthreport.service.enabled", false);                            // o Health reports service
user_pref("datareporting.healthreport.uploadEnabled", false);                              // o Health report upload to mozilla
user_pref("datareporting.policy.dataSubmissionEnabled", false);                            // o Data submission uploads master toggle
user_pref("default-browser-agent.enabled", false);                                         // o Default browser agent telemetry
user_pref("dom.ipc.plugins.flash.subprocess.crashreporter.enabled", false);                // o Sending Flash crash reports
user_pref("dom.ipc.plugins.reportCrashURL", false);                                        // o Sending website URL where a plugin crashed
user_pref("messaging-system.rsexperimentloader.enabled", false);                           // o New feature experiments
user_pref("toolkit.coverage.enabled", false);                                              // o Percent of users adopting feature x estimations
user_pref("toolkit.coverage.opt-out", true);                                               // x Percent of users adopting feature x estimations
user_pref("toolkit.telemetry.archive.enabled", false);                                     // o Allow pings to be archived locally
user_pref("toolkit.telemetry.bhrPing.enabled", false);                                     // o Ping telemetry servers on undocummented bhr event
user_pref("toolkit.telemetry.cachedClientID", "");                                         // o cafecafe-cafe-cafe-cafe-cafecafecafe
user_pref("toolkit.telemetry.coverage.opt-out", true);                                     // x Percent of users adopting feature x estimations
user_pref("toolkit.telemetry.ecosystemtelemetry.enabled", false);                          // o Firefox Account only telemetry
user_pref("toolkit.telemetry.enabled", false);                                             // o Telemetry module master toggle
user_pref("toolkit.telemetry.firstShutdownPing.enabled", false);                           // o Ping telemetry servers on first shutdown
user_pref("toolkit.telemetry.geckoview.streaming", false);                                 // o Gecko send Histogram/Scalar to telemetry delegate
user_pref("toolkit.telemetry.newProfilePing.enabled", false);                              // o Ping servers on the first run of a new profile
user_pref("toolkit.telemetry.pioneer-new-studies-available", false);                       // o New studies available - lie
user_pref("toolkit.telemetry.prioping.enabled", false);                                    // o Ping servers on content events (tracking blocked)
user_pref("toolkit.telemetry.reportingpolicy.firstRun", false);                            // o Firefox reporting warning
user_pref("toolkit.telemetry.server", "data:,");                                           // o Telemetry server forced empty
user_pref("toolkit.telemetry.shutdownPingSender.enabled", false);                          // o Ping servers on browser shuts down, second session
user_pref("toolkit.telemetry.shutdownPingSender.enabledFirstSession", false);              // o Ping servers on browser shuts down, first session
user_pref("toolkit.telemetry.unified", false);                                             // o Unified telemetry behavior
user_pref("toolkit.telemetry.updatePing.enabled", false);                                  // o Ping servers on browser updates - opt-out
user_pref("security.ssl.errorReporting.enabled", false);                                   // o SSL Error Reporting
user_pref("security.ssl.errorReporting.url", "");                                          // o SSL Error Reporting url
user_pref("services.sync.telemetry.maxPayloadCount", 1);                                   // x Ping servers on account sync with 1 entry [500]
user_pref("toolkit.telemetry.eventping.minimumFrequency", 6000);                           // x Ping servers on events min frequency [60]
user_pref("toolkit.telemetry.eventping.maximumFrequency", 6001);                           // x Ping servers on events max frequency [10]

//// SPONSORED
user_pref("browser.discovery.enabled", false);                                             // o Personalized recommendations
user_pref("browser.library.activity-stream.enabled", false);                               // o Library recent Highlights
user_pref("browser.laterrun.enabled", false);                                              // o Show welcome and onboarding later after install
user_pref("browser.messaging-system.whatsNewPanel.enabled", false);                        // o What's new panel
user_pref("browser.newtabpage.introShown", true);                                          // x New Tab welcome
user_pref("browser.newtabpage.activity-stream.asrouter.providers.cfr", "{\"id\":\"cfr\",\"enabled\":false}");         // o Mozilla servers
user_pref("browser.newtabpage.activity-stream.asrouter.providers.cfr-fxa", "{\"id\":\"cfr-fxa\",\"enabled\":false}"); // o 3rd-party servers
user_pref("browser.newtabpage.activity-stream.asrouter.providers.message-groups", "{\"id\":\"message-groups\",\"enabled\":false}");
user_pref("browser.newtabpage.activity-stream.asrouter.providers.messaging-experiments", "{\"id\":\"messaging-experiments\",\"enabled\":false}");
user_pref("browser.newtabpage.activity-stream.asrouter.providers.onboarding", "{\"id\":\"onboarding\",\"enabled\":false}");
user_pref("browser.newtabpage.activity-stream.asrouter.providers.snippets", "{\"id\":\"snippets\",\"enabled\":false}");
user_pref("browser.newtabpage.activity-stream.asrouter.providers.whats-new-panel", "{\"id\":\"whats-new-panel\",\"enabled\":false}");
user_pref("browser.newtabpage.activity-stream.asrouter.useRemoteL10n", false);             // o Online translate entries
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false);      // o Recommend extensions as you browse
user_pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false);    // o Recommend features as you browse
user_pref("browser.newtabpage.activity-stream.default.sites", "");                         // o Built-in Top Sites list - add your own instead
user_pref("browser.newtabpage.activity-stream.discoverystream.config", "{}");              // o Personalized content cfg
user_pref("browser.newtabpage.activity-stream.discoverystream.enabled", false);            // o Personalized content entries
user_pref("browser.newtabpage.activity-stream.feeds.asrouterfeed", false);                 // o Online contextual recommendations
user_pref("browser.newtabpage.activity-stream.feeds.discoverystreamfeed", false);          // o Personalized content entries
user_pref("browser.newtabpage.activity-stream.feeds.newtabinit", true);                    // x New Tab page entries master toggle
user_pref("browser.newtabpage.activity-stream.feeds.places", true);                        // x Breaks left-click to open links from New Tab page
user_pref("browser.newtabpage.activity-stream.feeds.prefs", true);                         // x Oops something went wrong otherwise
user_pref("browser.newtabpage.activity-stream.feeds.recommendationproviderswitcher",false);// o Refresh recommendations when provider changes
//user_pref("browser.newtabpage.activity-stream.feeds.section.highlights", false);         // / Highlights section entries
user_pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);           // o Top Stories section entries
user_pref("browser.newtabpage.activity-stream.feeds.section.topstories.options", "{}");    // o Top Stories section entries - forced empty
user_pref("browser.newtabpage.activity-stream.feeds.sections", true);                      // x All sections entries master toggle
user_pref("browser.newtabpage.activity-stream.feeds.snippets", false);                     // o Snippets entries
user_pref("browser.newtabpage.activity-stream.feeds.system.topstories", false);            // o Top Stories no refresh
//user_pref("browser.newtabpage.activity-stream.feeds.system.topsites", false);            // / Top Sites no refresh
//user_pref("browser.newtabpage.activity-stream.feeds.topsites", false);                   // / Top Sites entries
user_pref("browser.newtabpage.activity-stream.improvesearch.handoffToAwesomebar", true);   // x Search pane switches focus to urlbar
user_pref("browser.newtabpage.activity-stream.improvesearch.noDefaultSearchTile", true);   // x Search pane do not override most used sites order
user_pref("browser.newtabpage.activity-stream.improvesearch.topSiteSearchShortcuts",false);// o Search pane do not override most used sites
user_pref("browser.newtabpage.activity-stream.section.highlights.includePocket", false);   // o Pocket stories in highlights
user_pref("browser.newtabpage.activity-stream.showSearch", false);                         // o Search pane -superfluous,  use urlbar instead
user_pref("browser.newtabpage.activity-stream.showSponsored", false);                      // o Sponsored content
user_pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);              // o Sponsored Top Sites
user_pref("browser.search.suggest.enabled", false);                                        // o Search suggestions master toggle
user_pref("browser.search.update", true);                                                  // o Search engine updates - ebay needs an update atm
user_pref("browser.uitour.enabled", false);                                                // o Firefox Tour
user_pref("browser.urlbar.autoFill", false);                                               // x Disable urlbar autofill with domain extension
user_pref("browser.urlbar.speculativeConnect.enabled", false);                             // o Speculative connections from urlbar
user_pref("browser.urlbar.suggest.searches", false);                                       // o Previous searches suggestions
user_pref("browser.urlbar.suggest.engines", true);                                         // x Search engines in the urlbar (tab2search)
user_pref("browser.urlbar.update2.oneOffsRefresh", false);                                 // o Search in alternative engine v83 new annoyance
user_pref("extensions.getAddons.showPane", false);                                         // o Get Add-ons recommendations
user_pref("extensions.htmlaboutaddons.recommendations.enabled", false);                    // o Html about:addons recommendations
user_pref("extensions.pocket.enabled", false);                                             // o Pocket extension
user_pref("startup.homepage_override_url", "");                                            // o What's New page after updates
user_pref("startup.homepage_welcome_url", "");                                             // o Welcome page
user_pref("startup.homepage_welcome_url.additional", "");                                  // o Welcome additional pages

//// UPDATE
user_pref("app.update.auto", false);                                                       // o Check for updates but let you choose to install
user_pref("app.update.service.enabled", false);                                            // o Use a background service to install updates
user_pref("app.update.silent", false);                                                     // o Hide update UI prompts
//user_pref("extensions.systemAddon.update.enabled", false);                               // / System Add-ons update
//user_pref("extensions.update.autoUpdateDefault", false);                                 // / Update Add-ons Automatically

//// DEVELOPER
user_pref("browser.aboutConfig.showWarning", false);                                       // o Do not show about:config warning
user_pref("devtools.aboutdebugging.showSystemAddons", true);                               // x Display system addons in about:debugging
user_pref("devtools.chrome.enabled", true);                                                // x Browser chrome and add-on - Ctrl+Shift+J input
//user_pref("devtools.debugger.remote-enabled", true);                                     // / Browser Toolbox - Ctrl+Alt+Shift+I
user_pref("devtools.inspector.compatibility.enabled", true);                               // x Add inspector sidebar panel for the webcompat tool
user_pref("general.warnOnAboutConfig", false);                                             // o Display about:config normally without a warning
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);                    // x profile\chrome\ userChrome.css and userContent.css
