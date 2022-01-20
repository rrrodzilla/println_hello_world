+++
title = "📦 Publishing to Crates.io"
date = 2021-08-06
description = "Publishing a crate to the crates.io registry can be intimidating to new rustaceans, especially when unexpected errors occur. Learn how to get your code in front of the Rust community with minimal pain."
[taxonomies]
stacks=["rust", "crates.io"]
frameworks=[]
header=["HOW TO"]
+++

Busy?  Read the [TLDR](#tldr).

![The logo for the cargo-markdown cargo subcommand which can be found the crates.io website, portrays a box pallet with a two-level stack of boxes with the Rust logo on them, on a green background with a thick yellow border next to a Markdown logo consisting of a capitalize white letter M next to a large white arrow pointing downwards.](https://raw.githubusercontent.com/rrrodzilla/cargo-registry-preview/main/assets/cargo_markdown_logo.png)

---

## Table of Contents

1) [Introduction](#introduction)
2) [Where I went wrong (spoiler: RTFM)](#where-i-went-wrong-spoiler-rtfm)
    - [The pathtrim crate](#the-pathtrim-crate)
    - [The rusty_paseto crate](#the-rusty-paseto-crate)
3) [A better way](#a-better-way)
    - [Create an account](#create-an-account)
    - [Then do it again on staging](#then-do-it-again-on-staging)
        - [Important caveat about staging](#important-caveat-about-staging)
    - [Get your manifest file in order](#get-your-manifest-file-in-order)
        - [license or license-file](#red-circle-license-or-license-file)
        - [description](#red-circle-description)
        - [homepage](#homepage)
        - [documentation](#documentation)
        - [repository](#repository)
        - [keywords](#red-circle-keywords)
        - [categories](#red-circle-categories)
        - [authors](#black-circle-authors)
        - [readme](#black-circle-readme)
        - [Exclude with excludes](#black-circle-exclude-with-excludes)
    - [About that readme](#about-that-readme)
        - [cargo-markdown FTW](#cargo-markdown-ftw)
4) [Ship it!](#ship-it)
5) [Ship it again!](#ship-it-again)
6) [Uh oh, unship it!](#uh-oh-unship-it)
7) [Does your crate belong on crates.io?](#does-your-crate-belong-on-crates-io)
    - [Think small](#think-small)
    - [Use feature gates for bigger packages](#use-feature-gates-for-bigger-packages)
8) [Where to get help](#where-to-get-help)
9) [Acknowledgements](#acknowledgements)
10) [TLDR](#tldr)

---

## Introduction

The first crate I published was [a simple trait](https://crates.io/crates/pathtrim) for trimming the paths of anything that implements `AsRef<std::path::Path>`.  The trait was in response to a thread on the Rust discord community from someone looking for help and also so I could gain experience publishing to [crates.io](https://crates.io).  I was also looking to gain first-hand experience with the publishing process before I attempted to publish [rusty_paseto](https://crates.io/crates/rusty_paseto), a much larger crate implementing [the PASETO protocol (a safer alternative to JWT)](https://paragonie.com/blog/2018/03/paseto-platform-agnostic-security-tokens-is-secure-alternative-jose-standards-jwt-etc) which took a few months to write. 

Even though I'd read the [section on publishing to crates.io](https://doc.rust-lang.org/cargo/reference/publishing.html) in the [online Cargo Book](https://doc.rust-lang.org/cargo/index.html), I still bumped into several issues when I tried to publish this simple crate. This article is the distillation of what I learned publishing the simple [pathtrim](https://crates.io/crates/pathtrim) crate as well as [several others](https://crates.io/users/rrrodzilla) over the past few weeks. 

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

## Where I went wrong (spoiler: RTFM)

### The pathtrim crate

To be clear, most of the initial problems I incurred were because I didn't wholly [RTFM](https://en.wikipedia.org/wiki/RTFM).


The [TLDR](https://en.wikipedia.org/wiki/Wikipedia:Too_long;_didn't_read) from the [Cargo Book](https://doc.rust-lang.org/cargo/index.html) [section on publishing to crates.io](https://doc.rust-lang.org/cargo/reference/publishing.html) basically goes as follows:

1. Create an account on [crates.io](https://crates.io)
2. Login locally via `cargo login` with your API key
3. Ensure you have certain required manifest keys in your cargo.toml manifest file
4. Run `cargo publish --dry-run` to uncover warnings or errors before you finally,
5. Run `cargo publish` to push your packaged crate up to [crates.io](https://crates.io) 

Doesn't seem too tricky, right?  I got my code prettied up, added documentation, tests and got ready to publish.  Creating an account on crates.io, obtaining an API key and conducting a login were straightforward.  I ran `cargo publish --dry-run` from my project directory, and the only warning I received:

```fish
warning: aborting upload due to dry run
```

Fantastic!  All's good, let's ship it!

I ran `cargo publish`; the crate is packaged, verified, compiled, and uploaded. Sweet!

Hold up...
```fish
error: failed to publish to registry
```
Followed by...
```fish
invalid upload request: invalid length 6, expected at most 5 [keywords](#red-circle-keywords)
```
Ouch. Ok, I guess you can only have 5 [keywords](#red-circle-keywords). Trimmed my [keywords](#red-circle-keywords) list down and tried a dry-run again.  Again all good.  Now to ship to crates.io! Running `cargo publish` yields:

```fish
error: failed to publish to registry
```
...and...
```fish
invalid upload request: invalid length 6, expected at most 5 [categories](#red-circle-categories)
```

Right.  I probably should have checked that.  Fix and repeat the command after another successful dry run.
```fish
warning: the following are not valid [category](#red-circle-categories) slugs and were ignored...<some [category](#red-circle-categories) names>...
...Please see https://crates.io/category_slugs for the list of all [category](#red-circle-categories) slugs.
```

Whoops.  This one was only a warning, so the crate was successfully uploaded.

And yet I'm still not happy knowing one or more of my [category](#red-circle-categories) names were ignored, and my crate will be less discoverable than I'd like.  After looking at the [list of available category names](https://crates.io/category_slugs), I fixed up my manifest (I think one was misspelled) and tried again.  

Now I get:
```fish
error: failed to publish to registry...crate version '1.0.0' is already uploaded
```

Argh.  I wish the previous errors had been caught during the dry run.  Now I need to either wait until I can publish a new version with a unique version number or just bite the bullet and publish a bumped [semver](https://semver.org) patch number.  

For my first crate, I go ahead and do that.  Then I did it a few more times after noticing minor formatting issues on the [readme](#black-circle-readme) and in the docs.

After pushing up **v1.06**, I finally have things looking the way I want them to, and the [pathtrim](https://crates.io/crates/pathtrim) crate is successfully published to crates.io.  I wasn't expecting anybody but myself to use the crate, but I was pleasantly surprised to see dozens of downloads over the next few days nonetheless.

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

### The rusty_paseto crate

With [rusty_paseto](https://crates.io/crates/rusty_paseto), I was determined not to make the same mistakes twice.  I'd worked many hours on this code and wanted to put my best foot forward, especially since I am trying to assemble the beginnings of [a portfolio of open source work](https://github.com/rrrodzilla) to start a job hunt to write Rust code full-time.  

I ensured my manifest file contained the correct number of [keywords](#red-circle-keywords), [categories](#red-circle-categories) and that the [categories](#red-circle-categories) I selected exactly matched only [categories](#red-circle-categories) from [the official category slug list](https://crates.io/category_slugs).  I also spent a good amount of time formatting my [readme](#black-circle-readme) file and previewing it on Github to make sure everything looked just right.  

This time I run `cargo publish`, cross my fingers and then relax when I see [rusty_paseto](https://crates.io/crates/rusty_paseto) is published successfully with no errors or warnings.  Awesome.  

I head over to the crate's information page on crates.io and immediately see [a bunch of formatting issues with my readme file](https://crates.io/crates/rusty_paseto/0.2.6). I should have considered that crates.io would not support the same Markdown that Github does.  Additionally, the content area hosting the [readme](#black-circle-readme) file as HTML is about 2/3rds the width of the 930 pixels the rest of the main content area takes up.  Opening dev tools and viewing in mobile format looks even worse. ☹️  

At this point, I stop and re-assess. There's got to be a better way to get my crate published on the first try looking how I intended.

The rest of this article is dedicated to showing you how to do just that.

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

## A better way

Ok, you've written your code.  You've tested it.  You've written documentation.  You've written doc tests, and all tests are green (you are using [doc tests](https://doc.rust-lang.org/rustdoc/documentation-tests.html), aren't you?).  Although it's not required for publishing, if you're publishing a library, you should definitely check your public API against the [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/).  You're feeling good, and you're ready to send your code out into the world.  

### Create an account

First things first, you’ll need an account on [crates.io](https://crates.io) to acquire an API token. To do so, visit the home page and log in via a [GitHub account](https://github.com) (required for now). After this, see [your Account Settings page](https://crates.io/settings/profile) and click on **API Tokens** on the left side menu.  Generate a new token.  You'll also need to confirm your email address.  Then go to your command line and run the command below with the API key you were provided:

```fish
cargo login yourprovidedapikey 
```

This command will inform Cargo of your API token and store it locally in your `~/.cargo/credentials.toml`.

<div class="text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
This token is a secret and should not be shared with anyone else. If it leaks for any reason, you should revoke it immediately.
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

### Then do it again on staging

Now you have that done, you should do it again, this time on the [crates.io staging site](https://staging.crates.io)  

What's that?  Didn't you know there was a [staging site for crates.io](https://staging.crates.io) and that you could use it?  Me neither!  But @pietroalbini from the *crates.io team* in the [rust language discord channel](https://discordapp.com/channels/442252698964721669/448525639469891595) clued me into it while I was figuring things out for my own crates.  

In addition to signing up at [https://staging.crates.io](https://staging.crates.io), verifying your email again, and obtaining an API key, you'll have a couple more steps to accomplish on your local machine before you can log in with your staging API key.

Edit or create your `~/.cargo/config` file and add the following entry:
```toml
staging = { index = "https://github.com/rust-lang/staging.crates.io-index" }
```

Now you can run the following from your command line:
```fish
cargo login --registry=staging yourstagingapikey
```

And to publish to staging run:
```fish
cargo publish --registry=staging
```

Now you can test things out without worrying about pushing to the live site, which is permanent.  You'll still need to increment your version number, but you can just change it back in your Cargo.toml manifest file before you go live since it doesn't matter on staging.

#### Important caveat about staging!

An unfortunate limitation regarding the staging site severely limits its usefulness.  In particular keep the following in mind:

<div class="text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Uploading your crate to staging will <span class="font-bold inline-block">fail</span> if any of the other crates you have as a dependency are not already on staging. 
</div>
</div>

Given that at the time of this writing, we're **approaching 75 thousand crates** published to the live site, but there are **less than 7 thousand crates** on the staging site, the chances of this impacting you are high.  

Unfortunately, you'll get an error as you are publishing *(without --dry-run)* so you won't even get notified if you have a [keywords](#red-circle-keywords) or [category](#red-circle-categories) error until you get past the `Dependency is hosted on another registry` error.  

One workaround is to create an empty project `cargo new test_crate --lib` and copy in your crate's working manifest file (without dependencies), so you can verify your [categories](#red-circle-categories) and [keywords](#red-circle-keywords) don't fail on staging before going live.

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

### Get your manifest file in order

The table below shows some helpful [manifest package keys](https://doc.rust-lang.org/cargo/reference/manifest.html) you'll want for publishing.  This is far from inclusive as there are [plenty more you can use](https://doc.rust-lang.org/cargo/reference/manifest.html) but these are the primary keys I recommend for publishing to [crates.io](https://crates.io). 

A brief description of each key, as well as the warning or error that might be generated, follows:


| Relevant manifest keys |during<br />--dry-run|during<br/>publish| after<br />publish | 
| ------------: |:---:|:---:|:---:|
| [license or license file](#red-circle-license-or-license-file) |🟡|🔴|⚫|
| [description](#red-circle-description)		|🟡|🔴|⚫|
| [homepage](#homepage)	|🟡|🟡|🟡| 
| [documentation](#documentation)		|🟡|🟡|🟡| 
| [repository](#repository)		|🟡|🟡|🟡|
| [keywords](#red-circle-keywords)	|⚫|🔴|⚫|
| [categories](#red-circle-categories)  |⚫|🔴|🟡|
| [authors](#black-circle-authors)	|⚫|⚫|⚫|
| [readme](#black-circle-readme)		|⚫|⚫|⚫|

<div class="flex flex-col md:flex-row place-content-center"><div class="flex mx-4">🟡 warning</div><div class="flex mx-4">🔴 error</div><div class="flex mx-4">⚫ nothing</div></div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### 🔴 license or license file

Use one or the other:

The `license` field contains the name of the software license that the package is released under. 

The `license-file` field contains the path to a file containing the text of the license (relative to this Cargo.toml).

See additional details on [the manifest reference](https://doc.rust-lang.org/cargo/reference/manifest.html#the-license-and-license-file-fields).

<div class="my-2 text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Running <span class="font-bold">cargo publish --dry-run</span> will generate a warning if neither of these keys are specified
</div>
</div>

<div class="my-2 text-sm md:text-base bg-red-500 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Ignoring the warning above and running <span class="font-bold">cargo publish</span> will generate an error and fail to publish as this key is required
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### 🔴 description

The `description` is a short blurb about the package. [crates.io](https://crates.io) will display this with your package. This should be plain text (not Markdown).

<div class="my-2 text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Running <span class="font-bold">cargo publish --dry-run</span> will generate a warning if this key is missing
</div>
</div>

<div class="my-2 text-sm md:text-base bg-red-500 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Ignoring the warning above and running <span class="font-bold">cargo publish</span> will generate an error and fail to publish as this key is required
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### 🟡 homepage

The `homepage` field should be a URL to a site that is the home page for your package if you have one.  Smaller, simpler crates likely will not.

<div class="my-2 text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
A warning is generated when homepage, repository and documentation are all missing from the manifest
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### 🟡 documentation

The documentation field specifies a URL to a website hosting the crate's documentation. If no URL is set in the manifest file, crates.io will automatically link your crate to the corresponding docs.rs page.

Even if you haven't published yet, you can specify the documentation key as:

`documentation = "https://docs.rs/<your_crate_name>/latest/"`

<div class="my-2 text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
A warning is generated when homepage, repository and documentation are all missing from the manifest
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### 🟡 repository

Url to the source repository of your crate.

<div class="my-2 text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
A warning is generated when homepage, repository and documentation are all missing from the manifest
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### 🔴 keywords

While not required to be present to publish, they have to be ASCII text (so the first 128 Unicode code points).  

Choose any words you like to help people find your crate.

**note**: *Maximum of 5 keywords, start with a letter and no more than 20 characters, letters, numbers, _ or -*

<div class="my-2 text-sm md:text-base bg-red-500 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Violating the rules in the note above will generate an error when running <span class="font-bold">cargo publish</span> NOT when executing a <span class="font-bold">--dry-run</span>
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### 🔴🟡 categories

Also not required to be present when publishing; however, if you DO use them, which you SHOULD for discoverability purposes, you should be aware they are more strict than [keywords](#red-circle-keywords). 

**note**: *Maximum of 5 [categories](#red-circle-categories), case-sensitive from [this list](https://crates.io/category_slugs).*  

<div class="my-2 text-sm md:text-base bg-red-500 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Providing more than 5 categories above will generate an error when running <span class="font-bold">cargo publish</span> NOT when executing a <span class="font-bold">--dry-run</span>
</div>
</div>

<div class="my-2 text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Providing an invalid category publishes your crate warning the category was ignored.  A SemVer change is required to update. 
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### ⚫ authors

Lists people or organizations considered "authors" of the package. 

See additional details on [the manifest reference](https://doc.rust-lang.org/cargo/reference/manifest.html#the-authors-field).

<div class="my-2 text-sm md:text-base bg-yellow-400 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
You should be aware the value of this key can't be removed or changed once you publish the crate.  
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### ⚫ readme

The [readme](#black-circle-readme) key should be the path to a file in the package root (relative to your Cargo.toml) that contains general information about the package. This file will be transferred to the registry when you publish it. [Crates.io](https://crates.io) will interpret it as Markdown and render it HTML on the crate's page.

See additional details on [the manifest reference](https://doc.rust-lang.org/cargo/reference/manifest.html#the-[readme](#black-circle-readme)-field).

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

#### ⚫ Exclude with excludes

One more thing to check out depending on what you have in your project directory:  

Running `cargo publish --dry-run`, actually runs the command `cargo package` first which packages up your source code in a file called `/target/package/your_crate-semver.crate`.  You can run the command yourself if you just want to check out the package file that gets created.

If your publish command fails with an error saying the max upload size has been exceeded, you should run `cargo package --list` to see what files were included in your upload package.

Cargo-package already respects your `.gitignore` file but you can also specify additional large files you don't need to be included in your package with the [excludes manifest key](https://doc.rust-lang.org/cargo/reference/manifest.html#the-exclude-and-include-fields)

<div class="my-2 text-sm md:text-base bg-red-500 rounded-lg p-4 md:p-8 text-gray-900 flex flex-row">
<svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 md:h-12 md:w-12 mr:0 md:mr-8 text-grey-900 bold" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
</svg>
<div class="ml-2 md:ml-0">
Package files greater than <span class="font-bold">10MB</span> in size will cause the upload to fail.  No warnings are generated before running <span class="font-bold">cargo publish</span>
</div>
</div>

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

### About that readme

I've participated in [several big commercial product launches](https://www.linkedin.com/in/rodriguezrr), been part of startups acquired and failed, and have been an entrepreneur for most my life.  This has encouraged a product-based mindset to flavor my passion for technology.  Whether open or closed-source, paid or free, code released to the world is a _product_ that hopefully solves a problem for someone else.  When it comes to crates released on [crates.io](https://crates.io), your [readme](#black-circle-readme) file is the defacto landing page of your open-source product.

Your landing page should be functional and informative and guide the user into your product.  *Functional* in the sense that navigating the page should be intuitive and accessible.  Links should work and be innate, images should have descriptive alt tags for screen readers, etc.  *Informative* in the sense that content should be organized in a meaningful way and an effort should be made to adhere to basic graphic design and information architecture principles in a responsive manner (mobile *and* desktop).  

Nobody gets this right on the first go.  I know I sure don't.  It requires its own iterative development effort.  And [the layout constraints I mentioned with my experience deploying the rusty_paseto crate](#the-rusty-paseto-crate) highlight a need to be able to test your landing page within the layout shell of the [crates.io](https://crates.io) website.  

#### cargo-markdown FTW

Attempting to iterate rapidly by repeatedly deploying a [readme](#black-circle-readme) file to the [crates.io staging site](https://staging.crates.io) is far from efficient.  This is why I created the [cargo-markdown](/#) cargo subcommand to help me iterate quickly on my crate-based product frontend.  I've found it helpful for my own [readme](#black-circle-readme) files and hopefully, you will too.  It's helped me get from [this original readme page](https://crates.io/crates/rusty_paseto/0.3.1) to [this latest readme page](https://crates.io/crates/rusty_paseto/0.3.2) in a single patch version.

If this sounds interesting to you, you can [check it out here](https://crates.io/crates/cargo-markdown).

The version I'm working on currently will also do quick zero-copy link and accessibility checks with [the nom parser](https://crates.io/crates/nom) so [keep in touch](https://twitter.com/rrrodzilla) if you want to know when that version is released.

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

## Ship it!

If you've gone through everything above you can now run `cargo publish` and watch your crate push live to [crates.io](https://crates.io)

Take care when publishing a crate because a publish is permanent. The version can never be overwritten, and the code cannot be deleted. However, there is no limit to the number of versions that can be published.

Be patient because the link to the documentation site (if you're using [docs.rs](https://docs.rs)) can take a few minutes before your documentation has generated and shows up.

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

## Ship it again!

Change the version specified in your Cargo.toml manifest to release a new version. Keep in mind the [semver](https://semver.org) rules, and [consult the SemVer compatibility chapter](https://doc.rust-lang.org/cargo/reference/semver.html) of the [Cargo Book](https://doc.rust-lang.org/cargo) for what constitutes a semver-breaking change. 

Then run `cargo publish` to upload the new version.

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---


## Uh oh, unship it!

Suppose you publish your crate and realize you have an *"oh crap, that shouldn't have gone out"* situation and users should NOT use a particular version of your crate.  You should look at the [cargo yank command](https://doc.rust-lang.org/cargo/reference/publishing.html?highlight=yank#managing-a-cratesio-based-crate) which won't delete the code from the registry but will prevent users from being able to use the version you specifically yank.

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

## Does your crate belong on crates.io?

If it's helpful to you, it's likely to benefit others one day.  Many Rust users agree that one of the best things about programming in Rust is the fantastic community.  Sharing code on crates.io is a way to contribute your skills to that community.  The whole ecosystem improves when others can use your code in various real-world scenarios providing feedback, pull requests, and/or issues to be addressed.  You'll learn much about how your code gets used, and plenty about how to create and manage software other people use, even if you're only currently writing it for yourself.  

### Think small

When it comes to determining what you should share on crates.io, you should favor simplicity. [Small, simple crates](https://crates.io/crates/pathtrim) of functionality are likely to be more valuable since they can be assembled like simple building blocks and you won't be able to predict all the different ways users might want to consume your code when publishing it.  

### Use feature gates for bigger packages

[Larger crates](https://crates.io/crates/rusty_paseto) are fine, but put some thought into how [you can use feature gates](https://crates.io/crates/rusty_paseto#user-content-feature-gates) to allow users to only include the tiny bits of functionality they need for their use case.  Functionality should be relevant to the spirit of the crate.  It's easy to get excited about your code and attempt to include everything under the sun to make it usable for everybody.

As with most products, be ruthless and trim down the extra fat until you have the bare minimum, then trim down a little more.  If you have some extra-but-related functionality you know is valuable but don't think it belongs in the crate you're currently publishing, [make another crate](https://crates.io/crates/numnums) and work on it in your spare time to add value!  

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

## Where to get help

This was a long post, but there's plenty more to learn.  This should get you comfortable enough to know how to deal with most issues when you're publishing to [crates.io](https://crates.io).  Other places you can find information are listed below:

- The [Cargo Book](https://doc.rust-lang.org/cargo) especially the section on [publishing to crates.io](https://doc.rust-lang.org/cargo/reference/publishing.html)
- the [Rust Language community on Discord](https://discord.gg/rust-lang)
- the [crates.io team on Discord](https://discord.gg/rust-lang)

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

## Acknowledgements

The crates.io team assisted greatly with patiently answering questions that weren't clear or covered in the Rust book and providing information on how to use [the staging site of crates.io](https://staging.crates.io). 

In particular, many thanks goes to @pietroalbini, @tbieniek, and @carols10cents.  

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

## TLDR

- [Uncover issues early](#then-do-it-again-on-staging) by publishing to [staging](https://staging.crates.io) first
- [Get your manifest file in order and beware of gotchas](#get-your-manifest-file-in-order)
- Use [cargo-markdown](https://crates.io/crates/cargo-markdown) to put some love into your [readme](#about-that-readme)
- [Ship it!](#ship-it); [Ship it again](#ship-it-again), and [Uh oh, unship it!](#uh-oh-unship-it)
- [Yes, your crate belongs on crates.io](#does-your-crate-belong-on-crates-io)
- Learn [where to get help](#where-to-get-help)

<h6 align="right"><a href="#table-of-contents">back to toc</a></h6>

---

❤️ Like this article?  Follow me on [Twitter](https://twitter.com/rrrodzilla) and [Github](https://github.com/rrrodzilla) for more content like this.


