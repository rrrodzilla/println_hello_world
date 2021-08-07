+++
title = "Embracing Newtypes in Rust"
date = 2021-07-23
description = "Make your code more expressive, encapsulate validation and enforce context in your code by wrapping primitives and other types in your own tuple structs."
[taxonomies]
stacks=["rust"]
frameworks=["patterns"]
header=["DESIGN PATTERN"]
+++

Which of the following code snippets would you rather discover in a code base you become responsible for?

```rust
let port = 3000_u16;

```
or
```rust
let port = ServerPort(3000);

```
Creating wrapper types makes code easier to read and expresses intent better than plain primitive types.
This post will show how to:

- Wrap primitive and non-primitive types in tuple structs
- Implement common conversion and type traits to let you use your type in place of the wrapped types
- Use the Newtype pattern to simplify loading and passing config values for your application

## The Basic Newtype

Implementing the newtype pattern is straightforward.  Simply create a struct taking a single-valued tuple and passing the internal type of the struct.
```rust
//a tuple struct with an internal single value tuple holding a u16 value
pub struct ServerPort(u16);

let port = ServerPort(3000);
assert_eq!(port, 3000); //this fails!

```
## Compile-Time Validation with Traits
An important point with newtypes is that they are unique types completely different than the types they wrap.  The assert above fails because our custom type has no way of telling the compiler if and how it is equal to the numeric type in the assert.



### Equality Traits

To allow our type to participate in equality comparisons, we need to implement the equality traits on our new type.

```rust

#[derive(PartialEq)]
pub struct ServerPort(u16);

impl PartialEq<ServicePort> for u16 {
    fn eq(&self, other: &ServicePort) -> bool {
        self == &other.0
    }
}

impl PartialEq<u16> for ServicePort {
    fn eq(&self, other: &u16) -> bool {
        self.0 == *other
    }
}

impl Eq for ServicePort {}

let port = ServerPort(3000);
assert_eq!(port, 3000); //now this passes!



```

This is great because we now know a couple of things must be true about our type:

- Any type wrapped inside our type must be a valid instance of a type, otherwise the Rust compiler would complain at build time.
- Any structure or function we pass our type can rely on having received a vetted, valid instance of the inner type, or the program wouldn't have compiled.

### Implement From & Into
But how can we actually use the value inside the new type we've created?  Since our newtype is a distinct type of its own, we need to convert from our type to the wrapped type.  The best way to do this is to use one or more of the `std::convert` conversion traits. Currently, this code fails:

```rust
pub fn bind_to_port(server_port: &ServerPort){
	// return the inner type
	let some_int: u16 = server_port; //Nope! Compile error
	// ...
}

```
But implement From and Into:
```rust
use std::convert::{From, Into};

impl Into<u16> for ServicePort {
    fn into(self) -> u16 {
        self.0
    }
}

impl From<u16> for ServicePort {
    fn from(val: u16) -> Self {
        Self(val)
    }
}
```
and now you can do this:
```rust
pub fn bind_to_port(server_port: &ServerPort){
	// return the inner type
	let some_int: u16 = server_port.into(); //now this compiles
	// ...
}
```
Note the explicit call to `server_port.into()` in order to convert our newtype to the waiting `u16` variable.  And if we have to call legacy code we don't own that takes primitive typed arguments like this one:
```rust
pub fn legacy_bind_to_port(server_port: u16) -> u16; 
```
We can still use our new type by wrapping the legacy call and converting back into the inner_type:
```rust
pub fn bind_to_port(server_port: &ServerPort){
	// return the inner type
	let some_int: u16 = legacy_bind_to_port(server_port.into());
	// ...
}

```
This ensures the value the legacy function or any other function receives from our type is valid at compilation time.

### Implement Default

Want to load your type from an external source (like an env variable or config file) and then use it everywhere? Implement the `Default` trait:
```rust
impl Default for ServicePort {
    fn default() -> Self {
	// get the value from the os path or a .env file 
	// or config file or wherever

	// and then return a valid instance of the new type
        Self(0_u16)
    }
}

```
Now you can create an instance with the same value loaded from your config store by calling 
```rust 
let host: ServiceHost = Default::default();
// or let host = ServiceHost::default();
```
* Don't forget to bring the *Default* trait in scope with: `use std::default::Default;`

### Implement FromStr

Speaking of loading a value from a config file or env variable, how can we receive a string (str) value and convert it into a valid instance of our custom type?
The primitive type `str` has a `parse()` method which parses the string slice and converts it into any type that implements the `FromStr` trait.  This includes custom types like our own newtypes.  We just have to implement the trait:
```rust
use std::str::FromStr;

impl FromStr for ServicePort {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(Self(s.parse()?))
    }
}
```
So now you can load your type from string values from anywhere:
```rust
let service_port = "3000".parse::<ServicePort>().unwrap();
```








## Runtime-validation

A successful compilation tells us that the structure of the type we've created is valid in all of it's uses in the compiled software.  Once the program is running, however, how can we guarantee all of the business rules of our type are valid as well?  How can we tell if `ServerPort(10)` is valid in 



