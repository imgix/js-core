# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.2](https://github.com/imgix/imgix-core-js/compare/2.3.1...2.3.2) (2020-10-12)

* fix(buildURL): ensure operation is idempotent ([#168](https://github.com/imgix/imgix-core-js/pull/168))

## [2.3.1](https://github.com/imgix/imgix-core-js/compare/2.3.0...2.3.1) (2019-03-10)

* fix: add missing variable declarations ([#121](https://github.com/imgix/imgix-core-js/pull/121))

## [2.3.0](https://github.com/imgix/imgix-core-js/compare/2.2.1...2.3.0) (2019-03-04)

* feat: add srcset option parameter to buildSrcSet() method signature ([#118](https://github.com/imgix/imgix-core-js/pull/118))
* perf(srcset): memoize generated srcset width-pairs ([#115](https://github.com/imgix/imgix-core-js/pull/115))
* fix: throw error when certain srcset modifiers are passed zero ([#114](https://github.com/imgix/imgix-core-js/pull/114))
* feat: append variable qualities to dpr srcsets ([#111](https://github.com/imgix/imgix-core-js/pull/111))
* feat: add support for defining a custom srcset width array ([#110](https://github.com/imgix/imgix-core-js/pull/110))
* feat: add support for defining a custom srcset width tolerance ([#109](https://github.com/imgix/imgix-core-js/pull/109))
* feat: add support for defining a min and max srcset width ([#108](https://github.com/imgix/imgix-core-js/pull/108))

## [2.2.1](https://github.com/imgix/imgix-core-js/compare/2.2.0...2.2.1) (2019-11-27)

* build(deps): remove typescript as runtime dependency ([#77](https://github.com/imgix/imgix-core-js/pull/77))

## [2.2.1](https://github.com/imgix/imgix-core-js/compare/2.2.0...2.2.1) (2019-11-27)

* build(deps): remove typescript as runtime dependency ([#77](https://github.com/imgix/imgix-core-js/pull/77))

## [2.2.0](https://github.com/imgix/imgix-core-js/compare/2.1.2...2.2.0) (2019-10-22)

* feat: add typescript declaration file for `ImgixClient` ([#64](https://github.com/imgix/imgix-core-js/pull/64))

## [2.1.2](https://github.com/imgix/imgix-core-js/compare/2.1.1...2.1.2) (2019-09-17)

* fix: ensure URL-legal, path-illegal characters are encoded ([#61](https://github.com/imgix/imgix-core-js/pull/61))

## [2.1.1](https://github.com/imgix/imgix-core-js/compare/2.1.0...2.1.1) (2019-07-28)

* fix: include dpr parameter when generating fixed-width srcset ([#59](https://github.com/imgix/imgix-core-js/pull/59))

## [2.1.0](https://github.com/imgix/imgix-core-js/compare/1.2.1...2.1.0) (2019-07-28)

* feat: add srcset generation ([#53](https://github.com/imgix/imgix-core-js/pull/53))

# [2.0.0](https://github.com/imgix/imgix-core-js/compare/1.4.0...2.0.0) (2019-06-06)

* fix: remove deprecated domain sharding functionality ([#42](https://github.com/imgix/imgix-core-js/pull/42))
* fix: remove deprecated settings.host ([#45](https://github.com/imgix/imgix-core-js/pull/45))

## [1.4.0](https://github.com/imgix/imgix-core-js/compare/1.3.0...1.4.0) (2019-06-05)

* docs: deprecate settings.domains ([#43](https://github.com/imgix/imgix-core-js/pull/43))
* feat: add settings.domain argument ([#44](https://github.com/imgix/imgix-core-js/pull/44))

## [1.3.0](https://github.com/imgix/imgix-core-js/compare/1.2.1...1.3.0) (2019-05-07)

*   deprecate domain sharding ([#39](https://github.com/imgix/imgix-core-js/pull/39))
