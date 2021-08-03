+++
title = "Embracing Newtypes in Rust"
date = 2021-07-23
description = "Make your code more expressive, encapsulate validation and enforce context in your code by wrapping primitives and other types in your own tuple structs."
[taxonomies]
stacks=["rust"]
frameworks=["actix-web"]
header=["TEMPLATE"]
+++

I started using Actix-web to build an API server for one of my personal projects a few months ago.  Since then, the project code and folder structure has evolved considerably.  In fact, it looks nothing like the example code provided by the Actix-web book once I've added instrumentation, tests of various types and prepared it for deployment to Docker or elsewhere.  

In this post I'm going to describe how I use an opinionated project template I've created for myself to speed up spitballing ideas that eventually turn into full-blown projects without having to re-add all of the various boilerplate code that goes with moving from MVP to production.  Specifically this project template allows for: 

- Setting up a rust Actix-web project structured for ease of testing
- Optionally sets up unit and integration testing
- Optionally sets up instrumentation

## How to Install

- Use `cargo generate` to create a new project with my template and then follow the prompts to customize the generated rust project.

```bash
cargo install cargo-generate
cargo generate --git https://github.com/rrrodzilla/generust.git
```
Then cd into your project directory that gets generated for you and run
```bash
cargo test
```
to verify everything is working correctly.

## Project Options

### Project Name
Determines the project name and some of the crate names for each of the generated modules.

### Include Testing Frameworks
The project is already structured for integration and unit testing however this option adds test and additional dependencies to support blackbox testing the generated api.

### Instrumentation
Includes the tracing crate and wraps generated methods in tracing spans to capture runtime metrics.

## Project Structure
This project is structured to facilitate test driven development.  Where possible, reusable, functionality is moved to testable functions and unit tests are generated.


Future roadmap:

- Including CORS
- Including Identity
- Including Passwordless Authentication
- Including a Grpc Server
- Including Actix microservices behind Grpc
- Including a docker file for deployment to production
