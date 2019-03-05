# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.1](https://github.com/paritytech/js-libs/compare/v4.1.0...v4.1.1) (2019-03-05)


### Bug Fixes

* fix light.js docs not clickable ([#202](https://github.com/paritytech/js-libs/issues/202)) ([87b4d1f](https://github.com/paritytech/js-libs/commit/87b4d1f)), closes [#146](https://github.com/paritytech/js-libs/issues/146)





# [4.1.0](https://github.com/paritytech/js-libs/compare/v4.0.3...v4.1.0) (2019-03-05)


### Features

* createRpc & createPubSub: defer getApi & delay unsubscription ([#197](https://github.com/paritytech/js-libs/issues/197)) ([191f1d2](https://github.com/paritytech/js-libs/commit/191f1d2))
* fix build errored in [#197](https://github.com/paritytech/js-libs/issues/197) ([#201](https://github.com/paritytech/js-libs/issues/201)) ([1e0790d](https://github.com/paritytech/js-libs/commit/1e0790d))





## [4.0.3](https://github.com/paritytech/js-libs/compare/v4.0.2...v4.0.3) (2019-02-04)

**Note:** Version bump only for package js-libs





## [4.0.2](https://github.com/paritytech/js-libs/compare/v4.0.1...v4.0.2) (2019-01-22)

**Note:** Version bump only for package js-libs





## [4.0.1](https://github.com/paritytech/js-libs/compare/v4.0.0...v4.0.1) (2019-01-22)

**Note:** Version bump only for package js-libs





# [4.0.0](https://github.com/paritytech/js-libs/compare/v3.0.31...v4.0.0) (2019-01-22)


### Code Refactoring

* Rewrite post$ to take a password and not use signer ([689ae52](https://github.com/paritytech/js-libs/commit/689ae52))


### BREAKING CHANGES

* `post$` now requires `passphrase` in its options.

Non-constant contract method calls from `makeContract` now require `passphrase` in their options.

`post$` now returns `{estimated}?` `{signed}` `{sent}` `{confirmed}` and postRaw$ now returns `{sent}` `{confirmed}`
