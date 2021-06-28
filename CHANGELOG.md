# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [v3.2.1](https://github.com/imgix/js-core/compare/v3.2.0...v3.2.1) (2021-06-28)

* build: remove stale `.d.ts` file from `dist` ([#293](https://github.com/imgix/js-core/pull/293))

## [v3.2.0](https://github.com/imgix/js-core/compare/v3.1.3...v3.2.0) (2021-06-22)

* feat: export srcset TypeScript interface ([#283](https://github.com/imgix/js-core/pull/283))
* fix: remove "v" prefix from `VERSION` constant ([#289](https://github.com/imgix/js-core/pull/289))
* fix: ensure `undefined` parameters not added to url ([#286](https://github.com/imgix/js-core/pull/286))

## [v3.1.3](https://github.com/imgix/js-core/compare/v3.1.2...v3.1.3) (2021-03-25)

* build: declare esm as devDep ([#273](https://github.com/imgix/js-core/pull/273))

## [v3.1.2](https://github.com/imgix/js-core/compare/v3.1.1...v3.1.2) (2021-03-25)

* fix: improve error messages for target width validator ([#267](https://github.com/imgix/js-core/pull/267))
* build: use js extensions ([#269](https://github.com/imgix/js-core/pull/269))

## [v3.1.1](https://github.com/imgix/js-core/compare/v3.1.0...v3.1.1) (2021-03-23)

* fix: validate minWidth, maxWidth, widthTolerance ([#257](https://github.com/imgix/js-core/pull/257))
* fix: remove type and browser attributes from package.json ([#260](https://github.com/imgix/js-core/pull/260))
* build: tell rollup we want to explicitly export default ([#262](https://github.com/imgix/js-core/pull/262))
 
## [v3.1.0](https://github.com/imgix/js-core/compare/v3.0.0...v3.1.0) (2021-03-09)

* fix: typings for ImgixClient.targetWidths ([47658bc](https://github.com/imgix/js-core/commit/47658bc4869a156db6541cd97dfb41f6cc23351f))

## [v3.0.0](https://github.com/imgix/js-core/compare/v2.3.2...v3.0.0) (2021-03-08)

* feat: esm rewrite ([#188](https://github.com/imgix/js-core/pull/188))
* feat: remove ensureEven requirement ([#206](https://github.com/imgix/js-core/pull/206))
* feat: use mjs file extensions with type module ([#209](https://github.com/imgix/js-core/pull/209))
* feat: enforce 0.01 lower bound for widthTolerance ([#211](https://github.com/imgix/js-core/pull/211))
* feat: create a DPR srcset when a fixed height is specified ([#215](https://github.com/imgix/js-core/pull/215))
* feat: drop bower.json ([#222](https://github.com/imgix/js-core/pull/222))
* fix: percent encode plus signs in path components ([#223](https://github.com/imgix/js-core/pull/223))
* feat: static targetWidths functionality ([#248](https://github.com/imgix/js-core/pull/248))
  
## [v3.0.0-beta.4](https://github.com/imgix/js-core/compare/v3.0.0-beta.2...v3.0.0-beta.4) (2021-03-04)

* feat: static targetWidths functionality ([#248](https://github.com/imgix/js-core/pull/248))

## [v3.0.0-beta.2](https://github.com/imgix/js-core/compare/2.3.2...v3.0.0-beta.2) (2021-02-24)

* feat: esm rewrite ([#188](https://github.com/imgix/js-core/pull/188))
* feat: remove ensureEven requirement ([#206](https://github.com/imgix/js-core/pull/206))
* feat: use mjs file extensions with type module ([#209](https://github.com/imgix/js-core/pull/209))
* feat: enforce 0.01 lower bound for widthTolerance ([#211](https://github.com/imgix/js-core/pull/211))
* feat: create a DPR srcset when a fixed height is specified ([#215](https://github.com/imgix/js-core/pull/215))
* feat: drop bower.json ([#222](https://github.com/imgix/js-core/pull/222))
* fix: percent encode plus signs in path components ([#223](https://github.com/imgix/js-core/pull/223))

## [2.3.2](https://github.com/imgix/js-core/compare/2.3.1...2.3.2) (2020-10-12)

* fix(buildURL): ensure operation is idempotent ([#168](https://github.com/imgix/js-core/pull/168))

## [2.3.1](https://github.com/imgix/js-core/compare/2.3.0...2.3.1) (2019-03-10)

* fix: add missing variable declarations ([#121](https://github.com/imgix/js-core/pull/121))

## [2.3.0](https://github.com/imgix/js-core/compare/2.2.1...2.3.0) (2019-03-04)

* feat: add srcset option parameter to buildSrcSet() method signature ([#118](https://github.com/imgix/js-core/pull/118))
* perf(srcset): memoize generated srcset width-pairs ([#115](https://github.com/imgix/js-core/pull/115))
* fix: throw error when certain srcset modifiers are passed zero ([#114](https://github.com/imgix/js-core/pull/114))
* feat: append variable qualities to dpr srcsets ([#111](https://github.com/imgix/js-core/pull/111))
* feat: add support for defining a custom srcset width array ([#110](https://github.com/imgix/js-core/pull/110))
* feat: add support for defining a custom srcset width tolerance ([#109](https://github.com/imgix/js-core/pull/109))
* feat: add support for defining a min and max srcset width ([#108](https://github.com/imgix/js-core/pull/108))

## [2.2.1](https://github.com/imgix/js-core/compare/2.2.0...2.2.1) (2019-11-27)

* build(deps): remove typescript as runtime dependency ([#77](https://github.com/imgix/js-core/pull/77))

## [2.2.1](https://github.com/imgix/js-core/compare/2.2.0...2.2.1) (2019-11-27)

* build(deps): remove typescript as runtime dependency ([#77](https://github.com/imgix/js-core/pull/77))

## [2.2.0](https://github.com/imgix/js-core/compare/2.1.2...2.2.0) (2019-10-22)

* feat: add typescript declaration file for `ImgixClient` ([#64](https://github.com/imgix/js-core/pull/64))

## [2.1.2](https://github.com/imgix/js-core/compare/2.1.1...2.1.2) (2019-09-17)

* fix: ensure URL-legal, path-illegal characters are encoded ([#61](https://github.com/imgix/js-core/pull/61))

## [2.1.1](https://github.com/imgix/js-core/compare/2.1.0...2.1.1) (2019-07-28)

* fix: include dpr parameter when generating fixed-width srcset ([#59](https://github.com/imgix/js-core/pull/59))

## [2.1.0](https://github.com/imgix/js-core/compare/1.2.1...2.1.0) (2019-07-28)

* feat: add srcset generation ([#53](https://github.com/imgix/js-core/pull/53))

# [2.0.0](https://github.com/imgix/js-core/compare/1.4.0...2.0.0) (2019-06-06)

* fix: remove deprecated domain sharding functionality ([#42](https://github.com/imgix/js-core/pull/42))
* fix: remove deprecated settings.host ([#45](https://github.com/imgix/js-core/pull/45))

## [1.4.0](https://github.com/imgix/js-core/compare/1.3.0...1.4.0) (2019-06-05)

* docs: deprecate settings.domains ([#43](https://github.com/imgix/js-core/pull/43))
* feat: add settings.domain argument ([#44](https://github.com/imgix/js-core/pull/44))

## [1.3.0](https://github.com/imgix/js-core/compare/1.2.1...1.3.0) (2019-05-07)

*   deprecate domain sharding ([#39](https://github.com/imgix/js-core/pull/39))
