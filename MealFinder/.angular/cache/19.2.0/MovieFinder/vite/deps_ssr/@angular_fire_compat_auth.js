import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  firebase
} from "./chunk-NFUECCMP.js";
import {
  AppCheckInstances
} from "./chunk-QRG3U3YS.js";
import "./chunk-SHNWMCCJ.js";
import {
  VERSION as VERSION2,
  pendingUntilEvent,
  ɵAngularFireSchedulers
} from "./chunk-IPG3EBCJ.js";
import "./chunk-YXGKGSKV.js";
import "./chunk-YUTBEUZF.js";
import {
  isPlatformServer
} from "./chunk-7IH5IE2U.js";
import {
  EnvironmentInjector,
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
  NgZone,
  Optional,
  PLATFORM_ID,
  VERSION,
  inject,
  isDevMode,
  require_operators,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-VGBYYFCY.js";
import {
  require_cjs
} from "./chunk-3AYOO7D2.js";
import {
  __toESM
} from "./chunk-ANGF2IQY.js";

// node_modules/firebase/compat/app/dist/index.mjs
var name = "firebase";
var version = "11.4.0";
firebase.registerVersion(name, version, "app-compat");

// node_modules/@angular/fire/fesm2022/angular-fire-compat.mjs
var noopFunctions = ["ngOnDestroy"];
var ɵlazySDKProxy = (klass, observable, zone, options = {}) => {
  return new Proxy(klass, {
    get: (_, name2) => zone.runOutsideAngular(() => {
      if (klass[name2]) {
        if (options?.spy?.get) {
          options.spy.get(name2, klass[name2]);
        }
        return klass[name2];
      }
      if (noopFunctions.indexOf(name2) > -1) {
        return () => void 0;
      }
      const promise = observable.toPromise().then((mod) => {
        const ret = mod?.[name2];
        if (typeof ret === "function") {
          return ret.bind(mod);
        } else if (ret?.then) {
          return ret.then((res) => zone.run(() => res));
        } else {
          return zone.run(() => ret);
        }
      });
      return new Proxy(() => void 0, {
        get: (_2, name3) => promise[name3],
        // TODO handle callbacks as transparently as I can
        apply: (self, _2, args) => promise.then((it) => {
          const res = it?.(...args);
          if (options?.spy?.apply) {
            options.spy.apply(name2, args, res);
          }
          return res;
        })
      });
    })
  });
};
var ɵapplyMixins = (derivedCtor, constructors) => {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype || baseCtor).forEach((name2) => {
      Object.defineProperty(derivedCtor.prototype, name2, Object.getOwnPropertyDescriptor(baseCtor.prototype || baseCtor, name2));
    });
  });
};
var FirebaseApp = class {
  constructor(app) {
    return app;
  }
};
var FIREBASE_OPTIONS = new InjectionToken("angularfire2.app.options");
var FIREBASE_APP_NAME = new InjectionToken("angularfire2.app.name");
function ɵfirebaseAppFactory(options, zone, nameOrConfig) {
  const name2 = typeof nameOrConfig === "string" && nameOrConfig || "[DEFAULT]";
  const config = typeof nameOrConfig === "object" && nameOrConfig || {};
  config.name = config.name || name2;
  const existingApp = firebase.apps.filter((app2) => app2 && app2.name === config.name)[0];
  const app = existingApp || zone.runOutsideAngular(() => firebase.initializeApp(options, config));
  try {
    if (JSON.stringify(options) !== JSON.stringify(app.options)) {
      const hmr = !!module.hot;
      log$1("error", `${app.name} Firebase App already initialized with different options${hmr ? ", you may need to reload as Firebase is not HMR aware." : "."}`);
    }
  } catch (e) {
  }
  return new FirebaseApp(app);
}
var log$1 = (level, ...args) => {
  if (isDevMode() && typeof console !== "undefined") {
    console[level](...args);
  }
};
var FIREBASE_APP_PROVIDER = {
  provide: FirebaseApp,
  useFactory: ɵfirebaseAppFactory,
  deps: [FIREBASE_OPTIONS, NgZone, [new Optional(), FIREBASE_APP_NAME]]
};
var AngularFireModule = class _AngularFireModule {
  static initializeApp(options, nameOrConfig) {
    return {
      ngModule: _AngularFireModule,
      providers: [{
        provide: FIREBASE_OPTIONS,
        useValue: options
      }, {
        provide: FIREBASE_APP_NAME,
        useValue: nameOrConfig
      }]
    };
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(platformId) {
    firebase.registerVersion("angularfire", VERSION2.full, "core");
    firebase.registerVersion("angularfire", VERSION2.full, "app-compat");
    firebase.registerVersion("angular", VERSION.full, platformId.toString());
  }
  static ɵfac = function AngularFireModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AngularFireModule)(ɵɵinject(PLATFORM_ID));
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _AngularFireModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [FIREBASE_APP_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularFireModule, [{
    type: NgModule,
    args: [{
      providers: [FIREBASE_APP_PROVIDER]
    }]
  }], () => [{
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], null);
})();
function ɵcacheInstance(cacheKey, moduleName, appName, fn, deps) {
  const [, instance, cachedDeps] = globalThis.ɵAngularfireInstanceCache.find((it) => it[0] === cacheKey) || [];
  if (instance) {
    if (!matchDep(deps, cachedDeps)) {
      log("error", `${moduleName} was already initialized on the ${appName} Firebase App with different settings.${IS_HMR ? " You may need to reload as Firebase is not HMR aware." : ""}`);
      log("warn", {
        is: deps,
        was: cachedDeps
      });
    }
    return instance;
  } else {
    const newInstance = fn();
    globalThis.ɵAngularfireInstanceCache.push([cacheKey, newInstance, deps]);
    return newInstance;
  }
}
function matchDep(a, b) {
  try {
    return a.toString() === b.toString();
  } catch (_) {
    return a === b;
  }
}
var IS_HMR = typeof module !== "undefined" && !!module.hot;
var log = (level, ...args) => {
  if (isDevMode() && typeof console !== "undefined") {
    console[level](...args);
  }
};
globalThis.ɵAngularfireInstanceCache ||= [];

// node_modules/@angular/fire/fesm2022/angular-fire-compat-auth.mjs
var import_rxjs = __toESM(require_cjs(), 1);
var import_operators = __toESM(require_operators(), 1);
var proxyPolyfillCompat = {
  name: null,
  config: null,
  emulatorConfig: null,
  app: null,
  applyActionCode: null,
  checkActionCode: null,
  confirmPasswordReset: null,
  createUserWithEmailAndPassword: null,
  currentUser: null,
  fetchSignInMethodsForEmail: null,
  isSignInWithEmailLink: null,
  getRedirectResult: null,
  languageCode: null,
  settings: null,
  onAuthStateChanged: null,
  onIdTokenChanged: null,
  sendSignInLinkToEmail: null,
  sendPasswordResetEmail: null,
  setPersistence: null,
  signInAndRetrieveDataWithCredential: null,
  signInAnonymously: null,
  signInWithCredential: null,
  signInWithCustomToken: null,
  signInWithEmailAndPassword: null,
  signInWithPhoneNumber: null,
  signInWithEmailLink: null,
  signInWithPopup: null,
  signInWithRedirect: null,
  signOut: null,
  tenantId: null,
  updateCurrentUser: null,
  useDeviceLanguage: null,
  useEmulator: null,
  verifyPasswordResetCode: null
};
var USE_EMULATOR = new InjectionToken("angularfire2.auth.use-emulator");
var SETTINGS = new InjectionToken("angularfire2.auth.settings");
var TENANT_ID = new InjectionToken("angularfire2.auth.tenant-id");
var LANGUAGE_CODE = new InjectionToken("angularfire2.auth.langugage-code");
var USE_DEVICE_LANGUAGE = new InjectionToken("angularfire2.auth.use-device-language");
var PERSISTENCE = new InjectionToken("angularfire.auth.persistence");
var ɵauthFactory = (app, zone, useEmulator, tenantId, languageCode, useDeviceLanguage, settings, persistence) => ɵcacheInstance(`${app.name}.auth`, "AngularFireAuth", app.name, () => {
  const auth = zone.runOutsideAngular(() => app.auth());
  if (useEmulator) {
    auth.useEmulator(...useEmulator);
  }
  if (tenantId) {
    auth.tenantId = tenantId;
  }
  auth.languageCode = languageCode;
  if (useDeviceLanguage) {
    auth.useDeviceLanguage();
  }
  if (settings) {
    for (const [k, v] of Object.entries(settings)) {
      auth.settings[k] = v;
    }
  }
  if (persistence) {
    auth.setPersistence(persistence);
  }
  return auth;
}, [useEmulator, tenantId, languageCode, useDeviceLanguage, settings, persistence]);
var AngularFireAuth = class _AngularFireAuth {
  injector = inject(EnvironmentInjector);
  /**
   * Observable of authentication state; as of Firebase 4.0 this is only triggered via sign-in/out
   */
  authState;
  /**
   * Observable of the currently signed-in user's JWT token used to identify the user to a Firebase service (or null).
   */
  idToken;
  /**
   * Observable of the currently signed-in user (or null).
   */
  user;
  /**
   * Observable of the currently signed-in user's IdTokenResult object which contains the ID token JWT string and other
   * helper properties for getting different data associated with the token as well as all the decoded payload claims
   * (or null).
   */
  idTokenResult;
  /**
   * Observable of the currently signed-in user's credential, or null
   */
  credential;
  constructor(options, name2, platformId, zone, schedulers, useEmulator, settings, tenantId, languageCode, useDeviceLanguage, persistence, _appCheckInstances) {
    const logins = new import_rxjs.Subject();
    const auth = (0, import_rxjs.of)(void 0).pipe((0, import_operators.observeOn)(schedulers.outsideAngular), (0, import_operators.switchMap)(() => zone.runOutsideAngular(() => import("./dist-53VSYJOW.js"))), (0, import_operators.map)(() => ɵfirebaseAppFactory(options, zone, name2)), (0, import_operators.map)((app) => ɵauthFactory(app, zone, useEmulator, tenantId, languageCode, useDeviceLanguage, settings, persistence)), (0, import_operators.shareReplay)({
      bufferSize: 1,
      refCount: false
    }));
    if (isPlatformServer(platformId)) {
      this.authState = this.user = this.idToken = this.idTokenResult = this.credential = (0, import_rxjs.of)(null);
    } else {
      auth.pipe((0, import_operators.first)()).subscribe();
      const redirectResult = auth.pipe((0, import_operators.switchMap)((auth2) => auth2.getRedirectResult().then((it) => it, () => null)), pendingUntilEvent(this.injector), (0, import_operators.shareReplay)({
        bufferSize: 1,
        refCount: false
      }));
      const authStateChanged = auth.pipe((0, import_operators.switchMap)((auth2) => new import_rxjs.Observable((sub) => ({
        unsubscribe: zone.runOutsideAngular(() => auth2.onAuthStateChanged((next) => sub.next(next), (err) => sub.error(err), () => sub.complete()))
      }))));
      const idTokenChanged = auth.pipe((0, import_operators.switchMap)((auth2) => new import_rxjs.Observable((sub) => ({
        unsubscribe: zone.runOutsideAngular(() => auth2.onIdTokenChanged((next) => sub.next(next), (err) => sub.error(err), () => sub.complete()))
      }))));
      this.authState = redirectResult.pipe((0, import_operators.switchMapTo)(authStateChanged), (0, import_operators.subscribeOn)(schedulers.outsideAngular), (0, import_operators.observeOn)(schedulers.insideAngular));
      this.user = redirectResult.pipe((0, import_operators.switchMapTo)(idTokenChanged), (0, import_operators.subscribeOn)(schedulers.outsideAngular), (0, import_operators.observeOn)(schedulers.insideAngular));
      this.idToken = this.user.pipe((0, import_operators.switchMap)((user) => user ? (0, import_rxjs.from)(user.getIdToken()) : (0, import_rxjs.of)(null)));
      this.idTokenResult = this.user.pipe((0, import_operators.switchMap)((user) => user ? (0, import_rxjs.from)(user.getIdTokenResult()) : (0, import_rxjs.of)(null)));
      this.credential = (0, import_rxjs.merge)(
        redirectResult,
        logins,
        // pipe in null authState to make credential zipable, just a weird devexp if
        // authState and user go null to still have a credential
        this.authState.pipe((0, import_operators.filter)((it) => !it))
      ).pipe(
        // handle the { user: { } } when a user is already logged in, rather have null
        // TODO handle the type corcersion better
        (0, import_operators.map)((credential) => credential?.user ? credential : null),
        (0, import_operators.subscribeOn)(schedulers.outsideAngular),
        (0, import_operators.observeOn)(schedulers.insideAngular)
      );
    }
    return ɵlazySDKProxy(this, auth, zone, {
      spy: {
        apply: (name3, _, val) => {
          if (name3.startsWith("signIn") || name3.startsWith("createUser")) {
            val.then((user) => logins.next(user));
          }
        }
      }
    });
  }
  static ɵfac = function AngularFireAuth_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AngularFireAuth)(ɵɵinject(FIREBASE_OPTIONS), ɵɵinject(FIREBASE_APP_NAME, 8), ɵɵinject(PLATFORM_ID), ɵɵinject(NgZone), ɵɵinject(ɵAngularFireSchedulers), ɵɵinject(USE_EMULATOR, 8), ɵɵinject(SETTINGS, 8), ɵɵinject(TENANT_ID, 8), ɵɵinject(LANGUAGE_CODE, 8), ɵɵinject(USE_DEVICE_LANGUAGE, 8), ɵɵinject(PERSISTENCE, 8), ɵɵinject(AppCheckInstances, 8));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AngularFireAuth,
    factory: _AngularFireAuth.ɵfac,
    providedIn: "any"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularFireAuth, [{
    type: Injectable,
    args: [{
      providedIn: "any"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [FIREBASE_OPTIONS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [FIREBASE_APP_NAME]
    }]
  }, {
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: NgZone
  }, {
    type: ɵAngularFireSchedulers
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [USE_EMULATOR]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [SETTINGS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [TENANT_ID]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [LANGUAGE_CODE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [USE_DEVICE_LANGUAGE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [PERSISTENCE]
    }]
  }, {
    type: AppCheckInstances,
    decorators: [{
      type: Optional
    }]
  }], null);
})();
ɵapplyMixins(AngularFireAuth, [proxyPolyfillCompat]);
var AngularFireAuthModule = class _AngularFireAuthModule {
  constructor() {
    firebase.registerVersion("angularfire", VERSION2.full, "auth-compat");
  }
  static ɵfac = function AngularFireAuthModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AngularFireAuthModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _AngularFireAuthModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [AngularFireAuth]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularFireAuthModule, [{
    type: NgModule,
    args: [{
      providers: [AngularFireAuth]
    }]
  }], () => [], null);
})();
export {
  AngularFireAuth,
  AngularFireAuthModule,
  LANGUAGE_CODE,
  PERSISTENCE,
  SETTINGS,
  TENANT_ID,
  USE_DEVICE_LANGUAGE,
  USE_EMULATOR,
  ɵauthFactory
};
/*! Bundled license information:

firebase/compat/app/dist/index.mjs:
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
*/
//# sourceMappingURL=@angular_fire_compat_auth.js.map
