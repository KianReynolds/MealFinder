import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  __rest
} from "./chunk-SHNWMCCJ.js";
import {
  Component,
  DEFAULT_ENTRY_NAME,
  ErrorFactory,
  FirebaseError,
  LogLevel,
  Logger,
  SDK_VERSION,
  _addComponent,
  _addOrOverwriteComponent,
  _isFirebaseServerApp,
  _registerComponent,
  base64Decode,
  contains,
  createSubscribe,
  deepEqual,
  deepExtend,
  deleteApp,
  extractQuerystring,
  getGlobal,
  getModularInstance,
  getUA,
  index_esm2017_exports,
  initializeApp,
  isBrowserExtension,
  isCloudflareWorker,
  isEmpty,
  isIE,
  isIndexedDBAvailable,
  isMobileCordova,
  isNode,
  isReactNative,
  onLog,
  querystring,
  querystringDecode,
  registerVersion,
  setLogLevel
} from "./chunk-YUTBEUZF.js";
import {
  __async,
  __superGet
} from "./chunk-ANGF2IQY.js";

// node_modules/@firebase/app-compat/dist/esm/index.esm2017.js
var FirebaseAppImpl = class {
  constructor(_delegate, firebase2) {
    this._delegate = _delegate;
    this.firebase = firebase2;
    _addComponent(_delegate, new Component(
      "app-compat",
      () => this,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
    this.container = _delegate.container;
  }
  get automaticDataCollectionEnabled() {
    return this._delegate.automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(val) {
    this._delegate.automaticDataCollectionEnabled = val;
  }
  get name() {
    return this._delegate.name;
  }
  get options() {
    return this._delegate.options;
  }
  delete() {
    return new Promise((resolve) => {
      this._delegate.checkDestroyed();
      resolve();
    }).then(() => {
      this.firebase.INTERNAL.removeApp(this.name);
      return deleteApp(this._delegate);
    });
  }
  /**
   * Return a service instance associated with this app (creating it
   * on demand), identified by the passed instanceIdentifier.
   *
   * NOTE: Currently storage and functions are the only ones that are leveraging this
   * functionality. They invoke it by calling:
   *
   * ```javascript
   * firebase.app().storage('STORAGE BUCKET ID')
   * ```
   *
   * The service name is passed to this already
   * @internal
   */
  _getService(name4, instanceIdentifier = DEFAULT_ENTRY_NAME) {
    var _a;
    this._delegate.checkDestroyed();
    const provider = this._delegate.container.getProvider(name4);
    if (!provider.isInitialized() && ((_a = provider.getComponent()) === null || _a === void 0 ? void 0 : _a.instantiationMode) === "EXPLICIT") {
      provider.initialize();
    }
    return provider.getImmediate({
      identifier: instanceIdentifier
    });
  }
  /**
   * Remove a service instance from the cache, so we will create a new instance for this service
   * when people try to get it again.
   *
   * NOTE: currently only firestore uses this functionality to support firestore shutdown.
   *
   * @param name The service name
   * @param instanceIdentifier instance identifier in case multiple instances are allowed
   * @internal
   */
  _removeServiceInstance(name4, instanceIdentifier = DEFAULT_ENTRY_NAME) {
    this._delegate.container.getProvider(name4).clearInstance(instanceIdentifier);
  }
  /**
   * @param component the component being added to this app's container
   * @internal
   */
  _addComponent(component) {
    _addComponent(this._delegate, component);
  }
  _addOrOverwriteComponent(component) {
    _addOrOverwriteComponent(this._delegate, component);
  }
  toJSON() {
    return {
      name: this.name,
      automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
      options: this.options
    };
  }
};
var ERRORS = {
  [
    "no-app"
    /* AppError.NO_APP */
  ]: "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
  [
    "invalid-app-argument"
    /* AppError.INVALID_APP_ARGUMENT */
  ]: "firebase.{$appName}() takes either no argument or a Firebase App instance."
};
var ERROR_FACTORY = new ErrorFactory("app-compat", "Firebase", ERRORS);
function createFirebaseNamespaceCore(firebaseAppImpl) {
  const apps = {};
  const namespace = {
    // Hack to prevent Babel from modifying the object returned
    // as the firebase namespace.
    // @ts-ignore
    __esModule: true,
    initializeApp: initializeAppCompat,
    // @ts-ignore
    app,
    registerVersion,
    setLogLevel,
    onLog,
    // @ts-ignore
    apps: null,
    SDK_VERSION,
    INTERNAL: {
      registerComponent: registerComponentCompat,
      removeApp,
      useAsService,
      modularAPIs: index_esm2017_exports
    }
  };
  namespace["default"] = namespace;
  Object.defineProperty(namespace, "apps", {
    get: getApps
  });
  function removeApp(name4) {
    delete apps[name4];
  }
  function app(name4) {
    name4 = name4 || DEFAULT_ENTRY_NAME;
    if (!contains(apps, name4)) {
      throw ERROR_FACTORY.create("no-app", {
        appName: name4
      });
    }
    return apps[name4];
  }
  app["App"] = firebaseAppImpl;
  function initializeAppCompat(options, rawConfig = {}) {
    const app2 = initializeApp(options, rawConfig);
    if (contains(apps, app2.name)) {
      return apps[app2.name];
    }
    const appCompat = new firebaseAppImpl(app2, namespace);
    apps[app2.name] = appCompat;
    return appCompat;
  }
  function getApps() {
    return Object.keys(apps).map((name4) => apps[name4]);
  }
  function registerComponentCompat(component) {
    const componentName = component.name;
    const componentNameWithoutCompat = componentName.replace("-compat", "");
    if (_registerComponent(component) && component.type === "PUBLIC") {
      const serviceNamespace = (appArg = app()) => {
        if (typeof appArg[componentNameWithoutCompat] !== "function") {
          throw ERROR_FACTORY.create("invalid-app-argument", {
            appName: componentName
          });
        }
        return appArg[componentNameWithoutCompat]();
      };
      if (component.serviceProps !== void 0) {
        deepExtend(serviceNamespace, component.serviceProps);
      }
      namespace[componentNameWithoutCompat] = serviceNamespace;
      firebaseAppImpl.prototype[componentNameWithoutCompat] = // TODO: The eslint disable can be removed and the 'ignoreRestArgs'
      // option added to the no-explicit-any rule when ESlint releases it.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function(...args) {
        const serviceFxn = this._getService.bind(this, componentName);
        return serviceFxn.apply(this, component.multipleInstances ? args : []);
      };
    }
    return component.type === "PUBLIC" ? (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      namespace[componentNameWithoutCompat]
    ) : null;
  }
  function useAsService(app2, name4) {
    if (name4 === "serverAuth") {
      return null;
    }
    const useService = name4;
    return useService;
  }
  return namespace;
}
function createFirebaseNamespace() {
  const namespace = createFirebaseNamespaceCore(FirebaseAppImpl);
  namespace.INTERNAL = Object.assign(Object.assign({}, namespace.INTERNAL), {
    createFirebaseNamespace,
    extendNamespace,
    createSubscribe,
    ErrorFactory,
    deepExtend
  });
  function extendNamespace(props) {
    deepExtend(namespace, props);
  }
  return namespace;
}
var firebase$1 = createFirebaseNamespace();
var logger = new Logger("@firebase/app-compat");
var name = "@firebase/app-compat";
var version = "0.2.51";
function registerCoreComponents(variant) {
  registerVersion(name, version, variant);
}
try {
  const globals = getGlobal();
  if (globals.firebase !== void 0) {
    logger.warn(`
      Warning: Firebase is already defined in the global scope. Please make sure
      Firebase library is only loaded once.
    `);
    const sdkVersion = globals.firebase.SDK_VERSION;
    if (sdkVersion && sdkVersion.indexOf("LITE") >= 0) {
      logger.warn(`
        Warning: You are trying to load Firebase while using Firebase Performance standalone script.
        You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.
        `);
    }
  }
} catch (_a) {
}
var firebase = firebase$1;
registerCoreComponents();

// node_modules/@firebase/auth-compat/node_modules/@firebase/auth/dist/node-esm/totp-d5ff2369.js
var ProviderId = {
  /** Facebook provider ID */
  FACEBOOK: "facebook.com",
  /** GitHub provider ID */
  GITHUB: "github.com",
  /** Google provider ID */
  GOOGLE: "google.com",
  /** Password provider */
  PASSWORD: "password",
  /** Phone provider */
  PHONE: "phone",
  /** Twitter provider ID */
  TWITTER: "twitter.com"
};
var ActionCodeOperation = {
  /** The email link sign-in action. */
  EMAIL_SIGNIN: "EMAIL_SIGNIN",
  /** The password reset action. */
  PASSWORD_RESET: "PASSWORD_RESET",
  /** The email revocation action. */
  RECOVER_EMAIL: "RECOVER_EMAIL",
  /** The revert second factor addition email action. */
  REVERT_SECOND_FACTOR_ADDITION: "REVERT_SECOND_FACTOR_ADDITION",
  /** The revert second factor addition email action. */
  VERIFY_AND_CHANGE_EMAIL: "VERIFY_AND_CHANGE_EMAIL",
  /** The email verification action. */
  VERIFY_EMAIL: "VERIFY_EMAIL"
};
function _debugErrorMap() {
  return {
    [
      "admin-restricted-operation"
      /* AuthErrorCode.ADMIN_ONLY_OPERATION */
    ]: "This operation is restricted to administrators only.",
    [
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    ]: "",
    [
      "app-not-authorized"
      /* AuthErrorCode.APP_NOT_AUTHORIZED */
    ]: "This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.",
    [
      "app-not-installed"
      /* AuthErrorCode.APP_NOT_INSTALLED */
    ]: "The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.",
    [
      "captcha-check-failed"
      /* AuthErrorCode.CAPTCHA_CHECK_FAILED */
    ]: "The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.",
    [
      "code-expired"
      /* AuthErrorCode.CODE_EXPIRED */
    ]: "The SMS code has expired. Please re-send the verification code to try again.",
    [
      "cordova-not-ready"
      /* AuthErrorCode.CORDOVA_NOT_READY */
    ]: "Cordova framework is not ready.",
    [
      "cors-unsupported"
      /* AuthErrorCode.CORS_UNSUPPORTED */
    ]: "This browser is not supported.",
    [
      "credential-already-in-use"
      /* AuthErrorCode.CREDENTIAL_ALREADY_IN_USE */
    ]: "This credential is already associated with a different user account.",
    [
      "custom-token-mismatch"
      /* AuthErrorCode.CREDENTIAL_MISMATCH */
    ]: "The custom token corresponds to a different audience.",
    [
      "requires-recent-login"
      /* AuthErrorCode.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */
    ]: "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
    [
      "dependent-sdk-initialized-before-auth"
      /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
    ]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.",
    [
      "dynamic-link-not-activated"
      /* AuthErrorCode.DYNAMIC_LINK_NOT_ACTIVATED */
    ]: "Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.",
    [
      "email-change-needs-verification"
      /* AuthErrorCode.EMAIL_CHANGE_NEEDS_VERIFICATION */
    ]: "Multi-factor users must always have a verified email.",
    [
      "email-already-in-use"
      /* AuthErrorCode.EMAIL_EXISTS */
    ]: "The email address is already in use by another account.",
    [
      "emulator-config-failed"
      /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
    ]: 'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',
    [
      "expired-action-code"
      /* AuthErrorCode.EXPIRED_OOB_CODE */
    ]: "The action code has expired.",
    [
      "cancelled-popup-request"
      /* AuthErrorCode.EXPIRED_POPUP_REQUEST */
    ]: "This operation has been cancelled due to another conflicting popup being opened.",
    [
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ]: "An internal AuthError has occurred.",
    [
      "invalid-app-credential"
      /* AuthErrorCode.INVALID_APP_CREDENTIAL */
    ]: "The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.",
    [
      "invalid-app-id"
      /* AuthErrorCode.INVALID_APP_ID */
    ]: "The mobile app identifier is not registered for the current project.",
    [
      "invalid-user-token"
      /* AuthErrorCode.INVALID_AUTH */
    ]: "This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.",
    [
      "invalid-auth-event"
      /* AuthErrorCode.INVALID_AUTH_EVENT */
    ]: "An internal AuthError has occurred.",
    [
      "invalid-verification-code"
      /* AuthErrorCode.INVALID_CODE */
    ]: "The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.",
    [
      "invalid-continue-uri"
      /* AuthErrorCode.INVALID_CONTINUE_URI */
    ]: "The continue URL provided in the request is invalid.",
    [
      "invalid-cordova-configuration"
      /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */
    ]: "The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.",
    [
      "invalid-custom-token"
      /* AuthErrorCode.INVALID_CUSTOM_TOKEN */
    ]: "The custom token format is incorrect. Please check the documentation.",
    [
      "invalid-dynamic-link-domain"
      /* AuthErrorCode.INVALID_DYNAMIC_LINK_DOMAIN */
    ]: "The provided dynamic link domain is not configured or authorized for the current project.",
    [
      "invalid-email"
      /* AuthErrorCode.INVALID_EMAIL */
    ]: "The email address is badly formatted.",
    [
      "invalid-emulator-scheme"
      /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
    ]: "Emulator URL must start with a valid scheme (http:// or https://).",
    [
      "invalid-api-key"
      /* AuthErrorCode.INVALID_API_KEY */
    ]: "Your API key is invalid, please check you have copied it correctly.",
    [
      "invalid-cert-hash"
      /* AuthErrorCode.INVALID_CERT_HASH */
    ]: "The SHA-1 certificate hash provided is invalid.",
    [
      "invalid-credential"
      /* AuthErrorCode.INVALID_CREDENTIAL */
    ]: "The supplied auth credential is incorrect, malformed or has expired.",
    [
      "invalid-message-payload"
      /* AuthErrorCode.INVALID_MESSAGE_PAYLOAD */
    ]: "The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.",
    [
      "invalid-multi-factor-session"
      /* AuthErrorCode.INVALID_MFA_SESSION */
    ]: "The request does not contain a valid proof of first factor successful sign-in.",
    [
      "invalid-oauth-provider"
      /* AuthErrorCode.INVALID_OAUTH_PROVIDER */
    ]: "EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.",
    [
      "invalid-oauth-client-id"
      /* AuthErrorCode.INVALID_OAUTH_CLIENT_ID */
    ]: "The OAuth client ID provided is either invalid or does not match the specified API key.",
    [
      "unauthorized-domain"
      /* AuthErrorCode.INVALID_ORIGIN */
    ]: "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
    [
      "invalid-action-code"
      /* AuthErrorCode.INVALID_OOB_CODE */
    ]: "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.",
    [
      "wrong-password"
      /* AuthErrorCode.INVALID_PASSWORD */
    ]: "The password is invalid or the user does not have a password.",
    [
      "invalid-persistence-type"
      /* AuthErrorCode.INVALID_PERSISTENCE */
    ]: "The specified persistence type is invalid. It can only be local, session or none.",
    [
      "invalid-phone-number"
      /* AuthErrorCode.INVALID_PHONE_NUMBER */
    ]: "The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].",
    [
      "invalid-provider-id"
      /* AuthErrorCode.INVALID_PROVIDER_ID */
    ]: "The specified provider ID is invalid.",
    [
      "invalid-recipient-email"
      /* AuthErrorCode.INVALID_RECIPIENT_EMAIL */
    ]: "The email corresponding to this action failed to send as the provided recipient email address is invalid.",
    [
      "invalid-sender"
      /* AuthErrorCode.INVALID_SENDER */
    ]: "The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.",
    [
      "invalid-verification-id"
      /* AuthErrorCode.INVALID_SESSION_INFO */
    ]: "The verification ID used to create the phone auth credential is invalid.",
    [
      "invalid-tenant-id"
      /* AuthErrorCode.INVALID_TENANT_ID */
    ]: "The Auth instance's tenant ID is invalid.",
    [
      "login-blocked"
      /* AuthErrorCode.LOGIN_BLOCKED */
    ]: "Login blocked by user-provided method: {$originalMessage}",
    [
      "missing-android-pkg-name"
      /* AuthErrorCode.MISSING_ANDROID_PACKAGE_NAME */
    ]: "An Android Package Name must be provided if the Android App is required to be installed.",
    [
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    ]: "Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.",
    [
      "missing-app-credential"
      /* AuthErrorCode.MISSING_APP_CREDENTIAL */
    ]: "The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.",
    [
      "missing-verification-code"
      /* AuthErrorCode.MISSING_CODE */
    ]: "The phone auth credential was created with an empty SMS verification code.",
    [
      "missing-continue-uri"
      /* AuthErrorCode.MISSING_CONTINUE_URI */
    ]: "A continue URL must be provided in the request.",
    [
      "missing-iframe-start"
      /* AuthErrorCode.MISSING_IFRAME_START */
    ]: "An internal AuthError has occurred.",
    [
      "missing-ios-bundle-id"
      /* AuthErrorCode.MISSING_IOS_BUNDLE_ID */
    ]: "An iOS Bundle ID must be provided if an App Store ID is provided.",
    [
      "missing-or-invalid-nonce"
      /* AuthErrorCode.MISSING_OR_INVALID_NONCE */
    ]: "The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.",
    [
      "missing-password"
      /* AuthErrorCode.MISSING_PASSWORD */
    ]: "A non-empty password must be provided",
    [
      "missing-multi-factor-info"
      /* AuthErrorCode.MISSING_MFA_INFO */
    ]: "No second factor identifier is provided.",
    [
      "missing-multi-factor-session"
      /* AuthErrorCode.MISSING_MFA_SESSION */
    ]: "The request is missing proof of first factor successful sign-in.",
    [
      "missing-phone-number"
      /* AuthErrorCode.MISSING_PHONE_NUMBER */
    ]: "To send verification codes, provide a phone number for the recipient.",
    [
      "missing-verification-id"
      /* AuthErrorCode.MISSING_SESSION_INFO */
    ]: "The phone auth credential was created with an empty verification ID.",
    [
      "app-deleted"
      /* AuthErrorCode.MODULE_DESTROYED */
    ]: "This instance of FirebaseApp has been deleted.",
    [
      "multi-factor-info-not-found"
      /* AuthErrorCode.MFA_INFO_NOT_FOUND */
    ]: "The user does not have a second factor matching the identifier provided.",
    [
      "multi-factor-auth-required"
      /* AuthErrorCode.MFA_REQUIRED */
    ]: "Proof of ownership of a second factor is required to complete sign-in.",
    [
      "account-exists-with-different-credential"
      /* AuthErrorCode.NEED_CONFIRMATION */
    ]: "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
    [
      "network-request-failed"
      /* AuthErrorCode.NETWORK_REQUEST_FAILED */
    ]: "A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.",
    [
      "no-auth-event"
      /* AuthErrorCode.NO_AUTH_EVENT */
    ]: "An internal AuthError has occurred.",
    [
      "no-such-provider"
      /* AuthErrorCode.NO_SUCH_PROVIDER */
    ]: "User was not linked to an account with the given provider.",
    [
      "null-user"
      /* AuthErrorCode.NULL_USER */
    ]: "A null user object was provided as the argument for an operation which requires a non-null user object.",
    [
      "operation-not-allowed"
      /* AuthErrorCode.OPERATION_NOT_ALLOWED */
    ]: "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.",
    [
      "operation-not-supported-in-this-environment"
      /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
    ]: 'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
    [
      "popup-blocked"
      /* AuthErrorCode.POPUP_BLOCKED */
    ]: "Unable to establish a connection with the popup. It may have been blocked by the browser.",
    [
      "popup-closed-by-user"
      /* AuthErrorCode.POPUP_CLOSED_BY_USER */
    ]: "The popup has been closed by the user before finalizing the operation.",
    [
      "provider-already-linked"
      /* AuthErrorCode.PROVIDER_ALREADY_LINKED */
    ]: "User can only be linked to one identity for the given provider.",
    [
      "quota-exceeded"
      /* AuthErrorCode.QUOTA_EXCEEDED */
    ]: "The project's quota for this operation has been exceeded.",
    [
      "redirect-cancelled-by-user"
      /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */
    ]: "The redirect operation has been cancelled by the user before finalizing.",
    [
      "redirect-operation-pending"
      /* AuthErrorCode.REDIRECT_OPERATION_PENDING */
    ]: "A redirect sign-in operation is already pending.",
    [
      "rejected-credential"
      /* AuthErrorCode.REJECTED_CREDENTIAL */
    ]: "The request contains malformed or mismatching credentials.",
    [
      "second-factor-already-in-use"
      /* AuthErrorCode.SECOND_FACTOR_ALREADY_ENROLLED */
    ]: "The second factor is already enrolled on this account.",
    [
      "maximum-second-factor-count-exceeded"
      /* AuthErrorCode.SECOND_FACTOR_LIMIT_EXCEEDED */
    ]: "The maximum allowed number of second factors on a user has been exceeded.",
    [
      "tenant-id-mismatch"
      /* AuthErrorCode.TENANT_ID_MISMATCH */
    ]: "The provided tenant ID does not match the Auth instance's tenant ID",
    [
      "timeout"
      /* AuthErrorCode.TIMEOUT */
    ]: "The operation has timed out.",
    [
      "user-token-expired"
      /* AuthErrorCode.TOKEN_EXPIRED */
    ]: "The user's credential is no longer valid. The user must sign in again.",
    [
      "too-many-requests"
      /* AuthErrorCode.TOO_MANY_ATTEMPTS_TRY_LATER */
    ]: "We have blocked all requests from this device due to unusual activity. Try again later.",
    [
      "unauthorized-continue-uri"
      /* AuthErrorCode.UNAUTHORIZED_DOMAIN */
    ]: "The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.",
    [
      "unsupported-first-factor"
      /* AuthErrorCode.UNSUPPORTED_FIRST_FACTOR */
    ]: "Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.",
    [
      "unsupported-persistence-type"
      /* AuthErrorCode.UNSUPPORTED_PERSISTENCE */
    ]: "The current environment does not support the specified persistence type.",
    [
      "unsupported-tenant-operation"
      /* AuthErrorCode.UNSUPPORTED_TENANT_OPERATION */
    ]: "This operation is not supported in a multi-tenant context.",
    [
      "unverified-email"
      /* AuthErrorCode.UNVERIFIED_EMAIL */
    ]: "The operation requires a verified email.",
    [
      "user-cancelled"
      /* AuthErrorCode.USER_CANCELLED */
    ]: "The user did not grant your application the permissions it requested.",
    [
      "user-not-found"
      /* AuthErrorCode.USER_DELETED */
    ]: "There is no user record corresponding to this identifier. The user may have been deleted.",
    [
      "user-disabled"
      /* AuthErrorCode.USER_DISABLED */
    ]: "The user account has been disabled by an administrator.",
    [
      "user-mismatch"
      /* AuthErrorCode.USER_MISMATCH */
    ]: "The supplied credentials do not correspond to the previously signed in user.",
    [
      "user-signed-out"
      /* AuthErrorCode.USER_SIGNED_OUT */
    ]: "",
    [
      "weak-password"
      /* AuthErrorCode.WEAK_PASSWORD */
    ]: "The password must be 6 characters long or more.",
    [
      "web-storage-unsupported"
      /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */
    ]: "This browser is not supported or 3rd party cookies and data may be disabled.",
    [
      "already-initialized"
      /* AuthErrorCode.ALREADY_INITIALIZED */
    ]: "initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.",
    [
      "missing-recaptcha-token"
      /* AuthErrorCode.MISSING_RECAPTCHA_TOKEN */
    ]: "The reCAPTCHA token is missing when sending request to the backend.",
    [
      "invalid-recaptcha-token"
      /* AuthErrorCode.INVALID_RECAPTCHA_TOKEN */
    ]: "The reCAPTCHA token is invalid when sending request to the backend.",
    [
      "invalid-recaptcha-action"
      /* AuthErrorCode.INVALID_RECAPTCHA_ACTION */
    ]: "The reCAPTCHA action is invalid when sending request to the backend.",
    [
      "recaptcha-not-enabled"
      /* AuthErrorCode.RECAPTCHA_NOT_ENABLED */
    ]: "reCAPTCHA Enterprise integration is not enabled for this project.",
    [
      "missing-client-type"
      /* AuthErrorCode.MISSING_CLIENT_TYPE */
    ]: "The reCAPTCHA client type is missing when sending request to the backend.",
    [
      "missing-recaptcha-version"
      /* AuthErrorCode.MISSING_RECAPTCHA_VERSION */
    ]: "The reCAPTCHA version is missing when sending request to the backend.",
    [
      "invalid-req-type"
      /* AuthErrorCode.INVALID_REQ_TYPE */
    ]: "Invalid request parameters.",
    [
      "invalid-recaptcha-version"
      /* AuthErrorCode.INVALID_RECAPTCHA_VERSION */
    ]: "The reCAPTCHA version is invalid when sending request to the backend.",
    [
      "unsupported-password-policy-schema-version"
      /* AuthErrorCode.UNSUPPORTED_PASSWORD_POLICY_SCHEMA_VERSION */
    ]: "The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.",
    [
      "password-does-not-meet-requirements"
      /* AuthErrorCode.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */
    ]: "The password does not meet the requirements.",
    [
      "invalid-hosting-link-domain"
      /* AuthErrorCode.INVALID_HOSTING_LINK_DOMAIN */
    ]: "The provided Hosting link domain is not configured in Firebase Hosting or is not owned by the current project. This cannot be a default Hosting domain (`web.app` or `firebaseapp.com`)."
  };
}
function _prodErrorMap() {
  return {
    [
      "dependent-sdk-initialized-before-auth"
      /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
    ]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
  };
}
var debugErrorMap = _debugErrorMap;
var prodErrorMap = _prodErrorMap;
var _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
var logClient = new Logger("@firebase/auth");
function _logWarn(msg, ...args) {
  if (logClient.logLevel <= LogLevel.WARN) {
    logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
}
function _logError(msg, ...args) {
  if (logClient.logLevel <= LogLevel.ERROR) {
    logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
}
function _fail(authOrCode, ...rest) {
  throw createErrorInternal(authOrCode, ...rest);
}
function _createError(authOrCode, ...rest) {
  return createErrorInternal(authOrCode, ...rest);
}
function _errorWithCustomMessage(auth, code, message) {
  const errorMap = Object.assign(Object.assign({}, prodErrorMap()), {
    [code]: message
  });
  const factory = new ErrorFactory("auth", "Firebase", errorMap);
  return factory.create(code, {
    appName: auth.name
  });
}
function _serverAppCurrentUserOperationNotSupportedError(auth) {
  return _errorWithCustomMessage(auth, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
}
function createErrorInternal(authOrCode, ...rest) {
  if (typeof authOrCode !== "string") {
    const code = rest[0];
    const fullParams = [...rest.slice(1)];
    if (fullParams[0]) {
      fullParams[0].appName = authOrCode.name;
    }
    return authOrCode._errorFactory.create(code, ...fullParams);
  }
  return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
}
function _assert(assertion, authOrCode, ...rest) {
  if (!assertion) {
    throw createErrorInternal(authOrCode, ...rest);
  }
}
function debugFail(failure) {
  const message = `INTERNAL ASSERTION FAILED: ` + failure;
  _logError(message);
  throw new Error(message);
}
function debugAssert(assertion, message) {
  if (!assertion) {
    debugFail(message);
  }
}
function _getCurrentUrl() {
  var _a;
  return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href) || "";
}
function _isHttpOrHttps() {
  return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
}
function _getCurrentScheme() {
  var _a;
  return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
}
function _isOnline() {
  if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && // Apply only for traditional web apps and Chrome extensions.
  // This is especially true for Cordova apps which have unreliable
  // navigator.onLine behavior unless cordova-plugin-network-information is
  // installed which overwrites the native navigator.onLine value and
  // defines navigator.connection.
  (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
    return navigator.onLine;
  }
  return true;
}
function _getUserLanguage() {
  if (typeof navigator === "undefined") {
    return null;
  }
  const navigatorLanguage = navigator;
  return (
    // Most reliable, but only supported in Chrome/Firefox.
    navigatorLanguage.languages && navigatorLanguage.languages[0] || // Supported in most browsers, but returns the language of the browser
    // UI, not the language set in browser settings.
    navigatorLanguage.language || // Couldn't determine language.
    null
  );
}
var Delay = class {
  constructor(shortDelay, longDelay) {
    this.shortDelay = shortDelay;
    this.longDelay = longDelay;
    debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
    this.isMobile = isMobileCordova() || isReactNative();
  }
  get() {
    if (!_isOnline()) {
      return Math.min(5e3, this.shortDelay);
    }
    return this.isMobile ? this.longDelay : this.shortDelay;
  }
};
function _emulatorUrl(config, path) {
  debugAssert(config.emulator, "Emulator should always be set here");
  const {
    url
  } = config.emulator;
  if (!path) {
    return url;
  }
  return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
}
var FetchProvider = class {
  static initialize(fetchImpl, headersImpl, responseImpl) {
    this.fetchImpl = fetchImpl;
    if (headersImpl) {
      this.headersImpl = headersImpl;
    }
    if (responseImpl) {
      this.responseImpl = responseImpl;
    }
  }
  static fetch() {
    if (this.fetchImpl) {
      return this.fetchImpl;
    }
    if (typeof self !== "undefined" && "fetch" in self) {
      return self.fetch;
    }
    if (typeof globalThis !== "undefined" && globalThis.fetch) {
      return globalThis.fetch;
    }
    if (typeof fetch !== "undefined") {
      return fetch;
    }
    debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static headers() {
    if (this.headersImpl) {
      return this.headersImpl;
    }
    if (typeof self !== "undefined" && "Headers" in self) {
      return self.Headers;
    }
    if (typeof globalThis !== "undefined" && globalThis.Headers) {
      return globalThis.Headers;
    }
    if (typeof Headers !== "undefined") {
      return Headers;
    }
    debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static response() {
    if (this.responseImpl) {
      return this.responseImpl;
    }
    if (typeof self !== "undefined" && "Response" in self) {
      return self.Response;
    }
    if (typeof globalThis !== "undefined" && globalThis.Response) {
      return globalThis.Response;
    }
    if (typeof Response !== "undefined") {
      return Response;
    }
    debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
};
var SERVER_ERROR_MAP = {
  // Custom token errors.
  [
    "CREDENTIAL_MISMATCH"
    /* ServerError.CREDENTIAL_MISMATCH */
  ]: "custom-token-mismatch",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_CUSTOM_TOKEN"
    /* ServerError.MISSING_CUSTOM_TOKEN */
  ]: "internal-error",
  // Create Auth URI errors.
  [
    "INVALID_IDENTIFIER"
    /* ServerError.INVALID_IDENTIFIER */
  ]: "invalid-email",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_CONTINUE_URI"
    /* ServerError.MISSING_CONTINUE_URI */
  ]: "internal-error",
  // Sign in with email and password errors (some apply to sign up too).
  [
    "INVALID_PASSWORD"
    /* ServerError.INVALID_PASSWORD */
  ]: "wrong-password",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_PASSWORD"
    /* ServerError.MISSING_PASSWORD */
  ]: "missing-password",
  // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
  // invalid.
  [
    "INVALID_LOGIN_CREDENTIALS"
    /* ServerError.INVALID_LOGIN_CREDENTIALS */
  ]: "invalid-credential",
  // Sign up with email and password errors.
  [
    "EMAIL_EXISTS"
    /* ServerError.EMAIL_EXISTS */
  ]: "email-already-in-use",
  [
    "PASSWORD_LOGIN_DISABLED"
    /* ServerError.PASSWORD_LOGIN_DISABLED */
  ]: "operation-not-allowed",
  // Verify assertion for sign in with credential errors:
  [
    "INVALID_IDP_RESPONSE"
    /* ServerError.INVALID_IDP_RESPONSE */
  ]: "invalid-credential",
  [
    "INVALID_PENDING_TOKEN"
    /* ServerError.INVALID_PENDING_TOKEN */
  ]: "invalid-credential",
  [
    "FEDERATED_USER_ID_ALREADY_LINKED"
    /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */
  ]: "credential-already-in-use",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_REQ_TYPE"
    /* ServerError.MISSING_REQ_TYPE */
  ]: "internal-error",
  // Send Password reset email errors:
  [
    "EMAIL_NOT_FOUND"
    /* ServerError.EMAIL_NOT_FOUND */
  ]: "user-not-found",
  [
    "RESET_PASSWORD_EXCEED_LIMIT"
    /* ServerError.RESET_PASSWORD_EXCEED_LIMIT */
  ]: "too-many-requests",
  [
    "EXPIRED_OOB_CODE"
    /* ServerError.EXPIRED_OOB_CODE */
  ]: "expired-action-code",
  [
    "INVALID_OOB_CODE"
    /* ServerError.INVALID_OOB_CODE */
  ]: "invalid-action-code",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_OOB_CODE"
    /* ServerError.MISSING_OOB_CODE */
  ]: "internal-error",
  // Operations that require ID token in request:
  [
    "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
    /* ServerError.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */
  ]: "requires-recent-login",
  [
    "INVALID_ID_TOKEN"
    /* ServerError.INVALID_ID_TOKEN */
  ]: "invalid-user-token",
  [
    "TOKEN_EXPIRED"
    /* ServerError.TOKEN_EXPIRED */
  ]: "user-token-expired",
  [
    "USER_NOT_FOUND"
    /* ServerError.USER_NOT_FOUND */
  ]: "user-token-expired",
  // Other errors.
  [
    "TOO_MANY_ATTEMPTS_TRY_LATER"
    /* ServerError.TOO_MANY_ATTEMPTS_TRY_LATER */
  ]: "too-many-requests",
  [
    "PASSWORD_DOES_NOT_MEET_REQUIREMENTS"
    /* ServerError.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */
  ]: "password-does-not-meet-requirements",
  // Phone Auth related errors.
  [
    "INVALID_CODE"
    /* ServerError.INVALID_CODE */
  ]: "invalid-verification-code",
  [
    "INVALID_SESSION_INFO"
    /* ServerError.INVALID_SESSION_INFO */
  ]: "invalid-verification-id",
  [
    "INVALID_TEMPORARY_PROOF"
    /* ServerError.INVALID_TEMPORARY_PROOF */
  ]: "invalid-credential",
  [
    "MISSING_SESSION_INFO"
    /* ServerError.MISSING_SESSION_INFO */
  ]: "missing-verification-id",
  [
    "SESSION_EXPIRED"
    /* ServerError.SESSION_EXPIRED */
  ]: "code-expired",
  // Other action code errors when additional settings passed.
  // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
  // This is OK as this error will be caught by client side validation.
  [
    "MISSING_ANDROID_PACKAGE_NAME"
    /* ServerError.MISSING_ANDROID_PACKAGE_NAME */
  ]: "missing-android-pkg-name",
  [
    "UNAUTHORIZED_DOMAIN"
    /* ServerError.UNAUTHORIZED_DOMAIN */
  ]: "unauthorized-continue-uri",
  // getProjectConfig errors when clientId is passed.
  [
    "INVALID_OAUTH_CLIENT_ID"
    /* ServerError.INVALID_OAUTH_CLIENT_ID */
  ]: "invalid-oauth-client-id",
  // User actions (sign-up or deletion) disabled errors.
  [
    "ADMIN_ONLY_OPERATION"
    /* ServerError.ADMIN_ONLY_OPERATION */
  ]: "admin-restricted-operation",
  // Multi factor related errors.
  [
    "INVALID_MFA_PENDING_CREDENTIAL"
    /* ServerError.INVALID_MFA_PENDING_CREDENTIAL */
  ]: "invalid-multi-factor-session",
  [
    "MFA_ENROLLMENT_NOT_FOUND"
    /* ServerError.MFA_ENROLLMENT_NOT_FOUND */
  ]: "multi-factor-info-not-found",
  [
    "MISSING_MFA_ENROLLMENT_ID"
    /* ServerError.MISSING_MFA_ENROLLMENT_ID */
  ]: "missing-multi-factor-info",
  [
    "MISSING_MFA_PENDING_CREDENTIAL"
    /* ServerError.MISSING_MFA_PENDING_CREDENTIAL */
  ]: "missing-multi-factor-session",
  [
    "SECOND_FACTOR_EXISTS"
    /* ServerError.SECOND_FACTOR_EXISTS */
  ]: "second-factor-already-in-use",
  [
    "SECOND_FACTOR_LIMIT_EXCEEDED"
    /* ServerError.SECOND_FACTOR_LIMIT_EXCEEDED */
  ]: "maximum-second-factor-count-exceeded",
  // Blocking functions related errors.
  [
    "BLOCKING_FUNCTION_ERROR_RESPONSE"
    /* ServerError.BLOCKING_FUNCTION_ERROR_RESPONSE */
  ]: "internal-error",
  // Recaptcha related errors.
  [
    "RECAPTCHA_NOT_ENABLED"
    /* ServerError.RECAPTCHA_NOT_ENABLED */
  ]: "recaptcha-not-enabled",
  [
    "MISSING_RECAPTCHA_TOKEN"
    /* ServerError.MISSING_RECAPTCHA_TOKEN */
  ]: "missing-recaptcha-token",
  [
    "INVALID_RECAPTCHA_TOKEN"
    /* ServerError.INVALID_RECAPTCHA_TOKEN */
  ]: "invalid-recaptcha-token",
  [
    "INVALID_RECAPTCHA_ACTION"
    /* ServerError.INVALID_RECAPTCHA_ACTION */
  ]: "invalid-recaptcha-action",
  [
    "MISSING_CLIENT_TYPE"
    /* ServerError.MISSING_CLIENT_TYPE */
  ]: "missing-client-type",
  [
    "MISSING_RECAPTCHA_VERSION"
    /* ServerError.MISSING_RECAPTCHA_VERSION */
  ]: "missing-recaptcha-version",
  [
    "INVALID_RECAPTCHA_VERSION"
    /* ServerError.INVALID_RECAPTCHA_VERSION */
  ]: "invalid-recaptcha-version",
  [
    "INVALID_REQ_TYPE"
    /* ServerError.INVALID_REQ_TYPE */
  ]: "invalid-req-type"
  /* AuthErrorCode.INVALID_REQ_TYPE */
};
var DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
function _addTidIfNecessary(auth, request) {
  if (auth.tenantId && !request.tenantId) {
    return Object.assign(Object.assign({}, request), {
      tenantId: auth.tenantId
    });
  }
  return request;
}
function _performApiRequest(_0, _1, _2, _3) {
  return __async(this, arguments, function* (auth, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth, customErrorMap, () => __async(this, null, function* () {
      let body = {};
      let params = {};
      if (request) {
        if (method === "GET") {
          params = request;
        } else {
          body = {
            body: JSON.stringify(request)
          };
        }
      }
      const query = querystring(Object.assign({
        key: auth.config.apiKey
      }, params)).slice(1);
      const headers = yield auth._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/json";
      if (auth.languageCode) {
        headers[
          "X-Firebase-Locale"
          /* HttpHeader.X_FIREBASE_LOCALE */
        ] = auth.languageCode;
      }
      const fetchArgs = Object.assign({
        method,
        headers
      }, body);
      if (!isCloudflareWorker()) {
        fetchArgs.referrerPolicy = "no-referrer";
      }
      return FetchProvider.fetch()(_getFinalTarget(auth, auth.config.apiHost, path, query), fetchArgs);
    }));
  });
}
function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
  return __async(this, null, function* () {
    auth._canInitEmulator = false;
    const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
    try {
      const networkTimeout = new NetworkTimeout(auth);
      const response = yield Promise.race([fetchFn(), networkTimeout.promise]);
      networkTimeout.clearNetworkTimeout();
      const json = yield response.json();
      if ("needConfirmation" in json) {
        throw _makeTaggedError(auth, "account-exists-with-different-credential", json);
      }
      if (response.ok && !("errorMessage" in json)) {
        return json;
      } else {
        const errorMessage = response.ok ? json.errorMessage : json.error.message;
        const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
        if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
          throw _makeTaggedError(auth, "credential-already-in-use", json);
        } else if (serverErrorCode === "EMAIL_EXISTS") {
          throw _makeTaggedError(auth, "email-already-in-use", json);
        } else if (serverErrorCode === "USER_DISABLED") {
          throw _makeTaggedError(auth, "user-disabled", json);
        }
        const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
        if (serverErrorMessage) {
          throw _errorWithCustomMessage(auth, authError, serverErrorMessage);
        } else {
          _fail(auth, authError);
        }
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        throw e;
      }
      _fail(auth, "network-request-failed", {
        "message": String(e)
      });
    }
  });
}
function _performSignInRequest(_0, _1, _2, _3) {
  return __async(this, arguments, function* (auth, method, path, request, customErrorMap = {}) {
    const serverResponse = yield _performApiRequest(auth, method, path, request, customErrorMap);
    if ("mfaPendingCredential" in serverResponse) {
      _fail(auth, "multi-factor-auth-required", {
        _serverResponse: serverResponse
      });
    }
    return serverResponse;
  });
}
function _getFinalTarget(auth, host, path, query) {
  const base = `${host}${path}?${query}`;
  if (!auth.config.emulator) {
    return `${auth.config.apiScheme}://${base}`;
  }
  return _emulatorUrl(auth.config, base);
}
function _parseEnforcementState(enforcementStateStr) {
  switch (enforcementStateStr) {
    case "ENFORCE":
      return "ENFORCE";
    case "AUDIT":
      return "AUDIT";
    case "OFF":
      return "OFF";
    default:
      return "ENFORCEMENT_STATE_UNSPECIFIED";
  }
}
var NetworkTimeout = class {
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
  constructor(auth) {
    this.auth = auth;
    this.timer = null;
    this.promise = new Promise((_, reject) => {
      this.timer = setTimeout(() => {
        return reject(_createError(
          this.auth,
          "network-request-failed"
          /* AuthErrorCode.NETWORK_REQUEST_FAILED */
        ));
      }, DEFAULT_API_TIMEOUT_MS.get());
    });
  }
};
function _makeTaggedError(auth, code, response) {
  const errorParams = {
    appName: auth.name
  };
  if (response.email) {
    errorParams.email = response.email;
  }
  if (response.phoneNumber) {
    errorParams.phoneNumber = response.phoneNumber;
  }
  const error = _createError(auth, code, errorParams);
  error.customData._tokenResponse = response;
  return error;
}
function isEnterprise(grecaptcha) {
  return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
}
var RecaptchaConfig = class {
  constructor(response) {
    this.siteKey = "";
    this.recaptchaEnforcementState = [];
    if (response.recaptchaKey === void 0) {
      throw new Error("recaptchaKey undefined");
    }
    this.siteKey = response.recaptchaKey.split("/")[3];
    this.recaptchaEnforcementState = response.recaptchaEnforcementState;
  }
  /**
   * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
   *
   * @param providerStr - The provider whose enforcement state is to be returned.
   * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
   */
  getProviderEnforcementState(providerStr) {
    if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
      return null;
    }
    for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
      if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
        return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
      }
    }
    return null;
  }
  /**
   * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
   *
   * @param providerStr - The provider whose enablement state is to be returned.
   * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
   */
  isProviderEnabled(providerStr) {
    return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
  }
  /**
   * Returns true if reCAPTCHA Enterprise protection is enabled in at least one provider, otherwise
   * returns false.
   *
   * @returns Whether or not reCAPTCHA Enterprise protection is enabled for at least one provider.
   */
  isAnyProviderEnabled() {
    return this.isProviderEnabled(
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
    ) || this.isProviderEnabled(
      "PHONE_PROVIDER"
      /* RecaptchaAuthProvider.PHONE_PROVIDER */
    );
  }
};
function getRecaptchaConfig(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth, request));
  });
}
function deleteAccount(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:delete", request);
  });
}
function deleteLinkedAccounts(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  });
}
function getAccountInfo(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:lookup", request);
  });
}
function utcTimestampToDateString(utcTimestamp) {
  if (!utcTimestamp) {
    return void 0;
  }
  try {
    const date = new Date(Number(utcTimestamp));
    if (!isNaN(date.getTime())) {
      return date.toUTCString();
    }
  } catch (e) {
  }
  return void 0;
}
function getIdTokenResult(user, forceRefresh = false) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user);
    const token = yield userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(
      claims && claims.exp && claims.auth_time && claims.iat,
      userInternal.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const firebase2 = typeof claims.firebase === "object" ? claims.firebase : void 0;
    const signInProvider = firebase2 === null || firebase2 === void 0 ? void 0 : firebase2["sign_in_provider"];
    return {
      claims,
      token,
      authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
      issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
      expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
      signInProvider: signInProvider || null,
      signInSecondFactor: (firebase2 === null || firebase2 === void 0 ? void 0 : firebase2["sign_in_second_factor"]) || null
    };
  });
}
function secondsStringToMilliseconds(seconds) {
  return Number(seconds) * 1e3;
}
function _parseToken(token) {
  const [algorithm, payload, signature] = token.split(".");
  if (algorithm === void 0 || payload === void 0 || signature === void 0) {
    _logError("JWT malformed, contained fewer than 3 sections");
    return null;
  }
  try {
    const decoded = base64Decode(payload);
    if (!decoded) {
      _logError("Failed to decode base64 JWT payload");
      return null;
    }
    return JSON.parse(decoded);
  } catch (e) {
    _logError("Caught error parsing JWT payload as JSON", e === null || e === void 0 ? void 0 : e.toString());
    return null;
  }
}
function _tokenExpiresIn(token) {
  const parsedToken = _parseToken(token);
  _assert(
    parsedToken,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  _assert(
    typeof parsedToken.exp !== "undefined",
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  _assert(
    typeof parsedToken.iat !== "undefined",
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return Number(parsedToken.exp) - Number(parsedToken.iat);
}
function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
  return __async(this, null, function* () {
    if (bypassAuthState) {
      return promise;
    }
    try {
      return yield promise;
    } catch (e) {
      if (e instanceof FirebaseError && isUserInvalidated(e)) {
        if (user.auth.currentUser === user) {
          yield user.auth.signOut();
        }
      }
      throw e;
    }
  });
}
function isUserInvalidated({
  code
}) {
  return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
}
var ProactiveRefresh = class {
  constructor(user) {
    this.user = user;
    this.isRunning = false;
    this.timerId = null;
    this.errorBackoff = 3e4;
  }
  _start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.schedule();
  }
  _stop() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }
  }
  getInterval(wasError) {
    var _a;
    if (wasError) {
      const interval = this.errorBackoff;
      this.errorBackoff = Math.min(
        this.errorBackoff * 2,
        96e4
        /* Duration.RETRY_BACKOFF_MAX */
      );
      return interval;
    } else {
      this.errorBackoff = 3e4;
      const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== void 0 ? _a : 0;
      const interval = expTime - Date.now() - 3e5;
      return Math.max(0, interval);
    }
  }
  schedule(wasError = false) {
    if (!this.isRunning) {
      return;
    }
    const interval = this.getInterval(wasError);
    this.timerId = setTimeout(() => __async(this, null, function* () {
      yield this.iteration();
    }), interval);
  }
  iteration() {
    return __async(this, null, function* () {
      try {
        yield this.user.getIdToken(true);
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"network-request-failed"}`) {
          this.schedule(
            /* wasError */
            true
          );
        }
        return;
      }
      this.schedule();
    });
  }
};
var UserMetadata = class {
  constructor(createdAt, lastLoginAt) {
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
    this._initializeTime();
  }
  _initializeTime() {
    this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
    this.creationTime = utcTimestampToDateString(this.createdAt);
  }
  _copy(metadata) {
    this.createdAt = metadata.createdAt;
    this.lastLoginAt = metadata.lastLoginAt;
    this._initializeTime();
  }
  toJSON() {
    return {
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt
    };
  }
};
function _reloadWithoutSaving(user) {
  return __async(this, null, function* () {
    var _a;
    const auth = user.auth;
    const idToken = yield user.getIdToken();
    const response = yield _logoutIfInvalidated(user, getAccountInfo(auth, {
      idToken
    }));
    _assert(
      response === null || response === void 0 ? void 0 : response.users.length,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const coreAccount = response.users[0];
    user._notifyReloadListener(coreAccount);
    const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === void 0 ? void 0 : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
    const providerData = mergeProviderData(user.providerData, newProviderData);
    const oldIsAnonymous = user.isAnonymous;
    const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
      uid: coreAccount.localId,
      displayName: coreAccount.displayName || null,
      photoURL: coreAccount.photoUrl || null,
      email: coreAccount.email || null,
      emailVerified: coreAccount.emailVerified || false,
      phoneNumber: coreAccount.phoneNumber || null,
      tenantId: coreAccount.tenantId || null,
      providerData,
      metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
      isAnonymous
    };
    Object.assign(user, updates);
  });
}
function reload(user) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user);
    yield _reloadWithoutSaving(userInternal);
    yield userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
  });
}
function mergeProviderData(original, newData) {
  const deduped = original.filter((o) => !newData.some((n) => n.providerId === o.providerId));
  return [...deduped, ...newData];
}
function extractProviderData(providers) {
  return providers.map((_a) => {
    var {
      providerId
    } = _a, provider = __rest(_a, ["providerId"]);
    return {
      providerId,
      uid: provider.rawId || "",
      displayName: provider.displayName || null,
      email: provider.email || null,
      phoneNumber: provider.phoneNumber || null,
      photoURL: provider.photoUrl || null
    };
  });
}
function requestStsToken(auth, refreshToken) {
  return __async(this, null, function* () {
    const response = yield _performFetchWithErrorHandling(auth, {}, () => __async(this, null, function* () {
      const body = querystring({
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }).slice(1);
      const {
        tokenApiHost,
        apiKey
      } = auth.config;
      const url = _getFinalTarget(auth, tokenApiHost, "/v1/token", `key=${apiKey}`);
      const headers = yield auth._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/x-www-form-urlencoded";
      return FetchProvider.fetch()(url, {
        method: "POST",
        headers,
        body
      });
    }));
    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token
    };
  });
}
function revokeToken(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth, request));
  });
}
var StsTokenManager = class _StsTokenManager {
  constructor() {
    this.refreshToken = null;
    this.accessToken = null;
    this.expirationTime = null;
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
  }
  updateFromServerResponse(response) {
    _assert(
      response.idToken,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof response.idToken !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof response.refreshToken !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
    this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
  }
  updateFromIdToken(idToken) {
    _assert(
      idToken.length !== 0,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const expiresIn = _tokenExpiresIn(idToken);
    this.updateTokensAndExpiration(idToken, null, expiresIn);
  }
  getToken(auth, forceRefresh = false) {
    return __async(this, null, function* () {
      if (!forceRefresh && this.accessToken && !this.isExpired) {
        return this.accessToken;
      }
      _assert(
        this.refreshToken,
        auth,
        "user-token-expired"
        /* AuthErrorCode.TOKEN_EXPIRED */
      );
      if (this.refreshToken) {
        yield this.refresh(auth, this.refreshToken);
        return this.accessToken;
      }
      return null;
    });
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  refresh(auth, oldToken) {
    return __async(this, null, function* () {
      const {
        accessToken,
        refreshToken,
        expiresIn
      } = yield requestStsToken(auth, oldToken);
      this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
    });
  }
  updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
    this.refreshToken = refreshToken || null;
    this.accessToken = accessToken || null;
    this.expirationTime = Date.now() + expiresInSec * 1e3;
  }
  static fromJSON(appName, object) {
    const {
      refreshToken,
      accessToken,
      expirationTime
    } = object;
    const manager = new _StsTokenManager();
    if (refreshToken) {
      _assert(typeof refreshToken === "string", "internal-error", {
        appName
      });
      manager.refreshToken = refreshToken;
    }
    if (accessToken) {
      _assert(typeof accessToken === "string", "internal-error", {
        appName
      });
      manager.accessToken = accessToken;
    }
    if (expirationTime) {
      _assert(typeof expirationTime === "number", "internal-error", {
        appName
      });
      manager.expirationTime = expirationTime;
    }
    return manager;
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime
    };
  }
  _assign(stsTokenManager) {
    this.accessToken = stsTokenManager.accessToken;
    this.refreshToken = stsTokenManager.refreshToken;
    this.expirationTime = stsTokenManager.expirationTime;
  }
  _clone() {
    return Object.assign(new _StsTokenManager(), this.toJSON());
  }
  _performRefresh() {
    return debugFail("not implemented");
  }
};
function assertStringOrUndefined(assertion, appName) {
  _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", {
    appName
  });
}
var UserImpl = class _UserImpl {
  constructor(_a) {
    var {
      uid,
      auth,
      stsTokenManager
    } = _a, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
    this.providerId = "firebase";
    this.proactiveRefresh = new ProactiveRefresh(this);
    this.reloadUserInfo = null;
    this.reloadListener = null;
    this.uid = uid;
    this.auth = auth;
    this.stsTokenManager = stsTokenManager;
    this.accessToken = stsTokenManager.accessToken;
    this.displayName = opt.displayName || null;
    this.email = opt.email || null;
    this.emailVerified = opt.emailVerified || false;
    this.phoneNumber = opt.phoneNumber || null;
    this.photoURL = opt.photoURL || null;
    this.isAnonymous = opt.isAnonymous || false;
    this.tenantId = opt.tenantId || null;
    this.providerData = opt.providerData ? [...opt.providerData] : [];
    this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
  }
  getIdToken(forceRefresh) {
    return __async(this, null, function* () {
      const accessToken = yield _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
      _assert(
        accessToken,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      if (this.accessToken !== accessToken) {
        this.accessToken = accessToken;
        yield this.auth._persistUserIfCurrent(this);
        this.auth._notifyListenersIfCurrent(this);
      }
      return accessToken;
    });
  }
  getIdTokenResult(forceRefresh) {
    return getIdTokenResult(this, forceRefresh);
  }
  reload() {
    return reload(this);
  }
  _assign(user) {
    if (this === user) {
      return;
    }
    _assert(
      this.uid === user.uid,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    this.displayName = user.displayName;
    this.photoURL = user.photoURL;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.phoneNumber = user.phoneNumber;
    this.isAnonymous = user.isAnonymous;
    this.tenantId = user.tenantId;
    this.providerData = user.providerData.map((userInfo) => Object.assign({}, userInfo));
    this.metadata._copy(user.metadata);
    this.stsTokenManager._assign(user.stsTokenManager);
  }
  _clone(auth) {
    const newUser = new _UserImpl(Object.assign(Object.assign({}, this), {
      auth,
      stsTokenManager: this.stsTokenManager._clone()
    }));
    newUser.metadata._copy(this.metadata);
    return newUser;
  }
  _onReload(callback) {
    _assert(
      !this.reloadListener,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    this.reloadListener = callback;
    if (this.reloadUserInfo) {
      this._notifyReloadListener(this.reloadUserInfo);
      this.reloadUserInfo = null;
    }
  }
  _notifyReloadListener(userInfo) {
    if (this.reloadListener) {
      this.reloadListener(userInfo);
    } else {
      this.reloadUserInfo = userInfo;
    }
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start();
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop();
  }
  _updateTokensIfNecessary(response, reload2 = false) {
    return __async(this, null, function* () {
      let tokensRefreshed = false;
      if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
        this.stsTokenManager.updateFromServerResponse(response);
        tokensRefreshed = true;
      }
      if (reload2) {
        yield _reloadWithoutSaving(this);
      }
      yield this.auth._persistUserIfCurrent(this);
      if (tokensRefreshed) {
        this.auth._notifyListenersIfCurrent(this);
      }
    });
  }
  delete() {
    return __async(this, null, function* () {
      if (_isFirebaseServerApp(this.auth.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));
      }
      const idToken = yield this.getIdToken();
      yield _logoutIfInvalidated(this, deleteAccount(this.auth, {
        idToken
      }));
      this.stsTokenManager.clearRefreshToken();
      return this.auth.signOut();
    });
  }
  toJSON() {
    return Object.assign(Object.assign({
      uid: this.uid,
      email: this.email || void 0,
      emailVerified: this.emailVerified,
      displayName: this.displayName || void 0,
      isAnonymous: this.isAnonymous,
      photoURL: this.photoURL || void 0,
      phoneNumber: this.phoneNumber || void 0,
      tenantId: this.tenantId || void 0,
      providerData: this.providerData.map((userInfo) => Object.assign({}, userInfo)),
      stsTokenManager: this.stsTokenManager.toJSON(),
      // Redirect event ID must be maintained in case there is a pending
      // redirect event.
      _redirectEventId: this._redirectEventId
    }, this.metadata.toJSON()), {
      // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
      apiKey: this.auth.config.apiKey,
      appName: this.auth.name
    });
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || "";
  }
  static _fromJSON(auth, object) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const displayName = (_a = object.displayName) !== null && _a !== void 0 ? _a : void 0;
    const email = (_b = object.email) !== null && _b !== void 0 ? _b : void 0;
    const phoneNumber = (_c = object.phoneNumber) !== null && _c !== void 0 ? _c : void 0;
    const photoURL = (_d = object.photoURL) !== null && _d !== void 0 ? _d : void 0;
    const tenantId = (_e = object.tenantId) !== null && _e !== void 0 ? _e : void 0;
    const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== void 0 ? _f : void 0;
    const createdAt = (_g = object.createdAt) !== null && _g !== void 0 ? _g : void 0;
    const lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== void 0 ? _h : void 0;
    const {
      uid,
      emailVerified,
      isAnonymous,
      providerData,
      stsTokenManager: plainObjectTokenManager
    } = object;
    _assert(
      uid && plainObjectTokenManager,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
    _assert(
      typeof uid === "string",
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    assertStringOrUndefined(displayName, auth.name);
    assertStringOrUndefined(email, auth.name);
    _assert(
      typeof emailVerified === "boolean",
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof isAnonymous === "boolean",
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    assertStringOrUndefined(phoneNumber, auth.name);
    assertStringOrUndefined(photoURL, auth.name);
    assertStringOrUndefined(tenantId, auth.name);
    assertStringOrUndefined(_redirectEventId, auth.name);
    assertStringOrUndefined(createdAt, auth.name);
    assertStringOrUndefined(lastLoginAt, auth.name);
    const user = new _UserImpl({
      uid,
      auth,
      email,
      emailVerified,
      displayName,
      isAnonymous,
      photoURL,
      phoneNumber,
      tenantId,
      stsTokenManager,
      createdAt,
      lastLoginAt
    });
    if (providerData && Array.isArray(providerData)) {
      user.providerData = providerData.map((userInfo) => Object.assign({}, userInfo));
    }
    if (_redirectEventId) {
      user._redirectEventId = _redirectEventId;
    }
    return user;
  }
  /**
   * Initialize a User from an idToken server response
   * @param auth
   * @param idTokenResponse
   */
  static _fromIdTokenResponse(auth, idTokenResponse, isAnonymous = false) {
    return __async(this, null, function* () {
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromServerResponse(idTokenResponse);
      const user = new _UserImpl({
        uid: idTokenResponse.localId,
        auth,
        stsTokenManager,
        isAnonymous
      });
      yield _reloadWithoutSaving(user);
      return user;
    });
  }
  /**
   * Initialize a User from an idToken server response
   * @param auth
   * @param idTokenResponse
   */
  static _fromGetAccountInfoResponse(auth, response, idToken) {
    return __async(this, null, function* () {
      const coreAccount = response.users[0];
      _assert(
        coreAccount.localId !== void 0,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const providerData = coreAccount.providerUserInfo !== void 0 ? extractProviderData(coreAccount.providerUserInfo) : [];
      const isAnonymous = !(coreAccount.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromIdToken(idToken);
      const user = new _UserImpl({
        uid: coreAccount.localId,
        auth,
        stsTokenManager,
        isAnonymous
      });
      const updates = {
        uid: coreAccount.localId,
        displayName: coreAccount.displayName || null,
        photoURL: coreAccount.photoUrl || null,
        email: coreAccount.email || null,
        emailVerified: coreAccount.emailVerified || false,
        phoneNumber: coreAccount.phoneNumber || null,
        tenantId: coreAccount.tenantId || null,
        providerData,
        metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
        isAnonymous: !(coreAccount.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length)
      };
      Object.assign(user, updates);
      return user;
    });
  }
};
var instanceCache = /* @__PURE__ */ new Map();
function _getInstance(cls) {
  debugAssert(cls instanceof Function, "Expected a class definition");
  let instance = instanceCache.get(cls);
  if (instance) {
    debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
    return instance;
  }
  instance = new cls();
  instanceCache.set(cls, instance);
  return instance;
}
var InMemoryPersistence = class {
  constructor() {
    this.type = "NONE";
    this.storage = {};
  }
  _isAvailable() {
    return __async(this, null, function* () {
      return true;
    });
  }
  _set(key, value) {
    return __async(this, null, function* () {
      this.storage[key] = value;
    });
  }
  _get(key) {
    return __async(this, null, function* () {
      const value = this.storage[key];
      return value === void 0 ? null : value;
    });
  }
  _remove(key) {
    return __async(this, null, function* () {
      delete this.storage[key];
    });
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
};
InMemoryPersistence.type = "NONE";
var inMemoryPersistence = InMemoryPersistence;
function _persistenceKeyName(key, apiKey, appName) {
  return `${"firebase"}:${key}:${apiKey}:${appName}`;
}
var PersistenceUserManager = class _PersistenceUserManager {
  constructor(persistence, auth, userKey) {
    this.persistence = persistence;
    this.auth = auth;
    this.userKey = userKey;
    const {
      config,
      name: name4
    } = this.auth;
    this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name4);
    this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name4);
    this.boundEventHandler = auth._onStorageEvent.bind(auth);
    this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
  }
  setCurrentUser(user) {
    return this.persistence._set(this.fullUserKey, user.toJSON());
  }
  getCurrentUser() {
    return __async(this, null, function* () {
      const blob = yield this.persistence._get(this.fullUserKey);
      return blob ? UserImpl._fromJSON(this.auth, blob) : null;
    });
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey);
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
  }
  setPersistence(newPersistence) {
    return __async(this, null, function* () {
      if (this.persistence === newPersistence) {
        return;
      }
      const currentUser = yield this.getCurrentUser();
      yield this.removeCurrentUser();
      this.persistence = newPersistence;
      if (currentUser) {
        return this.setCurrentUser(currentUser);
      }
    });
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static create(auth, persistenceHierarchy, userKey = "authUser") {
    return __async(this, null, function* () {
      if (!persistenceHierarchy.length) {
        return new _PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey);
      }
      const availablePersistences = (yield Promise.all(persistenceHierarchy.map((persistence) => __async(this, null, function* () {
        if (yield persistence._isAvailable()) {
          return persistence;
        }
        return void 0;
      })))).filter((persistence) => persistence);
      let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
      const key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
      let userToMigrate = null;
      for (const persistence of persistenceHierarchy) {
        try {
          const blob = yield persistence._get(key);
          if (blob) {
            const user = UserImpl._fromJSON(auth, blob);
            if (persistence !== selectedPersistence) {
              userToMigrate = user;
            }
            selectedPersistence = persistence;
            break;
          }
        } catch (_a) {
        }
      }
      const migrationHierarchy = availablePersistences.filter((p) => p._shouldAllowMigration);
      if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
        return new _PersistenceUserManager(selectedPersistence, auth, userKey);
      }
      selectedPersistence = migrationHierarchy[0];
      if (userToMigrate) {
        yield selectedPersistence._set(key, userToMigrate.toJSON());
      }
      yield Promise.all(persistenceHierarchy.map((persistence) => __async(this, null, function* () {
        if (persistence !== selectedPersistence) {
          try {
            yield persistence._remove(key);
          } catch (_a) {
          }
        }
      })));
      return new _PersistenceUserManager(selectedPersistence, auth, userKey);
    });
  }
};
function _getBrowserName(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) {
    return "Opera";
  } else if (_isIEMobile(ua)) {
    return "IEMobile";
  } else if (ua.includes("msie") || ua.includes("trident/")) {
    return "IE";
  } else if (ua.includes("edge/")) {
    return "Edge";
  } else if (_isFirefox(ua)) {
    return "Firefox";
  } else if (ua.includes("silk/")) {
    return "Silk";
  } else if (_isBlackBerry(ua)) {
    return "Blackberry";
  } else if (_isWebOS(ua)) {
    return "Webos";
  } else if (_isSafari(ua)) {
    return "Safari";
  } else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) {
    return "Chrome";
  } else if (_isAndroid(ua)) {
    return "Android";
  } else {
    const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
    const matches = userAgent.match(re);
    if ((matches === null || matches === void 0 ? void 0 : matches.length) === 2) {
      return matches[1];
    }
  }
  return "Other";
}
function _isFirefox(ua = getUA()) {
  return /firefox\//i.test(ua);
}
function _isSafari(userAgent = getUA()) {
  const ua = userAgent.toLowerCase();
  return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
}
function _isChromeIOS(ua = getUA()) {
  return /crios\//i.test(ua);
}
function _isIEMobile(ua = getUA()) {
  return /iemobile/i.test(ua);
}
function _isAndroid(ua = getUA()) {
  return /android/i.test(ua);
}
function _isBlackBerry(ua = getUA()) {
  return /blackberry/i.test(ua);
}
function _isWebOS(ua = getUA()) {
  return /webos/i.test(ua);
}
function _isIOS(ua = getUA()) {
  return /iphone|ipad|ipod/i.test(ua) || /macintosh/i.test(ua) && /mobile/i.test(ua);
}
function _isIOS7Or8(ua = getUA()) {
  return /(iPad|iPhone|iPod).*OS 7_\d/i.test(ua) || /(iPad|iPhone|iPod).*OS 8_\d/i.test(ua);
}
function _isIE10() {
  return isIE() && document.documentMode === 10;
}
function _isMobileBrowser(ua = getUA()) {
  return _isIOS(ua) || _isAndroid(ua) || _isWebOS(ua) || _isBlackBerry(ua) || /windows phone/i.test(ua) || _isIEMobile(ua);
}
function _getClientVersion(clientPlatform, frameworks = []) {
  let reportedPlatform;
  switch (clientPlatform) {
    case "Browser":
      reportedPlatform = _getBrowserName(getUA());
      break;
    case "Worker":
      reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
      break;
    default:
      reportedPlatform = clientPlatform;
  }
  const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
  return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
}
var AuthMiddlewareQueue = class {
  constructor(auth) {
    this.auth = auth;
    this.queue = [];
  }
  pushCallback(callback, onAbort) {
    const wrappedCallback = (user) => new Promise((resolve, reject) => {
      try {
        const result = callback(user);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
    wrappedCallback.onAbort = onAbort;
    this.queue.push(wrappedCallback);
    const index = this.queue.length - 1;
    return () => {
      this.queue[index] = () => Promise.resolve();
    };
  }
  runMiddleware(nextUser) {
    return __async(this, null, function* () {
      if (this.auth.currentUser === nextUser) {
        return;
      }
      const onAbortStack = [];
      try {
        for (const beforeStateCallback of this.queue) {
          yield beforeStateCallback(nextUser);
          if (beforeStateCallback.onAbort) {
            onAbortStack.push(beforeStateCallback.onAbort);
          }
        }
      } catch (e) {
        onAbortStack.reverse();
        for (const onAbort of onAbortStack) {
          try {
            onAbort();
          } catch (_) {
          }
        }
        throw this.auth._errorFactory.create("login-blocked", {
          originalMessage: e === null || e === void 0 ? void 0 : e.message
        });
      }
    });
  }
};
function _getPasswordPolicy(_0) {
  return __async(this, arguments, function* (auth, request = {}) {
    return _performApiRequest(auth, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth, request));
  });
}
var MINIMUM_MIN_PASSWORD_LENGTH = 6;
var PasswordPolicyImpl = class {
  constructor(response) {
    var _a, _b, _c, _d;
    const responseOptions = response.customStrengthOptions;
    this.customStrengthOptions = {};
    this.customStrengthOptions.minPasswordLength = (_a = responseOptions.minPasswordLength) !== null && _a !== void 0 ? _a : MINIMUM_MIN_PASSWORD_LENGTH;
    if (responseOptions.maxPasswordLength) {
      this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
    }
    if (responseOptions.containsLowercaseCharacter !== void 0) {
      this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
    }
    if (responseOptions.containsUppercaseCharacter !== void 0) {
      this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
    }
    if (responseOptions.containsNumericCharacter !== void 0) {
      this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
    }
    if (responseOptions.containsNonAlphanumericCharacter !== void 0) {
      this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
    }
    this.enforcementState = response.enforcementState;
    if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
      this.enforcementState = "OFF";
    }
    this.allowedNonAlphanumericCharacters = (_c = (_b = response.allowedNonAlphanumericCharacters) === null || _b === void 0 ? void 0 : _b.join("")) !== null && _c !== void 0 ? _c : "";
    this.forceUpgradeOnSignin = (_d = response.forceUpgradeOnSignin) !== null && _d !== void 0 ? _d : false;
    this.schemaVersion = response.schemaVersion;
  }
  validatePassword(password) {
    var _a, _b, _c, _d, _e, _f;
    const status = {
      isValid: true,
      passwordPolicy: this
    };
    this.validatePasswordLengthOptions(password, status);
    this.validatePasswordCharacterOptions(password, status);
    status.isValid && (status.isValid = (_a = status.meetsMinPasswordLength) !== null && _a !== void 0 ? _a : true);
    status.isValid && (status.isValid = (_b = status.meetsMaxPasswordLength) !== null && _b !== void 0 ? _b : true);
    status.isValid && (status.isValid = (_c = status.containsLowercaseLetter) !== null && _c !== void 0 ? _c : true);
    status.isValid && (status.isValid = (_d = status.containsUppercaseLetter) !== null && _d !== void 0 ? _d : true);
    status.isValid && (status.isValid = (_e = status.containsNumericCharacter) !== null && _e !== void 0 ? _e : true);
    status.isValid && (status.isValid = (_f = status.containsNonAlphanumericCharacter) !== null && _f !== void 0 ? _f : true);
    return status;
  }
  /**
   * Validates that the password meets the length options for the policy.
   *
   * @param password Password to validate.
   * @param status Validation status.
   */
  validatePasswordLengthOptions(password, status) {
    const minPasswordLength = this.customStrengthOptions.minPasswordLength;
    const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
    if (minPasswordLength) {
      status.meetsMinPasswordLength = password.length >= minPasswordLength;
    }
    if (maxPasswordLength) {
      status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
    }
  }
  /**
   * Validates that the password meets the character options for the policy.
   *
   * @param password Password to validate.
   * @param status Validation status.
   */
  validatePasswordCharacterOptions(password, status) {
    this.updatePasswordCharacterOptionsStatuses(
      status,
      /* containsLowercaseCharacter= */
      false,
      /* containsUppercaseCharacter= */
      false,
      /* containsNumericCharacter= */
      false,
      /* containsNonAlphanumericCharacter= */
      false
    );
    let passwordChar;
    for (let i = 0; i < password.length; i++) {
      passwordChar = password.charAt(i);
      this.updatePasswordCharacterOptionsStatuses(
        status,
        /* containsLowercaseCharacter= */
        passwordChar >= "a" && passwordChar <= "z",
        /* containsUppercaseCharacter= */
        passwordChar >= "A" && passwordChar <= "Z",
        /* containsNumericCharacter= */
        passwordChar >= "0" && passwordChar <= "9",
        /* containsNonAlphanumericCharacter= */
        this.allowedNonAlphanumericCharacters.includes(passwordChar)
      );
    }
  }
  /**
   * Updates the running validation status with the statuses for the character options.
   * Expected to be called each time a character is processed to update each option status
   * based on the current character.
   *
   * @param status Validation status.
   * @param containsLowercaseCharacter Whether the character is a lowercase letter.
   * @param containsUppercaseCharacter Whether the character is an uppercase letter.
   * @param containsNumericCharacter Whether the character is a numeric character.
   * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
   */
  updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
    if (this.customStrengthOptions.containsLowercaseLetter) {
      status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
    }
    if (this.customStrengthOptions.containsUppercaseLetter) {
      status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
    }
    if (this.customStrengthOptions.containsNumericCharacter) {
      status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
    }
    if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
      status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
    }
  }
};
var AuthImpl = class {
  constructor(app, heartbeatServiceProvider, appCheckServiceProvider, config) {
    this.app = app;
    this.heartbeatServiceProvider = heartbeatServiceProvider;
    this.appCheckServiceProvider = appCheckServiceProvider;
    this.config = config;
    this.currentUser = null;
    this.emulatorConfig = null;
    this.operations = Promise.resolve();
    this.authStateSubscription = new Subscription(this);
    this.idTokenSubscription = new Subscription(this);
    this.beforeStateQueue = new AuthMiddlewareQueue(this);
    this.redirectUser = null;
    this.isProactiveRefreshEnabled = false;
    this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
    this._canInitEmulator = true;
    this._isInitialized = false;
    this._deleted = false;
    this._initializationPromise = null;
    this._popupRedirectResolver = null;
    this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
    this._agentRecaptchaConfig = null;
    this._tenantRecaptchaConfigs = {};
    this._projectPasswordPolicy = null;
    this._tenantPasswordPolicies = {};
    this.lastNotifiedUid = void 0;
    this.languageCode = null;
    this.tenantId = null;
    this.settings = {
      appVerificationDisabledForTesting: false
    };
    this.frameworks = [];
    this.name = app.name;
    this.clientVersion = config.sdkClientVersion;
  }
  _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
    if (popupRedirectResolver) {
      this._popupRedirectResolver = _getInstance(popupRedirectResolver);
    }
    this._initializationPromise = this.queue(() => __async(this, null, function* () {
      var _a, _b;
      if (this._deleted) {
        return;
      }
      this.persistenceManager = yield PersistenceUserManager.create(this, persistenceHierarchy);
      if (this._deleted) {
        return;
      }
      if ((_a = this._popupRedirectResolver) === null || _a === void 0 ? void 0 : _a._shouldInitProactively) {
        try {
          yield this._popupRedirectResolver._initialize(this);
        } catch (e) {
        }
      }
      yield this.initializeCurrentUser(popupRedirectResolver);
      this.lastNotifiedUid = ((_b = this.currentUser) === null || _b === void 0 ? void 0 : _b.uid) || null;
      if (this._deleted) {
        return;
      }
      this._isInitialized = true;
    }));
    return this._initializationPromise;
  }
  /**
   * If the persistence is changed in another window, the user manager will let us know
   */
  _onStorageEvent() {
    return __async(this, null, function* () {
      if (this._deleted) {
        return;
      }
      const user = yield this.assertedPersistence.getCurrentUser();
      if (!this.currentUser && !user) {
        return;
      }
      if (this.currentUser && user && this.currentUser.uid === user.uid) {
        this._currentUser._assign(user);
        yield this.currentUser.getIdToken();
        return;
      }
      yield this._updateCurrentUser(
        user,
        /* skipBeforeStateCallbacks */
        true
      );
    });
  }
  initializeCurrentUserFromIdToken(idToken) {
    return __async(this, null, function* () {
      try {
        const response = yield getAccountInfo(this, {
          idToken
        });
        const user = yield UserImpl._fromGetAccountInfoResponse(this, response, idToken);
        yield this.directlySetCurrentUser(user);
      } catch (err) {
        console.warn("FirebaseServerApp could not login user with provided authIdToken: ", err);
        yield this.directlySetCurrentUser(null);
      }
    });
  }
  initializeCurrentUser(popupRedirectResolver) {
    return __async(this, null, function* () {
      var _a;
      if (_isFirebaseServerApp(this.app)) {
        const idToken = this.app.settings.authIdToken;
        if (idToken) {
          return new Promise((resolve) => {
            setTimeout(() => this.initializeCurrentUserFromIdToken(idToken).then(resolve, resolve));
          });
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      const previouslyStoredUser = yield this.assertedPersistence.getCurrentUser();
      let futureCurrentUser = previouslyStoredUser;
      let needsTocheckMiddleware = false;
      if (popupRedirectResolver && this.config.authDomain) {
        yield this.getOrInitRedirectPersistenceManager();
        const redirectUserEventId = (_a = this.redirectUser) === null || _a === void 0 ? void 0 : _a._redirectEventId;
        const storedUserEventId = futureCurrentUser === null || futureCurrentUser === void 0 ? void 0 : futureCurrentUser._redirectEventId;
        const result = yield this.tryRedirectSignIn(popupRedirectResolver);
        if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (result === null || result === void 0 ? void 0 : result.user)) {
          futureCurrentUser = result.user;
          needsTocheckMiddleware = true;
        }
      }
      if (!futureCurrentUser) {
        return this.directlySetCurrentUser(null);
      }
      if (!futureCurrentUser._redirectEventId) {
        if (needsTocheckMiddleware) {
          try {
            yield this.beforeStateQueue.runMiddleware(futureCurrentUser);
          } catch (e) {
            futureCurrentUser = previouslyStoredUser;
            this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
          }
        }
        if (futureCurrentUser) {
          return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      _assert(
        this._popupRedirectResolver,
        this,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      yield this.getOrInitRedirectPersistenceManager();
      if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
        return this.directlySetCurrentUser(futureCurrentUser);
      }
      return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
    });
  }
  tryRedirectSignIn(redirectResolver) {
    return __async(this, null, function* () {
      let result = null;
      try {
        result = yield this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
      } catch (e) {
        yield this._setRedirectUser(null);
      }
      return result;
    });
  }
  reloadAndSetCurrentUserOrClear(user) {
    return __async(this, null, function* () {
      try {
        yield _reloadWithoutSaving(user);
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) !== `auth/${"network-request-failed"}`) {
          return this.directlySetCurrentUser(null);
        }
      }
      return this.directlySetCurrentUser(user);
    });
  }
  useDeviceLanguage() {
    this.languageCode = _getUserLanguage();
  }
  _delete() {
    return __async(this, null, function* () {
      this._deleted = true;
    });
  }
  updateCurrentUser(userExtern) {
    return __async(this, null, function* () {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      const user = userExtern ? getModularInstance(userExtern) : null;
      if (user) {
        _assert(
          user.auth.config.apiKey === this.config.apiKey,
          this,
          "invalid-user-token"
          /* AuthErrorCode.INVALID_AUTH */
        );
      }
      return this._updateCurrentUser(user && user._clone(this));
    });
  }
  _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
    return __async(this, null, function* () {
      if (this._deleted) {
        return;
      }
      if (user) {
        _assert(
          this.tenantId === user.tenantId,
          this,
          "tenant-id-mismatch"
          /* AuthErrorCode.TENANT_ID_MISMATCH */
        );
      }
      if (!skipBeforeStateCallbacks) {
        yield this.beforeStateQueue.runMiddleware(user);
      }
      return this.queue(() => __async(this, null, function* () {
        yield this.directlySetCurrentUser(user);
        this.notifyAuthListeners();
      }));
    });
  }
  signOut() {
    return __async(this, null, function* () {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      yield this.beforeStateQueue.runMiddleware(null);
      if (this.redirectPersistenceManager || this._popupRedirectResolver) {
        yield this._setRedirectUser(null);
      }
      return this._updateCurrentUser(
        null,
        /* skipBeforeStateCallbacks */
        true
      );
    });
  }
  setPersistence(persistence) {
    if (_isFirebaseServerApp(this.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
    }
    return this.queue(() => __async(this, null, function* () {
      yield this.assertedPersistence.setPersistence(_getInstance(persistence));
    }));
  }
  _getRecaptchaConfig() {
    if (this.tenantId == null) {
      return this._agentRecaptchaConfig;
    } else {
      return this._tenantRecaptchaConfigs[this.tenantId];
    }
  }
  validatePassword(password) {
    return __async(this, null, function* () {
      if (!this._getPasswordPolicyInternal()) {
        yield this._updatePasswordPolicy();
      }
      const passwordPolicy = this._getPasswordPolicyInternal();
      if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
        return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
      }
      return passwordPolicy.validatePassword(password);
    });
  }
  _getPasswordPolicyInternal() {
    if (this.tenantId === null) {
      return this._projectPasswordPolicy;
    } else {
      return this._tenantPasswordPolicies[this.tenantId];
    }
  }
  _updatePasswordPolicy() {
    return __async(this, null, function* () {
      const response = yield _getPasswordPolicy(this);
      const passwordPolicy = new PasswordPolicyImpl(response);
      if (this.tenantId === null) {
        this._projectPasswordPolicy = passwordPolicy;
      } else {
        this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
      }
    });
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type;
  }
  _updateErrorMap(errorMap) {
    this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
  }
  onAuthStateChanged(nextOrObserver, error, completed) {
    return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
  }
  beforeAuthStateChanged(callback, onAbort) {
    return this.beforeStateQueue.pushCallback(callback, onAbort);
  }
  onIdTokenChanged(nextOrObserver, error, completed) {
    return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
  }
  authStateReady() {
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        resolve();
      } else {
        const unsubscribe = this.onAuthStateChanged(() => {
          unsubscribe();
          resolve();
        }, reject);
      }
    });
  }
  /**
   * Revokes the given access token. Currently only supports Apple OAuth access tokens.
   */
  revokeAccessToken(token) {
    return __async(this, null, function* () {
      if (this.currentUser) {
        const idToken = yield this.currentUser.getIdToken();
        const request = {
          providerId: "apple.com",
          tokenType: "ACCESS_TOKEN",
          token,
          idToken
        };
        if (this.tenantId != null) {
          request.tenantId = this.tenantId;
        }
        yield revokeToken(this, request);
      }
    });
  }
  toJSON() {
    var _a;
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser: (_a = this._currentUser) === null || _a === void 0 ? void 0 : _a.toJSON()
    };
  }
  _setRedirectUser(user, popupRedirectResolver) {
    return __async(this, null, function* () {
      const redirectManager = yield this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
      return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
    });
  }
  getOrInitRedirectPersistenceManager(popupRedirectResolver) {
    return __async(this, null, function* () {
      if (!this.redirectPersistenceManager) {
        const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
        _assert(
          resolver,
          this,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        this.redirectPersistenceManager = yield PersistenceUserManager.create(
          this,
          [_getInstance(resolver._redirectPersistence)],
          "redirectUser"
          /* KeyName.REDIRECT_USER */
        );
        this.redirectUser = yield this.redirectPersistenceManager.getCurrentUser();
      }
      return this.redirectPersistenceManager;
    });
  }
  _redirectUserForId(id) {
    return __async(this, null, function* () {
      var _a, _b;
      if (this._isInitialized) {
        yield this.queue(() => __async(this, null, function* () {
        }));
      }
      if (((_a = this._currentUser) === null || _a === void 0 ? void 0 : _a._redirectEventId) === id) {
        return this._currentUser;
      }
      if (((_b = this.redirectUser) === null || _b === void 0 ? void 0 : _b._redirectEventId) === id) {
        return this.redirectUser;
      }
      return null;
    });
  }
  _persistUserIfCurrent(user) {
    return __async(this, null, function* () {
      if (user === this.currentUser) {
        return this.queue(() => __async(this, null, function* () {
          return this.directlySetCurrentUser(user);
        }));
      }
    });
  }
  /** Notifies listeners only if the user is current */
  _notifyListenersIfCurrent(user) {
    if (user === this.currentUser) {
      this.notifyAuthListeners();
    }
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
  }
  _startProactiveRefresh() {
    this.isProactiveRefreshEnabled = true;
    if (this.currentUser) {
      this._currentUser._startProactiveRefresh();
    }
  }
  _stopProactiveRefresh() {
    this.isProactiveRefreshEnabled = false;
    if (this.currentUser) {
      this._currentUser._stopProactiveRefresh();
    }
  }
  /** Returns the current user cast as the internal type */
  get _currentUser() {
    return this.currentUser;
  }
  notifyAuthListeners() {
    var _a, _b;
    if (!this._isInitialized) {
      return;
    }
    this.idTokenSubscription.next(this.currentUser);
    const currentUid = (_b = (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
    if (this.lastNotifiedUid !== currentUid) {
      this.lastNotifiedUid = currentUid;
      this.authStateSubscription.next(this.currentUser);
    }
  }
  registerStateListener(subscription, nextOrObserver, error, completed) {
    if (this._deleted) {
      return () => {
      };
    }
    const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
    let isUnsubscribed = false;
    const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
    _assert(
      promise,
      this,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    promise.then(() => {
      if (isUnsubscribed) {
        return;
      }
      cb(this.currentUser);
    });
    if (typeof nextOrObserver === "function") {
      const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    } else {
      const unsubscribe = subscription.addObserver(nextOrObserver);
      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    }
  }
  /**
   * Unprotected (from race conditions) method to set the current user. This
   * should only be called from within a queued callback. This is necessary
   * because the queue shouldn't rely on another queued callback.
   */
  directlySetCurrentUser(user) {
    return __async(this, null, function* () {
      if (this.currentUser && this.currentUser !== user) {
        this._currentUser._stopProactiveRefresh();
      }
      if (user && this.isProactiveRefreshEnabled) {
        user._startProactiveRefresh();
      }
      this.currentUser = user;
      if (user) {
        yield this.assertedPersistence.setCurrentUser(user);
      } else {
        yield this.assertedPersistence.removeCurrentUser();
      }
    });
  }
  queue(action) {
    this.operations = this.operations.then(action, action);
    return this.operations;
  }
  get assertedPersistence() {
    _assert(
      this.persistenceManager,
      this,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return this.persistenceManager;
  }
  _logFramework(framework) {
    if (!framework || this.frameworks.includes(framework)) {
      return;
    }
    this.frameworks.push(framework);
    this.frameworks.sort();
    this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
  }
  _getFrameworks() {
    return this.frameworks;
  }
  _getAdditionalHeaders() {
    return __async(this, null, function* () {
      var _a;
      const headers = {
        [
          "X-Client-Version"
          /* HttpHeader.X_CLIENT_VERSION */
        ]: this.clientVersion
      };
      if (this.app.options.appId) {
        headers[
          "X-Firebase-gmpid"
          /* HttpHeader.X_FIREBASE_GMPID */
        ] = this.app.options.appId;
      }
      const heartbeatsHeader = yield (_a = this.heartbeatServiceProvider.getImmediate({
        optional: true
      })) === null || _a === void 0 ? void 0 : _a.getHeartbeatsHeader();
      if (heartbeatsHeader) {
        headers[
          "X-Firebase-Client"
          /* HttpHeader.X_FIREBASE_CLIENT */
        ] = heartbeatsHeader;
      }
      const appCheckToken = yield this._getAppCheckToken();
      if (appCheckToken) {
        headers[
          "X-Firebase-AppCheck"
          /* HttpHeader.X_FIREBASE_APP_CHECK */
        ] = appCheckToken;
      }
      return headers;
    });
  }
  _getAppCheckToken() {
    return __async(this, null, function* () {
      var _a;
      if (_isFirebaseServerApp(this.app) && this.app.settings.appCheckToken) {
        return this.app.settings.appCheckToken;
      }
      const appCheckTokenResult = yield (_a = this.appCheckServiceProvider.getImmediate({
        optional: true
      })) === null || _a === void 0 ? void 0 : _a.getToken();
      if (appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.error) {
        _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
      }
      return appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.token;
    });
  }
};
function _castAuth(auth) {
  return getModularInstance(auth);
}
var Subscription = class {
  constructor(auth) {
    this.auth = auth;
    this.observer = null;
    this.addObserver = createSubscribe((observer) => this.observer = observer);
  }
  get next() {
    _assert(
      this.observer,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return this.observer.next.bind(this.observer);
  }
};
var externalJSProvider = {
  loadJS() {
    return __async(this, null, function* () {
      throw new Error("Unable to load external scripts");
    });
  },
  recaptchaV2Script: "",
  recaptchaEnterpriseScript: "",
  gapiScript: ""
};
function _loadJS(url) {
  return externalJSProvider.loadJS(url);
}
function _recaptchaEnterpriseScriptUrl() {
  return externalJSProvider.recaptchaEnterpriseScript;
}
var MockGreCAPTCHATopLevel = class {
  constructor() {
    this.enterprise = new MockGreCAPTCHA();
  }
  ready(callback) {
    callback();
  }
  execute(_siteKey, _options) {
    return Promise.resolve("token");
  }
  render(_container, _parameters) {
    return "";
  }
};
var MockGreCAPTCHA = class {
  ready(callback) {
    callback();
  }
  execute(_siteKey, _options) {
    return Promise.resolve("token");
  }
  render(_container, _parameters) {
    return "";
  }
};
var RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
var FAKE_TOKEN = "NO_RECAPTCHA";
var RecaptchaEnterpriseVerifier = class {
  /**
   *
   * @param authExtern - The corresponding Firebase {@link Auth} instance.
   *
   */
  constructor(authExtern) {
    this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
    this.auth = _castAuth(authExtern);
  }
  /**
   * Executes the verification process.
   *
   * @returns A Promise for a token that can be used to assert the validity of a request.
   */
  verify(action = "verify", forceRefresh = false) {
    return __async(this, null, function* () {
      function retrieveSiteKey(auth) {
        return __async(this, null, function* () {
          if (!forceRefresh) {
            if (auth.tenantId == null && auth._agentRecaptchaConfig != null) {
              return auth._agentRecaptchaConfig.siteKey;
            }
            if (auth.tenantId != null && auth._tenantRecaptchaConfigs[auth.tenantId] !== void 0) {
              return auth._tenantRecaptchaConfigs[auth.tenantId].siteKey;
            }
          }
          return new Promise((resolve, reject) => __async(this, null, function* () {
            getRecaptchaConfig(auth, {
              clientType: "CLIENT_TYPE_WEB",
              version: "RECAPTCHA_ENTERPRISE"
              /* RecaptchaVersion.ENTERPRISE */
            }).then((response) => {
              if (response.recaptchaKey === void 0) {
                reject(new Error("recaptcha Enterprise site key undefined"));
              } else {
                const config = new RecaptchaConfig(response);
                if (auth.tenantId == null) {
                  auth._agentRecaptchaConfig = config;
                } else {
                  auth._tenantRecaptchaConfigs[auth.tenantId] = config;
                }
                return resolve(config.siteKey);
              }
            }).catch((error) => {
              reject(error);
            });
          }));
        });
      }
      function retrieveRecaptchaToken(siteKey, resolve, reject) {
        const grecaptcha = window.grecaptcha;
        if (isEnterprise(grecaptcha)) {
          grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.execute(siteKey, {
              action
            }).then((token) => {
              resolve(token);
            }).catch(() => {
              resolve(FAKE_TOKEN);
            });
          });
        } else {
          reject(Error("No reCAPTCHA enterprise script loaded."));
        }
      }
      if (this.auth.settings.appVerificationDisabledForTesting) {
        const mockRecaptcha = new MockGreCAPTCHATopLevel();
        return mockRecaptcha.execute("siteKey", {
          action: "verify"
        });
      }
      return new Promise((resolve, reject) => {
        retrieveSiteKey(this.auth).then((siteKey) => {
          if (!forceRefresh && isEnterprise(window.grecaptcha)) {
            retrieveRecaptchaToken(siteKey, resolve, reject);
          } else {
            if (typeof window === "undefined") {
              reject(new Error("RecaptchaVerifier is only supported in browser"));
              return;
            }
            let url = _recaptchaEnterpriseScriptUrl();
            if (url.length !== 0) {
              url += siteKey;
            }
            _loadJS(url).then(() => {
              retrieveRecaptchaToken(siteKey, resolve, reject);
            }).catch((error) => {
              reject(error);
            });
          }
        }).catch((error) => {
          reject(error);
        });
      });
    });
  }
};
function injectRecaptchaFields(auth, request, action, isCaptchaResp = false, isFakeToken = false) {
  return __async(this, null, function* () {
    const verifier = new RecaptchaEnterpriseVerifier(auth);
    let captchaResponse;
    if (isFakeToken) {
      captchaResponse = FAKE_TOKEN;
    } else {
      try {
        captchaResponse = yield verifier.verify(action);
      } catch (error) {
        captchaResponse = yield verifier.verify(action, true);
      }
    }
    const newRequest = Object.assign({}, request);
    if (action === "mfaSmsEnrollment" || action === "mfaSmsSignIn") {
      if ("phoneEnrollmentInfo" in newRequest) {
        const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
        const recaptchaToken = newRequest.phoneEnrollmentInfo.recaptchaToken;
        Object.assign(newRequest, {
          "phoneEnrollmentInfo": {
            phoneNumber,
            recaptchaToken,
            captchaResponse,
            "clientType": "CLIENT_TYPE_WEB",
            "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }
        });
      } else if ("phoneSignInInfo" in newRequest) {
        const recaptchaToken = newRequest.phoneSignInInfo.recaptchaToken;
        Object.assign(newRequest, {
          "phoneSignInInfo": {
            recaptchaToken,
            captchaResponse,
            "clientType": "CLIENT_TYPE_WEB",
            "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }
        });
      }
      return newRequest;
    }
    if (!isCaptchaResp) {
      Object.assign(newRequest, {
        captchaResponse
      });
    } else {
      Object.assign(newRequest, {
        "captchaResp": captchaResponse
      });
    }
    Object.assign(newRequest, {
      "clientType": "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    });
    Object.assign(newRequest, {
      "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    return newRequest;
  });
}
function handleRecaptchaFlow(authInstance, request, actionName, actionMethod, recaptchaAuthProvider) {
  return __async(this, null, function* () {
    var _a, _b;
    if (recaptchaAuthProvider === "EMAIL_PASSWORD_PROVIDER") {
      if ((_a = authInstance._getRecaptchaConfig()) === null || _a === void 0 ? void 0 : _a.isProviderEnabled(
        "EMAIL_PASSWORD_PROVIDER"
        /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
      )) {
        const requestWithRecaptcha = yield injectRecaptchaFields(
          authInstance,
          request,
          actionName,
          actionName === "getOobCode"
          /* RecaptchaActionName.GET_OOB_CODE */
        );
        return actionMethod(authInstance, requestWithRecaptcha);
      } else {
        return actionMethod(authInstance, request).catch((error) => __async(this, null, function* () {
          if (error.code === `auth/${"missing-recaptcha-token"}`) {
            console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
            const requestWithRecaptcha = yield injectRecaptchaFields(
              authInstance,
              request,
              actionName,
              actionName === "getOobCode"
              /* RecaptchaActionName.GET_OOB_CODE */
            );
            return actionMethod(authInstance, requestWithRecaptcha);
          } else {
            return Promise.reject(error);
          }
        }));
      }
    } else if (recaptchaAuthProvider === "PHONE_PROVIDER") {
      if ((_b = authInstance._getRecaptchaConfig()) === null || _b === void 0 ? void 0 : _b.isProviderEnabled(
        "PHONE_PROVIDER"
        /* RecaptchaAuthProvider.PHONE_PROVIDER */
      )) {
        const requestWithRecaptcha = yield injectRecaptchaFields(authInstance, request, actionName);
        return actionMethod(authInstance, requestWithRecaptcha).catch((error) => __async(this, null, function* () {
          var _a2;
          if (((_a2 = authInstance._getRecaptchaConfig()) === null || _a2 === void 0 ? void 0 : _a2.getProviderEnforcementState(
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          )) === "AUDIT") {
            if (error.code === `auth/${"missing-recaptcha-token"}` || error.code === `auth/${"invalid-app-credential"}`) {
              console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${actionName} flow.`);
              const requestWithRecaptchaFields = yield injectRecaptchaFields(
                authInstance,
                request,
                actionName,
                false,
                // isCaptchaResp
                true
                // isFakeToken
              );
              return actionMethod(authInstance, requestWithRecaptchaFields);
            }
          }
          return Promise.reject(error);
        }));
      } else {
        const requestWithRecaptchaFields = yield injectRecaptchaFields(
          authInstance,
          request,
          actionName,
          false,
          // isCaptchaResp
          true
          // isFakeToken
        );
        return actionMethod(authInstance, requestWithRecaptchaFields);
      }
    } else {
      return Promise.reject(recaptchaAuthProvider + " provider is not supported.");
    }
  });
}
function _initializeAuthInstance(auth, deps) {
  const persistence = (deps === null || deps === void 0 ? void 0 : deps.persistence) || [];
  const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
  if (deps === null || deps === void 0 ? void 0 : deps.errorMap) {
    auth._updateErrorMap(deps.errorMap);
  }
  auth._initializeWithPersistence(hierarchy, deps === null || deps === void 0 ? void 0 : deps.popupRedirectResolver);
}
function connectAuthEmulator(auth, url, options) {
  const authInternal = _castAuth(auth);
  _assert(
    /^https?:\/\//.test(url),
    authInternal,
    "invalid-emulator-scheme"
    /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
  );
  const disableWarnings = !!(options === null || options === void 0 ? void 0 : options.disableWarnings);
  const protocol = extractProtocol(url);
  const {
    host,
    port
  } = extractHostAndPort(url);
  const portStr = port === null ? "" : `:${port}`;
  const emulator = {
    url: `${protocol}//${host}${portStr}/`
  };
  const emulatorConfig = Object.freeze({
    host,
    port,
    protocol: protocol.replace(":", ""),
    options: Object.freeze({
      disableWarnings
    })
  });
  if (!authInternal._canInitEmulator) {
    _assert(
      authInternal.config.emulator && authInternal.emulatorConfig,
      authInternal,
      "emulator-config-failed"
      /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
    );
    _assert(
      deepEqual(emulator, authInternal.config.emulator) && deepEqual(emulatorConfig, authInternal.emulatorConfig),
      authInternal,
      "emulator-config-failed"
      /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
    );
    return;
  }
  authInternal.config.emulator = emulator;
  authInternal.emulatorConfig = emulatorConfig;
  authInternal.settings.appVerificationDisabledForTesting = true;
  if (!disableWarnings) {
    emitEmulatorWarning();
  }
}
function extractProtocol(url) {
  const protocolEnd = url.indexOf(":");
  return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
}
function extractHostAndPort(url) {
  const protocol = extractProtocol(url);
  const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
  if (!authority) {
    return {
      host: "",
      port: null
    };
  }
  const hostAndPort = authority[2].split("@").pop() || "";
  const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
  if (bracketedIPv6) {
    const host = bracketedIPv6[1];
    return {
      host,
      port: parsePort(hostAndPort.substr(host.length + 1))
    };
  } else {
    const [host, port] = hostAndPort.split(":");
    return {
      host,
      port: parsePort(port)
    };
  }
}
function parsePort(portStr) {
  if (!portStr) {
    return null;
  }
  const port = Number(portStr);
  if (isNaN(port)) {
    return null;
  }
  return port;
}
function emitEmulatorWarning() {
  function attachBanner() {
    const el = document.createElement("p");
    const sty = el.style;
    el.innerText = "Running in emulator mode. Do not use with production credentials.";
    sty.position = "fixed";
    sty.width = "100%";
    sty.backgroundColor = "#ffffff";
    sty.border = ".1em solid #000000";
    sty.color = "#b50000";
    sty.bottom = "0px";
    sty.left = "0px";
    sty.margin = "0px";
    sty.zIndex = "10000";
    sty.textAlign = "center";
    el.classList.add("firebase-emulator-warning");
    document.body.appendChild(el);
  }
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", attachBanner);
    } else {
      attachBanner();
    }
  }
}
var AuthCredential = class {
  /** @internal */
  constructor(providerId, signInMethod) {
    this.providerId = providerId;
    this.signInMethod = signInMethod;
  }
  /**
   * Returns a JSON-serializable representation of this object.
   *
   * @returns a JSON-serializable representation of this object.
   */
  toJSON() {
    return debugFail("not implemented");
  }
  /** @internal */
  _getIdTokenResponse(_auth) {
    return debugFail("not implemented");
  }
  /** @internal */
  _linkToIdToken(_auth, _idToken) {
    return debugFail("not implemented");
  }
  /** @internal */
  _getReauthenticationResolver(_auth) {
    return debugFail("not implemented");
  }
};
function resetPassword(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:resetPassword", _addTidIfNecessary(auth, request));
  });
}
function updateEmailPassword(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  });
}
function linkEmailPassword(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:signUp", request);
  });
}
function applyActionCode$1(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", _addTidIfNecessary(auth, request));
  });
}
function signInWithPassword(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth, request));
  });
}
function sendOobCode(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:sendOobCode", _addTidIfNecessary(auth, request));
  });
}
function sendEmailVerification$1(auth, request) {
  return __async(this, null, function* () {
    return sendOobCode(auth, request);
  });
}
function sendPasswordResetEmail$1(auth, request) {
  return __async(this, null, function* () {
    return sendOobCode(auth, request);
  });
}
function sendSignInLinkToEmail$1(auth, request) {
  return __async(this, null, function* () {
    return sendOobCode(auth, request);
  });
}
function verifyAndChangeEmail(auth, request) {
  return __async(this, null, function* () {
    return sendOobCode(auth, request);
  });
}
function signInWithEmailLink$1(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
  });
}
function signInWithEmailLinkForLinking(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
  });
}
var EmailAuthCredential = class _EmailAuthCredential extends AuthCredential {
  /** @internal */
  constructor(_email, _password, signInMethod, _tenantId = null) {
    super("password", signInMethod);
    this._email = _email;
    this._password = _password;
    this._tenantId = _tenantId;
  }
  /** @internal */
  static _fromEmailAndPassword(email, password) {
    return new _EmailAuthCredential(
      email,
      password,
      "password"
      /* SignInMethod.EMAIL_PASSWORD */
    );
  }
  /** @internal */
  static _fromEmailAndCode(email, oobCode, tenantId = null) {
    return new _EmailAuthCredential(email, oobCode, "emailLink", tenantId);
  }
  /** {@inheritdoc AuthCredential.toJSON} */
  toJSON() {
    return {
      email: this._email,
      password: this._password,
      signInMethod: this.signInMethod,
      tenantId: this._tenantId
    };
  }
  /**
   * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
   *
   * @param json - Either `object` or the stringified representation of the object. When string is
   * provided, `JSON.parse` would be called first.
   *
   * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
   */
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    if ((obj === null || obj === void 0 ? void 0 : obj.email) && (obj === null || obj === void 0 ? void 0 : obj.password)) {
      if (obj.signInMethod === "password") {
        return this._fromEmailAndPassword(obj.email, obj.password);
      } else if (obj.signInMethod === "emailLink") {
        return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
      }
    }
    return null;
  }
  /** @internal */
  _getIdTokenResponse(auth) {
    return __async(this, null, function* () {
      switch (this.signInMethod) {
        case "password":
          const request = {
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(
            auth,
            request,
            "signInWithPassword",
            signInWithPassword,
            "EMAIL_PASSWORD_PROVIDER"
            /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
          );
        case "emailLink":
          return signInWithEmailLink$1(auth, {
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    });
  }
  /** @internal */
  _linkToIdToken(auth, idToken) {
    return __async(this, null, function* () {
      switch (this.signInMethod) {
        case "password":
          const request = {
            idToken,
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(
            auth,
            request,
            "signUpPassword",
            linkEmailPassword,
            "EMAIL_PASSWORD_PROVIDER"
            /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
          );
        case "emailLink":
          return signInWithEmailLinkForLinking(auth, {
            idToken,
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    });
  }
  /** @internal */
  _getReauthenticationResolver(auth) {
    return this._getIdTokenResponse(auth);
  }
};
function signInWithIdp(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth, request));
  });
}
var IDP_REQUEST_URI$1 = "http://localhost";
var OAuthCredential = class _OAuthCredential extends AuthCredential {
  constructor() {
    super(...arguments);
    this.pendingToken = null;
  }
  /** @internal */
  static _fromParams(params) {
    const cred = new _OAuthCredential(params.providerId, params.signInMethod);
    if (params.idToken || params.accessToken) {
      if (params.idToken) {
        cred.idToken = params.idToken;
      }
      if (params.accessToken) {
        cred.accessToken = params.accessToken;
      }
      if (params.nonce && !params.pendingToken) {
        cred.nonce = params.nonce;
      }
      if (params.pendingToken) {
        cred.pendingToken = params.pendingToken;
      }
    } else if (params.oauthToken && params.oauthTokenSecret) {
      cred.accessToken = params.oauthToken;
      cred.secret = params.oauthTokenSecret;
    } else {
      _fail(
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
    }
    return cred;
  }
  /** {@inheritdoc AuthCredential.toJSON}  */
  toJSON() {
    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      secret: this.secret,
      nonce: this.nonce,
      pendingToken: this.pendingToken,
      providerId: this.providerId,
      signInMethod: this.signInMethod
    };
  }
  /**
   * Static method to deserialize a JSON representation of an object into an
   * {@link  AuthCredential}.
   *
   * @param json - Input can be either Object or the stringified representation of the object.
   * When string is provided, JSON.parse would be called first.
   *
   * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
   */
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    const {
      providerId,
      signInMethod
    } = obj, rest = __rest(obj, ["providerId", "signInMethod"]);
    if (!providerId || !signInMethod) {
      return null;
    }
    const cred = new _OAuthCredential(providerId, signInMethod);
    cred.idToken = rest.idToken || void 0;
    cred.accessToken = rest.accessToken || void 0;
    cred.secret = rest.secret;
    cred.nonce = rest.nonce;
    cred.pendingToken = rest.pendingToken || null;
    return cred;
  }
  /** @internal */
  _getIdTokenResponse(auth) {
    const request = this.buildRequest();
    return signInWithIdp(auth, request);
  }
  /** @internal */
  _linkToIdToken(auth, idToken) {
    const request = this.buildRequest();
    request.idToken = idToken;
    return signInWithIdp(auth, request);
  }
  /** @internal */
  _getReauthenticationResolver(auth) {
    const request = this.buildRequest();
    request.autoCreate = false;
    return signInWithIdp(auth, request);
  }
  buildRequest() {
    const request = {
      requestUri: IDP_REQUEST_URI$1,
      returnSecureToken: true
    };
    if (this.pendingToken) {
      request.pendingToken = this.pendingToken;
    } else {
      const postBody = {};
      if (this.idToken) {
        postBody["id_token"] = this.idToken;
      }
      if (this.accessToken) {
        postBody["access_token"] = this.accessToken;
      }
      if (this.secret) {
        postBody["oauth_token_secret"] = this.secret;
      }
      postBody["providerId"] = this.providerId;
      if (this.nonce && !this.pendingToken) {
        postBody["nonce"] = this.nonce;
      }
      request.postBody = querystring(postBody);
    }
    return request;
  }
};
function parseMode(mode) {
  switch (mode) {
    case "recoverEmail":
      return "RECOVER_EMAIL";
    case "resetPassword":
      return "PASSWORD_RESET";
    case "signIn":
      return "EMAIL_SIGNIN";
    case "verifyEmail":
      return "VERIFY_EMAIL";
    case "verifyAndChangeEmail":
      return "VERIFY_AND_CHANGE_EMAIL";
    case "revertSecondFactorAddition":
      return "REVERT_SECOND_FACTOR_ADDITION";
    default:
      return null;
  }
}
function parseDeepLink(url) {
  const link = querystringDecode(extractQuerystring(url))["link"];
  const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
  const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
  const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
  return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
var ActionCodeURL = class _ActionCodeURL {
  /**
   * @param actionLink - The link from which to extract the URL.
   * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
   *
   * @internal
   */
  constructor(actionLink) {
    var _a, _b, _c, _d, _e, _f;
    const searchParams = querystringDecode(extractQuerystring(actionLink));
    const apiKey = (_a = searchParams[
      "apiKey"
      /* QueryField.API_KEY */
    ]) !== null && _a !== void 0 ? _a : null;
    const code = (_b = searchParams[
      "oobCode"
      /* QueryField.CODE */
    ]) !== null && _b !== void 0 ? _b : null;
    const operation = parseMode((_c = searchParams[
      "mode"
      /* QueryField.MODE */
    ]) !== null && _c !== void 0 ? _c : null);
    _assert(
      apiKey && code && operation,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    this.apiKey = apiKey;
    this.operation = operation;
    this.code = code;
    this.continueUrl = (_d = searchParams[
      "continueUrl"
      /* QueryField.CONTINUE_URL */
    ]) !== null && _d !== void 0 ? _d : null;
    this.languageCode = (_e = searchParams[
      "languageCode"
      /* QueryField.LANGUAGE_CODE */
    ]) !== null && _e !== void 0 ? _e : null;
    this.tenantId = (_f = searchParams[
      "tenantId"
      /* QueryField.TENANT_ID */
    ]) !== null && _f !== void 0 ? _f : null;
  }
  /**
   * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
   * otherwise returns null.
   *
   * @param link  - The email action link string.
   * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
   *
   * @public
   */
  static parseLink(link) {
    const actionLink = parseDeepLink(link);
    try {
      return new _ActionCodeURL(actionLink);
    } catch (_a) {
      return null;
    }
  }
};
var EmailAuthProvider = class _EmailAuthProvider {
  constructor() {
    this.providerId = _EmailAuthProvider.PROVIDER_ID;
  }
  /**
   * Initialize an {@link AuthCredential} using an email and password.
   *
   * @example
   * ```javascript
   * const authCredential = EmailAuthProvider.credential(email, password);
   * const userCredential = await signInWithCredential(auth, authCredential);
   * ```
   *
   * @example
   * ```javascript
   * const userCredential = await signInWithEmailAndPassword(auth, email, password);
   * ```
   *
   * @param email - Email address.
   * @param password - User account password.
   * @returns The auth provider credential.
   */
  static credential(email, password) {
    return EmailAuthCredential._fromEmailAndPassword(email, password);
  }
  /**
   * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
   * email link operation.
   *
   * @example
   * ```javascript
   * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
   * const userCredential = await signInWithCredential(auth, authCredential);
   * ```
   *
   * @example
   * ```javascript
   * await sendSignInLinkToEmail(auth, email);
   * // Obtain emailLink from user.
   * const userCredential = await signInWithEmailLink(auth, email, emailLink);
   * ```
   *
   * @param auth - The {@link Auth} instance used to verify the link.
   * @param email - Email address.
   * @param emailLink - Sign-in email link.
   * @returns - The auth provider credential.
   */
  static credentialWithLink(email, emailLink) {
    const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
    _assert(
      actionCodeUrl,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
  }
};
EmailAuthProvider.PROVIDER_ID = "password";
EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
var FederatedAuthProvider = class {
  /**
   * Constructor for generic OAuth providers.
   *
   * @param providerId - Provider for which credentials should be generated.
   */
  constructor(providerId) {
    this.providerId = providerId;
    this.defaultLanguageCode = null;
    this.customParameters = {};
  }
  /**
   * Set the language gode.
   *
   * @param languageCode - language code
   */
  setDefaultLanguage(languageCode) {
    this.defaultLanguageCode = languageCode;
  }
  /**
   * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
   * operations.
   *
   * @remarks
   * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
   * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
   *
   * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
   */
  setCustomParameters(customOAuthParameters) {
    this.customParameters = customOAuthParameters;
    return this;
  }
  /**
   * Retrieve the current list of {@link CustomParameters}.
   */
  getCustomParameters() {
    return this.customParameters;
  }
};
var BaseOAuthProvider = class extends FederatedAuthProvider {
  constructor() {
    super(...arguments);
    this.scopes = [];
  }
  /**
   * Add an OAuth scope to the credential.
   *
   * @param scope - Provider OAuth scope to add.
   */
  addScope(scope) {
    if (!this.scopes.includes(scope)) {
      this.scopes.push(scope);
    }
    return this;
  }
  /**
   * Retrieve the current list of OAuth scopes.
   */
  getScopes() {
    return [...this.scopes];
  }
};
var OAuthProvider = class _OAuthProvider extends BaseOAuthProvider {
  /**
   * Creates an {@link OAuthCredential} from a JSON string or a plain object.
   * @param json - A plain object or a JSON string
   */
  static credentialFromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    _assert(
      "providerId" in obj && "signInMethod" in obj,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    return OAuthCredential._fromParams(obj);
  }
  /**
   * Creates a {@link OAuthCredential} from a generic OAuth provider's access token or ID token.
   *
   * @remarks
   * The raw nonce is required when an ID token with a nonce field is provided. The SHA-256 hash of
   * the raw nonce must match the nonce field in the ID token.
   *
   * @example
   * ```javascript
   * // `googleUser` from the onsuccess Google Sign In callback.
   * // Initialize a generate OAuth provider with a `google.com` providerId.
   * const provider = new OAuthProvider('google.com');
   * const credential = provider.credential({
   *   idToken: googleUser.getAuthResponse().id_token,
   * });
   * const result = await signInWithCredential(credential);
   * ```
   *
   * @param params - Either the options object containing the ID token, access token and raw nonce
   * or the ID token string.
   */
  credential(params) {
    return this._credential(Object.assign(Object.assign({}, params), {
      nonce: params.rawNonce
    }));
  }
  /** An internal credential method that accepts more permissive options */
  _credential(params) {
    _assert(
      params.idToken || params.accessToken,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    return OAuthCredential._fromParams(Object.assign(Object.assign({}, params), {
      providerId: this.providerId,
      signInMethod: this.providerId
    }));
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _OAuthProvider.oauthCredentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _OAuthProvider.oauthCredentialFromTaggedObject(error.customData || {});
  }
  static oauthCredentialFromTaggedObject({
    _tokenResponse: tokenResponse
  }) {
    if (!tokenResponse) {
      return null;
    }
    const {
      oauthIdToken,
      oauthAccessToken,
      oauthTokenSecret,
      pendingToken,
      nonce,
      providerId
    } = tokenResponse;
    if (!oauthAccessToken && !oauthTokenSecret && !oauthIdToken && !pendingToken) {
      return null;
    }
    if (!providerId) {
      return null;
    }
    try {
      return new _OAuthProvider(providerId)._credential({
        idToken: oauthIdToken,
        accessToken: oauthAccessToken,
        nonce,
        pendingToken
      });
    } catch (e) {
      return null;
    }
  }
};
var FacebookAuthProvider = class _FacebookAuthProvider extends BaseOAuthProvider {
  constructor() {
    super(
      "facebook.com"
      /* ProviderId.FACEBOOK */
    );
  }
  /**
   * Creates a credential for Facebook.
   *
   * @example
   * ```javascript
   * // `event` from the Facebook auth.authResponseChange callback.
   * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
   * const result = await signInWithCredential(credential);
   * ```
   *
   * @param accessToken - Facebook access token.
   */
  static credential(accessToken) {
    return OAuthCredential._fromParams({
      providerId: _FacebookAuthProvider.PROVIDER_ID,
      signInMethod: _FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
      accessToken
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _FacebookAuthProvider.credentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({
    _tokenResponse: tokenResponse
  }) {
    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
      return null;
    }
    if (!tokenResponse.oauthAccessToken) {
      return null;
    }
    try {
      return _FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
};
FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
FacebookAuthProvider.PROVIDER_ID = "facebook.com";
var GoogleAuthProvider = class _GoogleAuthProvider extends BaseOAuthProvider {
  constructor() {
    super(
      "google.com"
      /* ProviderId.GOOGLE */
    );
    this.addScope("profile");
  }
  /**
   * Creates a credential for Google. At least one of ID token and access token is required.
   *
   * @example
   * ```javascript
   * // \`googleUser\` from the onsuccess Google Sign In callback.
   * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
   * const result = await signInWithCredential(credential);
   * ```
   *
   * @param idToken - Google ID token.
   * @param accessToken - Google access token.
   */
  static credential(idToken, accessToken) {
    return OAuthCredential._fromParams({
      providerId: _GoogleAuthProvider.PROVIDER_ID,
      signInMethod: _GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
      idToken,
      accessToken
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _GoogleAuthProvider.credentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({
    _tokenResponse: tokenResponse
  }) {
    if (!tokenResponse) {
      return null;
    }
    const {
      oauthIdToken,
      oauthAccessToken
    } = tokenResponse;
    if (!oauthIdToken && !oauthAccessToken) {
      return null;
    }
    try {
      return _GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
};
GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
GoogleAuthProvider.PROVIDER_ID = "google.com";
var GithubAuthProvider = class _GithubAuthProvider extends BaseOAuthProvider {
  constructor() {
    super(
      "github.com"
      /* ProviderId.GITHUB */
    );
  }
  /**
   * Creates a credential for GitHub.
   *
   * @param accessToken - GitHub access token.
   */
  static credential(accessToken) {
    return OAuthCredential._fromParams({
      providerId: _GithubAuthProvider.PROVIDER_ID,
      signInMethod: _GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
      accessToken
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _GithubAuthProvider.credentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({
    _tokenResponse: tokenResponse
  }) {
    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
      return null;
    }
    if (!tokenResponse.oauthAccessToken) {
      return null;
    }
    try {
      return _GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
};
GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
GithubAuthProvider.PROVIDER_ID = "github.com";
var IDP_REQUEST_URI = "http://localhost";
var SAMLAuthCredential = class _SAMLAuthCredential extends AuthCredential {
  /** @internal */
  constructor(providerId, pendingToken) {
    super(providerId, providerId);
    this.pendingToken = pendingToken;
  }
  /** @internal */
  _getIdTokenResponse(auth) {
    const request = this.buildRequest();
    return signInWithIdp(auth, request);
  }
  /** @internal */
  _linkToIdToken(auth, idToken) {
    const request = this.buildRequest();
    request.idToken = idToken;
    return signInWithIdp(auth, request);
  }
  /** @internal */
  _getReauthenticationResolver(auth) {
    const request = this.buildRequest();
    request.autoCreate = false;
    return signInWithIdp(auth, request);
  }
  /** {@inheritdoc AuthCredential.toJSON}  */
  toJSON() {
    return {
      signInMethod: this.signInMethod,
      providerId: this.providerId,
      pendingToken: this.pendingToken
    };
  }
  /**
   * Static method to deserialize a JSON representation of an object into an
   * {@link  AuthCredential}.
   *
   * @param json - Input can be either Object or the stringified representation of the object.
   * When string is provided, JSON.parse would be called first.
   *
   * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
   */
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    const {
      providerId,
      signInMethod,
      pendingToken
    } = obj;
    if (!providerId || !signInMethod || !pendingToken || providerId !== signInMethod) {
      return null;
    }
    return new _SAMLAuthCredential(providerId, pendingToken);
  }
  /**
   * Helper static method to avoid exposing the constructor to end users.
   *
   * @internal
   */
  static _create(providerId, pendingToken) {
    return new _SAMLAuthCredential(providerId, pendingToken);
  }
  buildRequest() {
    return {
      requestUri: IDP_REQUEST_URI,
      returnSecureToken: true,
      pendingToken: this.pendingToken
    };
  }
};
var SAML_PROVIDER_PREFIX = "saml.";
var SAMLAuthProvider = class _SAMLAuthProvider extends FederatedAuthProvider {
  /**
   * Constructor. The providerId must start with "saml."
   * @param providerId - SAML provider ID.
   */
  constructor(providerId) {
    _assert(
      providerId.startsWith(SAML_PROVIDER_PREFIX),
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    super(providerId);
  }
  /**
   * Generates an {@link AuthCredential} from a {@link UserCredential} after a
   * successful SAML flow completes.
   *
   * @remarks
   *
   * For example, to get an {@link AuthCredential}, you could write the
   * following code:
   *
   * ```js
   * const userCredential = await signInWithPopup(auth, samlProvider);
   * const credential = SAMLAuthProvider.credentialFromResult(userCredential);
   * ```
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _SAMLAuthProvider.samlCredentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _SAMLAuthProvider.samlCredentialFromTaggedObject(error.customData || {});
  }
  /**
   * Creates an {@link AuthCredential} from a JSON string or a plain object.
   * @param json - A plain object or a JSON string
   */
  static credentialFromJSON(json) {
    const credential = SAMLAuthCredential.fromJSON(json);
    _assert(
      credential,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    return credential;
  }
  static samlCredentialFromTaggedObject({
    _tokenResponse: tokenResponse
  }) {
    if (!tokenResponse) {
      return null;
    }
    const {
      pendingToken,
      providerId
    } = tokenResponse;
    if (!pendingToken || !providerId) {
      return null;
    }
    try {
      return SAMLAuthCredential._create(providerId, pendingToken);
    } catch (e) {
      return null;
    }
  }
};
var TwitterAuthProvider = class _TwitterAuthProvider extends BaseOAuthProvider {
  constructor() {
    super(
      "twitter.com"
      /* ProviderId.TWITTER */
    );
  }
  /**
   * Creates a credential for Twitter.
   *
   * @param token - Twitter access token.
   * @param secret - Twitter secret.
   */
  static credential(token, secret) {
    return OAuthCredential._fromParams({
      providerId: _TwitterAuthProvider.PROVIDER_ID,
      signInMethod: _TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
      oauthToken: token,
      oauthTokenSecret: secret
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _TwitterAuthProvider.credentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({
    _tokenResponse: tokenResponse
  }) {
    if (!tokenResponse) {
      return null;
    }
    const {
      oauthAccessToken,
      oauthTokenSecret
    } = tokenResponse;
    if (!oauthAccessToken || !oauthTokenSecret) {
      return null;
    }
    try {
      return _TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
    } catch (_a) {
      return null;
    }
  }
};
TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
TwitterAuthProvider.PROVIDER_ID = "twitter.com";
function signUp(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signUp", _addTidIfNecessary(auth, request));
  });
}
var UserCredentialImpl = class _UserCredentialImpl {
  constructor(params) {
    this.user = params.user;
    this.providerId = params.providerId;
    this._tokenResponse = params._tokenResponse;
    this.operationType = params.operationType;
  }
  static _fromIdTokenResponse(auth, operationType, idTokenResponse, isAnonymous = false) {
    return __async(this, null, function* () {
      const user = yield UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous);
      const providerId = providerIdForResponse(idTokenResponse);
      const userCred = new _UserCredentialImpl({
        user,
        providerId,
        _tokenResponse: idTokenResponse,
        operationType
      });
      return userCred;
    });
  }
  static _forOperation(user, operationType, response) {
    return __async(this, null, function* () {
      yield user._updateTokensIfNecessary(
        response,
        /* reload */
        true
      );
      const providerId = providerIdForResponse(response);
      return new _UserCredentialImpl({
        user,
        providerId,
        _tokenResponse: response,
        operationType
      });
    });
  }
};
function providerIdForResponse(response) {
  if (response.providerId) {
    return response.providerId;
  }
  if ("phoneNumber" in response) {
    return "phone";
  }
  return null;
}
function signInAnonymously(auth) {
  return __async(this, null, function* () {
    var _a;
    if (_isFirebaseServerApp(auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = _castAuth(auth);
    yield authInternal._initializationPromise;
    if ((_a = authInternal.currentUser) === null || _a === void 0 ? void 0 : _a.isAnonymous) {
      return new UserCredentialImpl({
        user: authInternal.currentUser,
        providerId: null,
        operationType: "signIn"
        /* OperationType.SIGN_IN */
      });
    }
    const response = yield signUp(authInternal, {
      returnSecureToken: true
    });
    const userCredential = yield UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response, true);
    yield authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
  });
}
var MultiFactorError = class _MultiFactorError extends FirebaseError {
  constructor(auth, error, operationType, user) {
    var _a;
    super(error.code, error.message);
    this.operationType = operationType;
    this.user = user;
    Object.setPrototypeOf(this, _MultiFactorError.prototype);
    this.customData = {
      appName: auth.name,
      tenantId: (_a = auth.tenantId) !== null && _a !== void 0 ? _a : void 0,
      _serverResponse: error.customData._serverResponse,
      operationType
    };
  }
  static _fromErrorAndOperation(auth, error, operationType, user) {
    return new _MultiFactorError(auth, error, operationType, user);
  }
};
function _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user) {
  const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth) : credential._getIdTokenResponse(auth);
  return idTokenProvider.catch((error) => {
    if (error.code === `auth/${"multi-factor-auth-required"}`) {
      throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user);
    }
    throw error;
  });
}
function providerDataAsNames(providerData) {
  return new Set(providerData.map(({
    providerId
  }) => providerId).filter((pid) => !!pid));
}
function unlink(user, providerId) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user);
    yield _assertLinkedStatus(true, userInternal, providerId);
    const {
      providerUserInfo
    } = yield deleteLinkedAccounts(userInternal.auth, {
      idToken: yield userInternal.getIdToken(),
      deleteProvider: [providerId]
    });
    const providersLeft = providerDataAsNames(providerUserInfo || []);
    userInternal.providerData = userInternal.providerData.filter((pd) => providersLeft.has(pd.providerId));
    if (!providersLeft.has(
      "phone"
      /* ProviderId.PHONE */
    )) {
      userInternal.phoneNumber = null;
    }
    yield userInternal.auth._persistUserIfCurrent(userInternal);
    return userInternal;
  });
}
function _link(user, credential, bypassAuthState = false) {
  return __async(this, null, function* () {
    const response = yield _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, yield user.getIdToken()), bypassAuthState);
    return UserCredentialImpl._forOperation(user, "link", response);
  });
}
function _assertLinkedStatus(expected, user, provider) {
  return __async(this, null, function* () {
    yield _reloadWithoutSaving(user);
    const providerIds = providerDataAsNames(user.providerData);
    const code = expected === false ? "provider-already-linked" : "no-such-provider";
    _assert(providerIds.has(provider) === expected, user.auth, code);
  });
}
function _reauthenticate(user, credential, bypassAuthState = false) {
  return __async(this, null, function* () {
    const {
      auth
    } = user;
    if (_isFirebaseServerApp(auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const operationType = "reauthenticate";
    try {
      const response = yield _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user), bypassAuthState);
      _assert(
        response.idToken,
        auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const parsed = _parseToken(response.idToken);
      _assert(
        parsed,
        auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const {
        sub: localId
      } = parsed;
      _assert(
        user.uid === localId,
        auth,
        "user-mismatch"
        /* AuthErrorCode.USER_MISMATCH */
      );
      return UserCredentialImpl._forOperation(user, operationType, response);
    } catch (e) {
      if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"user-not-found"}`) {
        _fail(
          auth,
          "user-mismatch"
          /* AuthErrorCode.USER_MISMATCH */
        );
      }
      throw e;
    }
  });
}
function _signInWithCredential(auth, credential, bypassAuthState = false) {
  return __async(this, null, function* () {
    if (_isFirebaseServerApp(auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const operationType = "signIn";
    const response = yield _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential);
    const userCredential = yield UserCredentialImpl._fromIdTokenResponse(auth, operationType, response);
    if (!bypassAuthState) {
      yield auth._updateCurrentUser(userCredential.user);
    }
    return userCredential;
  });
}
function signInWithCredential(auth, credential) {
  return __async(this, null, function* () {
    return _signInWithCredential(_castAuth(auth), credential);
  });
}
function linkWithCredential(user, credential) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user);
    yield _assertLinkedStatus(false, userInternal, credential.providerId);
    return _link(userInternal, credential);
  });
}
function reauthenticateWithCredential(user, credential) {
  return __async(this, null, function* () {
    return _reauthenticate(getModularInstance(user), credential);
  });
}
function signInWithCustomToken$1(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithCustomToken", _addTidIfNecessary(auth, request));
  });
}
function signInWithCustomToken(auth, customToken) {
  return __async(this, null, function* () {
    if (_isFirebaseServerApp(auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = _castAuth(auth);
    const response = yield signInWithCustomToken$1(authInternal, {
      token: customToken,
      returnSecureToken: true
    });
    const cred = yield UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
    yield authInternal._updateCurrentUser(cred.user);
    return cred;
  });
}
var MultiFactorInfoImpl = class {
  constructor(factorId, response) {
    this.factorId = factorId;
    this.uid = response.mfaEnrollmentId;
    this.enrollmentTime = new Date(response.enrolledAt).toUTCString();
    this.displayName = response.displayName;
  }
  static _fromServerResponse(auth, enrollment) {
    if ("phoneInfo" in enrollment) {
      return PhoneMultiFactorInfoImpl._fromServerResponse(auth, enrollment);
    } else if ("totpInfo" in enrollment) {
      return TotpMultiFactorInfoImpl._fromServerResponse(auth, enrollment);
    }
    return _fail(
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
  }
};
var PhoneMultiFactorInfoImpl = class _PhoneMultiFactorInfoImpl extends MultiFactorInfoImpl {
  constructor(response) {
    super("phone", response);
    this.phoneNumber = response.phoneInfo;
  }
  static _fromServerResponse(_auth, enrollment) {
    return new _PhoneMultiFactorInfoImpl(enrollment);
  }
};
var TotpMultiFactorInfoImpl = class _TotpMultiFactorInfoImpl extends MultiFactorInfoImpl {
  constructor(response) {
    super("totp", response);
  }
  static _fromServerResponse(_auth, enrollment) {
    return new _TotpMultiFactorInfoImpl(enrollment);
  }
};
function _setActionCodeSettingsOnRequest(auth, request, actionCodeSettings) {
  var _a;
  _assert(
    ((_a = actionCodeSettings.url) === null || _a === void 0 ? void 0 : _a.length) > 0,
    auth,
    "invalid-continue-uri"
    /* AuthErrorCode.INVALID_CONTINUE_URI */
  );
  _assert(
    typeof actionCodeSettings.dynamicLinkDomain === "undefined" || actionCodeSettings.dynamicLinkDomain.length > 0,
    auth,
    "invalid-dynamic-link-domain"
    /* AuthErrorCode.INVALID_DYNAMIC_LINK_DOMAIN */
  );
  _assert(
    typeof actionCodeSettings.linkDomain === "undefined" || actionCodeSettings.linkDomain.length > 0,
    auth,
    "invalid-hosting-link-domain"
    /* AuthErrorCode.INVALID_HOSTING_LINK_DOMAIN */
  );
  request.continueUrl = actionCodeSettings.url;
  request.dynamicLinkDomain = actionCodeSettings.dynamicLinkDomain;
  request.linkDomain = actionCodeSettings.linkDomain;
  request.canHandleCodeInApp = actionCodeSettings.handleCodeInApp;
  if (actionCodeSettings.iOS) {
    _assert(
      actionCodeSettings.iOS.bundleId.length > 0,
      auth,
      "missing-ios-bundle-id"
      /* AuthErrorCode.MISSING_IOS_BUNDLE_ID */
    );
    request.iOSBundleId = actionCodeSettings.iOS.bundleId;
  }
  if (actionCodeSettings.android) {
    _assert(
      actionCodeSettings.android.packageName.length > 0,
      auth,
      "missing-android-pkg-name"
      /* AuthErrorCode.MISSING_ANDROID_PACKAGE_NAME */
    );
    request.androidInstallApp = actionCodeSettings.android.installApp;
    request.androidMinimumVersionCode = actionCodeSettings.android.minimumVersion;
    request.androidPackageName = actionCodeSettings.android.packageName;
  }
}
function recachePasswordPolicy(auth) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    if (authInternal._getPasswordPolicyInternal()) {
      yield authInternal._updatePasswordPolicy();
    }
  });
}
function sendPasswordResetEmail(auth, email, actionCodeSettings) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const request = {
      requestType: "PASSWORD_RESET",
      email,
      clientType: "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    };
    if (actionCodeSettings) {
      _setActionCodeSettingsOnRequest(authInternal, request, actionCodeSettings);
    }
    yield handleRecaptchaFlow(
      authInternal,
      request,
      "getOobCode",
      sendPasswordResetEmail$1,
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
    );
  });
}
function confirmPasswordReset(auth, oobCode, newPassword) {
  return __async(this, null, function* () {
    yield resetPassword(getModularInstance(auth), {
      oobCode,
      newPassword
    }).catch((error) => __async(this, null, function* () {
      if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
        void recachePasswordPolicy(auth);
      }
      throw error;
    }));
  });
}
function applyActionCode(auth, oobCode) {
  return __async(this, null, function* () {
    yield applyActionCode$1(getModularInstance(auth), {
      oobCode
    });
  });
}
function checkActionCode(auth, oobCode) {
  return __async(this, null, function* () {
    const authModular = getModularInstance(auth);
    const response = yield resetPassword(authModular, {
      oobCode
    });
    const operation = response.requestType;
    _assert(
      operation,
      authModular,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    switch (operation) {
      case "EMAIL_SIGNIN":
        break;
      case "VERIFY_AND_CHANGE_EMAIL":
        _assert(
          response.newEmail,
          authModular,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        break;
      case "REVERT_SECOND_FACTOR_ADDITION":
        _assert(
          response.mfaInfo,
          authModular,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
      // fall through
      default:
        _assert(
          response.email,
          authModular,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
    }
    let multiFactorInfo = null;
    if (response.mfaInfo) {
      multiFactorInfo = MultiFactorInfoImpl._fromServerResponse(_castAuth(authModular), response.mfaInfo);
    }
    return {
      data: {
        email: (response.requestType === "VERIFY_AND_CHANGE_EMAIL" ? response.newEmail : response.email) || null,
        previousEmail: (response.requestType === "VERIFY_AND_CHANGE_EMAIL" ? response.email : response.newEmail) || null,
        multiFactorInfo
      },
      operation
    };
  });
}
function verifyPasswordResetCode(auth, code) {
  return __async(this, null, function* () {
    const {
      data
    } = yield checkActionCode(getModularInstance(auth), code);
    return data.email;
  });
}
function createUserWithEmailAndPassword(auth, email, password) {
  return __async(this, null, function* () {
    if (_isFirebaseServerApp(auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = _castAuth(auth);
    const request = {
      returnSecureToken: true,
      email,
      password,
      clientType: "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    };
    const signUpResponse = handleRecaptchaFlow(
      authInternal,
      request,
      "signUpPassword",
      signUp,
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
    );
    const response = yield signUpResponse.catch((error) => {
      if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
        void recachePasswordPolicy(auth);
      }
      throw error;
    });
    const userCredential = yield UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
    yield authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
  });
}
function signInWithEmailAndPassword(auth, email, password) {
  if (_isFirebaseServerApp(auth.app)) {
    return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
  }
  return signInWithCredential(getModularInstance(auth), EmailAuthProvider.credential(email, password)).catch((error) => __async(this, null, function* () {
    if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
      void recachePasswordPolicy(auth);
    }
    throw error;
  }));
}
function sendSignInLinkToEmail(auth, email, actionCodeSettings) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const request = {
      requestType: "EMAIL_SIGNIN",
      email,
      clientType: "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    };
    function setActionCodeSettings(request2, actionCodeSettings2) {
      _assert(
        actionCodeSettings2.handleCodeInApp,
        authInternal,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      if (actionCodeSettings2) {
        _setActionCodeSettingsOnRequest(authInternal, request2, actionCodeSettings2);
      }
    }
    setActionCodeSettings(request, actionCodeSettings);
    yield handleRecaptchaFlow(
      authInternal,
      request,
      "getOobCode",
      sendSignInLinkToEmail$1,
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
    );
  });
}
function isSignInWithEmailLink(auth, emailLink) {
  const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
  return (actionCodeUrl === null || actionCodeUrl === void 0 ? void 0 : actionCodeUrl.operation) === "EMAIL_SIGNIN";
}
function signInWithEmailLink(auth, email, emailLink) {
  return __async(this, null, function* () {
    if (_isFirebaseServerApp(auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authModular = getModularInstance(auth);
    const credential = EmailAuthProvider.credentialWithLink(email, emailLink || _getCurrentUrl());
    _assert(
      credential._tenantId === (authModular.tenantId || null),
      authModular,
      "tenant-id-mismatch"
      /* AuthErrorCode.TENANT_ID_MISMATCH */
    );
    return signInWithCredential(authModular, credential);
  });
}
function createAuthUri(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:createAuthUri", _addTidIfNecessary(auth, request));
  });
}
function fetchSignInMethodsForEmail(auth, email) {
  return __async(this, null, function* () {
    const continueUri = _isHttpOrHttps() ? _getCurrentUrl() : "http://localhost";
    const request = {
      identifier: email,
      continueUri
    };
    const {
      signinMethods
    } = yield createAuthUri(getModularInstance(auth), request);
    return signinMethods || [];
  });
}
function sendEmailVerification(user, actionCodeSettings) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user);
    const idToken = yield user.getIdToken();
    const request = {
      requestType: "VERIFY_EMAIL",
      idToken
    };
    if (actionCodeSettings) {
      _setActionCodeSettingsOnRequest(userInternal.auth, request, actionCodeSettings);
    }
    const {
      email
    } = yield sendEmailVerification$1(userInternal.auth, request);
    if (email !== user.email) {
      yield user.reload();
    }
  });
}
function verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user);
    const idToken = yield user.getIdToken();
    const request = {
      requestType: "VERIFY_AND_CHANGE_EMAIL",
      idToken,
      newEmail
    };
    if (actionCodeSettings) {
      _setActionCodeSettingsOnRequest(userInternal.auth, request, actionCodeSettings);
    }
    const {
      email
    } = yield verifyAndChangeEmail(userInternal.auth, request);
    if (email !== user.email) {
      yield user.reload();
    }
  });
}
function updateProfile$1(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  });
}
function updateProfile(_0, _1) {
  return __async(this, arguments, function* (user, {
    displayName,
    photoURL: photoUrl
  }) {
    if (displayName === void 0 && photoUrl === void 0) {
      return;
    }
    const userInternal = getModularInstance(user);
    const idToken = yield userInternal.getIdToken();
    const profileRequest = {
      idToken,
      displayName,
      photoUrl,
      returnSecureToken: true
    };
    const response = yield _logoutIfInvalidated(userInternal, updateProfile$1(userInternal.auth, profileRequest));
    userInternal.displayName = response.displayName || null;
    userInternal.photoURL = response.photoUrl || null;
    const passwordProvider = userInternal.providerData.find(
      ({
        providerId
      }) => providerId === "password"
      /* ProviderId.PASSWORD */
    );
    if (passwordProvider) {
      passwordProvider.displayName = userInternal.displayName;
      passwordProvider.photoURL = userInternal.photoURL;
    }
    yield userInternal._updateTokensIfNecessary(response);
  });
}
function updateEmail(user, newEmail) {
  const userInternal = getModularInstance(user);
  if (_isFirebaseServerApp(userInternal.auth.app)) {
    return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(userInternal.auth));
  }
  return updateEmailOrPassword(userInternal, newEmail, null);
}
function updatePassword(user, newPassword) {
  return updateEmailOrPassword(getModularInstance(user), null, newPassword);
}
function updateEmailOrPassword(user, email, password) {
  return __async(this, null, function* () {
    const {
      auth
    } = user;
    const idToken = yield user.getIdToken();
    const request = {
      idToken,
      returnSecureToken: true
    };
    if (email) {
      request.email = email;
    }
    if (password) {
      request.password = password;
    }
    const response = yield _logoutIfInvalidated(user, updateEmailPassword(auth, request));
    yield user._updateTokensIfNecessary(
      response,
      /* reload */
      true
    );
  });
}
function _fromIdTokenResponse(idTokenResponse) {
  var _a, _b;
  if (!idTokenResponse) {
    return null;
  }
  const {
    providerId
  } = idTokenResponse;
  const profile = idTokenResponse.rawUserInfo ? JSON.parse(idTokenResponse.rawUserInfo) : {};
  const isNewUser = idTokenResponse.isNewUser || idTokenResponse.kind === "identitytoolkit#SignupNewUserResponse";
  if (!providerId && (idTokenResponse === null || idTokenResponse === void 0 ? void 0 : idTokenResponse.idToken)) {
    const signInProvider = (_b = (_a = _parseToken(idTokenResponse.idToken)) === null || _a === void 0 ? void 0 : _a.firebase) === null || _b === void 0 ? void 0 : _b["sign_in_provider"];
    if (signInProvider) {
      const filteredProviderId = signInProvider !== "anonymous" && signInProvider !== "custom" ? signInProvider : null;
      return new GenericAdditionalUserInfo(isNewUser, filteredProviderId);
    }
  }
  if (!providerId) {
    return null;
  }
  switch (providerId) {
    case "facebook.com":
      return new FacebookAdditionalUserInfo(isNewUser, profile);
    case "github.com":
      return new GithubAdditionalUserInfo(isNewUser, profile);
    case "google.com":
      return new GoogleAdditionalUserInfo(isNewUser, profile);
    case "twitter.com":
      return new TwitterAdditionalUserInfo(isNewUser, profile, idTokenResponse.screenName || null);
    case "custom":
    case "anonymous":
      return new GenericAdditionalUserInfo(isNewUser, null);
    default:
      return new GenericAdditionalUserInfo(isNewUser, providerId, profile);
  }
}
var GenericAdditionalUserInfo = class {
  constructor(isNewUser, providerId, profile = {}) {
    this.isNewUser = isNewUser;
    this.providerId = providerId;
    this.profile = profile;
  }
};
var FederatedAdditionalUserInfoWithUsername = class extends GenericAdditionalUserInfo {
  constructor(isNewUser, providerId, profile, username) {
    super(isNewUser, providerId, profile);
    this.username = username;
  }
};
var FacebookAdditionalUserInfo = class extends GenericAdditionalUserInfo {
  constructor(isNewUser, profile) {
    super(isNewUser, "facebook.com", profile);
  }
};
var GithubAdditionalUserInfo = class extends FederatedAdditionalUserInfoWithUsername {
  constructor(isNewUser, profile) {
    super(isNewUser, "github.com", profile, typeof (profile === null || profile === void 0 ? void 0 : profile.login) === "string" ? profile === null || profile === void 0 ? void 0 : profile.login : null);
  }
};
var GoogleAdditionalUserInfo = class extends GenericAdditionalUserInfo {
  constructor(isNewUser, profile) {
    super(isNewUser, "google.com", profile);
  }
};
var TwitterAdditionalUserInfo = class extends FederatedAdditionalUserInfoWithUsername {
  constructor(isNewUser, profile, screenName) {
    super(isNewUser, "twitter.com", profile, screenName);
  }
};
function getAdditionalUserInfo(userCredential) {
  const {
    user,
    _tokenResponse
  } = userCredential;
  if (user.isAnonymous && !_tokenResponse) {
    return {
      providerId: null,
      isNewUser: false,
      profile: null
    };
  }
  return _fromIdTokenResponse(_tokenResponse);
}
var MultiFactorSessionImpl = class _MultiFactorSessionImpl {
  constructor(type, credential, user) {
    this.type = type;
    this.credential = credential;
    this.user = user;
  }
  static _fromIdtoken(idToken, user) {
    return new _MultiFactorSessionImpl("enroll", idToken, user);
  }
  static _fromMfaPendingCredential(mfaPendingCredential) {
    return new _MultiFactorSessionImpl("signin", mfaPendingCredential);
  }
  toJSON() {
    const key = this.type === "enroll" ? "idToken" : "pendingCredential";
    return {
      multiFactorSession: {
        [key]: this.credential
      }
    };
  }
  static fromJSON(obj) {
    var _a, _b;
    if (obj === null || obj === void 0 ? void 0 : obj.multiFactorSession) {
      if ((_a = obj.multiFactorSession) === null || _a === void 0 ? void 0 : _a.pendingCredential) {
        return _MultiFactorSessionImpl._fromMfaPendingCredential(obj.multiFactorSession.pendingCredential);
      } else if ((_b = obj.multiFactorSession) === null || _b === void 0 ? void 0 : _b.idToken) {
        return _MultiFactorSessionImpl._fromIdtoken(obj.multiFactorSession.idToken);
      }
    }
    return null;
  }
};
var MultiFactorResolverImpl = class _MultiFactorResolverImpl {
  constructor(session, hints, signInResolver) {
    this.session = session;
    this.hints = hints;
    this.signInResolver = signInResolver;
  }
  /** @internal */
  static _fromError(authExtern, error) {
    const auth = _castAuth(authExtern);
    const serverResponse = error.customData._serverResponse;
    const hints = (serverResponse.mfaInfo || []).map((enrollment) => MultiFactorInfoImpl._fromServerResponse(auth, enrollment));
    _assert(
      serverResponse.mfaPendingCredential,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const session = MultiFactorSessionImpl._fromMfaPendingCredential(serverResponse.mfaPendingCredential);
    return new _MultiFactorResolverImpl(session, hints, (assertion) => __async(this, null, function* () {
      const mfaResponse = yield assertion._process(auth, session);
      delete serverResponse.mfaInfo;
      delete serverResponse.mfaPendingCredential;
      const idTokenResponse = Object.assign(Object.assign({}, serverResponse), {
        idToken: mfaResponse.idToken,
        refreshToken: mfaResponse.refreshToken
      });
      switch (error.operationType) {
        case "signIn":
          const userCredential = yield UserCredentialImpl._fromIdTokenResponse(auth, error.operationType, idTokenResponse);
          yield auth._updateCurrentUser(userCredential.user);
          return userCredential;
        case "reauthenticate":
          _assert(
            error.user,
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          return UserCredentialImpl._forOperation(error.user, error.operationType, idTokenResponse);
        default:
          _fail(
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }));
  }
  resolveSignIn(assertionExtern) {
    return __async(this, null, function* () {
      const assertion = assertionExtern;
      return this.signInResolver(assertion);
    });
  }
};
function getMultiFactorResolver(auth, error) {
  var _a;
  const authModular = getModularInstance(auth);
  const errorInternal = error;
  _assert(
    error.customData.operationType,
    authModular,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  _assert(
    (_a = errorInternal.customData._serverResponse) === null || _a === void 0 ? void 0 : _a.mfaPendingCredential,
    authModular,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  return MultiFactorResolverImpl._fromError(authModular, errorInternal);
}
function startEnrollTotpMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
}
function finalizeEnrollTotpMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
}
function withdrawMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:withdraw", _addTidIfNecessary(auth, request));
}
var MultiFactorUserImpl = class _MultiFactorUserImpl {
  constructor(user) {
    this.user = user;
    this.enrolledFactors = [];
    user._onReload((userInfo) => {
      if (userInfo.mfaInfo) {
        this.enrolledFactors = userInfo.mfaInfo.map((enrollment) => MultiFactorInfoImpl._fromServerResponse(user.auth, enrollment));
      }
    });
  }
  static _fromUser(user) {
    return new _MultiFactorUserImpl(user);
  }
  getSession() {
    return __async(this, null, function* () {
      return MultiFactorSessionImpl._fromIdtoken(yield this.user.getIdToken(), this.user);
    });
  }
  enroll(assertionExtern, displayName) {
    return __async(this, null, function* () {
      const assertion = assertionExtern;
      const session = yield this.getSession();
      const finalizeMfaResponse = yield _logoutIfInvalidated(this.user, assertion._process(this.user.auth, session, displayName));
      yield this.user._updateTokensIfNecessary(finalizeMfaResponse);
      return this.user.reload();
    });
  }
  unenroll(infoOrUid) {
    return __async(this, null, function* () {
      const mfaEnrollmentId = typeof infoOrUid === "string" ? infoOrUid : infoOrUid.uid;
      const idToken = yield this.user.getIdToken();
      try {
        const idTokenResponse = yield _logoutIfInvalidated(this.user, withdrawMfa(this.user.auth, {
          idToken,
          mfaEnrollmentId
        }));
        this.enrolledFactors = this.enrolledFactors.filter(({
          uid
        }) => uid !== mfaEnrollmentId);
        yield this.user._updateTokensIfNecessary(idTokenResponse);
        yield this.user.reload();
      } catch (e) {
        throw e;
      }
    });
  }
};
var multiFactorUserCache = /* @__PURE__ */ new WeakMap();
function multiFactor(user) {
  const userModular = getModularInstance(user);
  if (!multiFactorUserCache.has(userModular)) {
    multiFactorUserCache.set(userModular, MultiFactorUserImpl._fromUser(userModular));
  }
  return multiFactorUserCache.get(userModular);
}
var name2 = "@firebase/auth";
var version2 = "1.9.1";
var AuthInterop = class {
  constructor(auth) {
    this.auth = auth;
    this.internalListeners = /* @__PURE__ */ new Map();
  }
  getUid() {
    var _a;
    this.assertAuthConfigured();
    return ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || null;
  }
  getToken(forceRefresh) {
    return __async(this, null, function* () {
      this.assertAuthConfigured();
      yield this.auth._initializationPromise;
      if (!this.auth.currentUser) {
        return null;
      }
      const accessToken = yield this.auth.currentUser.getIdToken(forceRefresh);
      return {
        accessToken
      };
    });
  }
  addAuthTokenListener(listener) {
    this.assertAuthConfigured();
    if (this.internalListeners.has(listener)) {
      return;
    }
    const unsubscribe = this.auth.onIdTokenChanged((user) => {
      listener((user === null || user === void 0 ? void 0 : user.stsTokenManager.accessToken) || null);
    });
    this.internalListeners.set(listener, unsubscribe);
    this.updateProactiveRefresh();
  }
  removeAuthTokenListener(listener) {
    this.assertAuthConfigured();
    const unsubscribe = this.internalListeners.get(listener);
    if (!unsubscribe) {
      return;
    }
    this.internalListeners.delete(listener);
    unsubscribe();
    this.updateProactiveRefresh();
  }
  assertAuthConfigured() {
    _assert(
      this.auth._initializationPromise,
      "dependent-sdk-initialized-before-auth"
      /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
    );
  }
  updateProactiveRefresh() {
    if (this.internalListeners.size > 0) {
      this.auth._startProactiveRefresh();
    } else {
      this.auth._stopProactiveRefresh();
    }
  }
};
function getVersionForPlatform(clientPlatform) {
  switch (clientPlatform) {
    case "Node":
      return "node";
    case "ReactNative":
      return "rn";
    case "Worker":
      return "webworker";
    case "Cordova":
      return "cordova";
    case "WebExtension":
      return "web-extension";
    default:
      return void 0;
  }
}
function registerAuth(clientPlatform) {
  _registerComponent(new Component(
    "auth",
    (container, {
      options: deps
    }) => {
      const app = container.getProvider("app").getImmediate();
      const heartbeatServiceProvider = container.getProvider("heartbeat");
      const appCheckServiceProvider = container.getProvider("app-check-internal");
      const {
        apiKey,
        authDomain
      } = app.options;
      _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", {
        appName: app.name
      });
      const config = {
        apiKey,
        authDomain,
        clientPlatform,
        apiHost: "identitytoolkit.googleapis.com",
        tokenApiHost: "securetoken.googleapis.com",
        apiScheme: "https",
        sdkClientVersion: _getClientVersion(clientPlatform)
      };
      const authInstance = new AuthImpl(app, heartbeatServiceProvider, appCheckServiceProvider, config);
      _initializeAuthInstance(authInstance, deps);
      return authInstance;
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  ).setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
    const authInternalProvider = container.getProvider(
      "auth-internal"
      /* _ComponentName.AUTH_INTERNAL */
    );
    authInternalProvider.initialize();
  }));
  _registerComponent(new Component(
    "auth-internal",
    (container) => {
      const auth = _castAuth(container.getProvider(
        "auth"
        /* _ComponentName.AUTH */
      ).getImmediate());
      return ((auth2) => new AuthInterop(auth2))(auth);
    },
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  ));
  registerVersion(name2, version2, getVersionForPlatform(clientPlatform));
  registerVersion(name2, version2, "esm2017");
}
FetchProvider.initialize(fetch, Headers, Response);
registerAuth(
  "Node"
  /* ClientPlatform.NODE */
);
var NOT_AVAILABLE_ERROR = _createError(
  "operation-not-supported-in-this-environment"
  /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
);
function fail() {
  return __async(this, null, function* () {
    throw NOT_AVAILABLE_ERROR;
  });
}
var FailClass = class {
  constructor() {
    throw NOT_AVAILABLE_ERROR;
  }
};
var browserLocalPersistence = inMemoryPersistence;
var browserSessionPersistence = inMemoryPersistence;
var indexedDBLocalPersistence = inMemoryPersistence;
var browserPopupRedirectResolver = NOT_AVAILABLE_ERROR;
var PhoneAuthProvider = FailClass;
var signInWithPhoneNumber = fail;
var linkWithPhoneNumber = fail;
var reauthenticateWithPhoneNumber = fail;
var updatePhoneNumber = fail;
var signInWithPopup = fail;
var linkWithPopup = fail;
var reauthenticateWithPopup = fail;
var signInWithRedirect = fail;
var linkWithRedirect = fail;
var reauthenticateWithRedirect = fail;
var getRedirectResult = fail;
var RecaptchaVerifier = FailClass;
var PhoneMultiFactorGenerator = class {
  static assertion() {
    throw NOT_AVAILABLE_ERROR;
  }
};
AuthImpl.prototype.setPersistence = () => __async(void 0, null, function* () {
});
function finalizeSignInTotpMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
}
var MultiFactorAssertionImpl = class {
  constructor(factorId) {
    this.factorId = factorId;
  }
  _process(auth, session, displayName) {
    switch (session.type) {
      case "enroll":
        return this._finalizeEnroll(auth, session.credential, displayName);
      case "signin":
        return this._finalizeSignIn(auth, session.credential);
      default:
        return debugFail("unexpected MultiFactorSessionType");
    }
  }
};
var TotpMultiFactorGenerator = class {
  /**
   * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
   * the TOTP (time-based one-time password) second factor.
   * This assertion is used to complete enrollment in TOTP second factor.
   *
   * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
   * @param oneTimePassword One-time password from TOTP App.
   * @returns A {@link TotpMultiFactorAssertion} which can be used with
   * {@link MultiFactorUser.enroll}.
   */
  static assertionForEnrollment(secret, oneTimePassword) {
    return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
  }
  /**
   * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
   * This assertion is used to complete signIn with TOTP as the second factor.
   *
   * @param enrollmentId identifies the enrolled TOTP second factor.
   * @param oneTimePassword One-time password from TOTP App.
   * @returns A {@link TotpMultiFactorAssertion} which can be used with
   * {@link MultiFactorResolver.resolveSignIn}.
   */
  static assertionForSignIn(enrollmentId, oneTimePassword) {
    return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
  }
  /**
   * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
   * Creates a TOTP secret as part of enrolling a TOTP second factor.
   * Used for generating a QR code URL or inputting into a TOTP app.
   * This method uses the auth instance corresponding to the user in the multiFactorSession.
   *
   * @param session The {@link MultiFactorSession} that the user is part of.
   * @returns A promise to {@link TotpSecret}.
   */
  static generateSecret(session) {
    return __async(this, null, function* () {
      var _a;
      const mfaSession = session;
      _assert(
        typeof ((_a = mfaSession.user) === null || _a === void 0 ? void 0 : _a.auth) !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const response = yield startEnrollTotpMfa(mfaSession.user.auth, {
        idToken: mfaSession.credential,
        totpEnrollmentInfo: {}
      });
      return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
    });
  }
};
TotpMultiFactorGenerator.FACTOR_ID = "totp";
var TotpMultiFactorAssertionImpl = class _TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
  constructor(otp, enrollmentId, secret) {
    super(
      "totp"
      /* FactorId.TOTP */
    );
    this.otp = otp;
    this.enrollmentId = enrollmentId;
    this.secret = secret;
  }
  /** @internal */
  static _fromSecret(secret, otp) {
    return new _TotpMultiFactorAssertionImpl(otp, void 0, secret);
  }
  /** @internal */
  static _fromEnrollmentId(enrollmentId, otp) {
    return new _TotpMultiFactorAssertionImpl(otp, enrollmentId);
  }
  /** @internal */
  _finalizeEnroll(auth, idToken, displayName) {
    return __async(this, null, function* () {
      _assert(
        typeof this.secret !== "undefined",
        auth,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      return finalizeEnrollTotpMfa(auth, {
        idToken,
        displayName,
        totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
      });
    });
  }
  /** @internal */
  _finalizeSignIn(auth, mfaPendingCredential) {
    return __async(this, null, function* () {
      _assert(
        this.enrollmentId !== void 0 && this.otp !== void 0,
        auth,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      const totpVerificationInfo = {
        verificationCode: this.otp
      };
      return finalizeSignInTotpMfa(auth, {
        mfaPendingCredential,
        mfaEnrollmentId: this.enrollmentId,
        totpVerificationInfo
      });
    });
  }
};
var TotpSecret = class _TotpSecret {
  // The public members are declared outside the constructor so the docs can be generated.
  constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth) {
    this.sessionInfo = sessionInfo;
    this.auth = auth;
    this.secretKey = secretKey;
    this.hashingAlgorithm = hashingAlgorithm;
    this.codeLength = codeLength;
    this.codeIntervalSeconds = codeIntervalSeconds;
    this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
  }
  /** @internal */
  static _fromStartTotpMfaEnrollmentResponse(response, auth) {
    return new _TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth);
  }
  /** @internal */
  _makeTotpVerificationInfo(otp) {
    return {
      sessionInfo: this.sessionInfo,
      verificationCode: otp
    };
  }
  /**
   * Returns a QR code URL as described in
   * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
   * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
   * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
   *
   * @param accountName the name of the account/app along with a user identifier.
   * @param issuer issuer of the TOTP (likely the app name).
   * @returns A QR code URL string.
   */
  generateQrCodeUrl(accountName, issuer) {
    var _a;
    let useDefaults = false;
    if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
      useDefaults = true;
    }
    if (useDefaults) {
      if (_isEmptyString(accountName)) {
        accountName = ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.email) || "unknownuser";
      }
      if (_isEmptyString(issuer)) {
        issuer = this.auth.name;
      }
    }
    return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
  }
};
function _isEmptyString(input) {
  return typeof input === "undefined" || (input === null || input === void 0 ? void 0 : input.length) === 0;
}

// node_modules/@firebase/auth-compat/node_modules/@firebase/auth/dist/node-esm/internal.js
function _generateEventId(prefix = "", digits = 10) {
  let random = "";
  for (let i = 0; i < digits; i++) {
    random += Math.floor(Math.random() * 10);
  }
  return prefix + random;
}
function _withDefaultResolver(auth, resolverOverride) {
  if (resolverOverride) {
    return _getInstance(resolverOverride);
  }
  _assert(
    auth._popupRedirectResolver,
    auth,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  return auth._popupRedirectResolver;
}
var IdpCredential = class extends AuthCredential {
  constructor(params) {
    super(
      "custom",
      "custom"
      /* ProviderId.CUSTOM */
    );
    this.params = params;
  }
  _getIdTokenResponse(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _linkToIdToken(auth, idToken) {
    return signInWithIdp(auth, this._buildIdpRequest(idToken));
  }
  _getReauthenticationResolver(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _buildIdpRequest(idToken) {
    const request = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: true,
      returnIdpCredential: true
    };
    if (idToken) {
      request.idToken = idToken;
    }
    return request;
  }
};
function _signIn(params) {
  return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
  const {
    auth,
    user
  } = params;
  _assert(
    user,
    auth,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
function _link2(params) {
  return __async(this, null, function* () {
    const {
      auth,
      user
    } = params;
    _assert(
      user,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _link(user, new IdpCredential(params), params.bypassAuthState);
  });
}
var AbstractPopupRedirectOperation = class {
  constructor(auth, filter, resolver, user, bypassAuthState = false) {
    this.auth = auth;
    this.resolver = resolver;
    this.user = user;
    this.bypassAuthState = bypassAuthState;
    this.pendingPromise = null;
    this.eventManager = null;
    this.filter = Array.isArray(filter) ? filter : [filter];
  }
  execute() {
    return new Promise((resolve, reject) => __async(this, null, function* () {
      this.pendingPromise = {
        resolve,
        reject
      };
      try {
        this.eventManager = yield this.resolver._initialize(this.auth);
        yield this.onExecution();
        this.eventManager.registerConsumer(this);
      } catch (e) {
        this.reject(e);
      }
    }));
  }
  onAuthEvent(event) {
    return __async(this, null, function* () {
      const {
        urlResponse,
        sessionId,
        postBody,
        tenantId,
        error,
        type
      } = event;
      if (error) {
        this.reject(error);
        return;
      }
      const params = {
        auth: this.auth,
        requestUri: urlResponse,
        sessionId,
        tenantId: tenantId || void 0,
        postBody: postBody || void 0,
        user: this.user,
        bypassAuthState: this.bypassAuthState
      };
      try {
        this.resolve(yield this.getIdpTask(type)(params));
      } catch (e) {
        this.reject(e);
      }
    });
  }
  onError(error) {
    this.reject(error);
  }
  getIdpTask(type) {
    switch (type) {
      case "signInViaPopup":
      case "signInViaRedirect":
        return _signIn;
      case "linkViaPopup":
      case "linkViaRedirect":
        return _link2;
      case "reauthViaPopup":
      case "reauthViaRedirect":
        return _reauth;
      default:
        _fail(
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
    }
  }
  resolve(cred) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.resolve(cred);
    this.unregisterAndCleanUp();
  }
  reject(error) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.reject(error);
    this.unregisterAndCleanUp();
  }
  unregisterAndCleanUp() {
    if (this.eventManager) {
      this.eventManager.unregisterConsumer(this);
    }
    this.pendingPromise = null;
    this.cleanUp();
  }
};
var PENDING_REDIRECT_KEY = "pendingRedirect";
var redirectOutcomeMap = /* @__PURE__ */ new Map();
var RedirectAction = class _RedirectAction extends AbstractPopupRedirectOperation {
  constructor(auth, resolver, bypassAuthState = false) {
    super(auth, [
      "signInViaRedirect",
      "linkViaRedirect",
      "reauthViaRedirect",
      "unknown"
      /* AuthEventType.UNKNOWN */
    ], resolver, void 0, bypassAuthState);
    this.eventId = null;
  }
  /**
   * Override the execute function; if we already have a redirect result, then
   * just return it.
   */
  execute() {
    return __async(this, null, function* () {
      let readyOutcome = redirectOutcomeMap.get(this.auth._key());
      if (!readyOutcome) {
        try {
          const hasPendingRedirect = yield _getAndClearPendingRedirectStatus(this.resolver, this.auth);
          const result = hasPendingRedirect ? yield __superGet(_RedirectAction.prototype, this, "execute").call(this) : null;
          readyOutcome = () => Promise.resolve(result);
        } catch (e) {
          readyOutcome = () => Promise.reject(e);
        }
        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
      }
      if (!this.bypassAuthState) {
        redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
      }
      return readyOutcome();
    });
  }
  onAuthEvent(event) {
    return __async(this, null, function* () {
      if (event.type === "signInViaRedirect") {
        return __superGet(_RedirectAction.prototype, this, "onAuthEvent").call(this, event);
      } else if (event.type === "unknown") {
        this.resolve(null);
        return;
      }
      if (event.eventId) {
        const user = yield this.auth._redirectUserForId(event.eventId);
        if (user) {
          this.user = user;
          return __superGet(_RedirectAction.prototype, this, "onAuthEvent").call(this, event);
        } else {
          this.resolve(null);
        }
      }
    });
  }
  onExecution() {
    return __async(this, null, function* () {
    });
  }
  cleanUp() {
  }
};
function _getAndClearPendingRedirectStatus(resolver, auth) {
  return __async(this, null, function* () {
    const key = pendingRedirectKey(auth);
    const persistence = resolverPersistence(resolver);
    if (!(yield persistence._isAvailable())) {
      return false;
    }
    const hasPendingRedirect = (yield persistence._get(key)) === "true";
    yield persistence._remove(key);
    return hasPendingRedirect;
  });
}
function _clearRedirectOutcomes() {
  redirectOutcomeMap.clear();
}
function _overrideRedirectResult(auth, result) {
  redirectOutcomeMap.set(auth._key(), result);
}
function resolverPersistence(resolver) {
  return _getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
  return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
}
function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
  return __async(this, null, function* () {
    if (_isFirebaseServerApp(auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = _castAuth(auth);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = yield action.execute();
    if (result && !bypassAuthState) {
      delete result.user._redirectEventId;
      yield authInternal._persistUserIfCurrent(result.user);
      yield authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
  });
}
var STORAGE_AVAILABLE_KEY = "__sak";
var BrowserPersistenceClass = class {
  constructor(storageRetriever, type) {
    this.storageRetriever = storageRetriever;
    this.type = type;
  }
  _isAvailable() {
    try {
      if (!this.storage) {
        return Promise.resolve(false);
      }
      this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
      this.storage.removeItem(STORAGE_AVAILABLE_KEY);
      return Promise.resolve(true);
    } catch (_a) {
      return Promise.resolve(false);
    }
  }
  _set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }
  _get(key) {
    const json = this.storage.getItem(key);
    return Promise.resolve(json ? JSON.parse(json) : null);
  }
  _remove(key) {
    this.storage.removeItem(key);
    return Promise.resolve();
  }
  get storage() {
    return this.storageRetriever();
  }
};
var BrowserSessionPersistence = class extends BrowserPersistenceClass {
  constructor() {
    super(
      () => window.sessionStorage,
      "SESSION"
      /* PersistenceType.SESSION */
    );
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
};
BrowserSessionPersistence.type = "SESSION";
var browserSessionPersistence2 = BrowserSessionPersistence;
var WIDGET_PATH = "__/auth/handler";
var EMULATOR_WIDGET_PATH = "emulator/auth/handler";
var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
  return __async(this, null, function* () {
    _assert(
      auth.config.authDomain,
      auth,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    _assert(
      auth.config.apiKey,
      auth,
      "invalid-api-key"
      /* AuthErrorCode.INVALID_API_KEY */
    );
    const params = {
      apiKey: auth.config.apiKey,
      appName: auth.name,
      authType,
      redirectUrl,
      v: SDK_VERSION,
      eventId
    };
    if (provider instanceof FederatedAuthProvider) {
      provider.setDefaultLanguage(auth.languageCode);
      params.providerId = provider.providerId || "";
      if (!isEmpty(provider.getCustomParameters())) {
        params.customParameters = JSON.stringify(provider.getCustomParameters());
      }
      for (const [key, value] of Object.entries(additionalParams || {})) {
        params[key] = value;
      }
    }
    if (provider instanceof BaseOAuthProvider) {
      const scopes = provider.getScopes().filter((scope) => scope !== "");
      if (scopes.length > 0) {
        params.scopes = scopes.join(",");
      }
    }
    if (auth.tenantId) {
      params.tid = auth.tenantId;
    }
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
      if (paramsDict[key] === void 0) {
        delete paramsDict[key];
      }
    }
    const appCheckToken = yield auth._getAppCheckToken();
    const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
    return `${getHandlerBase(auth)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
  });
}
function getHandlerBase({
  config
}) {
  if (!config.emulator) {
    return `https://${config.authDomain}/${WIDGET_PATH}`;
  }
  return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
}
function _cordovaWindow() {
  return window;
}
function _getProjectConfig(_0) {
  return __async(this, arguments, function* (auth, request = {}) {
    return _performApiRequest(auth, "GET", "/v1/projects", request);
  });
}
var REDIRECT_TIMEOUT_MS = 2e3;
function _generateHandlerUrl(auth, event, provider) {
  return __async(this, null, function* () {
    var _a;
    const {
      BuildInfo
    } = _cordovaWindow();
    debugAssert(event.sessionId, "AuthEvent did not contain a session ID");
    const sessionDigest = yield computeSha256(event.sessionId);
    const additionalParams = {};
    if (_isIOS()) {
      additionalParams["ibi"] = BuildInfo.packageName;
    } else if (_isAndroid()) {
      additionalParams["apn"] = BuildInfo.packageName;
    } else {
      _fail(
        auth,
        "operation-not-supported-in-this-environment"
        /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
    }
    if (BuildInfo.displayName) {
      additionalParams["appDisplayName"] = BuildInfo.displayName;
    }
    additionalParams["sessionId"] = sessionDigest;
    return _getRedirectUrl(auth, provider, event.type, void 0, (_a = event.eventId) !== null && _a !== void 0 ? _a : void 0, additionalParams);
  });
}
function _validateOrigin(auth) {
  return __async(this, null, function* () {
    const {
      BuildInfo
    } = _cordovaWindow();
    const request = {};
    if (_isIOS()) {
      request.iosBundleId = BuildInfo.packageName;
    } else if (_isAndroid()) {
      request.androidPackageName = BuildInfo.packageName;
    } else {
      _fail(
        auth,
        "operation-not-supported-in-this-environment"
        /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
    }
    yield _getProjectConfig(auth, request);
  });
}
function _performRedirect(handlerUrl) {
  const {
    cordova
  } = _cordovaWindow();
  return new Promise((resolve) => {
    cordova.plugins.browsertab.isAvailable((browserTabIsAvailable) => {
      let iabRef = null;
      if (browserTabIsAvailable) {
        cordova.plugins.browsertab.openUrl(handlerUrl);
      } else {
        iabRef = cordova.InAppBrowser.open(handlerUrl, _isIOS7Or8() ? "_blank" : "_system", "location=yes");
      }
      resolve(iabRef);
    });
  });
}
function _waitForAppResume(auth, eventListener, iabRef) {
  return __async(this, null, function* () {
    const {
      cordova
    } = _cordovaWindow();
    let cleanup = () => {
    };
    try {
      yield new Promise((resolve, reject) => {
        let onCloseTimer = null;
        function authEventSeen() {
          var _a;
          resolve();
          const closeBrowserTab = (_a = cordova.plugins.browsertab) === null || _a === void 0 ? void 0 : _a.close;
          if (typeof closeBrowserTab === "function") {
            closeBrowserTab();
          }
          if (typeof (iabRef === null || iabRef === void 0 ? void 0 : iabRef.close) === "function") {
            iabRef.close();
          }
        }
        function resumed() {
          if (onCloseTimer) {
            return;
          }
          onCloseTimer = window.setTimeout(() => {
            reject(_createError(
              auth,
              "redirect-cancelled-by-user"
              /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */
            ));
          }, REDIRECT_TIMEOUT_MS);
        }
        function visibilityChanged() {
          if ((document === null || document === void 0 ? void 0 : document.visibilityState) === "visible") {
            resumed();
          }
        }
        eventListener.addPassiveListener(authEventSeen);
        document.addEventListener("resume", resumed, false);
        if (_isAndroid()) {
          document.addEventListener("visibilitychange", visibilityChanged, false);
        }
        cleanup = () => {
          eventListener.removePassiveListener(authEventSeen);
          document.removeEventListener("resume", resumed, false);
          document.removeEventListener("visibilitychange", visibilityChanged, false);
          if (onCloseTimer) {
            window.clearTimeout(onCloseTimer);
          }
        };
      });
    } finally {
      cleanup();
    }
  });
}
function _checkCordovaConfiguration(auth) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  const win = _cordovaWindow();
  _assert(typeof ((_a = win === null || win === void 0 ? void 0 : win.universalLinks) === null || _a === void 0 ? void 0 : _a.subscribe) === "function", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-universal-links-plugin-fix"
  });
  _assert(typeof ((_b = win === null || win === void 0 ? void 0 : win.BuildInfo) === null || _b === void 0 ? void 0 : _b.packageName) !== "undefined", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-plugin-buildInfo"
  });
  _assert(typeof ((_e = (_d = (_c = win === null || win === void 0 ? void 0 : win.cordova) === null || _c === void 0 ? void 0 : _c.plugins) === null || _d === void 0 ? void 0 : _d.browsertab) === null || _e === void 0 ? void 0 : _e.openUrl) === "function", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-plugin-browsertab"
  });
  _assert(typeof ((_h = (_g = (_f = win === null || win === void 0 ? void 0 : win.cordova) === null || _f === void 0 ? void 0 : _f.plugins) === null || _g === void 0 ? void 0 : _g.browsertab) === null || _h === void 0 ? void 0 : _h.isAvailable) === "function", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-plugin-browsertab"
  });
  _assert(typeof ((_k = (_j = win === null || win === void 0 ? void 0 : win.cordova) === null || _j === void 0 ? void 0 : _j.InAppBrowser) === null || _k === void 0 ? void 0 : _k.open) === "function", auth, "invalid-cordova-configuration", {
    missingPlugin: "cordova-plugin-inappbrowser"
  });
}
function computeSha256(sessionId) {
  return __async(this, null, function* () {
    const bytes = stringToArrayBuffer(sessionId);
    const buf = yield crypto.subtle.digest("SHA-256", bytes);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((num) => num.toString(16).padStart(2, "0")).join("");
  });
}
function stringToArrayBuffer(str) {
  debugAssert(/[0-9a-zA-Z]+/.test(str), "Can only convert alpha-numeric strings");
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str);
  }
  const buff = new ArrayBuffer(str.length);
  const view = new Uint8Array(buff);
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return view;
}
var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
var AuthEventManager = class {
  constructor(auth) {
    this.auth = auth;
    this.cachedEventUids = /* @__PURE__ */ new Set();
    this.consumers = /* @__PURE__ */ new Set();
    this.queuedRedirectEvent = null;
    this.hasHandledPotentialRedirect = false;
    this.lastProcessedEventTime = Date.now();
  }
  registerConsumer(authEventConsumer) {
    this.consumers.add(authEventConsumer);
    if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
      this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
      this.saveEventToCache(this.queuedRedirectEvent);
      this.queuedRedirectEvent = null;
    }
  }
  unregisterConsumer(authEventConsumer) {
    this.consumers.delete(authEventConsumer);
  }
  onEvent(event) {
    if (this.hasEventBeenHandled(event)) {
      return false;
    }
    let handled = false;
    this.consumers.forEach((consumer) => {
      if (this.isEventForConsumer(event, consumer)) {
        handled = true;
        this.sendToConsumer(event, consumer);
        this.saveEventToCache(event);
      }
    });
    if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
      return handled;
    }
    this.hasHandledPotentialRedirect = true;
    if (!handled) {
      this.queuedRedirectEvent = event;
      handled = true;
    }
    return handled;
  }
  sendToConsumer(event, consumer) {
    var _a;
    if (event.error && !isNullRedirectEvent(event)) {
      const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split("auth/")[1]) || "internal-error";
      consumer.onError(_createError(this.auth, code));
    } else {
      consumer.onAuthEvent(event);
    }
  }
  isEventForConsumer(event, consumer) {
    const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
    return consumer.filter.includes(event.type) && eventIdMatches;
  }
  hasEventBeenHandled(event) {
    if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
      this.cachedEventUids.clear();
    }
    return this.cachedEventUids.has(eventUid(event));
  }
  saveEventToCache(event) {
    this.cachedEventUids.add(eventUid(event));
    this.lastProcessedEventTime = Date.now();
  }
};
function eventUid(e) {
  return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v) => v).join("-");
}
function isNullRedirectEvent({
  type,
  error
}) {
  return type === "unknown" && (error === null || error === void 0 ? void 0 : error.code) === `auth/${"no-auth-event"}`;
}
function isRedirectEvent(event) {
  switch (event.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
      return true;
    case "unknown":
      return isNullRedirectEvent(event);
    default:
      return false;
  }
}
var _POLLING_INTERVAL_MS = 1e3;
var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
var BrowserLocalPersistence = class _BrowserLocalPersistence extends BrowserPersistenceClass {
  constructor() {
    super(
      () => window.localStorage,
      "LOCAL"
      /* PersistenceType.LOCAL */
    );
    this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
    this.listeners = {};
    this.localCache = {};
    this.pollTimer = null;
    this.fallbackToPolling = _isMobileBrowser();
    this._shouldAllowMigration = true;
  }
  forAllChangedKeys(cb) {
    for (const key of Object.keys(this.listeners)) {
      const newValue = this.storage.getItem(key);
      const oldValue = this.localCache[key];
      if (newValue !== oldValue) {
        cb(key, oldValue, newValue);
      }
    }
  }
  onStorageEvent(event, poll = false) {
    if (!event.key) {
      this.forAllChangedKeys((key2, _oldValue, newValue) => {
        this.notifyListeners(key2, newValue);
      });
      return;
    }
    const key = event.key;
    if (poll) {
      this.detachListener();
    } else {
      this.stopPolling();
    }
    const triggerListeners = () => {
      const storedValue2 = this.storage.getItem(key);
      if (!poll && this.localCache[key] === storedValue2) {
        return;
      }
      this.notifyListeners(key, storedValue2);
    };
    const storedValue = this.storage.getItem(key);
    if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
      setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
    } else {
      triggerListeners();
    }
  }
  notifyListeners(key, value) {
    this.localCache[key] = value;
    const listeners = this.listeners[key];
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(value ? JSON.parse(value) : value);
      }
    }
  }
  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      this.forAllChangedKeys((key, oldValue, newValue) => {
        this.onStorageEvent(
          new StorageEvent("storage", {
            key,
            oldValue,
            newValue
          }),
          /* poll */
          true
        );
      });
    }, _POLLING_INTERVAL_MS);
  }
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  attachListener() {
    window.addEventListener("storage", this.boundEventHandler);
  }
  detachListener() {
    window.removeEventListener("storage", this.boundEventHandler);
  }
  _addListener(key, listener) {
    if (Object.keys(this.listeners).length === 0) {
      if (this.fallbackToPolling) {
        this.startPolling();
      } else {
        this.attachListener();
      }
    }
    if (!this.listeners[key]) {
      this.listeners[key] = /* @__PURE__ */ new Set();
      this.localCache[key] = this.storage.getItem(key);
    }
    this.listeners[key].add(listener);
  }
  _removeListener(key, listener) {
    if (this.listeners[key]) {
      this.listeners[key].delete(listener);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    }
    if (Object.keys(this.listeners).length === 0) {
      this.detachListener();
      this.stopPolling();
    }
  }
  // Update local cache on base operations:
  _set(key, value) {
    return __async(this, null, function* () {
      yield __superGet(_BrowserLocalPersistence.prototype, this, "_set").call(this, key, value);
      this.localCache[key] = JSON.stringify(value);
    });
  }
  _get(key) {
    return __async(this, null, function* () {
      const value = yield __superGet(_BrowserLocalPersistence.prototype, this, "_get").call(this, key);
      this.localCache[key] = JSON.stringify(value);
      return value;
    });
  }
  _remove(key) {
    return __async(this, null, function* () {
      yield __superGet(_BrowserLocalPersistence.prototype, this, "_remove").call(this, key);
      delete this.localCache[key];
    });
  }
};
BrowserLocalPersistence.type = "LOCAL";
var browserLocalPersistence2 = BrowserLocalPersistence;
var SESSION_ID_LENGTH = 20;
var CordovaAuthEventManager = class extends AuthEventManager {
  constructor() {
    super(...arguments);
    this.passiveListeners = /* @__PURE__ */ new Set();
    this.initPromise = new Promise((resolve) => {
      this.resolveInitialized = resolve;
    });
  }
  addPassiveListener(cb) {
    this.passiveListeners.add(cb);
  }
  removePassiveListener(cb) {
    this.passiveListeners.delete(cb);
  }
  // In a Cordova environment, this manager can live through multiple redirect
  // operations
  resetRedirect() {
    this.queuedRedirectEvent = null;
    this.hasHandledPotentialRedirect = false;
  }
  /** Override the onEvent method */
  onEvent(event) {
    this.resolveInitialized();
    this.passiveListeners.forEach((cb) => cb(event));
    return super.onEvent(event);
  }
  initialized() {
    return __async(this, null, function* () {
      yield this.initPromise;
    });
  }
};
function _generateNewEvent(auth, type, eventId = null) {
  return {
    type,
    eventId,
    urlResponse: null,
    sessionId: generateSessionId(),
    postBody: null,
    tenantId: auth.tenantId,
    error: _createError(
      auth,
      "no-auth-event"
      /* AuthErrorCode.NO_AUTH_EVENT */
    )
  };
}
function _savePartialEvent(auth, event) {
  return storage()._set(persistenceKey(auth), event);
}
function _getAndRemoveEvent(auth) {
  return __async(this, null, function* () {
    const event = yield storage()._get(persistenceKey(auth));
    if (event) {
      yield storage()._remove(persistenceKey(auth));
    }
    return event;
  });
}
function _eventFromPartialAndUrl(partialEvent, url) {
  var _a, _b;
  const callbackUrl = _getDeepLinkFromCallback(url);
  if (callbackUrl.includes("/__/auth/callback")) {
    const params = searchParamsOrEmpty(callbackUrl);
    const errorObject = params["firebaseError"] ? parseJsonOrNull(decodeURIComponent(params["firebaseError"])) : null;
    const code = (_b = (_a = errorObject === null || errorObject === void 0 ? void 0 : errorObject["code"]) === null || _a === void 0 ? void 0 : _a.split("auth/")) === null || _b === void 0 ? void 0 : _b[1];
    const error = code ? _createError(code) : null;
    if (error) {
      return {
        type: partialEvent.type,
        eventId: partialEvent.eventId,
        tenantId: partialEvent.tenantId,
        error,
        urlResponse: null,
        sessionId: null,
        postBody: null
      };
    } else {
      return {
        type: partialEvent.type,
        eventId: partialEvent.eventId,
        tenantId: partialEvent.tenantId,
        sessionId: partialEvent.sessionId,
        urlResponse: callbackUrl,
        postBody: null
      };
    }
  }
  return null;
}
function generateSessionId() {
  const chars = [];
  const allowedChars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < SESSION_ID_LENGTH; i++) {
    const idx = Math.floor(Math.random() * allowedChars.length);
    chars.push(allowedChars.charAt(idx));
  }
  return chars.join("");
}
function storage() {
  return _getInstance(browserLocalPersistence2);
}
function persistenceKey(auth) {
  return _persistenceKeyName("authEvent", auth.config.apiKey, auth.name);
}
function parseJsonOrNull(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
function _getDeepLinkFromCallback(url) {
  const params = searchParamsOrEmpty(url);
  const link = params["link"] ? decodeURIComponent(params["link"]) : void 0;
  const doubleDeepLink = searchParamsOrEmpty(link)["link"];
  const iOSDeepLink = params["deep_link_id"] ? decodeURIComponent(params["deep_link_id"]) : void 0;
  const iOSDoubleDeepLink = searchParamsOrEmpty(iOSDeepLink)["link"];
  return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
function searchParamsOrEmpty(url) {
  if (!(url === null || url === void 0 ? void 0 : url.includes("?"))) {
    return {};
  }
  const [_, ...rest] = url.split("?");
  return querystringDecode(rest.join("?"));
}
var INITIAL_EVENT_TIMEOUT_MS = 500;
var CordovaPopupRedirectResolver = class {
  constructor() {
    this._redirectPersistence = browserSessionPersistence2;
    this._shouldInitProactively = true;
    this.eventManagers = /* @__PURE__ */ new Map();
    this.originValidationPromises = {};
    this._completeRedirectFn = _getRedirectResult;
    this._overrideRedirectResult = _overrideRedirectResult;
  }
  _initialize(auth) {
    return __async(this, null, function* () {
      const key = auth._key();
      let manager = this.eventManagers.get(key);
      if (!manager) {
        manager = new CordovaAuthEventManager(auth);
        this.eventManagers.set(key, manager);
        this.attachCallbackListeners(auth, manager);
      }
      return manager;
    });
  }
  _openPopup(auth) {
    _fail(
      auth,
      "operation-not-supported-in-this-environment"
      /* AuthErrorCode.OPERATION_NOT_SUPPORTED */
    );
  }
  _openRedirect(auth, provider, authType, eventId) {
    return __async(this, null, function* () {
      _checkCordovaConfiguration(auth);
      const manager = yield this._initialize(auth);
      yield manager.initialized();
      manager.resetRedirect();
      _clearRedirectOutcomes();
      yield this._originValidation(auth);
      const event = _generateNewEvent(auth, authType, eventId);
      yield _savePartialEvent(auth, event);
      const url = yield _generateHandlerUrl(auth, event, provider);
      const iabRef = yield _performRedirect(url);
      return _waitForAppResume(auth, manager, iabRef);
    });
  }
  _isIframeWebStorageSupported(_auth, _cb) {
    throw new Error("Method not implemented.");
  }
  _originValidation(auth) {
    const key = auth._key();
    if (!this.originValidationPromises[key]) {
      this.originValidationPromises[key] = _validateOrigin(auth);
    }
    return this.originValidationPromises[key];
  }
  attachCallbackListeners(auth, manager) {
    const {
      universalLinks,
      handleOpenURL,
      BuildInfo
    } = _cordovaWindow();
    const noEventTimeout = setTimeout(() => __async(this, null, function* () {
      yield _getAndRemoveEvent(auth);
      manager.onEvent(generateNoEvent());
    }), INITIAL_EVENT_TIMEOUT_MS);
    const universalLinksCb = (eventData) => __async(this, null, function* () {
      clearTimeout(noEventTimeout);
      const partialEvent = yield _getAndRemoveEvent(auth);
      let finalEvent = null;
      if (partialEvent && (eventData === null || eventData === void 0 ? void 0 : eventData["url"])) {
        finalEvent = _eventFromPartialAndUrl(partialEvent, eventData["url"]);
      }
      manager.onEvent(finalEvent || generateNoEvent());
    });
    if (typeof universalLinks !== "undefined" && typeof universalLinks.subscribe === "function") {
      universalLinks.subscribe(null, universalLinksCb);
    }
    const existingHandleOpenURL = handleOpenURL;
    const packagePrefix = `${BuildInfo.packageName.toLowerCase()}://`;
    _cordovaWindow().handleOpenURL = (url) => __async(this, null, function* () {
      if (url.toLowerCase().startsWith(packagePrefix)) {
        universalLinksCb({
          url
        });
      }
      if (typeof existingHandleOpenURL === "function") {
        try {
          existingHandleOpenURL(url);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
};
var cordovaPopupRedirectResolver = CordovaPopupRedirectResolver;
function generateNoEvent() {
  return {
    type: "unknown",
    eventId: null,
    sessionId: null,
    urlResponse: null,
    postBody: null,
    tenantId: null,
    error: _createError(
      "no-auth-event"
      /* AuthErrorCode.NO_AUTH_EVENT */
    )
  };
}
function addFrameworkForLogging(auth, framework) {
  _castAuth(auth)._logFramework(framework);
}

// node_modules/@firebase/auth-compat/dist/esm/index.node.esm.js
var name3 = "@firebase/auth-compat";
var version3 = "0.5.19";
var CORDOVA_ONDEVICEREADY_TIMEOUT_MS = 1e3;
function _getCurrentScheme2() {
  var _a;
  return ((_a = self === null || self === void 0 ? void 0 : self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
}
function _isHttpOrHttps2() {
  return _getCurrentScheme2() === "http:" || _getCurrentScheme2() === "https:";
}
function _isAndroidOrIosCordovaScheme(ua = getUA()) {
  return !!((_getCurrentScheme2() === "file:" || _getCurrentScheme2() === "ionic:" || _getCurrentScheme2() === "capacitor:") && ua.toLowerCase().match(/iphone|ipad|ipod|android/));
}
function _isNativeEnvironment() {
  return isReactNative() || isNode();
}
function _isIe11() {
  return isIE() && (document === null || document === void 0 ? void 0 : document.documentMode) === 11;
}
function _isEdge(ua = getUA()) {
  return /Edge\/\d+/.test(ua);
}
function _isLocalStorageNotSynchronized(ua = getUA()) {
  return _isIe11() || _isEdge(ua);
}
function _isWebStorageSupported() {
  try {
    const storage2 = self.localStorage;
    const key = _generateEventId();
    if (storage2) {
      storage2["setItem"](key, "1");
      storage2["removeItem"](key);
      if (_isLocalStorageNotSynchronized()) {
        return isIndexedDBAvailable();
      }
      return true;
    }
  } catch (e) {
    return _isWorker() && isIndexedDBAvailable();
  }
  return false;
}
function _isWorker() {
  return typeof global !== "undefined" && "WorkerGlobalScope" in global && "importScripts" in global;
}
function _isPopupRedirectSupported() {
  return (_isHttpOrHttps2() || isBrowserExtension() || _isAndroidOrIosCordovaScheme()) && // React Native with remote debugging reports its location.protocol as
  // http.
  !_isNativeEnvironment() && // Local storage has to be supported for browser popup and redirect
  // operations to work.
  _isWebStorageSupported() && // DOM, popups and redirects are not supported within a worker.
  !_isWorker();
}
function _isLikelyCordova() {
  return _isAndroidOrIosCordovaScheme() && typeof document !== "undefined";
}
function _isCordova() {
  return __async(this, null, function* () {
    if (!_isLikelyCordova()) {
      return false;
    }
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(false);
      }, CORDOVA_ONDEVICEREADY_TIMEOUT_MS);
      document.addEventListener("deviceready", () => {
        clearTimeout(timeoutId);
        resolve(true);
      });
    });
  });
}
function _getSelfWindow() {
  return typeof window !== "undefined" ? window : null;
}
var Persistence = {
  LOCAL: "local",
  NONE: "none",
  SESSION: "session"
};
var _assert$3 = _assert;
var PERSISTENCE_KEY = "persistence";
function _validatePersistenceArgument(auth, persistence) {
  _assert$3(
    Object.values(Persistence).includes(persistence),
    auth,
    "invalid-persistence-type"
    /* exp.AuthErrorCode.INVALID_PERSISTENCE */
  );
  if (isReactNative()) {
    _assert$3(
      persistence !== Persistence.SESSION,
      auth,
      "unsupported-persistence-type"
      /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */
    );
    return;
  }
  if (isNode()) {
    _assert$3(
      persistence === Persistence.NONE,
      auth,
      "unsupported-persistence-type"
      /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */
    );
    return;
  }
  if (_isWorker()) {
    _assert$3(
      persistence === Persistence.NONE || persistence === Persistence.LOCAL && isIndexedDBAvailable(),
      auth,
      "unsupported-persistence-type"
      /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */
    );
    return;
  }
  _assert$3(
    persistence === Persistence.NONE || _isWebStorageSupported(),
    auth,
    "unsupported-persistence-type"
    /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */
  );
}
function _savePersistenceForRedirect(auth) {
  return __async(this, null, function* () {
    yield auth._initializationPromise;
    const session = getSessionStorageIfAvailable();
    const key = _persistenceKeyName(PERSISTENCE_KEY, auth.config.apiKey, auth.name);
    if (session) {
      session.setItem(key, auth._getPersistence());
    }
  });
}
function _getPersistencesFromRedirect(apiKey, appName) {
  const session = getSessionStorageIfAvailable();
  if (!session) {
    return [];
  }
  const key = _persistenceKeyName(PERSISTENCE_KEY, apiKey, appName);
  const persistence = session.getItem(key);
  switch (persistence) {
    case Persistence.NONE:
      return [inMemoryPersistence];
    case Persistence.LOCAL:
      return [indexedDBLocalPersistence, browserSessionPersistence];
    case Persistence.SESSION:
      return [browserSessionPersistence];
    default:
      return [];
  }
}
function getSessionStorageIfAvailable() {
  var _a;
  try {
    return ((_a = _getSelfWindow()) === null || _a === void 0 ? void 0 : _a.sessionStorage) || null;
  } catch (e) {
    return null;
  }
}
var _assert$2 = _assert;
var CompatPopupRedirectResolver = class {
  constructor() {
    this.browserResolver = _getInstance(browserPopupRedirectResolver);
    this.cordovaResolver = _getInstance(cordovaPopupRedirectResolver);
    this.underlyingResolver = null;
    this._redirectPersistence = browserSessionPersistence;
    this._completeRedirectFn = _getRedirectResult;
    this._overrideRedirectResult = _overrideRedirectResult;
  }
  _initialize(auth) {
    return __async(this, null, function* () {
      yield this.selectUnderlyingResolver();
      return this.assertedUnderlyingResolver._initialize(auth);
    });
  }
  _openPopup(auth, provider, authType, eventId) {
    return __async(this, null, function* () {
      yield this.selectUnderlyingResolver();
      return this.assertedUnderlyingResolver._openPopup(auth, provider, authType, eventId);
    });
  }
  _openRedirect(auth, provider, authType, eventId) {
    return __async(this, null, function* () {
      yield this.selectUnderlyingResolver();
      return this.assertedUnderlyingResolver._openRedirect(auth, provider, authType, eventId);
    });
  }
  _isIframeWebStorageSupported(auth, cb) {
    this.assertedUnderlyingResolver._isIframeWebStorageSupported(auth, cb);
  }
  _originValidation(auth) {
    return this.assertedUnderlyingResolver._originValidation(auth);
  }
  get _shouldInitProactively() {
    return _isLikelyCordova() || this.browserResolver._shouldInitProactively;
  }
  get assertedUnderlyingResolver() {
    _assert$2(
      this.underlyingResolver,
      "internal-error"
      /* exp.AuthErrorCode.INTERNAL_ERROR */
    );
    return this.underlyingResolver;
  }
  selectUnderlyingResolver() {
    return __async(this, null, function* () {
      if (this.underlyingResolver) {
        return;
      }
      const isCordova = yield _isCordova();
      this.underlyingResolver = isCordova ? this.cordovaResolver : this.browserResolver;
    });
  }
};
function unwrap(object) {
  return object.unwrap();
}
function wrapped(object) {
  return object.wrapped();
}
function credentialFromResponse(userCredential) {
  return credentialFromObject(userCredential);
}
function attachExtraErrorFields(auth, e) {
  var _a;
  const response = (_a = e.customData) === null || _a === void 0 ? void 0 : _a._tokenResponse;
  if ((e === null || e === void 0 ? void 0 : e.code) === "auth/multi-factor-auth-required") {
    const mfaErr = e;
    mfaErr.resolver = new MultiFactorResolver(auth, getMultiFactorResolver(auth, e));
  } else if (response) {
    const credential = credentialFromObject(e);
    const credErr = e;
    if (credential) {
      credErr.credential = credential;
      credErr.tenantId = response.tenantId || void 0;
      credErr.email = response.email || void 0;
      credErr.phoneNumber = response.phoneNumber || void 0;
    }
  }
}
function credentialFromObject(object) {
  const {
    _tokenResponse
  } = object instanceof FirebaseError ? object.customData : object;
  if (!_tokenResponse) {
    return null;
  }
  if (!(object instanceof FirebaseError)) {
    if ("temporaryProof" in _tokenResponse && "phoneNumber" in _tokenResponse) {
      return PhoneAuthProvider.credentialFromResult(object);
    }
  }
  const providerId = _tokenResponse.providerId;
  if (!providerId || providerId === ProviderId.PASSWORD) {
    return null;
  }
  let provider;
  switch (providerId) {
    case ProviderId.GOOGLE:
      provider = GoogleAuthProvider;
      break;
    case ProviderId.FACEBOOK:
      provider = FacebookAuthProvider;
      break;
    case ProviderId.GITHUB:
      provider = GithubAuthProvider;
      break;
    case ProviderId.TWITTER:
      provider = TwitterAuthProvider;
      break;
    default:
      const {
        oauthIdToken,
        oauthAccessToken,
        oauthTokenSecret,
        pendingToken,
        nonce
      } = _tokenResponse;
      if (!oauthAccessToken && !oauthTokenSecret && !oauthIdToken && !pendingToken) {
        return null;
      }
      if (pendingToken) {
        if (providerId.startsWith("saml.")) {
          return SAMLAuthCredential._create(providerId, pendingToken);
        } else {
          return OAuthCredential._fromParams({
            providerId,
            signInMethod: providerId,
            pendingToken,
            idToken: oauthIdToken,
            accessToken: oauthAccessToken
          });
        }
      }
      return new OAuthProvider(providerId).credential({
        idToken: oauthIdToken,
        accessToken: oauthAccessToken,
        rawNonce: nonce
      });
  }
  return object instanceof FirebaseError ? provider.credentialFromError(object) : provider.credentialFromResult(object);
}
function convertCredential(auth, credentialPromise) {
  return credentialPromise.catch((e) => {
    if (e instanceof FirebaseError) {
      attachExtraErrorFields(auth, e);
    }
    throw e;
  }).then((credential) => {
    const operationType = credential.operationType;
    const user = credential.user;
    return {
      operationType,
      credential: credentialFromResponse(credential),
      additionalUserInfo: getAdditionalUserInfo(credential),
      user: User.getOrCreate(user)
    };
  });
}
function convertConfirmationResult(auth, confirmationResultPromise) {
  return __async(this, null, function* () {
    const confirmationResultExp = yield confirmationResultPromise;
    return {
      verificationId: confirmationResultExp.verificationId,
      confirm: (verificationCode) => convertCredential(auth, confirmationResultExp.confirm(verificationCode))
    };
  });
}
var MultiFactorResolver = class {
  constructor(auth, resolver) {
    this.resolver = resolver;
    this.auth = wrapped(auth);
  }
  get session() {
    return this.resolver.session;
  }
  get hints() {
    return this.resolver.hints;
  }
  resolveSignIn(assertion) {
    return convertCredential(unwrap(this.auth), this.resolver.resolveSignIn(assertion));
  }
};
var User = class _User {
  constructor(_delegate) {
    this._delegate = _delegate;
    this.multiFactor = multiFactor(_delegate);
  }
  static getOrCreate(user) {
    if (!_User.USER_MAP.has(user)) {
      _User.USER_MAP.set(user, new _User(user));
    }
    return _User.USER_MAP.get(user);
  }
  delete() {
    return this._delegate.delete();
  }
  reload() {
    return this._delegate.reload();
  }
  toJSON() {
    return this._delegate.toJSON();
  }
  getIdTokenResult(forceRefresh) {
    return this._delegate.getIdTokenResult(forceRefresh);
  }
  getIdToken(forceRefresh) {
    return this._delegate.getIdToken(forceRefresh);
  }
  linkAndRetrieveDataWithCredential(credential) {
    return this.linkWithCredential(credential);
  }
  linkWithCredential(credential) {
    return __async(this, null, function* () {
      return convertCredential(this.auth, linkWithCredential(this._delegate, credential));
    });
  }
  linkWithPhoneNumber(phoneNumber, applicationVerifier) {
    return __async(this, null, function* () {
      return convertConfirmationResult(this.auth, linkWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
    });
  }
  linkWithPopup(provider) {
    return __async(this, null, function* () {
      return convertCredential(this.auth, linkWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
    });
  }
  linkWithRedirect(provider) {
    return __async(this, null, function* () {
      yield _savePersistenceForRedirect(_castAuth(this.auth));
      return linkWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    });
  }
  reauthenticateAndRetrieveDataWithCredential(credential) {
    return this.reauthenticateWithCredential(credential);
  }
  reauthenticateWithCredential(credential) {
    return __async(this, null, function* () {
      return convertCredential(this.auth, reauthenticateWithCredential(this._delegate, credential));
    });
  }
  reauthenticateWithPhoneNumber(phoneNumber, applicationVerifier) {
    return convertConfirmationResult(this.auth, reauthenticateWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
  }
  reauthenticateWithPopup(provider) {
    return convertCredential(this.auth, reauthenticateWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
  }
  reauthenticateWithRedirect(provider) {
    return __async(this, null, function* () {
      yield _savePersistenceForRedirect(_castAuth(this.auth));
      return reauthenticateWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    });
  }
  sendEmailVerification(actionCodeSettings) {
    return sendEmailVerification(this._delegate, actionCodeSettings);
  }
  unlink(providerId) {
    return __async(this, null, function* () {
      yield unlink(this._delegate, providerId);
      return this;
    });
  }
  updateEmail(newEmail) {
    return updateEmail(this._delegate, newEmail);
  }
  updatePassword(newPassword) {
    return updatePassword(this._delegate, newPassword);
  }
  updatePhoneNumber(phoneCredential) {
    return updatePhoneNumber(this._delegate, phoneCredential);
  }
  updateProfile(profile) {
    return updateProfile(this._delegate, profile);
  }
  verifyBeforeUpdateEmail(newEmail, actionCodeSettings) {
    return verifyBeforeUpdateEmail(this._delegate, newEmail, actionCodeSettings);
  }
  get emailVerified() {
    return this._delegate.emailVerified;
  }
  get isAnonymous() {
    return this._delegate.isAnonymous;
  }
  get metadata() {
    return this._delegate.metadata;
  }
  get phoneNumber() {
    return this._delegate.phoneNumber;
  }
  get providerData() {
    return this._delegate.providerData;
  }
  get refreshToken() {
    return this._delegate.refreshToken;
  }
  get tenantId() {
    return this._delegate.tenantId;
  }
  get displayName() {
    return this._delegate.displayName;
  }
  get email() {
    return this._delegate.email;
  }
  get photoURL() {
    return this._delegate.photoURL;
  }
  get providerId() {
    return this._delegate.providerId;
  }
  get uid() {
    return this._delegate.uid;
  }
  get auth() {
    return this._delegate.auth;
  }
};
User.USER_MAP = /* @__PURE__ */ new WeakMap();
var _assert$1 = _assert;
var Auth = class {
  constructor(app, provider) {
    this.app = app;
    if (provider.isInitialized()) {
      this._delegate = provider.getImmediate();
      this.linkUnderlyingAuth();
      return;
    }
    const {
      apiKey
    } = app.options;
    _assert$1(apiKey, "invalid-api-key", {
      appName: app.name
    });
    _assert$1(apiKey, "invalid-api-key", {
      appName: app.name
    });
    const resolver = typeof window !== "undefined" ? CompatPopupRedirectResolver : void 0;
    this._delegate = provider.initialize({
      options: {
        persistence: buildPersistenceHierarchy(apiKey, app.name),
        popupRedirectResolver: resolver
      }
    });
    this._delegate._updateErrorMap(debugErrorMap);
    this.linkUnderlyingAuth();
  }
  get emulatorConfig() {
    return this._delegate.emulatorConfig;
  }
  get currentUser() {
    if (!this._delegate.currentUser) {
      return null;
    }
    return User.getOrCreate(this._delegate.currentUser);
  }
  get languageCode() {
    return this._delegate.languageCode;
  }
  set languageCode(languageCode) {
    this._delegate.languageCode = languageCode;
  }
  get settings() {
    return this._delegate.settings;
  }
  get tenantId() {
    return this._delegate.tenantId;
  }
  set tenantId(tid) {
    this._delegate.tenantId = tid;
  }
  useDeviceLanguage() {
    this._delegate.useDeviceLanguage();
  }
  signOut() {
    return this._delegate.signOut();
  }
  useEmulator(url, options) {
    connectAuthEmulator(this._delegate, url, options);
  }
  applyActionCode(code) {
    return applyActionCode(this._delegate, code);
  }
  checkActionCode(code) {
    return checkActionCode(this._delegate, code);
  }
  confirmPasswordReset(code, newPassword) {
    return confirmPasswordReset(this._delegate, code, newPassword);
  }
  createUserWithEmailAndPassword(email, password) {
    return __async(this, null, function* () {
      return convertCredential(this._delegate, createUserWithEmailAndPassword(this._delegate, email, password));
    });
  }
  fetchProvidersForEmail(email) {
    return this.fetchSignInMethodsForEmail(email);
  }
  fetchSignInMethodsForEmail(email) {
    return fetchSignInMethodsForEmail(this._delegate, email);
  }
  isSignInWithEmailLink(emailLink) {
    return isSignInWithEmailLink(this._delegate, emailLink);
  }
  getRedirectResult() {
    return __async(this, null, function* () {
      _assert$1(
        _isPopupRedirectSupported(),
        this._delegate,
        "operation-not-supported-in-this-environment"
        /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
      const credential = yield getRedirectResult(this._delegate, CompatPopupRedirectResolver);
      if (!credential) {
        return {
          credential: null,
          user: null
        };
      }
      return convertCredential(this._delegate, Promise.resolve(credential));
    });
  }
  // This function should only be called by frameworks (e.g. FirebaseUI-web) to log their usage.
  // It is not intended for direct use by developer apps. NO jsdoc here to intentionally leave it
  // out of autogenerated documentation pages to reduce accidental misuse.
  addFrameworkForLogging(framework) {
    addFrameworkForLogging(this._delegate, framework);
  }
  onAuthStateChanged(nextOrObserver, errorFn, completed) {
    const {
      next,
      error,
      complete
    } = wrapObservers(nextOrObserver, errorFn, completed);
    return this._delegate.onAuthStateChanged(next, error, complete);
  }
  onIdTokenChanged(nextOrObserver, errorFn, completed) {
    const {
      next,
      error,
      complete
    } = wrapObservers(nextOrObserver, errorFn, completed);
    return this._delegate.onIdTokenChanged(next, error, complete);
  }
  sendSignInLinkToEmail(email, actionCodeSettings) {
    return sendSignInLinkToEmail(this._delegate, email, actionCodeSettings);
  }
  sendPasswordResetEmail(email, actionCodeSettings) {
    return sendPasswordResetEmail(this._delegate, email, actionCodeSettings || void 0);
  }
  setPersistence(persistence) {
    return __async(this, null, function* () {
      _validatePersistenceArgument(this._delegate, persistence);
      let converted;
      switch (persistence) {
        case Persistence.SESSION:
          converted = browserSessionPersistence;
          break;
        case Persistence.LOCAL:
          const isIndexedDBFullySupported = yield _getInstance(indexedDBLocalPersistence)._isAvailable();
          converted = isIndexedDBFullySupported ? indexedDBLocalPersistence : browserLocalPersistence;
          break;
        case Persistence.NONE:
          converted = inMemoryPersistence;
          break;
        default:
          return _fail("argument-error", {
            appName: this._delegate.name
          });
      }
      return this._delegate.setPersistence(converted);
    });
  }
  signInAndRetrieveDataWithCredential(credential) {
    return this.signInWithCredential(credential);
  }
  signInAnonymously() {
    return convertCredential(this._delegate, signInAnonymously(this._delegate));
  }
  signInWithCredential(credential) {
    return convertCredential(this._delegate, signInWithCredential(this._delegate, credential));
  }
  signInWithCustomToken(token) {
    return convertCredential(this._delegate, signInWithCustomToken(this._delegate, token));
  }
  signInWithEmailAndPassword(email, password) {
    return convertCredential(this._delegate, signInWithEmailAndPassword(this._delegate, email, password));
  }
  signInWithEmailLink(email, emailLink) {
    return convertCredential(this._delegate, signInWithEmailLink(this._delegate, email, emailLink));
  }
  signInWithPhoneNumber(phoneNumber, applicationVerifier) {
    return convertConfirmationResult(this._delegate, signInWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
  }
  signInWithPopup(provider) {
    return __async(this, null, function* () {
      _assert$1(
        _isPopupRedirectSupported(),
        this._delegate,
        "operation-not-supported-in-this-environment"
        /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
      return convertCredential(this._delegate, signInWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
    });
  }
  signInWithRedirect(provider) {
    return __async(this, null, function* () {
      _assert$1(
        _isPopupRedirectSupported(),
        this._delegate,
        "operation-not-supported-in-this-environment"
        /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */
      );
      yield _savePersistenceForRedirect(this._delegate);
      return signInWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    });
  }
  updateCurrentUser(user) {
    return this._delegate.updateCurrentUser(user);
  }
  verifyPasswordResetCode(code) {
    return verifyPasswordResetCode(this._delegate, code);
  }
  unwrap() {
    return this._delegate;
  }
  _delete() {
    return this._delegate._delete();
  }
  linkUnderlyingAuth() {
    this._delegate.wrapped = () => this;
  }
};
Auth.Persistence = Persistence;
function wrapObservers(nextOrObserver, error, complete) {
  let next = nextOrObserver;
  if (typeof nextOrObserver !== "function") {
    ({
      next,
      error,
      complete
    } = nextOrObserver);
  }
  const oldNext = next;
  const newNext = (user) => oldNext(user && User.getOrCreate(user));
  return {
    next: newNext,
    error,
    complete
  };
}
function buildPersistenceHierarchy(apiKey, appName) {
  const persistences = _getPersistencesFromRedirect(apiKey, appName);
  if (typeof self !== "undefined" && !persistences.includes(indexedDBLocalPersistence)) {
    persistences.push(indexedDBLocalPersistence);
  }
  if (typeof window !== "undefined") {
    for (const persistence of [browserLocalPersistence, browserSessionPersistence]) {
      if (!persistences.includes(persistence)) {
        persistences.push(persistence);
      }
    }
  }
  if (!persistences.includes(inMemoryPersistence)) {
    persistences.push(inMemoryPersistence);
  }
  return persistences;
}
var PhoneAuthProvider2 = class {
  static credential(verificationId, verificationCode) {
    return PhoneAuthProvider.credential(verificationId, verificationCode);
  }
  constructor() {
    this.providerId = "phone";
    this._delegate = new PhoneAuthProvider(unwrap(firebase.auth()));
  }
  verifyPhoneNumber(phoneInfoOptions, applicationVerifier) {
    return this._delegate.verifyPhoneNumber(
      // The implementation matches but the types are subtly incompatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      phoneInfoOptions,
      applicationVerifier
    );
  }
  unwrap() {
    return this._delegate;
  }
};
PhoneAuthProvider2.PHONE_SIGN_IN_METHOD = PhoneAuthProvider.PHONE_SIGN_IN_METHOD;
PhoneAuthProvider2.PROVIDER_ID = PhoneAuthProvider.PROVIDER_ID;
var _assert2 = _assert;
var RecaptchaVerifier2 = class {
  constructor(container, parameters, app = firebase.app()) {
    var _a;
    _assert2((_a = app.options) === null || _a === void 0 ? void 0 : _a.apiKey, "invalid-api-key", {
      appName: app.name
    });
    this._delegate = new RecaptchaVerifier(
      // TODO: remove ts-ignore when moving types from auth-types to auth-compat
      // @ts-ignore
      app.auth(),
      container,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters
    );
    this.type = this._delegate.type;
  }
  clear() {
    this._delegate.clear();
  }
  render() {
    return this._delegate.render();
  }
  verify() {
    return this._delegate.verify();
  }
};
var AUTH_TYPE = "auth-compat";
function registerAuthCompat(instance) {
  instance.INTERNAL.registerComponent(new Component(
    AUTH_TYPE,
    (container) => {
      const app = container.getProvider("app-compat").getImmediate();
      const authProvider = container.getProvider("auth");
      return new Auth(app, authProvider);
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setServiceProps({
    ActionCodeInfo: {
      Operation: {
        EMAIL_SIGNIN: ActionCodeOperation.EMAIL_SIGNIN,
        PASSWORD_RESET: ActionCodeOperation.PASSWORD_RESET,
        RECOVER_EMAIL: ActionCodeOperation.RECOVER_EMAIL,
        REVERT_SECOND_FACTOR_ADDITION: ActionCodeOperation.REVERT_SECOND_FACTOR_ADDITION,
        VERIFY_AND_CHANGE_EMAIL: ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL,
        VERIFY_EMAIL: ActionCodeOperation.VERIFY_EMAIL
      }
    },
    EmailAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    OAuthProvider,
    SAMLAuthProvider,
    PhoneAuthProvider: PhoneAuthProvider2,
    PhoneMultiFactorGenerator,
    RecaptchaVerifier: RecaptchaVerifier2,
    TwitterAuthProvider,
    Auth,
    AuthCredential,
    Error: FirebaseError
  }).setInstantiationMode(
    "LAZY"
    /* InstantiationMode.LAZY */
  ).setMultipleInstances(false));
  instance.registerVersion(name3, version3);
}
registerAuthCompat(firebase);
FetchProvider.initialize(fetch, Headers, Response);

export {
  firebase
};
/*! Bundled license information:

@firebase/app-compat/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/totp-d5ff2369.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/internal.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/node-esm/internal.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth-compat/dist/esm/index.node.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=chunk-NFUECCMP.js.map
