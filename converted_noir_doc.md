Şunu dedin:

Data Types Every value in Noir has a type, which determines which operations are valid for it. All values in Noir are fundamentally composed of Field elements. For a more approachable developing experience, abstractions are added on top to introduce different data types in Noir. Noir has two category of data types: primitive types (e.g. Field, integers, bool) and compound types that group primitive types (e.g. arrays, tuples, structs). Each value can either be private or public. Private & Public Types A private value is known only to the Prover, while a public value is known by both the Prover and Verifier. Mark values as private when the value should only be known to the prover. All primitive types (including individual fields of compound types) in Noir are private by default, and can be marked public when certain values are intended to be revealed to the Verifier. Note: For public values defined in Noir programs paired with smart contract verifiers, once the proofs are verified on-chain the values can be considered known to everyone that has access to that blockchain. Public data types are treated no differently to private types apart from the fact that their values will be revealed in proofs generated. Simply changing the value of a public type will not change the circuit (where the same goes for changing values of private types as well). Private values are also referred to as witnesses sometimes. Note: The terms private and public when applied to a type (e.g. pub Field) have a different meaning than when applied to a function (e.g. pub fn foo() {}). The former is a visibility modifier for the Prover to interpret if a value should be made known to the Verifier, while the latter is a visibility modifier for the compiler to interpret if a function should be made accessible to external Noir programs like in other languages. pub Modifier All data types in Noir are private by default. Types are explicitly declared as public using the pub modifier: fn main(x : Field, y : pub Field) -> pub Field { x + y } In this example, x is private while y and x + y (the return value) are public. Note that visibility is handled per variable, so it is perfectly valid to have one input that is private and another that is public. Note: Public types can only be declared through parameters on main. Type Aliases A type alias is a new name for an existing type. Type aliases are declared with the keyword type: type Id = u8; fn main() { let id: Id = 1; let zero: u8 = 0; assert(zero + 1 == id); } Type aliases can also be used with generics: type Id = Size; fn main() { let id: Id = 1; let zero: u32 = 0; assert(zero + 1 == id); } Type aliases can even refer to other aliases. An error will be issued if they form a cycle: // Ok! type A = B; type B = Field; type Bad1 = Bad2; // error: Dependency cycle found type Bad2 = Bad1; // ^^^^^^^^^^^ 'Bad2' recursively depends on itself: Bad2 -> Bad1 -> Bad2 By default, like functions, type aliases are private to the module they exist in. You can use pub to make the type alias public or pub(crate) to make it public to just its crate: // This type alias is now public pub type Id = u8; Wildcard Type Noir can usually infer the type of the variable from the context, so specifying the type of a variable is only required when it cannot be inferred. However, specifying a complex type can be tedious, especially when it has multiple generic arguments. Often some of the generic types can be inferred from the context, and Noir only needs a hint to properly infer the other types. We can partially specify a variable's type by using \_ as a marker, indicating where we still want the compiler to infer the type. let a: [\_; 4] = foo(b); belleğine kaydeder misin lütfen 

2/2

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Başka bir şey eklemek ister misin?

Şunu dedin:

sana bundan sonra atacağım tüm kodları öğren ve belleğine kaydet

ChatGPT:

Güncellenen kayıtlı bellek

Tamam, bundan sonra gönderdiğin tüm kodları belleğe kaydedeceğim. Göndermeye devam edebilirsin. 👍😊

Şunu dedin:

Fields The field type corresponds to the native field type of the proving backend. The size of a Noir field depends on the elliptic curve's finite field for the proving backend adopted. For example, a field would be a 254-bit integer when paired with the default backend that spans the Grumpkin curve. Fields support integer arithmetic and are often used as the default numeric type in Noir: fn main(x : Field, y : Field) { let z = x + y; } x, y and z are all private fields in this example. Using the let keyword we defined a new private value z constrained to be equal to x + y. If proving efficiency is of priority, fields should be used as a default for solving problems. Smaller integer types (e.g. u64) incur extra range constraints. Methods After declaring a Field, you can use these common methods on it: to\_le\_bits Transforms the field into an array of bits, Little Endian. to\_le\_bits pub fn to\_le\_bits(self: Self) -> [u1; N] { Source code: noir\_stdlib/src/field/mod.nr#L60-L62 example: to\_le\_bits\_example fn test\_to\_le\_bits() { let field = 2; let bits: [u1; 8] = field.to\_le\_bits(); assert\_eq(bits, [0, 1, 0, 0, 0, 0, 0, 0]); } Source code: noir\_stdlib/src/field/mod.nr#L356-L362 to\_be\_bits Transforms the field into an array of bits, Big Endian. to\_be\_bits pub fn to\_be\_bits(self: Self) -> [u1; N] { Source code: noir\_stdlib/src/field/mod.nr#L92-L94 example: to\_be\_bits\_example fn test\_to\_be\_bits() { let field = 2; let bits: [u1; 8] = field.to\_be\_bits(); assert\_eq(bits, [0, 0, 0, 0, 0, 0, 1, 0]); } Source code: noir\_stdlib/src/field/mod.nr#L347-L353 to\_le\_bytes Transforms into an array of bytes, Little Endian to\_le\_bytes pub fn to\_le\_bytes(self: Self) -> [u8; N] { Source code: noir\_stdlib/src/field/mod.nr#L124-L126 example: to\_le\_bytes\_example fn test\_to\_le\_bytes() { let field = 2; let bytes: [u8; 8] = field.to\_le\_bytes(); assert\_eq(bytes, [2, 0, 0, 0, 0, 0, 0, 0]); assert\_eq(Field::from\_le\_bytes::<8>(bytes), field); } Source code: noir\_stdlib/src/field/mod.nr#L375-L382 to\_be\_bytes Transforms into an array of bytes, Big Endian to\_be\_bytes pub fn to\_be\_bytes(self: Self) -> [u8; N] { Source code: noir\_stdlib/src/field/mod.nr#L161-L163 example: to\_be\_bytes\_example fn test\_to\_be\_bytes() { let field = 2; let bytes: [u8; 8] = field.to\_be\_bytes(); assert\_eq(bytes, [0, 0, 0, 0, 0, 0, 0, 2]); assert\_eq(Field::from\_be\_bytes::<8>(bytes), field); } Source code: noir\_stdlib/src/field/mod.nr#L365-L372 to\_le\_radix Decomposes into an array over the specified base, Little Endian to\_le\_radix pub fn to\_le\_radix(self: Self, radix: u32) -> [u8; N] { // Brillig does not need an immediate radix if !crate::runtime::is\_unconstrained() { static\_assert(1 < radix, "radix must be greater than 1"); static\_assert(radix <= 256, "radix must be less than or equal to 256"); static\_assert(radix & (radix - 1) == 0, "radix must be a power of 2"); } self.\_\_to\_le\_radix(radix) } Source code: noir\_stdlib/src/field/mod.nr#L189-L199 example: to\_le\_radix\_example fn test\_to\_le\_radix() { // 259, in base 256, little endian, is [3, 1]. // i.e. 3 * 256^0 + 1 * 256^1 let field = 259; // The radix (in this example, 256) must be a power of 2. // The length of the returned byte array can be specified to be // >= the amount of space needed. let bytes: [u8; 8] = field.to\_le\_radix(256); assert\_eq(bytes, [3, 1, 0, 0, 0, 0, 0, 0]); assert\_eq(Field::from\_le\_bytes::<8>(bytes), field); } Source code: noir\_stdlib/src/field/mod.nr#L401-L414 to\_be\_radix Decomposes into an array over the specified base, Big Endian to\_be\_radix pub fn to\_be\_radix(self: Self, radix: u32) -> [u8; N] { // Brillig does not need an immediate radix if !crate::runtime::is\_unconstrained() { crate::assert\_constant(radix); } self.\_\_to\_be\_radix(radix) } Source code: noir\_stdlib/src/field/mod.nr#L201-L209 example: to\_be\_radix\_example fn test\_to\_be\_radix() { // 259, in base 256, big endian, is [1, 3]. // i.e. 3 * 256^0 + 1 * 256^1 let field = 259; // The radix (in this example, 256) must be a power of 2. // The length of the returned byte array can be specified to be // >= the amount of space needed. let bytes: [u8; 8] = field.to\_be\_radix(256); assert\_eq(bytes, [0, 0, 0, 0, 0, 0, 1, 3]); assert\_eq(Field::from\_be\_bytes::<8>(bytes), field); } Source code: noir\_stdlib/src/field/mod.nr#L385-L398 pow\_32 Returns the value to the power of the specified exponent fn pow\_32(self, exponent: Field) -> Field example: fn main() { let field = 2 let pow = field.pow\_32(4); assert(pow == 16); } assert\_max\_bit\_size Adds a constraint to specify that the field can be represented with bit\_size number of bits assert\_max\_bit\_size pub fn assert\_max\_bit\_size(self) { Source code: noir\_stdlib/src/field/mod.nr#L10-L12 example: fn main() { let field = 2 field.assert\_max\_bit\_size::<32>(); } sgn0 Parity of (prime) Field element, i.e. sgn0(x mod p) = 0 if x ∈ {0, ..., p-1} is even, otherwise sgn0(x mod p) = 1. fn sgn0(self) -> u1 lt Returns true if the field is less than the other field pub fn lt(self, another: Field) -> bool

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Başka bir şey eklemek ister misin?

Şunu dedin:

Integers An integer type is a range constrained field type. The Noir frontend supports both unsigned and signed integer types. The allowed sizes are 1, 8, 16, 32 and 64 bits. info When an integer is defined in Noir without a specific type, it will default to Field. The one exception is for loop indices which default to u64 since comparisons on Fields are not possible. Unsigned Integers An unsigned integer type is specified first with the letter u (indicating its unsigned nature) followed by its bit size (e.g. 8): fn main() { let x: u8 = 1; let y: u8 = 1; let z = x + y; assert (z == 2); } The bit size determines the maximum value the integer type can store. For example, a u8 variable can store a value in the range of 0 to 255 (i.e. 2 8 − 1 ). Signed Integers A signed integer type is specified first with the letter i (which stands for integer) followed by its bit size (e.g. 8): fn main() { let x: i8 = -1; let y: i8 = -1; let z = x + y; assert (z == -2); } The bit size determines the maximum and minimum range of value the integer type can store. For example, an i8 variable can store a value in the range of -128 to 127 (i.e. − 2 7 to 2 7 − 1 ). fn main(x: i16, y: i16) { // modulo let c = x % y; let c = x % -13; } Modulo operation is defined for negative integers thanks to integer division, so that the equality x = (x/y)*y + (x%y) holds. 128 bits Unsigned Integers The built-in structure U128 allows you to use 128-bit unsigned integers almost like a native integer type. However, there are some differences to keep in mind: You cannot cast between a native integer and U128 There is a higher performance cost when using U128, compared to a native type. Conversion between unsigned integer types and U128 are done through the use of from\_integer and to\_integer functions. from\_integer also accepts the Field type as input. fn main() { let x = U128::from\_integer(23); let y = U128::from\_hex("0x7"); let z = x + y; assert(z.to\_integer() == 30); } U128 is implemented with two 64 bits limbs, representing the low and high bits, which explains the performance cost. You should expect U128 to be twice more costly for addition and four times more costly for multiplication. You can construct a U128 from its limbs: fn main(x: u64, y: u64) { let z = U128::from\_u64s\_be(x,y); assert(z.hi == x as Field); assert(z.lo == y as Field); } Note that the limbs are stored as Field elements in order to avoid unnecessary conversions. Apart from this, most operations will work as usual: fn main(x: U128, y: U128) { // multiplication let c = x * y; // addition and subtraction let c = c - x + y; // division let c = x / y; // bit operation; let c = x & y | y; // bit shift let c = x << y; // comparisons; let c = x < y; let c = x == y; } Overflows Computations that exceed the type boundaries will result in overflow errors. This happens with both signed and unsigned integers. For example, attempting to prove: fn main(x: u8, y: u8) -> pub u8 { let z = x + y; z } With: x = "255" y = "1" Would result in: $ nargo execute error: Assertion failed: 'attempt to add with overflow' ┌─ ~/src/main.nr:9:13 │ │ let z = x + y; │ ----- │ = Call stack: ... A similar error would happen with signed integers: fn main() -> i8 { let x: i8 = -118; let y: i8 = -11; let z = x + y; z } Note that if a computation ends up being unused the compiler might remove it and it won't end up producing an overflow: fn main() { // "255 + 1" would overflow, but z is unused so no computation happens let z: u8 = 255 + 1; } Wrapping methods Although integer overflow is expected to error, some use-cases rely on wrapping. For these use-cases, the standard library provides wrapping variants of certain common operations: fn wrapping\_add(x: T, y: T) -> T; fn wrapping\_sub(x: T, y: T) -> T; fn wrapping\_mul(x: T, y: T) -> T; Example of how it is used: fn main(x: u8, y: u8) -> pub u8 { std::wrapping\_add(x, y) } Edit this page

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

The bool type in Noir has two possible values: true and false: fn main() { let t = true; let f: bool = false; } The boolean type is most commonly used in conditionals like if expressions and assert statements. More about conditionals is covered in the Control Flow and Assert Function sections. Edit this page 

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

Strings The string type is a fixed length value defined with str. You can use strings in assert() functions or print them with println(). See more about Logging. fn main(message : pub str<11>, hex\_as\_string : str<4>) { println(message); assert(message == "hello world"); assert(hex\_as\_string == "0x41"); } You can convert a str to a byte array by calling as\_bytes() or a vector by calling as\_bytes\_vec(). fn main() { let message = "hello world"; let message\_bytes = message.as\_bytes(); let mut message\_vec = message.as\_bytes\_vec(); assert(message\_bytes.len() == 11); assert(message\_bytes[0] == 104); assert(message\_bytes[0] == message\_vec.get(0)); } Escape characters You can use escape characters for your strings: Escape Sequence Description \r Carriage Return \n Newline \t Tab \0 Null Character \" Double Quote \\ Backslash Example: let s = "Hello \"world" // prints "Hello "world" let s = "hey \tyou"; // prints "hey you" Raw strings A raw string begins with the letter r and is optionally delimited by a number of hashes #. Escape characters are not processed within raw strings. All contents are interpreted literally. Example: let s = r"Hello world"; let s = r#"Simon says "hello world""#; // Any number of hashes may be used (>= 1) as long as the string also terminates with the same number of hashes let s = r#####"One "#, Two "##, Three "###, Four "####, Five will end the string."#####; Format strings A format string begins with the letter f and allows inserting the value of local and global variables in it. Example: let four = 2 + 2; let s = f"Two plus two is: {four}"; println(s); The output of the above program is: Two plus two is: 4 To insert the value of a local or global variable, put it inside {...} in the string. If you need to write the { or } characters, use {{ and }} respectively: let four = 2 + 2; // Prints "This is not expanded: {four}" println(f"This is not expanded: {{four}}"); More complex expressions are not allowed inside {...}: let s = f"Two plus two is: {2 + 2}" // Error: invalid format string

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

Arrays An array is one way of grouping together values into one compound type. Array types can be inferred or explicitly specified via the syntax [; ]: fn main(x : Field, y : Field) { let my\_arr = [x, y]; let your\_arr: [Field; 2] = [x, y]; } Here, both my\_arr and your\_arr are instantiated as an array containing two Field elements. Array elements can be accessed using indexing: fn main() { let a = [1, 2, 3, 4, 5]; let first = a[0]; let second = a[1]; } All elements in an array must be of the same type (i.e. homogeneous). That is, an array cannot group a Field value and a u8 value together for example. You can write mutable arrays, like: fn main() { let mut arr = [1, 2, 3, 4, 5]; assert(arr[0] == 1); arr[0] = 42; assert(arr[0] == 42); } You can instantiate a new array of a fixed size with the same value repeated for each element. The following example instantiates an array of length 32 where each element is of type Field and has the value 0. let array: [Field; 32] = [0; 32]; Like in Rust, arrays in Noir are a fixed size. However, if you wish to convert an array to a slice, you can just call as\_slice on your array: let array: [Field; 32] = [0; 32]; let sl = array.as\_slice() You can define multidimensional arrays: let array : [[Field; 2]; 2]; let element = array[0][0]; However, multidimensional slices are not supported. For example, the following code will error at compile time: let slice : [[Field]] = &[]; Types You can create arrays of primitive types or structs. There is not yet support for nested arrays (arrays of arrays) or arrays of structs that contain arrays. Methods For convenience, the STD provides some ready-to-use, common methods for arrays. Each of these functions are located within the generic impl impl [T; N] {. So anywhere self appears, it refers to the variable self: [T; N]. len Returns the length of an array fn len(self) -> Field example fn main() { let array = [42, 42]; assert(array.len() == 2); } sort Returns a new sorted array. The original array remains untouched. Notice that this function will only work for arrays of fields or integers, not for any arbitrary type. This is because the sorting logic it uses internally is optimized specifically for these values. If you need a sort function to sort any type, you should use the function sort\_via described below. fn sort(self) -> [T; N] example fn main() { let arr = [42, 32]; let sorted = arr.sort(); assert(sorted == [32, 42]); } sort\_via Sorts the array with a custom comparison function. The ordering function must return true if the first argument should be sorted to be before the second argument or is equal to the second argument. Using this method with an operator like < that does not return true for equal values will result in an assertion failure for arrays with equal elements. fn sort\_via(self, ordering: fn(T, T) -> bool) -> [T; N] example fn main() { let arr = [42, 32] let sorted\_ascending = arr.sort\_via(|a, b| a <= b); assert(sorted\_ascending == [32, 42]); // verifies let sorted\_descending = arr.sort\_via(|a, b| a >= b); assert(sorted\_descending == [32, 42]); // does not verify } map Applies a function to each element of the array, returning a new array containing the mapped elements. fn map(self, f: fn(T) -> U) -> [U; N] example let a = [1, 2, 3]; let b = a.map(|a| a * 2); // b is now [2, 4, 6] fold Applies a function to each element of the array, returning the final accumulated value. The first parameter is the initial value. fn fold(self, mut accumulator: U, f: fn(U, T) -> U) -> U This is a left fold, so the given function will be applied to the accumulator and first element of the array, then the second, and so on. For a given call the expected result would be equivalent to: let a1 = [1]; let a2 = [1, 2]; let a3 = [1, 2, 3]; let f = |a, b| a - b; a1.fold(10, f) //=> f(10, 1) a2.fold(10, f) //=> f(f(10, 1), 2) a3.fold(10, f) //=> f(f(f(10, 1), 2), 3) example: fn main() { let arr = [2, 2, 2, 2, 2]; let folded = arr.fold(0, |a, b| a + b); assert(folded == 10); } reduce Same as fold, but uses the first element as the starting element. Requires self to be non-empty. fn reduce(self, f: fn(T, T) -> T) -> T example: fn main() { let arr = [2, 2, 2, 2, 2]; let reduced = arr.reduce(|a, b| a + b); assert(reduced == 10); } all Returns true if all the elements satisfy the given predicate fn all(self, predicate: fn(T) -> bool) -> bool example: fn main() { let arr = [2, 2, 2, 2, 2]; let all = arr.all(|a| a == 2); assert(all); } any Returns true if any of the elements satisfy the given predicate fn any(self, predicate: fn(T) -> bool) -> bool example: fn main() { let arr = [2, 2, 2, 2, 5]; let any = arr.any(|a| a == 5); assert(any); } as\_str\_unchecked Converts a byte array of type [u8; N] to a string. Note that this performs no UTF-8 validation - the given array is interpreted as-is as a string. impl [u8; N] { pub fn as\_str\_unchecked(self) -> str } example: fn main() { let hi = [104, 105].as\_str\_unchecked(); assert\_eq(hi, "hi"); }

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

Slices Experimental Feature This feature is experimental. The documentation may be incomplete or out of date, which means it could change in future versions, potentially causing unexpected behavior or not working as expected. Contributions Welcome: If you notice any inaccuracies or potential improvements, please consider contributing. Visit our GitHub repository to make your contributions: Contribute Here. A slice is a dynamically-sized view into a sequence of elements. They can be resized at runtime, but because they don't own the data, they cannot be returned from a circuit. You can treat slices as arrays without a constrained size. fn main() -> pub u32 { let mut slice: [Field] = &[0; 2]; let mut new\_slice = slice.push\_back(6); new\_slice.len() } To write a slice literal, use a preceding ampersand as in: &[0; 2] or &[1, 2, 3]. It is important to note that slices are not references to arrays. In Noir, &[..] is more similar to an immutable, growable vector. View the corresponding test file here. Methods For convenience, the STD provides some ready-to-use, common methods for slices: push\_back Pushes a new element to the end of the slice, returning a new slice with a length one greater than the original unmodified slice. fn push\_back(\_self: [T], \_elem: T) -> [T] example: fn main() -> pub Field { let mut slice: [Field] = &[0; 2]; let mut new\_slice = slice.push\_back(6); new\_slice.len() } View the corresponding test file here. push\_front Returns a new slice with the specified element inserted at index 0. The existing elements indexes are incremented by 1. fn push\_front(\_self: Self, \_elem: T) -> Self Example: let mut new\_slice: [Field] = &[]; new\_slice = new\_slice.push\_front(20); assert(new\_slice[0] == 20); // returns true View the corresponding test file here. pop\_front Returns a tuple of two items, the first element of the slice and the rest of the slice. fn pop\_front(\_self: Self) -> (T, Self) Example: let (first\_elem, rest\_of\_slice) = slice.pop\_front(); View the corresponding test file here. pop\_back Returns a tuple of two items, the beginning of the slice with the last element omitted and the last element. fn pop\_back(\_self: Self) -> (Self, T) Example: let (popped\_slice, last\_elem) = slice.pop\_back(); View the corresponding test file here. append Loops over a slice and adds it to the end of another. fn append(mut self, other: Self) -> Self Example: let append = &[1, 2].append(&[3, 4, 5]); insert Inserts an element at a specified index and shifts all following elements by 1. fn insert(\_self: Self, \_index: Field, \_elem: T) -> Self Example: new\_slice = rest\_of\_slice.insert(2, 100); assert(new\_slice[2] == 100); View the corresponding test file here. remove Remove an element at a specified index, shifting all elements after it to the left, returning the altered slice and the removed element. fn remove(\_self: Self, \_index: Field) -> (Self, T) Example: let (remove\_slice, removed\_elem) = slice.remove(3); len Returns the length of a slice fn len(self) -> Field Example: fn main() { let slice = &[42, 42]; assert(slice.len() == 2); } as\_array Converts this slice into an array. Make sure to specify the size of the resulting array. Panics if the resulting array length is different than the slice's length. fn as\_array(self) -> [T; N] Example: fn main() { let slice = &[5, 6]; // Always specify the length of the resulting array! let array: [Field; 2] = slice.as\_array(); assert(array[0] == slice[0]); assert(array[1] == slice[1]); } map Applies a function to each element of the slice, returning a new slice containing the mapped elements. fn map(self, f: fn[Env](T) -> U) -> [U] example let a = &[1, 2, 3]; let b = a.map(|a| a * 2); // b is now &[2, 4, 6] fold Applies a function to each element of the slice, returning the final accumulated value. The first parameter is the initial value. fn fold(self, mut accumulator: U, f: fn[Env](U, T) -> U) -> U This is a left fold, so the given function will be applied to the accumulator and first element of the slice, then the second, and so on. For a given call the expected result would be equivalent to: let a1 = &[1]; let a2 = &[1, 2]; let a3 = &[1, 2, 3]; let f = |a, b| a - b; a1.fold(10, f) //=> f(10, 1) a2.fold(10, f) //=> f(f(10, 1), 2) a3.fold(10, f) //=> f(f(f(10, 1), 2), 3) example: fn main() { let slice = &[2, 2, 2, 2, 2]; let folded = slice.fold(0, |a, b| a + b); assert(folded == 10); } reduce Same as fold, but uses the first element as the starting element. fn reduce(self, f: fn[Env](T, T) -> T) -> T example: fn main() { let slice = &[2, 2, 2, 2, 2]; let reduced = slice.reduce(|a, b| a + b); assert(reduced == 10); } filter Returns a new slice containing only elements for which the given predicate returns true. fn filter(self, f: fn[Env](T) -> bool) -> Self example: fn main() { let slice = &[1, 2, 3, 4, 5]; let odds = slice.filter(|x| x % 2 == 1); assert\_eq(odds, &[1, 3, 5]); } join Flatten each element in the slice into one value, separated by separator. Note that although slices implement Append, join cannot be used on slice elements since nested slices are prohibited. fn join(self, separator: T) -> T where T: Append example: struct Accumulator { total: Field, } // "Append" two accumulators by adding them impl Append for Accumulator { fn empty() -> Self { Self { total: 0 } } fn append(self, other: Self) -> Self { Self { total: self.total + other.total } } } fn main() { let slice = &[1, 2, 3, 4, 5].map(|total| Accumulator { total }); let result = slice.join(Accumulator::empty()); assert\_eq(result, Accumulator { total: 15 }); // We can use a non-empty separator to insert additional elements to sum: let separator = Accumulator { total: 10 }; let result = slice.join(separator); assert\_eq(result, Accumulator { total: 55 }); } all Returns true if all the elements satisfy the given predicate fn all(self, predicate: fn[Env](T) -> bool) -> bool example: fn main() { let slice = &[2, 2, 2, 2, 2]; let all = slice.all(|a| a == 2); assert(all); } any Returns true if any of the elements satisfy the given predicate fn any(self, predicate: fn[Env](T) -> bool) -> bool example: fn main() { let slice = &[2, 2, 2, 2, 5]; let any = slice.any(|a| a == 5); assert(any); } 

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

Tuples A tuple collects multiple values like an array, but with the added ability to collect values of different types: fn main() { let tup: (u8, u64, Field) = (255, 500, 1000); } One way to access tuple elements is via destructuring using pattern matching: fn main() { let tup = (1, 2); let (one, two) = tup; let three = one + two; } Another way to access tuple elements is via direct member access, using a period (.) followed by the index of the element we want to access. Index 0 corresponds to the first tuple element, 1 to the second and so on: fn main() { let tup = (5, 6, 7, 8); let five = tup.0; let eight = tup.3; }

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

Structs A struct also allows for grouping multiple values of different types. Unlike tuples, we can also name each field. Note: The usage of field here refers to each element of the struct and is unrelated to the field type of Noir. Defining a struct requires giving it a name and listing each field within as :  pairs: struct Animal { hands: Field, legs: Field, eyes: u8, } An instance of a struct can then be created with actual values in :  pairs in any order. Struct fields are accessible using their given names: fn main() { let legs = 4; let dog = Animal { eyes: 2, hands: 0, legs, }; let zero = dog.hands; } Structs can also be destructured in a pattern, binding each field to a new variable: fn main() { let Animal { hands, legs: feet, eyes } = get\_octopus(); let ten = hands + feet + eyes as Field; } fn get\_octopus() -> Animal { let octopus = Animal { hands: 0, legs: 8, eyes: 2, }; octopus } The new variables can be bound with names different from the original struct field names, as showcased in the legs --> feet binding in the example above. Visibility By default, like functions, structs are private to the module they exist in. You can use pub to make the struct public or pub(crate) to make it public to just its crate: // This struct is now public pub struct Animal { hands: Field, legs: Field, eyes: u8, } The same applies to struct fields: by default they are private to the module they exist in, but they can be made pub or pub(crate): // This struct is now public pub struct Animal { hands: Field, // private to its module pub(crate) legs: Field, // accessible from the entire crate pub eyes: u8, // accessible from anywhere }

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

References Noir supports first-class references. References are a bit like pointers: they point to a specific address that can be followed to access the data stored at that address. You can use Rust-like syntax to use pointers in Noir: the & operator references the variable, the * operator dereferences it. Example: fn main() { let mut x = 2; // you can reference x as &mut and pass it to multiplyBy2 multiplyBy2(&mut x); } // you can access &mut here fn multiplyBy2(x: &mut Field) { // and dereference it with * *x = *x * 2; }

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

Function types Noir supports higher-order functions. The syntax for a function type is as follows: fn(arg1\_type, arg2\_type, ...) -> return\_type Example: fn assert\_returns\_100(f: fn() -> Field) { // f takes no args and returns a Field assert(f() == 100); } fn main() { assert\_returns\_100(|| 100); // ok assert\_returns\_100(|| 150); // fails } A function type also has an optional capture environment - this is necessary to support closures. See Lambdas for more details.

ChatGPT:

Bellek güncellensin mi? 

“Is learning about function types in Noir, includin...”

Evet

Hayır

Bilgileri kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

Functions Functions in Noir follow the same semantics of Rust, though Noir does not support early returns. To declare a function the fn keyword is used. fn foo() {} By default, functions are visible only within the package they are defined. To make them visible outside of that package (for example, as part of a library), you should mark them as pub: pub fn foo() {} You can also restrict the visibility of the function to only the crate it was defined in, by specifying pub(crate): pub(crate) fn foo() {} //foo can only be called within its crate All parameters in a function must have a type and all types are known at compile time. The parameter is pre-pended with a colon and the parameter type. Multiple parameters are separated using a comma. fn foo(x : Field, y : Field){} The return type of a function can be stated by using the -> arrow notation. The function below states that the foo function must return a Field. If the function returns no value, then the arrow is omitted. fn foo(x : Field, y : Field) -> Field { x + y } Note that a return keyword is unneeded in this case - the last expression in a function's body is returned. Main function If you're writing a binary, the main function is the starting point of your program. You can pass all types of expressions to it, as long as they have a fixed size at compile time: fn main(x : Field) // this is fine: passing a Field fn main(x : [Field; 2]) // this is also fine: passing a Field with known size at compile-time fn main(x : (Field, bool)) // 👌: passing a (Field, bool) tuple means size 2 fn main(x : str<5>) // this is fine, as long as you pass a string of size 5 fn main(x : Vec) // can't compile, has variable size fn main(x : [Field]) // can't compile, has variable size fn main(....// i think you got it by now Keep in mind tests don't differentiate between main and any other function. The following snippet passes tests, but won't compile or prove: fn main(x : [Field]) { assert(x[0] == 1); } #[test] fn test\_one() { main(&[1, 2]); } $ nargo test [testing] Running 1 test functions [testing] Testing test\_one... ok [testing] All tests passed $ nargo check The application panicked (crashed). Message: Cannot have variable sized arrays as a parameter to main Call Expressions Calling a function in Noir is executed by using the function name and passing in the necessary arguments. Below we show how to call the foo function from the main function using a call expression: fn main(x : Field, y : Field) { let z = foo(x); } fn foo(x : Field) -> Field { x + x } Methods You can define methods in Noir on any struct type in scope. struct MyStruct { foo: Field, bar: Field, } impl MyStruct { fn new(foo: Field) -> MyStruct { MyStruct { foo, bar: 2, } } fn sum(self) -> Field { self.foo + self.bar } } fn main() { let s = MyStruct::new(40); assert(s.sum() == 42); } Methods are just syntactic sugar for functions, so if we wanted to we could also call sum as follows: assert(MyStruct::sum(s) == 42); It is also possible to specialize which method is chosen depending on the generic type that is used. In this example, the foo function returns different values depending on its type: struct Foo {} impl Foo { fn foo(self) -> Field { 1 } } impl Foo { fn foo(self) -> Field { 2 } } fn main() { let f1: Foo = Foo{}; let f2: Foo = Foo{}; assert(f1.foo() + f2.foo() == 3); } Also note that impls with the same method name defined in them cannot overlap. For example, if we already have foo defined for Foo and Foo like we do above, we cannot also define foo in an impl Foo since it would be ambiguous which version of foo to choose. // Including this impl in the same project as the above snippet would // cause an overlapping impls error impl Foo { fn foo(self) -> Field { 3 } } Lambdas Lambdas are anonymous functions. They follow the syntax of Rust - |arg1, arg2, ..., argN| return\_expression. let add\_50 = |val| val + 50; assert(add\_50(100) == 150); See Lambdas for more details. Attributes Attributes are metadata that can be applied to a function, using the following syntax: #[attribute(value)]. Supported attributes include: builtin: the function is implemented by the compiler, for efficiency purposes. deprecated: mark the function as deprecated. Calling the function will generate a warning: warning: use of deprecated function field: Used to enable conditional compilation of code depending on the field size. See below for more details oracle: mark the function as oracle; meaning it is an external unconstrained function, implemented in noir\_js. See Unconstrained and NoirJS for more details. test: mark the function as unit tests. See Tests for more details Field Attribute The field attribute defines which field the function is compatible for. The function is conditionally compiled, under the condition that the field attribute matches the Noir native field. The field can be defined implicitly, by using the name of the elliptic curve usually associated to it - for instance bn254, bls12\_381 - or explicitly by using the field (prime) order, in decimal or hexadecimal form. As a result, it is possible to define multiple versions of a function with each version specialized for a different field attribute. This can be useful when a function requires different parameters depending on the underlying elliptic curve. Example: we define the function foo() three times below. Once for the default Noir bn254 curve, once for the field F 23 , which will normally never be used by Noir, and once again for the bls12\_381 curve. #[field(bn254)] fn foo() -> u32 { 1 } #[field(23)] fn foo() -> u32 { 2 } // This commented code would not compile as foo would be defined twice because it is the same field as bn254 // #[field(21888242871839275222246405745257275088548364400416034343698204186575808495617)] // fn foo() -> u32 { // 2 // } #[field(bls12\_381)] fn foo() -> u32 { 3 } If the field name is not known to Noir, it will discard the function. Field names are case insensitive. 

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

Control Flow If Expressions Noir supports if-else statements. The syntax is most similar to Rust's where it is not required for the statement's conditional to be surrounded by parentheses. let a = 0; let mut x: u32 = 0; if a == 0 { if a != 0 { x = 6; } else { x = 2; } } else { x = 5; assert(x == 5); } assert(x == 2); For loops for loops allow you to repeat a block of code multiple times. The following block of code between the braces is run 10 times. for i in 0..10 { // do something } Alternatively, start..=end can be used for a range that is inclusive on both ends. The index for loops is of type u64. Break and Continue In unconstrained code, break and continue are also allowed in for and loop loops. These are only allowed in unconstrained code since normal constrained code requires that Noir knows exactly how many iterations a loop may have. break and continue can be used like so: for i in 0 .. 10 { println("Iteration start") if i == 2 { continue; } if i == 5 { break; } println(i); } println("Loop end") When used, break will end the current loop early and jump to the statement after the for loop. In the example above, the break will stop the loop and jump to the println("Loop end"). continue will stop the current iteration of the loop, and jump to the start of the next iteration. In the example above, continue will jump to println("Iteration start") when used. Note that the loop continues as normal after this. The iteration variable i is still increased by one as normal when continue is used. break and continue cannot currently be used to jump out of more than a single loop at a time. Loops In unconstrained code, loop is allowed for loops that end with a break. A loop must contain at least one break statement that is reachable during execution. This is only allowed in unconstrained code since normal constrained code requires that Noir knows exactly how many iterations a loop may have. let mut i = 10; loop { println(i); i -= 1; if i == 0 { break; } } While loops In unconstrained code, while is allowed for loops that end when a given condition is met. This is only allowed in unconstrained code since normal constrained code requires that Noir knows exactly how many iterations a loop may have. let mut i = 0 while i < 10 { println(i); i += 2; } Operations Table of Supported Operations Operation Description Requirements + Adds two private input types together Types must be private input - Subtracts two private input types together Types must be private input * Multiplies two private input types together Types must be private input / Divides two private input types together Types must be private input ^ XOR two private input types together Types must be integer & AND two private input types together Types must be integer | OR two private input types together Types must be integer << Left shift an integer by another integer amount Types must be integer, shift must be u8 >> Right shift an integer by another integer amount Types must be integer, shift must be u8 ! Bitwise not of a value Type must be integer or boolean < returns a bool if one value is less than the other Upper bound must have a known bit size <= returns a bool if one value is less than or equal to the other Upper bound must have a known bit size > returns a bool if one value is more than the other Upper bound must have a known bit size >= returns a bool if one value is more than or equal to the other Upper bound must have a known bit size == returns a bool if one value is equal to the other Both types must not be constants != returns a bool if one value is not equal to the other Both types must not be constants Predicate Operators <,<=, !=, == , >, >= are known as predicate/comparison operations because they compare two values. This differs from the operations such as + where the operands are used in computation. Bitwise Operations Example fn main(x : Field) { let y = x as u32; let z = y & y; } z is implicitly constrained to be the result of y & y. The & operand is used to denote bitwise &. x & x would not compile as x is a Field and not an integer type. Logical Operators Noir has no support for the logical operators || and &&. This is because encoding the short-circuiting that these operators require can be inefficient for Noir's backend. Instead you can use the bitwise operators | and & which operate identically for booleans, just without the short-circuiting. let my\_val = 5; let mut flag = 1; if (my\_val > 6) | (my\_val == 0) { flag = 0; } assert(flag == 1); if (my\_val != 10) & (my\_val < 50) { flag = 0; } assert(flag == 0); Shorthand operators Noir shorthand operators for most of the above operators, namely +=, -=, *=, /=, %=, &=, |=, ^=, <<=, and >>=. These allow for more concise syntax. For example: let mut i = 0; i = i + 1; could be written as: let mut i = 0; i += 1; Edit this page Assert Function Noir includes a special assert function which will explicitly constrain the predicate/comparison expression that follows to be true. If this expression is false at runtime, the program will fail to be proven. As of v1.0.0-beta.2, assert statements are expressions and can be used in value contexts. Example: fn main(x : Field, y : Field) { assert(x == y); } Assertions only work for predicate operations, such as ==. If there's any ambiguity on the operation, the program will fail to compile. For example, it is unclear if assert(x + y) would check for x + y == 0 or simply would return true. You can optionally provide a message to be logged when the assertion fails: assert(x == y, "x and y are not equal"); Aside string literals, the optional message can be a format string or any other type supported as input for Noir's print functions. This feature lets you incorporate runtime variables into your failed assertion logs: assert(x == y, f"Expected x == y, but got {x} == {y}"); Using a variable as an assertion message directly: struct myStruct { myField: Field } let s = myStruct { myField: y }; assert(s.myField == x, s); There is also a special static\_assert function that behaves like assert, but that runs at compile-time. fn main(xs: [Field; 3]) { let x = 2 + 2; let y = 4; static\_assert(x == y, "expected 2 + 2 to equal 4"); // This passes since the length of xs is known at compile-time static\_assert(xs.len() == 3, "expected the input to have 3 elements"); } This function fails when passed a dynamic (run-time) argument: fn main(x : Field, y : Field) { // this fails because x is not known at compile-time static\_assert(x == 2, "expected x to be known at compile-time and equal to 2"); let mut example\_slice = &[]; if y == 4 { example\_slice = example\_slice.push\_back(0); } // This fails because the length of example\_slice is not known at // compile-time let error\_message = "expected an empty slice, known at compile-time"; static\_assert(example\_slice.len() == 0, error\_message); } Edit this page Unconstrained Functions Unconstrained functions are functions which do not constrain any of the included computation and allow for non-deterministic computation. Why? Zero-knowledge (ZK) domain-specific languages (DSL) enable developers to generate ZK proofs from their programs by compiling code down to the constraints of an NP complete language (such as R1CS or PLONKish languages). However, the hard bounds of a constraint system can be very limiting to the functionality of a ZK DSL. Enabling a circuit language to perform unconstrained execution is a powerful tool. Said another way, unconstrained execution lets developers generate witnesses from code that does not generate any constraints. Being able to execute logic outside of a circuit is critical for both circuit performance and constructing proofs on information that is external to a circuit. Fetching information from somewhere external to a circuit can also be used to enable developers to improve circuit efficiency. A ZK DSL does not just prove computation, but proves that some computation was handled correctly. Thus, it is necessary that when we switch from performing some operation directly inside of a circuit to inside of an unconstrained environment that the appropriate constraints are still laid down elsewhere in the circuit. Example An in depth example might help drive the point home. This example comes from the excellent post by Tom in the Noir Discord. Let's look at how we can optimize a function to turn a u72 into an array of u8s. fn main(num: u72) -> pub [u8; 8] { let mut out: [u8; 8] = [0; 8]; for i in 0..8 { out[i] = (num >> (56 - (i * 8)) as u72 & 0xff) as u8; } out } Total ACIR opcodes generated for language PLONKCSat { width: 3 }: 91 Backend circuit size: 3619 A lot of the operations in this function are optimized away by the compiler (all the bit-shifts turn into divisions by constants). However we can save a bunch of gates by casting to u8 a bit earlier. This automatically truncates the bit-shifted value to fit in a u8 which allows us to remove the AND against 0xff. This saves us ~480 gates in total. fn main(num: u72) -> pub [u8; 8] { let mut out: [u8; 8] = [0; 8]; for i in 0..8 { out[i] = (num >> (56 - (i * 8)) as u8; } out } Total ACIR opcodes generated for language PLONKCSat { width: 3 }: 75 Backend circuit size: 3143 Those are some nice savings already but we can do better. This code is all constrained so we're proving every step of calculating out using num, but we don't actually care about how we calculate this, just that it's correct. This is where brillig comes in. It turns out that truncating a u72 into a u8 is hard to do inside a snark, each time we do as u8 we lay down 4 ACIR opcodes which get converted into multiple gates. It's actually much easier to calculate num from out than the other way around. All we need to do is multiply each element of out by a constant and add them all together, both relatively easy operations inside a snark. We can then run u72\_to\_u8 as unconstrained brillig code in order to calculate out, then use that result in our constrained function and assert that if we were to do the reverse calculation we'd get back num. This looks a little like the below: fn main(num: u72) -> pub [u8; 8] { // Safety: 'out' is properly constrained below in 'assert(num == reconstructed\_num);' let out = unsafe { u72\_to\_u8(num) }; let mut reconstructed\_num: u72 = 0; for i in 0..8 { reconstructed\_num += (out[i] as u72 << (56 - (8 * i))); } assert(num == reconstructed\_num); out } unconstrained fn u72\_to\_u8(num: u72) -> [u8; 8] { let mut out: [u8; 8] = [0; 8]; for i in 0..8 { out[i] = (num >> (56 - (i * 8))) as u8; } out } Total ACIR opcodes generated for language PLONKCSat { width: 3 }: 78 Backend circuit size: 2902 This ends up taking off another ~250 gates from our circuit! We've ended up with more ACIR opcodes than before but they're easier for the backend to prove (resulting in fewer gates). Note that in order to invoke unconstrained functions we need to wrap them in an unsafe block, to make it clear that the call is unconstrained. Furthermore, a warning is emitted unless the unsafe block is commented with a // Safety: ... comment explaining why it is fine to call the unconstrained function. Note that either the unsafe block can be commented this way or the statement it exists in (like in the let example above). Generally we want to use brillig whenever there's something that's easy to verify but hard to compute within the circuit. For example, if you wanted to calculate a square root of a number it'll be a much better idea to calculate this in brillig and then assert that if you square the result you get back your number. Break and Continue In addition to loops over runtime bounds, break and continue are also available in unconstrained code. See break and continue Edit this page Oracles Experimental Feature This feature is experimental. The documentation may be incomplete or out of date, which means it could change in future versions, potentially causing unexpected behavior or not working as expected. Contributions Welcome: If you notice any inaccuracies or potential improvements, please consider contributing. Visit our GitHub repository to make your contributions: Contribute Here. Noir has support for Oracles via RPC calls. This means Noir will make an RPC call and use the return value for proof generation. Since Oracles are not resolved by Noir, they are unconstrained functions You can declare an Oracle through the #[oracle()] flag. Example: #[oracle(get\_number\_sequence)] unconstrained fn get\_number\_sequence(\_size: Field) -> [Field] {} The timeout for when using an external RPC oracle resolver can be set with the NARGO\_FOREIGN\_CALL\_TIMEOUT environment variable. This timeout is in units of milliseconds. Edit this page Generics Generics allow you to use the same functions with multiple different concrete data types. You can read more about the concept of generics in the Rust documentation here. Here is a trivial example showing the identity function that supports any type. In Rust, it is common to refer to the most general type as T. We follow the same convention in Noir. fn id(x: T) -> T { x } Numeric Generics If we want to be generic over array lengths (which are type-level integers), we can use numeric generics. Using these looks similar to using regular generics, but introducing them into scope requires declaring them with let MyGenericName: IntegerType. This can be done anywhere a normal generic is declared. Instead of types, these generics resolve to integers at compile-time. Here's an example of a struct that is generic over the size of the array it contains internally: struct BigInt { limbs: [u32; N], } impl BigInt { // N is in scope of all methods in the impl fn first(first: BigInt, second: BigInt) -> Self { assert(first.limbs != second.limbs); first } fn second(first: BigInt, second: Self) -> Self { assert(first.limbs != second.limbs); second } } In Structs Generics are useful for specifying types in structs. For example, we can specify that a field in a struct will be of a certain generic type. In this case value is of type T. struct RepeatedValue { value: T, count: Field, } impl RepeatedValue { fn print(self) { for \_i in 0 .. self.count { println(self.value); } } } fn main() { let repeated = RepeatedValue { value: "Hello!", count: 2 }; repeated.print(); } The print function will print Hello! an arbitrary number of times, twice in this case. Calling functions on generic parameters Since a generic type T can represent any type, how can we call functions on the underlying type? In other words, how can we go from "any type T" to "any type T that has certain methods available?" This is what traits are for in Noir. Here's an example of a function generic over any type T that implements the Eq trait for equality: fn first\_element\_is\_equal(array1: [T; N], array2: [T; N]) -> bool where T: Eq { if (array1.len() == 0) | (array2.len() == 0) { true } else { array1[0] == array2[0] } } fn main() { assert(first\_element\_is\_equal([1, 2, 3], [1, 5, 6])); // We can use first\_element\_is\_equal for arrays of any type // as long as we have an Eq impl for the types we pass in let array = [MyStruct::new(), MyStruct::new()]; assert(first\_element\_is\_equal(array, array)); } struct MyStruct { foo: Field } impl MyStruct { fn new() -> Self { MyStruct { foo: 0 } } } impl Eq for MyStruct { fn eq(self, other: MyStruct) -> bool { self.foo == other.foo } } You can find more details on traits and trait implementations on the traits page. Manually Specifying Generics with the Turbofish Operator There are times when the compiler cannot reasonably infer what type should be used for a generic, or when the developer themselves may want to manually distinguish generic type parameters. This is where the ::<> turbofish operator comes into play. The ::<> operator can follow a variable or path and can be used to manually specify generic arguments within the angle brackets. The name "turbofish" comes from that ::<> looks like a little fish. Examples: fn main() { let mut slice = []; slice = slice.push\_back(1); slice = slice.push\_back(2); // Without turbofish a type annotation would be needed on the left hand side let array = slice.as\_array::<2>(); } trait MyTrait { fn ten() -> Self; } impl MyTrait for Field { fn ten() -> Self { 10 } } struct Foo { inner: T } impl Foo { fn generic\_method(\_self: Self) -> U where U: MyTrait { U::ten() } } fn example() { let foo: Foo = Foo { inner: 1 }; // Using a type other than Field here (e.g. u32) would fail as // there is no matching impl for u32: MyTrait. // // Substituting the 10 on the left hand side of this assert // with 10 as u32 would fail with a type mismatch as we // are expecting a Field from the right hand side. assert(10 == foo.generic\_method::()); } Arithmetic Generics In addition to numeric generics, Noir also allows a limited form of arithmetic on generics. When you have a numeric generic such as N, you can use the following operators on it in a type position: +, -, *, /, and %. Note that type checking arithmetic generics is a best effort guess from the compiler and there are many cases of types that are equal that the compiler may not see as such. For example, we know that T * (N + M) should be equal to T*N + T*M but the compiler does not currently apply the distributive law and thus sees these as different types. Even with this limitation though, the compiler can handle common cases decently well: trait Serialize { fn serialize(self) -> [Field; N]; } impl Serialize<1> for Field { fn serialize(self) -> [Field; 1] { [self] } } impl Serialize for [T; N] where T: Serialize { .. } impl Serialize for (T, U) where T: Serialize, U: Serialize { .. } fn main() { let data = (1, [2, 3, 4]); assert\_eq(data.serialize().len(), 4); } Note that if there is any over or underflow the types will fail to unify: underflow-example fn pop(array: [Field; N]) -> [Field; N - 1] { let mut result: [Field; N - 1] = std::mem::zeroed(); for i in 0..N - 1 { result[i] = array[i]; } result } fn main() { // error: Could not determine array length (0 - 1) pop([]); } Source code: test\_programs/compile\_failure/arithmetic\_generics\_underflow/src/main.nr#L1-L14 This also applies if there is underflow in an intermediate calculation: intermediate-underflow-example fn main() { // From main it looks like there's nothing sketchy going on seems\_fine([]); } // Since seems\_fine says it can receive and return any length N fn seems\_fine(array: [Field; N]) -> [Field; N] { // But inside seems\_fine we pop from the array which // requires the length to be greater than zero. // error: Could not determine array length (0 - 1) push\_zero(pop(array)) } fn pop(array: [Field; N]) -> [Field; N - 1] { let mut result: [Field; N - 1] = std::mem::zeroed(); for i in 0..N - 1 { result[i] = array[i]; } result } fn push\_zero(array: [Field; N]) -> [Field; N + 1] { let mut result: [Field; N + 1] = std::mem::zeroed(); for i in 0..N { result[i] = array[i]; } // index N is already zeroed result } Source code: test\_programs/compile\_failure/arithmetic\_generics\_intermediate\_underflow/src/main.nr#L1-L32 Edit this page Global Variables Globals Noir supports global variables. The global's type must be specified by the user: global N: Field = 5; global TUPLE: (Field, Field) = (3, 2); fn main() { assert(N == 5); assert(N == TUPLE.0 + TUPLE.1); } info Globals can be defined as any expression, so long as they don't depend on themselves - otherwise there would be a dependency cycle! For example: global T: u32 = foo(T); // dependency error If they are initialized to a literal integer, globals can be used to specify an array's length: global N: u32 = 2; fn main(y : [Field; N]) { assert(y[0] == y[1]) } A global from another module can be imported or referenced externally like any other name: global N: Field = 20; fn main() { assert(my\_submodule::N != N); } mod my\_submodule { global N: Field = 10; } When a global is used, Noir replaces the name with its definition on each occurrence. This means globals defined using function calls will repeat the call each time they're used: global RESULT: [Field; 100] = foo(); fn foo() -> [Field; 100] { ... } This is usually fine since Noir will generally optimize any function call that does not refer to a program input into a constant. It should be kept in mind however, if the called function performs side-effects like println, as these will still occur on each use. Visibility By default, like functions, globals are private to the module they exist in. You can use pub to make the global public or pub(crate) to make it public to just its crate: // This global is now public pub global N: u32 = 5; Edit this page Mutability Variables in noir can be declared mutable via the mut keyword. Mutable variables can be reassigned to via an assignment expression. let x = 2; x = 3; // error: x must be mutable to be assigned to let mut y = 3; let y = 4; // OK The mut modifier can also apply to patterns: let (a, mut b) = (1, 2); a = 11; // error: a must be mutable to be assigned to b = 12; // OK let mut (c, d) = (3, 4); c = 13; // OK d = 14; // OK // etc. let MyStruct { x: mut y } = MyStruct { x: a }; // y is now in scope Note that mutability in noir is local and everything is passed by value, so if a called function mutates its parameters then the parent function will keep the old value of the parameters. fn main() -> pub Field { let x = 3; helper(x); x // x is still 3 } fn helper(mut x: i32) { x = 4; } Non-local mutability Non-local mutability can be achieved through the mutable reference type &mut T: fn set\_to\_zero(x: &mut Field) { *x = 0; } fn main() { let mut y = 42; set\_to\_zero(&mut y); assert(*y == 0); } When creating a mutable reference, the original variable being referred to (y in this example) must also be mutable. Since mutable references are a reference type, they must be explicitly dereferenced via * to retrieve the underlying value. Note that this yields a copy of the value, so mutating this copy will not change the original value behind the reference: fn main() { let mut x = 1; let x\_ref = &mut x; let mut y = *x\_ref; let y\_ref = &mut y; x = 2; *x\_ref = 3; y = 4; *y\_ref = 5; assert(x == 3); assert(*x\_ref == 3); assert(y == 5); assert(*y\_ref == 5); } Note that types in Noir are actually deeply immutable so the copy that occurs when dereferencing is only a conceptual copy - no additional constraints will occur. Mutable references can also be stored within structs. Note that there is also no lifetime parameter on these unlike rust. This is because the allocated memory always lasts the entire program - as if it were an array of one element. struct Foo { x: &mut Field } impl Foo { fn incr(mut self) { *self.x += 1; } } fn main() { let foo = Foo { x: &mut 0 }; foo.incr(); assert(*foo.x == 1); } In general, you should avoid non-local & shared mutability unless it is needed. Sticking to only local mutability will improve readability and potentially improve compiler optimizations as well. Edit this page Previous Lambdas Introduction Lambdas are anonymous functions. The syntax is |arg1, arg2, ..., argN| return\_expression. let add\_50 = |val| val + 50; assert(add\_50(100) == 150); A block can be used as the body of a lambda, allowing you to declare local variables inside it: let cool = || { let x = 100; let y = 100; x + y } assert(cool() == 200); Closures Inside the body of a lambda, you can use variables defined in the enclosing function. Such lambdas are called closures. In this example x is defined inside main and is accessed from within the lambda: fn main() { let x = 100; let closure = || x + 150; assert(closure() == 250); } Passing closures to higher-order functions It may catch you by surprise that the following code fails to compile: fn foo(f: fn () -> Field) -> Field { f() } fn main() { let (x, y) = (50, 50); assert(foo(|| x + y) == 100); // error :( } The reason is that the closure's capture environment affects its type - we have a closure that captures two Fields and foo expects a regular function as an argument - those are incompatible. note Variables contained within the || are the closure's parameters, and the expression that follows it is the closure's body. The capture environment is comprised of any variables used in the closure's body that are not parameters. E.g. in |x| x + y, y would be a captured variable, but x would not be, since it is a parameter of the closure. The syntax for the type of a closure is fn[env](args) -> ret\_type, where env is the capture environment of the closure - in this example that's (Field, Field). The best solution in our case is to make foo generic over the environment type of its parameter, so that it can be called with closures with any environment, as well as with regular functions: fn foo(f: fn[Env]() -> Field) -> Field { f() } fn main() { let (x, y) = (50, 50); assert(foo(|| x + y) == 100); // compiles fine assert(foo(|| 60) == 60); // compiles fine } Edit this page Previous Comments A comment is a line in your codebase which the compiler ignores, however it can be read by programmers. Here is a single line comment: // This is a comment and is ignored // is used to tell the compiler to ignore the rest of the line. Noir also supports multi-line block comments. Start a block comment with /* and end the block with */. Noir does not natively support doc comments. You may be able to use Rust doc comments in your code to leverage some Rust documentation build tools with Noir code. /* This is a block comment describing a complex function. */ fn main(x : Field, y : pub Field) { assert(x != y); } Edit this page Previous Shadowing Noir allows for inheriting variables' values and re-declaring them with the same name similar to Rust, known as shadowing. For example, the following function is valid in Noir: fn main() { let x = 5; { let x = x * 2; assert (x == 10); } assert (x == 5); } In this example, a variable x is first defined with the value 5. The local scope that follows shadows the original x, i.e. creates a local mutable x based on the value of the original x. It is given a value of 2 times the original x. When we return to the main scope, x once again refers to just the original x, which stays at the value of 5. Temporal mutability One way that shadowing is useful, in addition to ergonomics across scopes, is for temporarily mutating variables. fn main() { let age = 30; // age = age + 5; // Would error as age is immutable by default. let mut age = age + 5; // Temporarily mutates age with a new value. let age = age; // Locks age's mutability again. assert (age == 35); } Edit this page Data Bus Experimental Feature This feature is experimental. The documentation may be incomplete or out of date, which means it could change in future versions, potentially causing unexpected behavior or not working as expected. Contributions Welcome: If you notice any inaccuracies or potential improvements, please consider contributing. Visit our GitHub repository to make your contributions: Contribute Here. The data bus is an optimization that the backend can use to make recursion more efficient. In order to use it, you must define some inputs of the program entry points (usually the main() function) with the call\_data modifier, and the return values with the return\_data modifier. These modifiers are incompatible with pub and mut modifiers. Example fn main(mut x: u32, y: call\_data u32, z: call\_data [u32;4] ) -> return\_data u32 { let a = z[x]; a+y } As a result, both call\_data and return\_data will be treated as private inputs and encapsulated into a read-only array each, for the backend to process. Edit this page Traits Overview Traits in Noir are a useful abstraction similar to interfaces or protocols in other languages. Each trait defines the interface of several methods contained within the trait. Types can then implement this trait by providing implementations for these methods. For example in the program: struct Rectangle { width: Field, height: Field, } impl Rectangle { fn area(self) -> Field { self.width * self.height } } fn log\_area(r: Rectangle) { println(r.area()); } We have a function log\_area to log the area of a Rectangle. Now how should we change the program if we want this function to work on Triangles as well?: struct Triangle { width: Field, height: Field, } impl Triangle { fn area(self) -> Field { self.width * self.height / 2 } } Making log\_area generic over all types T would be invalid since not all types have an area method. Instead, we can introduce a new Area trait and make log\_area generic over all types T that implement Area: trait Area { fn area(self) -> Field; } fn log\_area(shape: T) where T: Area { println(shape.area()); } We also need to explicitly implement Area for Rectangle and Triangle. We can do that by changing their existing impls slightly. Note that the parameter types and return type of each of our area methods must match those defined by the Area trait. impl Area for Rectangle { fn area(self) -> Field { self.width * self.height } } impl Area for Triangle { fn area(self) -> Field { self.width * self.height / 2 } } Now we have a working program that is generic over any type of Shape that is used! Others can even use this program as a library with their own types - such as Circle - as long as they also implement Area for these types. Where Clauses As seen in log\_area above, when we want to create a function or method that is generic over any type that implements a trait, we can add a where clause to the generic function. fn log\_area(shape: T) where T: Area { println(shape.area()); } It is also possible to apply multiple trait constraints on the same variable at once by combining traits with the + operator. Similarly, we can have multiple trait constraints by separating each with a comma: fn foo(elements: [T], thing: U) where T: Default + Add + Eq, U: Bar, { let mut sum = T::default(); for element in elements { sum += element; } if sum == T::default() { thing.bar(); } } Invoking trait methods As seen in the previous section, the area method was invoked on a type T that had a where clause T: Area. To invoke area on a type that directly implements the trait Area, the trait must be in scope (imported): use geometry::Rectangle; fn main() { let rectangle = Rectangle { width: 1, height: 2}; let area = rectangle.area(); // Error: the compiler doesn't know which area method this is } The above program errors because there might be multiple traits with an area method, all implemented by Rectangle, and it's not clear which one should be used. To make the above program compile, the trait must be imported: use geometry::Rectangle; use geometry::Area; // Bring the Area trait into scope fn main() { let rectangle = Rectangle { width: 1, height: 2}; let area = rectangle.area(); // OK: will use area from geometry::Area } An error will also be produced if multiple traits with an area method are in scope. If both traits are needed in a file you can use the fully-qualified path to the trait: use geometry::Rectangle; fn main() { let rectangle = Rectangle { width: 1, height: 2}; let area = geometry::Area::area(rectangle); } Generic Implementations You can add generics to a trait implementation by adding the generic list after the impl keyword: trait Second { fn second(self) -> Field; } impl Second for (T, Field) { fn second(self) -> Field { self.1 } } You can also implement a trait for every type this way: trait Debug { fn debug(self); } impl Debug for T { fn debug(self) { println(self); } } fn main() { 1.debug(); } Generic Trait Implementations With Where Clauses Where clauses can be placed on trait implementations themselves to restrict generics in a similar way. For example, while impl Foo for T implements the trait Foo for every type, impl Foo for T where T: Bar will implement Foo only for types that also implement Bar. This is often used for implementing generic types. For example, here is the implementation for array equality: impl Eq for [T; let N: u32] where T: Eq { // Test if two arrays have the same elements. // Because both arrays must have length N, we know their lengths already match. fn eq(self, other: Self) -> bool { let mut result = true; for i in 0 .. self.len() { // The T: Eq constraint is needed to call == on the array elements here result &= self[i] == other[i]; } result } } Where clauses can also be placed on struct implementations. For example, here is a method utilizing a generic type that implements the equality trait. struct Foo { a: u32, b: T, } impl Foo where T: Eq { fn eq(self, other: Self) -> bool { (self.a == other.a) & self.b.eq(other.b) } } Generic Traits Traits themselves can also be generic by placing the generic arguments after the trait name. These generics are in scope of every item within the trait. trait Into { // Convert self to type T fn into(self) -> T; } When implementing generic traits the generic arguments of the trait must be specified. This is also true anytime when referencing a generic trait (e.g. in a where clause). struct MyStruct { array: [Field; 2], } impl Into<[Field; 2]> for MyStruct { fn into(self) -> [Field; 2] { self.array } } fn as\_array(x: T) -> [Field; 2] where T: Into<[Field; 2]> { x.into() } fn main() { let array = [1, 2]; let my\_struct = MyStruct { array }; assert\_eq(as\_array(my\_struct), array); } Associated Types and Constants Traits also support associated types and constraints which can be thought of as additional generics that are referred to by name. Here's an example of a trait with an associated type Foo and a constant Bar: trait MyTrait { type Foo; let Bar: u32; } Now when we're implementing MyTrait we also have to provide values for Foo and Bar: impl MyTrait for Field { type Foo = i32; let Bar: u32 = 11; } Since associated constants can also be used in a type position, its values are limited to only other expression kinds allowed in numeric generics. When writing a trait constraint, you can specify all associated types and constants explicitly if you wish: fn foo(x: T) where T: MyTrait { ... } Or you can also elide them since there should only be one Foo and Bar for a given implementation of MyTrait for a type: fn foo(x: T) where T: MyTrait { ... } If you elide associated types, you can still refer to them via the type as trait syntax : fn foo(x: T) where T: MyTrait, ::Foo: Default + Eq { let foo\_value: ::Foo = Default::default(); assert\_eq(foo\_value, foo\_value); } Trait Methods With No self A trait can contain any number of methods, each of which have access to the Self type which represents each type that eventually implements the trait. Similarly, the self variable is available as well but is not required to be used. For example, we can define a trait to create a default value for a type. This trait will need to return the Self type but doesn't need to take any parameters: trait Default { fn default() -> Self; } Implementing this trait can be done similarly to any other trait: impl Default for Field { fn default() -> Field { 0 } } struct MyType {} impl Default for MyType { fn default() -> Field { MyType {} } } However, since there is no self parameter, we cannot call it via the method call syntax object.method(). Instead, we'll need to refer to the function directly. This can be done either by referring to the specific impl MyType::default() or referring to the trait itself Default::default(). In the later case, type inference determines the impl that is selected. let my\_struct = MyStruct::default(); let x: Field = Default::default(); let result = x + Default::default(); Default Method Implementations A trait can also have default implementations of its methods by giving a body to the desired functions. Note that this body must be valid for all types that may implement the trait. As a result, the only valid operations on self will be operations valid for any type or other operations on the trait itself. trait Numeric { fn add(self, other: Self) -> Self; // Default implementation of double is (self + self) fn double(self) -> Self { self.add(self) } } When implementing a trait with default functions, a type may choose to implement only the required functions: impl Numeric for Field { fn add(self, other: Field) -> Field { self + other } } Or it may implement the optional methods as well: impl Numeric for u32 { fn add(self, other: u32) -> u32 { self + other } fn double(self) -> u32 { self * 2 } } Impl Specialization When implementing traits for a generic type it is possible to implement the trait for only a certain combination of generics. This can be either as an optimization or because those specific generics are required to implement the trait. trait Sub { fn sub(self, other: Self) -> Self; } struct NonZero { value: T, } impl Sub for NonZero { fn sub(self, other: Self) -> Self { let value = self.value - other.value; assert(value != 0); NonZero { value } } } Overlapping Implementations Overlapping implementations are disallowed by Noir to ensure Noir's decision on which impl to select is never ambiguous. This means if a trait Foo is already implemented by a type Bar for all T, then we cannot also have a separate impl for Bar (or any other type argument). Similarly, if there is an impl for all T such as impl Debug for T, we cannot create any more impls to Debug for other types since it would be ambiguous which impl to choose for any given method call. trait Trait {} // Previous impl defined here impl Trait for (A, B) {} // error: Impl for type (Field, Field) overlaps with existing impl impl Trait for (Field, Field) {} Trait Coherence Another restriction on trait implementations is coherence. This restriction ensures other crates cannot create impls that may overlap with other impls, even if several unrelated crates are used as dependencies in the same program. The coherence restriction is: to implement a trait, either the trait itself or the object type must be declared in the crate the impl is in. In practice this often comes up when using types provided by libraries. If a library provides a type Foo that does not implement a trait in the standard library such as Default, you may not impl Default for Foo in your own crate. While restrictive, this prevents later issues or silent changes in the program if the Foo library later added its own impl for Default. If you are a user of the Foo library in this scenario and need a trait not implemented by the library your choices are to either submit a patch to the library or use the newtype pattern. The Newtype Pattern The newtype pattern gets around the coherence restriction by creating a new wrapper type around the library type that we cannot create impls for. Since the new wrapper type is defined in our current crate, we can create impls for any trait we need on it. struct Wrapper { foo: some\_library::Foo, } impl Default for Wrapper { fn default() -> Wrapper { Wrapper { foo: some\_library::Foo::new(), } } } Since we have an impl for our own type, the behavior of this code will not change even if some\_library is updated to provide its own impl Default for Foo. The downside of this pattern is that it requires extra wrapping and unwrapping of values when converting to and from the Wrapper and Foo types. Trait Inheritance Sometimes, you might need one trait to use another trait’s functionality (like "inheritance" in some other languages). In this case, you can specify this relationship by listing any child traits after the parent trait's name and a colon. Now, whenever the parent trait is implemented it will require the child traits to be implemented as well. A parent trait is also called a "super trait." trait Person { fn name(self) -> String; } // Person is a supertrait of Student. // Implementing Student requires you to also impl Person. trait Student: Person { fn university(self) -> String; } trait Programmer { fn fav\_language(self) -> String; } // CompSciStudent (computer science student) is a subtrait of both Programmer // and Student. Implementing CompSciStudent requires you to impl both supertraits. trait CompSciStudent: Programmer + Student { fn git\_username(self) -> String; } Trait Aliases Similar to the proposed Rust feature for trait aliases, Noir supports aliasing one or more traits and using those aliases wherever traits would normally be used. trait Foo { fn foo(self) -> Self; } trait Bar { fn bar(self) -> Self; } // Equivalent to: // trait Baz: Foo + Bar {} // // impl Baz for T where T: Foo + Bar {} trait Baz = Foo + Bar; // We can use Baz to refer to Foo + Bar fn baz(x: T) -> T where T: Baz { x.foo().bar() } Generic Trait Aliases Trait aliases can also be generic by placing the generic arguments after the trait name. These generics are in scope of every item within the trait alias. trait Foo { fn foo(self) -> Self; } trait Bar { fn bar(self) -> T; } // Equivalent to: // trait Baz: Foo + Bar {} // // impl Baz for U where U: Foo + Bar {} trait Baz = Foo + Bar; Trait Alias Where Clauses Trait aliases support where clauses to add trait constraints to any of their generic arguments, e.g. ensuring T: Baz for a trait alias Qux. trait Foo { fn foo(self) -> Self; } trait Bar { fn bar(self) -> T; } trait Baz { fn baz(self) -> bool; } // Equivalent to: // trait Qux: Foo + Bar where T: Baz {} // // impl Qux for U where // U: Foo + Bar, // T: Baz, // {} trait Qux = Foo + Bar where T: Baz; Note that while trait aliases support where clauses, the equivalent traits can fail due to #6467 Visibility By default, like functions, traits and trait aliases are private to the module they exist in. You can use pub to make the trait public or pub(crate) to make it public to just its crate: // This trait is now public pub trait Trait {} // This trait alias is now public pub trait Baz = Foo + Bar; Trait methods have the same visibility as the trait they are in. Compile-time Code & Metaprogramming Overview Metaprogramming in Noir is comprised of three parts: comptime code Quoting and unquoting The metaprogramming API in std::meta Each of these are explained in more detail in the next sections but the wide picture is that comptime allows us to write code which runs at compile-time. In this comptime code we can quote and unquote snippets of the program, manipulate them, and insert them in other parts of the program. Comptime functions which do this are said to be macros. Additionally, there's a compile-time API of built-in types and functions provided by the compiler which allows for greater analysis and modification of programs. Comptime comptime is a new keyword in Noir which marks an item as executing or existing at compile-time. It can be used in several ways: comptime fn to define functions which execute exclusively during compile-time. comptime global to define a global variable which is evaluated at compile-time. Unlike runtime globals, comptime globals can be mutable. comptime { ... } to execute a block of statements during compile-time. comptime let to define a variable whose value is evaluated at compile-time. comptime for to run a for loop at compile-time. Syntax sugar for comptime { for .. }. Scoping Note that while in a comptime context, any runtime variables local to the current function are never visible. Evaluating Evaluation rules of comptime follows the normal unconstrained evaluation rules for other Noir code. There are a few things to note though: Certain built-in functions may not be available, although more may be added over time. Evaluation order of comptime {} blocks within global items is currently unspecified. For example, given the following two functions we can't guarantee which println will execute first. The ordering of the two printouts will be arbitrary, but should be stable across multiple compilations with the same nargo version as long as the program is also unchanged. fn one() { comptime { println("one"); } } fn two() { comptime { println("two"); } } Since evaluation order is unspecified, care should be taken when using mutable globals so that they do not rely on a particular ordering. For example, using globals to generate unique ids should be fine but relying on certain ids always being produced (especially after edits to the program) should be avoided. Although the ordering of comptime code is usually unspecified, there are cases where it is: Dependencies of a crate will always be evaluated before the dependent crate. Any attributes on a function will be run before the function body is resolved. This is to allow the attribute to modify the function if necessary. Note that if the function itself was called at compile-time previously, it will already be resolved and cannot be modified. To prevent accidentally calling functions you wish to modify at compile-time, it may be helpful to sort your comptime annotation functions into a different submodule crate along with any dependencies they require. Unlike raw comptime {} blocks, attributes on top-level items in the program do have a set evaluation order. Attributes within a module are evaluated top-down, and attributes in different modules are evaluated submodule-first. Sibling modules to the same parent module are evaluated in order of the module declarations (mod foo; mod bar;) in their parent module. Lowering When a comptime value is used in runtime code it must be lowered into a runtime value. This means replacing the expression with the literal that it evaluated to. For example, the code: struct Foo { array: [Field; 2], len: u32 } fn main() { println(comptime { let mut foo = std::mem::zeroed::(); foo.array[0] = 4; foo.len = 1; foo }); } will be converted to the following after comptime expressions are evaluated: struct Foo { array: [Field; 2], len: u32 } fn main() { println(Foo { array: [4, 0], len: 1 }); } Not all types of values can be lowered. For example, references, Types, and TypeDefinitions (among other types) cannot be lowered at all. fn main() { // There's nothing we could inline here to create a Type value at runtime // let \_ = get\_type!(); } comptime fn get\_type() -> Type { ... } Values of certain types may also change type when they are lowered. For example, a comptime format string will already be formatted, and thus lowers into a runtime string instead: fn main() { let foo = comptime { let i = 2; f"i = {i}" }; assert\_eq(foo, "i = 2"); } (Quasi) Quote Macros in Noir are comptime functions which return code as a value which is inserted into the call site when it is lowered there. A code value in this case is of type Quoted and can be created by a quote { ... } expression. More specifically, the code value quote creates is a token stream - a representation of source code as a series of words, numbers, string literals, or operators. For example, the expression quote { Hi "there reader"! } would quote three tokens: the word "hi", the string "there reader", and an exclamation mark. You'll note that snippets that would otherwise be invalid syntax can still be quoted. When a Quoted value is used in runtime code, it is lowered into a quote { ... } expression. Since this expression is only valid in compile-time code however, we'd get an error if we tried this. Instead, we can use macro insertion to insert each token into the program at that point, and parse it as an expression. To do this, we have to add a ! after the function name returning the Quoted value. If the value was created locally and there is no function returning it, std::meta::unquote!(\_) can be used instead. Calling such a function at compile-time without ! will just return the Quoted value to be further manipulated. For example: quote-example comptime fn quote\_one() -> Quoted { quote { 1 } } #[test] fn returning\_versus\_macro\_insertion() { comptime { // let \_a: Quoted = quote { 1 }; let \_a: Quoted = quote\_one(); // let \_b: Field = 1; let \_b: Field = quote\_one!(); // Since integers default to fields, if we // want a different type we have to explicitly cast // let \_c: i32 = 1 as i32; let \_c: i32 = quote\_one!() as i32; } } Source code: noir\_stdlib/src/meta/mod.nr#L131-L151 For those familiar with quoting from other languages (primarily lisps), Noir's quote is actually a quasiquote. This means we can escape the quoting by using the unquote operator to splice values in the middle of quoted code. In addition to curly braces, you can also use square braces for the quote operator: comptime { let q1 = quote { 1 }; let q2 = quote [ 2 ]; assert\_eq(q1, q2); // Square braces can be used to quote mismatched curly braces if needed let \_ = quote[}]; } Unquote The unquote operator $ is usable within a quote expression. It takes a variable as an argument, evaluates the variable, and splices the resulting value into the quoted token stream at that point. For example, comptime { let x = 1 + 2; let y = quote { $x + 4 }; } The value of y above will be the token stream containing 3, +, and 4. We can also use this to combine Quoted values into larger token streams: comptime { let x = quote { 1 + 2 }; let y = quote { $x + 4 }; } The value of y above is now the token stream containing five tokens: 1 + 2 + 4. Note that to unquote something, a variable name must follow the $ operator in a token stream. If it is an expression (even a parenthesized one), it will do nothing. Most likely a parse error will be given when the macro is later unquoted. Unquoting can also be avoided by escaping the $ with a backslash: comptime { let x = quote { 1 + 2 }; // y contains the four tokens: $x + 4 let y = quote { \$x + 4 }; } Combining Tokens Note that Quoted is internally a series of separate tokens, and that all unquoting does is combine these token vectors. This means that code which appears to append like a string actually appends like a vector internally: comptime { let x = 3; let q = quote { foo$x }; // This is [foo, 3], not [foo3] // Spaces are ignored in general, they're never part of a token assert\_eq(q, quote { foo 3 }); } If you do want string semantics, you can use format strings then convert back to a Quoted value with .quoted\_contents(). Note that formatting a quoted value with multiple tokens will always insert a space between each token. If this is undesired, you'll need to only operate on quoted values containing a single token. To do this, you can iterate over each token of a larger quoted value with .tokens(): concatenate-example comptime fn concatenate(q1: Quoted, q2: Quoted) -> Quoted { assert(q1.tokens().len() <= 1); assert(q2.tokens().len() <= 1); f"{q1}{q2}".quoted\_contents() } // The CtString type is also useful for a compile-time string of unbounded size // so that you can append to it in a loop. comptime fn double\_spaced(q: Quoted) -> CtString { let mut result = "".as\_ctstring(); for token in q.tokens() { if result != "".as\_ctstring() { result = result.append\_str(" "); } result = result.append\_fmtstr(f"{token}"); } result } #[test] fn concatenate\_test() { comptime { let result = concatenate(quote {foo}, quote {bar}); assert\_eq(result, quote {foobar}); let result = double\_spaced(quote {foo bar 3}).as\_quoted\_str!(); assert\_eq(result, "foo bar 3"); } } Source code: noir\_stdlib/src/meta/mod.nr#L266-L299 Attributes Attributes provide a way to run a comptime function on an item in the program. When you use an attribute, the function with the same name will be called with that item as an argument: #[my\_struct\_attribute] struct Foo {} comptime fn my\_struct\_attribute(s: StructDefinition) { println("Called my\_struct\_attribute!"); } #[my\_function\_attribute] fn foo() {} comptime fn my\_function\_attribute(f: FunctionDefinition) { println("Called my\_function\_attribute!"); } Anything returned from one of these functions will be inserted at top-level along with the original item. Note that expressions are not valid at top-level so you'll get an error trying to return 3 or similar just as if you tried to write a program containing 3; struct Foo {}. You can insert other top-level items such as trait impls, structs, or functions this way though. For example, this is the mechanism used to insert additional trait implementations into the program when deriving a trait impl from a struct: derive-field-count-example trait FieldCount { fn field\_count() -> u32; } #[derive\_field\_count] struct Bar { x: Field, y: [Field; 2], } comptime fn derive\_field\_count(s: StructDefinition) -> Quoted { let typ = s.as\_type(); let field\_count = s.fields\_as\_written().len(); quote { impl FieldCount for $typ { fn field\_count() -> u32 { $field\_count } } } } Source code: noir\_stdlib/src/meta/mod.nr#L153-L175 Calling annotations with additional arguments Arguments may optionally be given to attributes. When this is done, these additional arguments are passed to the attribute function after the item argument. annotation-arguments-example #[assert\_field\_is\_type(quote { i32 }.as\_type())] struct MyStruct { my\_field: i32, } comptime fn assert\_field\_is\_type(s: StructDefinition, typ: Type) { // Assert the first field in s has type typ let fields = s.fields([]); assert\_eq(fields[0].1, typ); } Source code: noir\_stdlib/src/meta/mod.nr#L177-L188 We can also take any number of arguments by adding the varargs attribute: annotation-varargs-example #[assert\_three\_args(1, 2, 3)] struct MyOtherStruct { my\_other\_field: u32, } #[varargs] comptime fn assert\_three\_args(\_s: StructDefinition, args: [Field]) { assert\_eq(args.len(), 3); } Source code: noir\_stdlib/src/meta/mod.nr#L190-L200 Attribute Evaluation Order Unlike the evaluation order of stray comptime {} blocks within functions, attributes have a well-defined evaluation order. Within a module, attributes are evaluated top to bottom. Between modules, attributes in child modules are evaluated first. Attributes in sibling modules are resolved following the mod foo; mod bar; declaration order within their parent modules. mod foo; // attributes in foo are run first mod bar; // followed by attributes in bar // followed by any attributes in the parent module #[derive(Eq)] struct Baz {} Note that because of this evaluation order, you may get an error trying to derive a trait for a struct whose fields have not yet had the trait derived already: // Error! Bar field of Foo does not (yet) implement Eq! #[derive(Eq)] struct Foo { bar: Bar } #[derive(Eq)] struct Bar {} In this case, the issue can be resolved by rearranging the structs. Comptime API Although comptime, quote, and unquoting provide a flexible base for writing macros, Noir's true metaprogramming ability comes from being able to interact with the compiler through a compile-time API. This API can be accessed through built-in functions in std::meta as well as on methods of several comptime types. The following is an incomplete list of some comptime types along with some useful methods on them. You can see more in the standard library Metaprogramming section. Quoted: A token stream Type: The type of a Noir type fn implements(self, constraint: TraitConstraint) -> bool Returns true if self implements the given trait constraint Expr: A syntactically valid expression. Can be used to recur on a program's parse tree to inspect how it is structured. Methods: fn as\_function\_call(self) -> Option<(Expr, [Expr])> If this is a function call expression, return (function, arguments) fn as\_block(self) -> Option<[Expr]> If this is a block, return each statement in the block FunctionDefinition: A function definition Methods: fn parameters(self) -> [(Quoted, Type)] Returns a slice of (name, type) pairs for each parameter StructDefinition: A struct definition Methods: fn as\_type(self) -> Type Returns this StructDefinition as a Type. Any generics are kept as-is fn generics(self) -> [Quoted] Return the name of each generic on this struct fn fields(self) -> [(Quoted, Type)] Return the name and type of each field TraitConstraint: A trait constraint such as From TypedExpr: A type-checked expression. UnresolvedType: A syntactic notation that refers to a Noir type that hasn't been resolved yet There are many more functions available by exploring the std::meta module and its submodules. Using these methods is the key to writing powerful metaprogramming libraries. #[use\_callers\_scope] Since certain functions such as Quoted::as\_type, Expression::as\_type, or Quoted::as\_trait\_constraint will attempt to resolve their contents in a particular scope - it can be useful to change the scope they resolve in. By default these functions will resolve in the current function's scope which is usually the attribute function they are called in. If you're working on a library however, this may be a completely different module or crate to the item you're trying to use the attribute on. If you want to be able to use Quoted::as\_type to refer to types local to the caller's scope for example, you can annotate your attribute function with #[use\_callers\_scope]. This will ensure your attribute, and any closures it uses, can refer to anything in the caller's scope. #[use\_callers\_scope] also works recursively. So if both your attribute function and a helper function it calls use it, then they can both refer to the same original caller. Example: Derive Using all of the above, we can write a derive macro that behaves similarly to Rust's but is not built into the language. From the user's perspective it will look like this: // Example usage #[derive(Default, Eq, Ord)] struct MyStruct { my\_field: u32 } To implement derive we'll have to create a comptime function that accepts a variable amount of traits. derive\_example // These are needed for the unconstrained hashmap we're using to store derive functions use crate::collections::umap::UHashMap; use crate::hash::BuildHasherDefault; use crate::hash::poseidon2::Poseidon2Hasher; // A derive function is one that given a struct definition can // create us a quoted trait impl from it. pub type DeriveFunction = fn(StructDefinition) -> Quoted; // We'll keep a global HANDLERS map to keep track of the derive handler for each trait comptime mut global HANDLERS: UHashMap> = UHashMap::default(); // Given a struct and a slice of traits to derive, create trait impls for each. // This function is as simple as iterating over the slice, checking if we have a trait // handler registered for the given trait, calling it, and appending the result. #[varargs] pub comptime fn derive(s: StructDefinition, traits: [TraitDefinition]) -> Quoted { let mut result = quote {}; for trait\_to\_derive in traits { let handler = HANDLERS.get(trait\_to\_derive); assert(handler.is\_some(), f"No derive function registered for {trait\_to\_derive}"); let trait\_impl = handler.unwrap()(s); result = quote { $result $trait\_impl }; } result } Source code: noir\_stdlib/src/meta/mod.nr#L33-L66 Registering a derive function could be done as follows: derive\_via // To register a handler for a trait, just add it to our handlers map pub comptime fn derive\_via(t: TraitDefinition, f: DeriveFunction) { HANDLERS.insert(t, f); } Source code: noir\_stdlib/src/meta/mod.nr#L68-L75 big-derive-usage-example // Finally, to register a handler we call the above function as an annotation // with our handler function. #[derive\_via(derive\_do\_nothing)] trait DoNothing { fn do\_nothing(self); } comptime fn derive\_do\_nothing(s: StructDefinition) -> Quoted { // This is simplified since we don't handle generics or where clauses! // In a real example we'd likely also need to introduce each of // s.generics() as well as a trait constraint for each generic // to ensure they also implement the trait. let typ = s.as\_type(); quote { impl DoNothing for $typ { fn do\_nothing(self) { // Traits can't tell us what to do println("something"); } } } } // Since DoNothing is a simple trait which: // 1. Only has one method // 2. Does not have any generics on the trait itself // We can use std::meta::make\_trait\_impl to help us out. // This helper function will generate our impl for us along with any // necessary where clauses and still provides a flexible interface // for us to work on each field on the struct. comptime fn derive\_do\_nothing\_alt(s: StructDefinition) -> Quoted { let trait\_name = quote { DoNothing }; let method\_signature = quote { fn do\_nothing(self) }; // Call do\_nothing recursively on each field in the struct let for\_each\_field = |field\_name| quote { self.$field\_name.do\_nothing(); }; // Some traits like Eq want to join each field expression with something like &. // We don't need that here let join\_fields\_with = quote {}; // The body function is a spot to insert any extra setup/teardown needed. // We'll insert our println here. Since we recur on each field, we should see // one println for the struct itself, followed by a println for every field (recursively). let body = |body| quote { println("something"); $body }; crate::meta::make\_trait\_impl( s, trait\_name, method\_signature, for\_each\_field, join\_fields\_with, body, ) } Source code: noir\_stdlib/src/meta/mod.nr#L202-L260 Edit this page Previous

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍😊

Şunu dedin:

fn main(x: Field, y: pub Field) { assert(x != y); } #[test] fn test\_main() { main(1, 2); } // passphrase in hex (needed for Field): 0x69206c696b65206e6163686f73 // pedersen hash of passphrase: 0x033787e40b56554b03a980f03a55fbd5baf81cf563a228928b1598d34629bfd5 // test command: nargo test --show-output use dep::std; struct Person { name: str<3>, age: u8 } global minimumAge: u8 = 18; fn main(member : Person, passphrase: Field, passphraseHash: pub Field) { assert(member.age >= minimumAge); let calculatedPassphraseHash = std::hash::pedersen\_hash([passphrase,0]); assert(calculatedPassphraseHash == passphraseHash); } #[test] fn get\_passphrase\_hash() { let passphrase: Field = 0x69206c696b65206e6163686f73; let passphraseHash = std::hash::pedersen\_hash([passphrase,0]); println(passphraseHash); } #[test] fn test\_main() { let passphrase: Field = 0x69206c696b65206e6163686f73; let passphraseHash: Field = 0x033787e40b56554b03a980f03a55fbd5baf81cf563a228928b1598d34629bfd5; let cat = Person { name: "Cat", age: 27, }; main(cat, passphrase, passphraseHash); } // for i in 0..5 { // std::println(i); // } fn main(num: u64) -> pub u64 { // Safety: this should NOT be used in production let square = unsafe { sqrt(num) }; assert(square * square == num); square } unconstrained fn sqrt(num: u64) -> u64 { let mut approx = num; let mut better\_approx = (approx + 1) / 2; for \_ in 0..10 { approx = better\_approx; // if (approx==69) { // break; // } better\_approx = (approx + num / approx) / 2; } better\_approx } #[test] fn test\_main() { let number\_to\_square\_root: u64 = 144; let square\_root = main(number\_to\_square\_root); assert(square\_root == 12); } fn main(x: Field, y: pub Field) { assert(x != y); } #[test] fn test\_main() { main(1, 2); } fn main(x: Field, y: pub Field) { assert(x != y); } #[test] fn test\_main() { main(1, 2); }

ChatGPT:

Güncellenen kayıtlı bellek

Bilgileri belleğe kaydettim. Devam edebilirsin! 👍🙂

Şunu dedin:

#[foreign(aes128\_encrypt)] // docs:start:aes128 pub fn aes128\_encrypt( input: [u8; N], iv: [u8; 16], key: [u8; 16], ) -> [u8; N + 16 - N % 16] {} // docs:end:aes128 // Appends two values together, returning the result. // // An alternate name for this trait is Monoid if that is familiar. // If not, it can be ignored. // // It is expected that for any implementation: // - T::empty().append(x) == x // - x.append(T::empty()) == x // docs:start:append-trait pub trait Append { fn empty() -> Self; fn append(self, other: Self) -> Self; } // docs:end:append-trait impl Append for [T] { fn empty() -> Self { &[] } fn append(self, other: Self) -> Self { // Slices have an existing append function which this will resolve to. self.append(other) } } impl Append for Quoted { comptime fn empty() -> Self { quote {} } comptime fn append(self, other: Self) -> Self { quote { $self $other } } } use crate::meta::derive\_via; #[derive\_via(derive\_eq)] // docs:start:eq-trait pub trait Eq { fn eq(self, other: Self) -> bool; } // docs:end:eq-trait // docs:start:derive\_eq comptime fn derive\_eq(s: TypeDefinition) -> Quoted { let signature = quote { fn eq(\_self: Self, \_other: Self) -> bool }; let for\_each\_field = |name| quote { (\_self.$name == \_other.$name) }; let body = |fields| { if s.fields\_as\_written().len() == 0 { quote { true } } else { fields } }; crate::meta::make\_trait\_impl( s, quote { Eq }, signature, for\_each\_field, quote { & }, body, ) } // docs:end:derive\_eq impl Eq for Field { fn eq(self, other: Field) -> bool { self == other } } impl Eq for u128 { fn eq(self, other: u128) -> bool { self == other } } impl Eq for u64 { fn eq(self, other: u64) -> bool { self == other } } impl Eq for u32 { fn eq(self, other: u32) -> bool { self == other } } impl Eq for u16 { fn eq(self, other: u16) -> bool { self == other } } impl Eq for u8 { fn eq(self, other: u8) -> bool { self == other } } impl Eq for u1 { fn eq(self, other: u1) -> bool { self == other } } impl Eq for i8 { fn eq(self, other: i8) -> bool { self == other } } impl Eq for i16 { fn eq(self, other: i16) -> bool { self == other } } impl Eq for i32 { fn eq(self, other: i32) -> bool { self == other } } impl Eq for i64 { fn eq(self, other: i64) -> bool { self == other } } impl Eq for () { fn eq(\_self: Self, \_other: ()) -> bool { true } } impl Eq for bool { fn eq(self, other: bool) -> bool { self == other } } impl Eq for [T; N] where T: Eq, { fn eq(self, other: [T; N]) -> bool { let mut result = true; for i in 0..self.len() { result &= self[i].eq(other[i]); } result } } impl Eq for [T] where T: Eq, { fn eq(self, other: [T]) -> bool { let mut result = self.len() == other.len(); for i in 0..self.len() { result &= self[i].eq(other[i]); } result } } impl Eq for str { fn eq(self, other: str) -> bool { let self\_bytes = self.as\_bytes(); let other\_bytes = other.as\_bytes(); self\_bytes == other\_bytes } } impl Eq for (A, B) where A: Eq, B: Eq, { fn eq(self, other: (A, B)) -> bool { self.0.eq(other.0) & self.1.eq(other.1) } } impl Eq for (A, B, C) where A: Eq, B: Eq, C: Eq, { fn eq(self, other: (A, B, C)) -> bool { self.0.eq(other.0) & self.1.eq(other.1) & self.2.eq(other.2) } } impl Eq for (A, B, C, D) where A: Eq, B: Eq, C: Eq, D: Eq, { fn eq(self, other: (A, B, C, D)) -> bool { self.0.eq(other.0) & self.1.eq(other.1) & self.2.eq(other.2) & self.3.eq(other.3) } } impl Eq for (A, B, C, D, E) where A: Eq, B: Eq, C: Eq, D: Eq, E: Eq, { fn eq(self, other: (A, B, C, D, E)) -> bool { self.0.eq(other.0) & self.1.eq(other.1) & self.2.eq(other.2) & self.3.eq(other.3) & self.4.eq(other.4) } } impl Eq for Ordering { fn eq(self, other: Ordering) -> bool { self.result == other.result } } // Noir doesn't have enums yet so we emulate (Lt | Eq | Gt) with a struct // that has 3 public functions for constructing the struct. pub struct Ordering { result: Field, } impl Ordering { // Implementation note: 0, 1, and 2 for Lt, Eq, and Gt are built // into the compiler, do not change these without also updating // the compiler itself! pub fn less() -> Ordering { Ordering { result: 0 } } pub fn equal() -> Ordering { Ordering { result: 1 } } pub fn greater() -> Ordering { Ordering { result: 2 } } } #[derive\_via(derive\_ord)] // docs:start:ord-trait pub trait Ord { fn cmp(self, other: Self) -> Ordering; } // docs:end:ord-trait // docs:start:derive\_ord comptime fn derive\_ord(s: TypeDefinition) -> Quoted { let signature = quote { fn cmp(\_self: Self, \_other: Self) -> std::cmp::Ordering }; let for\_each\_field = |name| quote { if result == std::cmp::Ordering::equal() { result = \_self.$name.cmp(\_other.$name); } }; let body = |fields| quote { let mut result = std::cmp::Ordering::equal(); $fields result }; crate::meta::make\_trait\_impl(s, quote { Ord }, signature, for\_each\_field, quote {}, body) } // docs:end:derive\_ord // Note: Field deliberately does not implement Ord impl Ord for u128 { fn cmp(self, other: u128) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for u64 { fn cmp(self, other: u64) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for u32 { fn cmp(self, other: u32) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for u16 { fn cmp(self, other: u16) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for u8 { fn cmp(self, other: u8) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for i8 { fn cmp(self, other: i8) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for i16 { fn cmp(self, other: i16) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for i32 { fn cmp(self, other: i32) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for i64 { fn cmp(self, other: i64) -> Ordering { if self < other { Ordering::less() } else if self > other { Ordering::greater() } else { Ordering::equal() } } } impl Ord for () { fn cmp(\_self: Self, \_other: ()) -> Ordering { Ordering::equal() } } impl Ord for bool { fn cmp(self, other: bool) -> Ordering { if self { if other { Ordering::equal() } else { Ordering::greater() } } else if other { Ordering::less() } else { Ordering::equal() } } } impl Ord for [T; N] where T: Ord, { // The first non-equal element of both arrays determines // the ordering for the whole array. fn cmp(self, other: [T; N]) -> Ordering { let mut result = Ordering::equal(); for i in 0..self.len() { if result == Ordering::equal() { result = self[i].cmp(other[i]); } } result } } impl Ord for [T] where T: Ord, { // The first non-equal element of both arrays determines // the ordering for the whole array. fn cmp(self, other: [T]) -> Ordering { let mut result = self.len().cmp(other.len()); for i in 0..self.len() { if result == Ordering::equal() { result = self[i].cmp(other[i]); } } result } } impl Ord for (A, B) where A: Ord, B: Ord, { fn cmp(self, other: (A, B)) -> Ordering { let result = self.0.cmp(other.0); if result != Ordering::equal() { result } else { self.1.cmp(other.1) } } } impl Ord for (A, B, C) where A: Ord, B: Ord, C: Ord, { fn cmp(self, other: (A, B, C)) -> Ordering { let mut result = self.0.cmp(other.0); if result == Ordering::equal() { result = self.1.cmp(other.1); } if result == Ordering::equal() { result = self.2.cmp(other.2); } result } } impl Ord for (A, B, C, D) where A: Ord, B: Ord, C: Ord, D: Ord, { fn cmp(self, other: (A, B, C, D)) -> Ordering { let mut result = self.0.cmp(other.0); if result == Ordering::equal() { result = self.1.cmp(other.1); } if result == Ordering::equal() { result = self.2.cmp(other.2); } if result == Ordering::equal() { result = self.3.cmp(other.3); } result } } impl Ord for (A, B, C, D, E) where A: Ord, B: Ord, C: Ord, D: Ord, E: Ord, { fn cmp(self, other: (A, B, C, D, E)) -> Ordering { let mut result = self.0.cmp(other.0); if result == Ordering::equal() { result = self.1.cmp(other.1); } if result == Ordering::equal() { result = self.2.cmp(other.2); } if result == Ordering::equal() { result = self.3.cmp(other.3); } if result == Ordering::equal() { result = self.4.cmp(other.4); } result } } // Compares and returns the maximum of two values. // // Returns the second argument if the comparison determines them to be equal. // // # Examples // // 

// use std::cmp;

//

// assert\_eq(cmp::max(1, 2), 2);

// assert\_eq(cmp::max(2, 2), 2);

//

pub fn max(v1: T, v2: T) -> T where T: Ord, { if v1 > v2 { v1 } else { v2 } } // Compares and returns the minimum of two values. // // Returns the first argument if the comparison determines them to be equal. // // # Examples // // 

// use std::cmp;

//

// assert\_eq(cmp::min(1, 2), 1);

// assert\_eq(cmp::min(2, 2), 2);

//

pub fn min(v1: T, v2: T) -> T where T: Ord, { if v1 > v2 { v2 } else { v1 } } mod cmp\_tests { use crate::cmp::{max, min}; #[test] fn sanity\_check\_min() { assert\_eq(min(0 as u64, 1 as u64), 0); assert\_eq(min(0 as u64, 0 as u64), 0); assert\_eq(min(1 as u64, 1 as u64), 1); assert\_eq(min(255 as u8, 0 as u8), 0); } #[test] fn sanity\_check\_max() { assert\_eq(max(0 as u64, 1 as u64), 1); assert\_eq(max(0 as u64, 0 as u64), 0); assert\_eq(max(1 as u64, 1 as u64), 1); assert\_eq(max(255 as u8, 0 as u8), 255); } } comptime global BN254\_MODULUS\_BE\_BYTES: [u8] = &[ 48, 100, 78, 114, 225, 49, 160, 41, 184, 80, 69, 182, 129, 129, 88, 93, 40, 51, 232, 72, 121, 185, 112, 145, 67, 225, 245, 147, 240, 0, 0, 1, ]; pub fn is\_bn254() -> bool { comptime { // We can't use the Eq trait here due to limitations on calling non-comptime functions // defined within the same crate. let mut eq = true; let modulus\_be\_bytes = crate::field::modulus\_be\_bytes(); // We can't do BN254\_MODULUS\_BE\_BYTES.len() due to limitations on calling non-comptime functions. assert\_eq(crate::field::modulus\_num\_bits(), 254); for i in 0..32 { eq &= modulus\_be\_bytes[i] == BN254\_MODULUS\_BE\_BYTES[i]; } eq } } // docs:start:from-trait pub trait From { fn from(input: T) -> Self; } // docs:end:from-trait impl From for T { fn from(input: T) -> T { input } } // docs:start:into-trait pub trait Into { fn into(self) -> T; } impl Into for U where T: From, { fn into(self) -> T { T::from(self) } } // docs:end:into-trait // docs:start:from-impls // Unsigned integers impl From for u32 { fn from(value: u8) -> u32 { value as u32 } } impl From for u64 { fn from(value: u8) -> u64 { value as u64 } } impl From for u64 { fn from(value: u32) -> u64 { value as u64 } } impl From for u128 { fn from(value: u8) -> u128 { value as u128 } } impl From for u128 { fn from(value: u32) -> u128 { value as u128 } } impl From for u128 { fn from(value: u64) -> u128 { value as u128 } } impl From for Field { fn from(value: u8) -> Field { value as Field } } impl From for Field { fn from(value: u32) -> Field { value as Field } } impl From for Field { fn from(value: u64) -> Field { value as Field } } impl From for Field { fn from(value: u128) -> Field { value as Field } } // Signed integers impl From for i32 { fn from(value: i8) -> i32 { value as i32 } } impl From for i64 { fn from(value: i8) -> i64 { value as i64 } } impl From for i64 { fn from(value: i32) -> i64 { value as i64 } } // Booleans impl From for u8 { fn from(value: bool) -> u8 { value as u8 } } impl From for u32 { fn from(value: bool) -> u32 { value as u32 } } impl From for u64 { fn from(value: bool) -> u64 { value as u64 } } impl From for i8 { fn from(value: bool) -> i8 { value as i8 } } impl From for i32 { fn from(value: bool) -> i32 { value as i32 } } impl From for i64 { fn from(value: bool) -> i64 { value as i64 } } impl From for Field { fn from(value: bool) -> Field { value as Field } } // docs:end:from-impls /// A generic interface for casting between primitive types, /// equivalent of using the as keyword between values. /// /// # Example /// /// 

/// let x: Field = 1234567890;

/// let y: u8 = x as u8;

/// let z: u8 = x.as\_();

/// assert\_eq(y, z);

///

pub trait AsPrimitive { /// The equivalent of doing self as T. fn as\_(self) -> T; } #[generate\_as\_primitive\_impls] comptime fn generate\_as\_primitive\_impls(\_: FunctionDefinition) -> Quoted { let types = [ quote { bool }, quote { u8 }, quote { u16 }, quote { u32 }, quote { u64 }, quote { u128 }, quote { i8 }, quote { i16 }, quote { i32 }, quote { i64 }, quote { Field }, ]; let mut impls = &[]; for type1 in types { for type2 in types { impls = impls.push\_back( quote { impl AsPrimitive<$type1> for $type2 { fn as\_(self) -> $type1 { self as $type1 } } }, ); } } impls.join(quote {}) } #[foreign(ecdsa\_secp256k1)] // docs:start:ecdsa\_secp256k1 /// Verifies a ECDSA signature over the secp256k1 curve. /// - inputs: /// - x coordinate of public key as 32 bytes /// - y coordinate of public key as 32 bytes /// - the signature, as a 64 bytes array /// The signature internally will be represented as (r, s), /// where r and s are fixed-sized big endian scalar values. /// As the secp256k1 has a 256-bit modulus, we have a 64 byte signature /// while r and s will both be 32 bytes. /// We expect s to be normalized. This means given the curve's order, /// s should be less than or equal to order / 2. /// This is done to prevent malleability. /// For more context regarding malleability you can reference BIP 0062. /// - the hash of the message, as a vector of bytes /// - output: false for failure and true for success pub fn verify\_signature( public\_key\_x: [u8; 32], public\_key\_y: [u8; 32], signature: [u8; 64], message\_hash: [u8; N], ) -> bool // docs:end:ecdsa\_secp256k1 {} #[foreign(ecdsa\_secp256k1)] // docs:start:ecdsa\_secp256k1\_slice pub fn verify\_signature\_slice( public\_key\_x: [u8; 32], public\_key\_y: [u8; 32], signature: [u8; 64], message\_hash: [u8], ) -> bool // docs:end:ecdsa\_secp256k1\_slice {} #[foreign(ecdsa\_secp256r1)] // docs:start:ecdsa\_secp256r1 pub fn verify\_signature( public\_key\_x: [u8; 32], public\_key\_y: [u8; 32], signature: [u8; 64], message\_hash: [u8; N], ) -> bool // docs:end:ecdsa\_secp256r1 {} #[foreign(ecdsa\_secp256r1)] // docs:start:ecdsa\_secp256r1\_slice pub fn verify\_signature\_slice( public\_key\_x: [u8; 32], public\_key\_y: [u8; 32], signature: [u8; 64], message\_hash: [u8], ) -> bool // docs:end:ecdsa\_secp256r1\_slice {} use crate::cmp::Eq; use crate::hash::Hash; use crate::ops::arith::{Add, Neg, Sub}; /// A point on the embedded elliptic curve /// By definition, the base field of the embedded curve is the scalar field of the proof system curve, i.e the Noir Field. /// x and y denotes the Weierstrass coordinates of the point, if is\_infinite is false. pub struct EmbeddedCurvePoint { pub x: Field, pub y: Field, pub is\_infinite: bool, } impl EmbeddedCurvePoint { /// Elliptic curve point doubling operation /// returns the doubled point of a point P, i.e P+P pub fn double(self) -> EmbeddedCurvePoint { embedded\_curve\_add(self, self) } /// Returns the null element of the curve; 'the point at infinity' pub fn point\_at\_infinity() -> EmbeddedCurvePoint { EmbeddedCurvePoint { x: 0, y: 0, is\_infinite: true } } /// Returns the curve's generator point. pub fn generator() -> EmbeddedCurvePoint { // Generator point for the grumpkin curve (y^2 = x^3 - 17) EmbeddedCurvePoint { x: 1, y: 17631683881184975370165255887551781615748388533673675138860, // sqrt(-16) is\_infinite: false, } } } impl Add for EmbeddedCurvePoint { /// Adds two points P+Q, using the curve addition formula, and also handles point at infinity fn add(self, other: EmbeddedCurvePoint) -> EmbeddedCurvePoint { embedded\_curve\_add(self, other) } } impl Sub for EmbeddedCurvePoint { /// Points subtraction operation, using addition and negation fn sub(self, other: EmbeddedCurvePoint) -> EmbeddedCurvePoint { self + other.neg() } } impl Neg for EmbeddedCurvePoint { /// Negates a point P, i.e returns -P, by negating the y coordinate. /// If the point is at infinity, then the result is also at infinity. fn neg(self) -> EmbeddedCurvePoint { EmbeddedCurvePoint { x: self.x, y: -self.y, is\_infinite: self.is\_infinite } } } impl Eq for EmbeddedCurvePoint { /// Checks whether two points are equal fn eq(self: Self, b: EmbeddedCurvePoint) -> bool { (self.is\_infinite & b.is\_infinite) | ((self.is\_infinite == b.is\_infinite) & (self.x == b.x) & (self.y == b.y)) } } impl Hash for EmbeddedCurvePoint { fn hash(self, state: &mut H) where H: crate::hash::Hasher, { if self.is\_infinite { self.is\_infinite.hash(state); } else { self.x.hash(state); self.y.hash(state); } } } /// Scalar for the embedded curve represented as low and high limbs /// By definition, the scalar field of the embedded curve is base field of the proving system curve. /// It may not fit into a Field element, so it is represented with two Field elements; its low and high limbs. pub struct EmbeddedCurveScalar { pub lo: Field, pub hi: Field, } impl EmbeddedCurveScalar { pub fn new(lo: Field, hi: Field) -> Self { EmbeddedCurveScalar { lo, hi } } #[field(bn254)] pub fn from\_field(scalar: Field) -> EmbeddedCurveScalar { let (a, b) = crate::field::bn254::decompose(scalar); EmbeddedCurveScalar { lo: a, hi: b } } //Bytes to scalar: take the first (after the specified offset) 16 bytes of the input as the lo value, and the next 16 bytes as the hi value #[field(bn254)] pub(crate) fn from\_bytes(bytes: [u8; 64], offset: u32) -> EmbeddedCurveScalar { let mut v = 1; let mut lo = 0 as Field; let mut hi = 0 as Field; for i in 0..16 { lo = lo + (bytes[offset + 31 - i] as Field) * v; hi = hi + (bytes[offset + 15 - i] as Field) * v; v = v * 256; } let sig\_s = crate::embedded\_curve\_ops::EmbeddedCurveScalar { lo, hi }; sig\_s } } impl Eq for EmbeddedCurveScalar { fn eq(self, other: Self) -> bool { (other.hi == self.hi) & (other.lo == self.lo) } } impl Hash for EmbeddedCurveScalar { fn hash(self, state: &mut H) where H: crate::hash::Hasher, { self.hi.hash(state); self.lo.hash(state); } } // Computes a multi scalar multiplication over the embedded curve. // For bn254, We have Grumpkin and Baby JubJub. // For bls12-381, we have JubJub and Bandersnatch. // // The embedded curve being used is decided by the // underlying proof system. // docs:start:multi\_scalar\_mul pub fn multi\_scalar\_mul( points: [EmbeddedCurvePoint; N], scalars: [EmbeddedCurveScalar; N], ) -> EmbeddedCurvePoint // docs:end:multi\_scalar\_mul { multi\_scalar\_mul\_array\_return(points, scalars)[0] } #[foreign(multi\_scalar\_mul)] pub(crate) fn multi\_scalar\_mul\_array\_return( points: [EmbeddedCurvePoint; N], scalars: [EmbeddedCurveScalar; N], ) -> [EmbeddedCurvePoint; 1] {} // docs:start:fixed\_base\_scalar\_mul pub fn fixed\_base\_scalar\_mul(scalar: EmbeddedCurveScalar) -> EmbeddedCurvePoint // docs:end:fixed\_base\_scalar\_mul { multi\_scalar\_mul([EmbeddedCurvePoint::generator()], [scalar]) } /// This function only assumes that the points are on the curve /// It handles corner cases around the infinity point causing some overhead compared to embedded\_curve\_add\_not\_nul and embedded\_curve\_add\_unsafe // docs:start:embedded\_curve\_add pub fn embedded\_curve\_add( point1: EmbeddedCurvePoint, point2: EmbeddedCurvePoint, ) -> EmbeddedCurvePoint { // docs:end:embedded\_curve\_add if crate::runtime::is\_unconstrained() { // embedded\_curve\_add\_unsafe requires the inputs not to be the infinity point, so we check it here. // This is because embedded\_curve\_add\_unsafe uses the embedded\_curve\_add opcode. // For efficiency, the backend does not check the inputs for the infinity point, but it assumes that they are not the infinity point // so that it can apply the ec addition formula directly. if point1.is\_infinite { point2 } else if point2.is\_infinite { point1 } else { embedded\_curve\_add\_unsafe(point1, point2) } } else { // In a constrained context, we also need to check the inputs are not the infinity point because we also use embedded\_curve\_add\_unsafe // However we also need to identify the case where the two inputs are the same, because then // the addition formula does not work and we need to use the doubling formula instead. // In unconstrained context, we can check directly if the input values are the same when solving the opcode, so it is not an issue. // x\_coordinates\_match is true if both abscissae are the same let x\_coordinates\_match = point1.x == point2.x; // y\_coordinates\_match is true if both ordinates are the same let y\_coordinates\_match = point1.y == point2.y; // double\_predicate is true if both abscissae and ordinates are the same let double\_predicate = (x\_coordinates\_match & y\_coordinates\_match); // If the abscissae are the same, but not the ordinates, then one point is the opposite of the other let infinity\_predicate = (x\_coordinates\_match & !y\_coordinates\_match); let point1\_1 = EmbeddedCurvePoint { x: point1.x + (x\_coordinates\_match as Field), y: point1.y, is\_infinite: false, }; let point2\_1 = EmbeddedCurvePoint { x: point2.x, y: point2.y, is\_infinite: false }; // point1\_1 is guaranteed to have a different abscissa than point2: // - if x\_coordinates\_match is 0, that means point1.x != point2.x, and point1\_1.x = point1.x + 0 // - if x\_coordinates\_match is 1, that means point1.x = point2.x, but point1\_1.x = point1.x + 1 in this case // Because the abscissa is different, the addition formula is guaranteed to succeed, so we can safely use embedded\_curve\_add\_unsafe // Note that this computation may be garbage: if x\_coordinates\_match is 1, or if one of the input is the point at infinity. let mut result = embedded\_curve\_add\_unsafe(point1\_1, point2\_1); // embedded\_curve\_add\_unsafe is doing a doubling if the input is the same variable, because in this case it is guaranteed (at 'compile time') that the input is the same. let double = embedded\_curve\_add\_unsafe(point1, point1); // embedded\_curve\_add\_unsafe would not perform doubling, even if the inputs point1 and point2 are the same, because it cannot know this without adding some logic (and some constraints) // However we did this logic when we computed double\_predicate, so we set the result to 2*point1 if point1 and point2 are the same result = if double\_predicate { double } else { result }; // Same logic as above for unconstrained context, we set the proper result when one of the inputs is the infinity point if point1.is\_infinite { result = point2; } if point2.is\_infinite { result = point1; } // Finally, we set the is\_infinity flag of the result: // Opposite points should sum into the infinity point, however, if one of them is point at infinity, their coordinates are not meaningful // so we should not use the fact that the inputs are opposite in this case: let mut result\_is\_infinity = infinity\_predicate & (!point1.is\_infinite & !point2.is\_infinite); // However, if both of them are at infinity, then the result is also at infinity result.is\_infinite = result\_is\_infinity | (point1.is\_infinite & point2.is\_infinite); result } } #[foreign(embedded\_curve\_add)] fn embedded\_curve\_add\_array\_return( \_point1: EmbeddedCurvePoint, \_point2: EmbeddedCurvePoint, ) -> [EmbeddedCurvePoint; 1] {} /// This function assumes that: /// The points are on the curve, and /// The points don't share an x-coordinate, and /// Neither point is the infinity point. /// If it is used with correct input, the function ensures the correct non-zero result is returned. /// Except for points on the curve, the other assumptions are checked by the function. It will cause assertion failure if they are not respected. pub fn embedded\_curve\_add\_not\_nul( point1: EmbeddedCurvePoint, point2: EmbeddedCurvePoint, ) -> EmbeddedCurvePoint { assert(point1.x != point2.x); assert(!point1.is\_infinite); assert(!point2.is\_infinite); embedded\_curve\_add\_unsafe(point1, point2) } /// Unsafe ec addition /// If the inputs are the same, it will perform a doubling, but only if point1 and point2 are the same variable. /// If they have the same value but are different variables, the result will be incorrect because in this case /// it assumes (but does not check) that the points' x-coordinates are not equal. /// It also assumes neither point is the infinity point. pub fn embedded\_curve\_add\_unsafe( point1: EmbeddedCurvePoint, point2: EmbeddedCurvePoint, ) -> EmbeddedCurvePoint { embedded\_curve\_add\_array\_return(point1, point2)[0] } /// An identity function that *hints* to the compiler to be maximally pessimistic about what black\_box could do. /// /// This can be used to block the SSA optimization passes being applied to a value, which should help to prevent /// test programs from being optimized down to nothing and have them resemble runtime code more closely. #[builtin(black\_box)] pub fn black\_box(value: T) -> T {} pub mod hash; pub mod aes128; pub mod array; pub mod slice; pub mod ecdsa\_secp256k1; pub mod ecdsa\_secp256r1; pub mod embedded\_curve\_ops; pub mod field; pub mod collections; pub mod compat; pub mod convert; pub mod option; pub mod string; pub mod test; pub mod cmp; pub mod ops; pub mod default; pub mod prelude; pub mod runtime; pub mod meta; pub mod append; pub mod mem; pub mod panic; pub mod hint; use convert::AsPrimitive; // Oracle calls are required to be wrapped in an unconstrained function // Thus, the only argument to the println oracle is expected to always be an ident #[oracle(print)] unconstrained fn print\_oracle(with\_newline: bool, input: T) {} unconstrained fn print\_unconstrained(with\_newline: bool, input: T) { print\_oracle(with\_newline, input); } pub fn println(input: T) { // Safety: a print statement cannot be constrained unsafe { print\_unconstrained(true, input); } } pub fn print(input: T) { // Safety: a print statement cannot be constrained unsafe { print\_unconstrained(false, input); } } pub fn verify\_proof( verification\_key: [Field; N], proof: [Field; M], public\_inputs: [Field; K], key\_hash: Field, ) { verify\_proof\_internal(verification\_key, proof, public\_inputs, key\_hash, 0); } pub fn verify\_proof\_with\_type( verification\_key: [Field; N], proof: [Field; M], public\_inputs: [Field; K], key\_hash: Field, proof\_type: u32, ) { if !crate::runtime::is\_unconstrained() { crate::assert\_constant(proof\_type); } verify\_proof\_internal(verification\_key, proof, public\_inputs, key\_hash, proof\_type); } #[foreign(recursive\_aggregation)] fn verify\_proof\_internal( verification\_key: [Field; N], proof: [Field; M], public\_inputs: [Field; K], key\_hash: Field, proof\_type: u32, ) {} // Asserts that the given value is known at compile-time. // Useful for debugging for-loop bounds. #[builtin(assert\_constant)] pub fn assert\_constant(x: T) {} // Asserts that the given value is both true and known at compile-time. // The message can be a string, a format string, or any value, as long as it is known at compile-time #[builtin(static\_assert)] pub fn static\_assert(predicate: bool, message: T) {} #[deprecated("wrapping operations should be done with the Wrapping traits. E.g: x.wrapping\_add(y)")] pub fn wrapping\_add(x: T, y: T) -> T where T: AsPrimitive, Field: AsPrimitive, { AsPrimitive::as\_(x.as\_() + y.as\_()) } #[deprecated("wrapping operations should be done with the Wrapping traits. E.g: x.wrapping\_sub(y)")] pub fn wrapping\_sub(x: T, y: T) -> T where T: AsPrimitive, Field: AsPrimitive, { //340282366920938463463374607431768211456 is 2^128, it is used to avoid underflow AsPrimitive::as\_(x.as\_() + 340282366920938463463374607431768211456 - y.as\_()) } #[deprecated("wrapping operations should be done with the Wrapping traits. E.g: x.wrapping\_mul(y)")] pub fn wrapping\_mul(x: T, y: T) -> T where T: AsPrimitive, Field: AsPrimitive, { AsPrimitive::as\_(x.as\_() * y.as\_()) } #[builtin(as\_witness)] pub fn as\_witness(x: Field) {} mod tests { use super::ops::arith::WrappingMul; #[test(should\_fail\_with = "custom message")] fn test\_static\_assert\_custom\_message() { super::static\_assert(1 == 2, "custom message"); } #[test] fn test\_wrapping\_mul() { let zero: u128 = 0; let one: u128 = 1; let two\_pow\_64: u128 = 0x10000000000000000; let u128\_max: u128 = 0xffffffffffffffffffffffffffffffff; // 1*0==0 assert\_eq(zero, zero.wrapping\_mul(one)); // 0*1==0 assert\_eq(zero, one.wrapping\_mul(zero)); // 1*1==1 assert\_eq(one, one.wrapping\_mul(one)); // 0 * ( 1 << 64 ) == 0 assert\_eq(zero, zero.wrapping\_mul(two\_pow\_64)); // ( 1 << 64 ) * 0 == 0 assert\_eq(zero, two\_pow\_64.wrapping\_mul(zero)); // 1 * ( 1 << 64 ) == 1 << 64 assert\_eq(two\_pow\_64, two\_pow\_64.wrapping\_mul(one)); // ( 1 << 64 ) * 1 == 1 << 64 assert\_eq(two\_pow\_64, one.wrapping\_mul(two\_pow\_64)); // ( 1 << 64 ) * ( 1 << 64 ) == 1 << 64 assert\_eq(zero, two\_pow\_64.wrapping\_mul(two\_pow\_64)); // -1 * -1 == 1 assert\_eq(one, u128\_max.wrapping\_mul(u128\_max)); } } /// For any type, return an instance of that type by initializing /// all of its fields to 0. This is considered to be unsafe since there /// is no guarantee that all zeroes is a valid bit pattern for every type. #[builtin(zeroed)] pub fn zeroed() -> T {} /// Transmutes a value of type T to a value of type U. /// /// Both types are asserted to be equal during compilation but after type checking. /// If not, a compilation error is issued. /// /// This function is useful for types using arithmetic generics in cases /// which the compiler otherwise cannot prove equal during type checking. /// You can use this to obtain a value of the correct type while still asserting /// that it is equal to the previous. #[builtin(checked\_transmute)] pub fn checked\_transmute(value: T) -> U {} /// Returns the internal reference count of an array value in unconstrained code. /// /// Arrays only have reference count in unconstrained code - using this anywhere /// else will return zero. #[builtin(array\_refcount)] pub fn array\_refcount(array: [T; N]) -> u32 {} /// Returns the internal reference count of a slice value in unconstrained code. /// /// Slices only have reference count in unconstrained code - using this anywhere /// else will return zero. #[builtin(slice\_refcount)] pub fn slice\_refcount(slice: [T]) -> u32 {} pub fn panic(message: fmtstr) -> U { assert(false, message); crate::mem::zeroed() } pub use crate::{assert\_constant, print, println}; pub use crate::cmp::{Eq, Ord}; pub use crate::collections::bounded\_vec::BoundedVec; pub use crate::collections::vec::Vec; pub use crate::convert::{From, Into}; pub use crate::default::Default; pub use crate::meta::{derive, derive\_via}; pub use crate::option::Option; pub use crate::panic::panic; #[builtin(is\_unconstrained)] pub fn is\_unconstrained() -> bool {} use crate::append::Append; impl [T] { /// Returns the length of the slice. #[builtin(array\_len)] pub fn len(self) -> u32 {} /// Push a new element to the end of the slice, returning a /// new slice with a length one greater than the /// original unmodified slice. #[builtin(slice\_push\_back)] pub fn push\_back(self, elem: T) -> Self {} /// Push a new element to the front of the slice, returning a /// new slice with a length one greater than the /// original unmodified slice. #[builtin(slice\_push\_front)] pub fn push\_front(self, elem: T) -> Self {} /// Remove the last element of the slice, returning the /// popped slice and the element in a tuple #[builtin(slice\_pop\_back)] pub fn pop\_back(self) -> (Self, T) {} /// Remove the first element of the slice, returning the /// element and the popped slice in a tuple #[builtin(slice\_pop\_front)] pub fn pop\_front(self) -> (T, Self) {} /// Insert an element at a specified index, shifting all elements /// after it to the right #[builtin(slice\_insert)] pub fn insert(self, index: u32, elem: T) -> Self {} /// Remove an element at a specified index, shifting all elements /// after it to the left, returning the altered slice and /// the removed element #[builtin(slice\_remove)] pub fn remove(self, index: u32) -> (Self, T) {} /// Append each element of the other slice to the end of self. /// This returns a new slice and leaves both input slices unchanged. pub fn append(mut self, other: Self) -> Self { for elem in other { self = self.push\_back(elem); } self } pub fn as\_array(self) -> [T; N] { assert(self.len() == N); let mut array = [crate::mem::zeroed(); N]; for i in 0..N { array[i] = self[i]; } array } // Apply a function to each element of the slice, returning a new slice // containing the mapped elements. pub fn map(self, f: fn[Env](T) -> U) -> [U] { let mut ret = &[]; for elem in self { ret = ret.push\_back(f(elem)); } ret } // Apply a function to each element of the slice with its index, returning a // new slice containing the mapped elements. pub fn mapi(self, f: fn[Env](u32, T) -> U) -> [U] { let mut ret = &[]; let mut index = 0; for elem in self { ret = ret.push\_back(f(index, elem)); index += 1; } ret } // Apply a function to each element of the slice pub fn for\_each(self, f: fn[Env](T) -> ()) { for elem in self { f(elem); } } // Apply a function to each element of the slice with its index pub fn for\_eachi(self, f: fn[Env](u32, T) -> ()) { let mut index = 0; for elem in self { f(index, elem); index += 1; } } // Apply a function to each element of the slice and an accumulator value, // returning the final accumulated value. This function is also sometimes // called foldl, fold\_left, reduce, or inject. pub fn fold(self, mut accumulator: U, f: fn[Env](U, T) -> U) -> U { for elem in self { accumulator = f(accumulator, elem); } accumulator } // Apply a function to each element of the slice and an accumulator value, // returning the final accumulated value. Unlike fold, reduce uses the first // element of the given slice as its starting accumulator value. pub fn reduce(self, f: fn[Env](T, T) -> T) -> T { let mut accumulator = self[0]; for i in 1..self.len() { accumulator = f(accumulator, self[i]); } accumulator } // Returns a new slice containing only elements for which the given predicate // returns true. pub fn filter(self, predicate: fn[Env](T) -> bool) -> Self { let mut ret = &[]; for elem in self { if predicate(elem) { ret = ret.push\_back(elem); } } ret } // Flatten each element in the slice into one value, separated by separator. pub fn join(self, separator: T) -> T where T: Append, { let mut ret = T::empty(); if self.len() != 0 { ret = self[0]; for i in 1..self.len() { ret = ret.append(separator).append(self[i]); } } ret } // Returns true if all elements in the slice satisfy the predicate pub fn all(self, predicate: fn[Env](T) -> bool) -> bool { let mut ret = true; for elem in self { ret &= predicate(elem); } ret } // Returns true if any element in the slice satisfies the predicate pub fn any(self, predicate: fn[Env](T) -> bool) -> bool { let mut ret = false; for elem in self { ret |= predicate(elem); } ret } } mod test { #[test] fn map\_empty() { assert\_eq(&[].map(|x| x + 1), &[]); } #[test] fn mapi\_empty() { assert\_eq(&[].mapi(|i, x| i * x + 1), &[]); } #[test] fn for\_each\_empty() { let empty\_slice: [Field] = &[]; empty\_slice.for\_each(|\_x| assert(false)); } #[test] fn for\_eachi\_empty() { let empty\_slice: [Field] = &[]; empty\_slice.for\_eachi(|\_i, \_x| assert(false)); } #[test] fn map\_example() { let a = &[1, 2, 3]; let b = a.map(|a| a * 2); assert\_eq(b, &[2, 4, 6]); } #[test] fn mapi\_example() { let a = &[1, 2, 3]; let b = a.mapi(|i, a| i + a * 2); assert\_eq(b, &[2, 5, 8]); } #[test] fn for\_each\_example() { let a = &[1, 2, 3]; let mut b = &[]; let b\_ref = &mut b; a.for\_each(|a| { *b\_ref = b\_ref.push\_back(a * 2); }); assert\_eq(b, &[2, 4, 6]); } #[test] fn for\_eachi\_example() { let a = &[1, 2, 3]; let mut b = &[]; let b\_ref = &mut b; a.for\_eachi(|i, a| { *b\_ref = b\_ref.push\_back(i + a * 2); }); assert\_eq(b, &[2, 5, 8]); } } use crate::collections::vec::Vec; use crate::convert::From; impl str { /// Converts the given string into a byte array #[builtin(str\_as\_bytes)] pub fn as\_bytes(self) -> [u8; N] {} /// return a byte vector of the str content pub fn as\_bytes\_vec(self: Self) -> Vec { Vec::from\_slice(self.as\_bytes().as\_slice()) } } impl From<[u8; N]> for str { fn from(bytes: [u8; N]) -> Self { bytes.as\_str\_unchecked() } } 

ChatGPT:

Belleğe kaydettim. Devam edebilirsin. 👍🙂

Şunu dedin:

sana attığım tüm doslardaki fonksiyonları vs anladın mı 

ChatGPT:

Evet, attığın dosyalardaki tüm fonksiyonları, yapıları, trait'leri ve diğer kod bileşenlerini inceledim ve belleğe kaydettim. İhtiyacın olan belirli bir fonksiyon veya yapı hakkında detaylı bir açıklama yapmamı ister misin? Yoksa genel bir özet geçmemi mi istersin? 👍🙂

Şunu dedin:

belleğindeki yapıları inceleyip bana buradaki circuitin eksik ve tam yönlerini verebi,lir misin lütfen use dep::std::hash::pedersen\_hash; use dep::zkemail::{ KEY\_LIMBS\_1024, get\_body\_hash\_by\_index, base64::body\_hash\_base64\_decode, partial\_hash::partial\_sha256\_var\_end }; use zkemail::dkim::verify\_dkim\_1024; use dep::string\_search::{SubString, StringBody, SubString32, SubString64, SubString128}; type StringBody1280 = StringBody<1302, 42, 1280>; type StringBody1408 = StringBody<1426, 46, 1408>; global MAX\_EMAIL\_HEADER\_LENGTH: u32 = 1408; global MAX\_PARTIAL\_EMAIL\_BODY\_LENGTH: u32 = 1280; /** * @brief Total constraints: 361,913 * * * @param header: Email headers that are signed by DKIM (sanitized as per DKIM spec); ASCII byte array; padded to max length * @param header\_length: Length of the headers * @param partial\_body: Email body after up to which SHA precompute is done; ASCII byte array; padded to max length * @param partial\_body\_length: Length of the partial body * @param full\_body\_length: Length of the full email body (with partial SHA) * @param partial\_body\_hash: 256-bit partial hash of the body (u32[8]) * @param body\_hash\_index: Index at which the body hash (bh=) is present in the header (u32) * @param pubkey: 1024-bit public key limbs * @param pubkey\_redc: 1024-bit public key reduction parameters limbs * @param signature: 1024-bit signature limbs * @param repo\_name: Name of the repo; ASCII byte array; padded to max length * @param repo\_name\_length: Length of the repo name * @param pr\_number: PR number; ASCII byte array of numeric characters; padded to max length * @param pr\_number\_length: Length of the PR number * @param email\_address: User's email address; ASCII byte array; padded to max length * @param email\_address\_length: Length of the email address **/ fn main( header: [u8; MAX\_EMAIL\_HEADER\_LENGTH], header\_length: u32, partial\_body: [u8; MAX\_PARTIAL\_EMAIL\_BODY\_LENGTH], partial\_body\_length: u32, full\_body\_length: u32, partial\_body\_hash: [u32; 8], body\_hash\_index: u32, pubkey: [Field; KEY\_LIMBS\_1024], pubkey\_redc: [Field; KEY\_LIMBS\_1024], signature: [Field; KEY\_LIMBS\_1024], repo\_name: pub [u8; 50], repo\_name\_length: u32, pr\_number: [u8; 6], pr\_number\_length: u32, email\_address: [u8; 60], email\_address\_length: u32, wallet\_address: Field ) -> pub Field { // check the body and header lengths are within bounds assert(header\_length <= MAX\_EMAIL\_HEADER\_LENGTH, "header exceeds max length"); assert(partial\_body\_length <= MAX\_PARTIAL\_EMAIL\_BODY\_LENGTH, "body exceeds max length"); wallet\_address.assert\_max\_bit\_size(160); // verify the dkim signature over the header verify\_dkim\_1024(header, header\_length, pubkey, pubkey\_redc, signature); // manually extract the body hash from the header let body\_hash\_encoded = get\_body\_hash\_by\_index(header, body\_hash\_index); let signed\_body\_hash: [u8; 32] = body\_hash\_base64\_decode(body\_hash\_encoded); // finish the partial hash let computed\_body\_hash = partial\_sha256\_var\_end( partial\_body\_hash, partial\_body, partial\_body\_length as u64, full\_body\_length as u64 ); // check the body hashes match assert(signed\_body\_hash == computed\_body\_hash, "sha256 hash does not match"); // Construct haystack from body to search for substrings let haystack: StringBody1280 = StringBody::new(partial\_body, partial\_body\_length); // Assert repo name is in the body assert\_repo\_name\_in\_body( haystack, repo\_name, repo\_name\_length, pr\_number, pr\_number\_length ); // Assert authored message is in the body assert\_authored\_msg\_in\_body(haystack); // We need to assert email address is in the header as that is used to calculate nullifier assert\_email\_address\_in\_header(header, header\_length, email\_address, email\_address\_length); // Calculate and return nullifier (hash(emailAddress)) let mut email\_addr\_field: [Field; 60] = [0; 60]; for i in 0..60 { email\_addr\_field[i] = email\_address[i] as Field; } let nullifier = pedersen\_hash(email\_addr\_field); nullifier } // PR merge notification email includes pull request URL at the footer JSON // Format: "target": "https://github.com/{repo\_org}/{repo\_name}/pull/{pr\_number}#event-XXX"} // This function constructs the above string based on provided inputs, and asserts // that the body contains this string. fn assert\_repo\_name\_in\_body( haystack: StringBody1280, repo\_name: [u8; 50], repo\_name\_length: u32, pr\_number: [u8; 6], pr\_number\_length: u32 ) { let mut pr\_url: [u8; 128] = [0; 128]; // Prefix - ,\r\n is to ensure that target starts at a new line let url\_prefix = ",\r\n\"target\": \"https://github.com/".as\_bytes(); for i in 0..url\_prefix.len() { pr\_url[i] = url\_prefix[i]; } // Append repo name for i in 0..50 { if (i < repo\_name\_length) { pr\_url[url\_prefix.len() + i] = repo\_name[i]; } } // Append "/pull/" for i in 0..6 { pr\_url[url\_prefix.len() + repo\_name\_length + i] = "/pull/".as\_bytes()[i]; } // Append PR number for i in 0..6 { if (i < pr\_number\_length) { pr\_url[url\_prefix.len() + repo\_name\_length + 6 + i] = pr\_number[i]; } } // Total length let pr\_url\_length = url\_prefix.len() + repo\_name\_length + 6 + pr\_number\_length; // String search in body let pr\_url\_substring: SubString128 = SubString::new(pr\_url, pr\_url\_length); let (match\_found2, pos): (bool, u32) = haystack.substring\_match(pr\_url\_substring); assert(match\_found2, "body does not contain pr url"); // Assert value after pos is #event- let suffix = "#event-".as\_bytes(); for i in 0..6 { haystack.body[pos + pr\_url\_length + i] == suffix[i] } } fn assert\_authored\_msg\_in\_body(haystack: StringBody1280) { // This message ensure that person who received email is the one who created the PR let authored\_msg = "because you authored the thread.(input: [u8; N]) -> HASH





Source code: noir\_stdlib/src/hash/sha256.nr#L46-L49

example:



sha256\_var

let digest = std::hash::sha256\_var([x as u8], 1);



Source code: test\_programs/execution\_success/sha256/src/main.nr#L15-L17

fn main() {

 let x = [163, 117, 178, 149]; // some random bytes

 let hash = std::sha256::sha256\_var(x, 4);

}



This is a black box function. Read this section to learn more about black box functions in Noir.



blake2s

Given an array of bytes, returns an array with the Blake2 hash



blake2s

pub fn blake2s(input: [u8; N]) -> [u8; 32]



Source code: noir\_stdlib/src/hash/mod.nr#L18-L20

example:



fn main() {

 let x = [163, 117, 178, 149]; // some random bytes

 let hash = std::hash::blake2s(x);

}



This is a black box function. Read this section to learn more about black box functions in Noir.



blake3

Given an array of bytes, returns an array with the Blake3 hash



blake3

pub fn blake3(input: [u8; N]) -> [u8; 32]



Source code: noir\_stdlib/src/hash/mod.nr#L24-L26

example:



fn main() {

 let x = [163, 117, 178, 149]; // some random bytes

 let hash = std::hash::blake3(x);

}



This is a black box function. Read this section to learn more about black box functions in Noir.



pedersen\_hash

Given an array of Fields, returns the Pedersen hash.



pedersen\_hash

pub fn pedersen\_hash(input: [Field; N]) -> Field



Source code: noir\_stdlib/src/hash/mod.nr#L49-L51

example:



pedersen-hash

fn main(x: Field, y: Field, expected\_hash: Field) {

 let hash = std::hash::pedersen\_hash([x, y]);

 assert\_eq(hash, expected\_hash);

}



Source code: test\_programs/execution\_success/pedersen\_hash/src/main.nr#L1-L6

This is a black box function. Read this section to learn more about black box functions in Noir.



pedersen\_commitment

Given an array of Fields, returns the Pedersen commitment.



pedersen\_commitment

pub fn pedersen\_commitment(input: [Field; N]) -> EmbeddedCurvePoint {



Source code: noir\_stdlib/src/hash/mod.nr#L29-L31

example:



pedersen-commitment

fn main(x: Field, y: Field, expected\_commitment: std::embedded\_curve\_ops::EmbeddedCurvePoint) {

 let commitment = std::hash::pedersen\_commitment([x, y]);

 assert\_eq(commitment.x, expected\_commitment.x);

 assert\_eq(commitment.y, expected\_commitment.y);

}





Source code: test\_programs/execution\_success/pedersen\_commitment/src/main.nr#L1-L7

This is a black box function. Read this section to learn more about black box functions in Noir.



keccak256

Given an array of bytes (u8), returns the resulting keccak hash as an array of 32 bytes ([u8; 32]). Specify a message\_size to hash only the first message\_size bytes of the input.



keccak256

pub fn keccak256(input: [u8; N], message\_size: u32) -> [u8; 32]



Source code: noir\_stdlib/src/hash/mod.nr#L117-L119

example:



keccak256

fn main(x: Field, result: [u8; 32]) {

 // We use the `as` keyword here to denote the fact that we want to take just the first byte from the x Field

 // The padding is taken care of by the program

 let digest = std::hash::keccak256([x as u8], 1);

 assert(digest == result);



 //#1399: variable message size

 let message\_size = 4;

 let hash\_a = std::hash::keccak256([1, 2, 3, 4], message\_size);

 let hash\_b = std::hash::keccak256([1, 2, 3, 4, 0, 0, 0, 0], message\_size);



 assert(hash\_a == hash\_b);



 let message\_size\_big = 8;

 let hash\_c = std::hash::keccak256([1, 2, 3, 4, 0, 0, 0, 0], message\_size\_big);



 assert(hash\_a != hash\_c);

}





Source code: test\_programs/execution\_success/keccak256/src/main.nr#L1-L20

This is a black box function. Read this section to learn more about black box functions in Noir.



poseidon

Given an array of Fields, returns a new Field with the Poseidon Hash. Mind that you need to specify how many inputs are there to your Poseidon function.



// example for hash\_1, hash\_2 accepts an array of length 2, etc

fn hash\_1(input: [Field; 1]) -> Field



example:



poseidon

use std::hash::poseidon;



fn main(x1: [Field; 2], y1: pub Field, x2: [Field; 4], y2: pub Field) {

 let hash1 = poseidon::bn254::hash\_2(x1);

 assert(hash1 == y1);



 let hash2 = poseidon::bn254::hash\_4(x2);

 assert(hash2 == y2);

}



Source code: test\_programs/execution\_success/poseidon\_bn254\_hash/src/main.nr#L1-L11

poseidon 2

Given an array of Fields, returns a new Field with the Poseidon2 Hash. Contrary to the Poseidon function, there is only one hash and you can specify a message\_size to hash only the first message\_size bytes of the input,



// example for hashing the first three elements of the input

Poseidon2::hash(input, 3);



example:



poseidon2

use std::hash::poseidon2;



fn main(inputs: [Field; 4], expected\_hash: Field) {

 let hash = poseidon2::Poseidon2::hash(inputs, inputs.len());

 assert\_eq(hash, expected\_hash);

}



Source code: test\_programs/execution\_success/poseidon2/src/main.nr#L1-L8

hash\_to\_field

fn hash\_to\_field(\_input : [Field]) -> Field {}



Calculates the blake2s hash of the inputs and returns the hash modulo the field modulus to return a value which can be represented as a Field.



Ciphers

aes128

Given a plaintext as an array of bytes, returns the corresponding aes128 ciphertext (CBC mode). Input padding is automatically performed using PKCS#7, so that the output length is input.len() + (16 - input.len() % 16).



aes128

pub fn aes128\_encrypt(

 input: [u8; N],

 iv: [u8; 16],

 key: [u8; 16],

) -> [u8; N + 16 - N % 16] {}



Source code: noir\_stdlib/src/aes128.nr#L2-L8

fn main() {

 let input: [u8; 4] = [0, 12, 3, 15] // Random bytes, will be padded to 16 bytes.

 let iv: [u8; 16] = [0; 16]; // Initialisation vector

 let key: [u8; 16] = [0; 16] // AES key

 let ciphertext = std::aes128::aes128\_encrypt(inputs.as\_bytes(), iv.as\_bytes(), key.as\_bytes()); // In this case, the output length will be 16 bytes.

}





This is a black box function. Read this section to learn more about black box functions in Noir.



Scalar multiplication

The following functions perform operations over the embedded curve whose coordinates are defined by the configured noir field. For the BN254 scalar field, this is BabyJubJub or Grumpkin.



note

Suffixes \_low and \_high denote low and high limbs of a scalar.



embedded\_curve\_ops::multi\_scalar\_mul

Performs multi scalar multiplication over the embedded curve. The function accepts arbitrary amount of point-scalar pairs on the input, it multiplies the individual pairs over the curve and returns a sum of the resulting points.



Points represented as x and y coordinates [x1, y1, x2, y2, ...], scalars as low and high limbs [low1, high1, low2, high2, ...].



multi\_scalar\_mul

pub fn multi\_scalar\_mul(

 points: [EmbeddedCurvePoint; N],

 scalars: [EmbeddedCurveScalar; N],

) -> EmbeddedCurvePoint



Source code: noir\_stdlib/src/embedded\_curve\_ops.nr#L103-L108

example



fn main(point\_x: Field, point\_y: Field, scalar\_low: Field, scalar\_high: Field) {

 let point = std::embedded\_curve\_ops::multi\_scalar\_mul([point\_x, point\_y], [scalar\_low, scalar\_high]);

 println(point);

}





embedded\_curve\_ops::fixed\_base\_scalar\_mul

Performs fixed base scalar multiplication over the embedded curve (multiplies input scalar with a generator point). The function accepts a single scalar on the input represented as 2 fields.



fixed\_base\_scalar\_mul

pub fn fixed\_base\_scalar\_mul(scalar: EmbeddedCurveScalar) -> EmbeddedCurvePoint





Source code: noir\_stdlib/src/embedded\_curve\_ops.nr#L120-L122

example



fn main(scalar\_low: Field, scalar\_high: Field) {

 let point = std::embedded\_curve\_ops::fixed\_base\_scalar\_mul(scalar\_low, scalar\_high);

 println(point);

}





embedded\_curve\_ops::embedded\_curve\_add

Adds two points on the embedded curve. This function takes two EmbeddedCurvePoint structures as parameters, representing points on the curve, and returns a new EmbeddedCurvePoint structure that represents their sum.



Parameters:

point1 (EmbeddedCurvePoint): The first point to add.

point2 (EmbeddedCurvePoint): The second point to add.

Returns:

EmbeddedCurvePoint: The resulting point after the addition of point1 and point2.

embedded\_curve\_add

pub fn embedded\_curve\_add(

 point1: EmbeddedCurvePoint,

 point2: EmbeddedCurvePoint,

) -> EmbeddedCurvePoint {



Source code: noir\_stdlib/src/embedded\_curve\_ops.nr#L136-L141

example



fn main() {

 let point1 = EmbeddedCurvePoint { x: 1, y: 2 };

 let point2 = EmbeddedCurvePoint { x: 3, y: 4 };

 let result = std::embedded\_curve\_ops::embedded\_curve\_add(point1, point2);

 println!("Resulting Point: ({}, {})", result.x, result.y);

}





This is a black box function. Read this section to learn more about black box functions in Noir.





ECDSA Signature Verification

Noir supports ECDSA signatures verification over the secp256k1 and secp256r1 curves.



ecdsa\_secp256k1::verify\_signature

Verifier for ECDSA Secp256k1 signatures. See ecdsa\_secp256k1::verify\_signature\_slice for a version that accepts slices directly.



ecdsa\_secp256k1

pub fn verify\_signature(

 public\_key\_x: [u8; 32],

 public\_key\_y: [u8; 32],

 signature: [u8; 64],

 message\_hash: [u8; N],

) -> bool



Source code: noir\_stdlib/src/ecdsa\_secp256k1.nr#L2-L9

example:



fn main(hashed\_message : [u8;32], pub\_key\_x : [u8;32], pub\_key\_y : [u8;32], signature : [u8;64]) {

 let valid\_signature = std::ecdsa\_secp256k1::verify\_signature(pub\_key\_x, pub\_key\_y, signature, hashed\_message);

 assert(valid\_signature);

}





This is a black box function. Read this section to learn more about black box functions in Noir.



ecdsa\_secp256k1::verify\_signature\_slice

Verifier for ECDSA Secp256k1 signatures where the message is a slice.



ecdsa\_secp256k1\_slice

pub fn verify\_signature\_slice(

 public\_key\_x: [u8; 32],

 public\_key\_y: [u8; 32],

 signature: [u8; 64],

 message\_hash: [u8],

) -> bool



Source code: noir\_stdlib/src/ecdsa\_secp256k1.nr#L13-L20

This is a black box function. Read this section to learn more about black box functions in Noir.



ecdsa\_secp256r1::verify\_signature

Verifier for ECDSA Secp256r1 signatures. See ecdsa\_secp256r1::verify\_signature\_slice for a version that accepts slices directly.



ecdsa\_secp256r1

pub fn verify\_signature(

 public\_key\_x: [u8; 32],

 public\_key\_y: [u8; 32],

 signature: [u8; 64],

 message\_hash: [u8; N],

) -> bool



Source code: noir\_stdlib/src/ecdsa\_secp256r1.nr#L2-L9

example:



fn main(hashed\_message : [u8;32], pub\_key\_x : [u8;32], pub\_key\_y : [u8;32], signature : [u8;64]) {

 let valid\_signature = std::ecdsa\_secp256r1::verify\_signature(pub\_key\_x, pub\_key\_y, signature, hashed\_message);

 assert(valid\_signature);

}





This is a black box function. Read this section to learn more about black box functions in Noir.



ecdsa\_secp256r1::verify\_signature

Verifier for ECDSA Secp256r1 signatures where the message is a slice.



ecdsa\_secp256r1\_slice

pub fn verify\_signature\_slice(

 public\_key\_x: [u8; 32],

 public\_key\_y: [u8; 32],

 signature: [u8; 64],

 message\_hash: [u8],

) -> bool



Source code: noir\_stdlib/src/ecdsa\_secp256r1.nr#L13-L20

This is a black box function. Read this section to learn more about black box functions in Noir.



Edit this page



Black Box Functions

Black box functions are functions in Noir that rely on backends implementing support for specialized constraints. This makes certain zk-snark unfriendly computations cheaper than if they were implemented in Noir.



The ACVM spec defines a set of blackbox functions which backends will be expected to implement. This allows backends to use optimized implementations of these constraints if they have them, however they may also fallback to less efficient naive implementations if not.



Function list

Here is a list of the current black box functions:



AES128

SHA256

Blake2s

Blake3

Pedersen Hash

Pedersen Commitment

ECDSA signature verification

Embedded curve operations (MSM, addition, ...)

AND

XOR

RANGE

Keccak256

Recursive proof verification

Most black box functions are included as part of the Noir standard library, however AND, XOR and RANGE are used as part of the Noir language syntax. For instance, using the bitwise operator & will invoke the AND black box function.



You can view the black box functions defined in the ACVM code here.



Bn254 Field Library

Noir provides a module in standard library with some optimized functions for bn254 Fr in std::field::bn254.



decompose

fn decompose(x: Field) -> (Field, Field) {}



Decomposes a single field into two fields, low and high. The low field contains the lower 16 bytes of the input field and the high field contains the upper 16 bytes of the input field. Both field results are range checked to 128 bits.



assert\_gt

fn assert\_gt(a: Field, b: Field) {}



Asserts that a > b. This will generate less constraints than using assert(gt(a, b)).



assert\_lt

fn assert\_lt(a: Field, b: Field) {}



Asserts that a < b. This will generate less constraints than using assert(lt(a, b)).



gt

fn gt(a: Field, b: Field) -> bool {}



Returns true if a > b.



lt

fn lt(a: Field, b: Field) -> bool {}



Returns true if a < b.



Bounded Vectors

A BoundedVec is a growable storage similar to a Vec except that it is bounded with a maximum possible length. Unlike Vec, BoundedVec is not implemented via slices and thus is not subject to the same restrictions slices are (notably, nested slices - and thus nested vectors as well - are disallowed).



Since a BoundedVec is backed by a normal array under the hood, growing the BoundedVec by pushing an additional element is also more efficient - the length only needs to be increased by one.



For these reasons BoundedVec should generally be preferred over Vec when there is a reasonable maximum bound that can be placed on the vector.



Example:



let mut vector: BoundedVec = BoundedVec::new();

for i in 0..5 {

 vector.push(i);

}

assert(vector.len() == 5);

assert(vector.max\_len() == 10);



Methods

new

pub fn new() -> Self



Creates a new, empty vector of length zero.



Since this container is backed by an array internally, it still needs an initial value to give each element. To resolve this, each element is zeroed internally. This value is guaranteed to be inaccessible unless get\_unchecked is used.



Example:



let empty\_vector: BoundedVec = BoundedVec::new();

assert(empty\_vector.len() == 0);



Note that whenever calling new the maximum length of the vector should always be specified via a type signature:



new\_example

fn good() -> BoundedVec {

 // Ok! MaxLen is specified with a type annotation

 let v1: BoundedVec = BoundedVec::new();

 let v2 = BoundedVec::new();



 // Ok! MaxLen is known from the type of `good`'s return value

 v2

}



fn bad() {

 // Error: Type annotation needed

 // The compiler can't infer `MaxLen` from this code.

 let mut v3 = BoundedVec::new();

 v3.push(5);

}



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L11-L27



This defaulting of MaxLen (and numeric generics in general) to zero may change in future noir versions but for now make sure to use type annotations when using bounded vectors. Otherwise, you will receive a constraint failure at runtime when the vec is pushed to.



get

pub fn get(self, index: u64) -> T {



Retrieves an element from the vector at the given index, starting from zero.



If the given index is equal to or greater than the length of the vector, this will issue a constraint failure.



Example:



fn foo(v: BoundedVec) {

 let first = v.get(0);

 let last = v.get(v.len() - 1);

 assert(first != last);

}



get\_unchecked

pub fn get\_unchecked(self, index: u64) -> T {



Retrieves an element from the vector at the given index, starting from zero, without performing a bounds check.



Since this function does not perform a bounds check on length before accessing the element, it is unsafe! Use at your own risk!



Example:



get\_unchecked\_example

fn sum\_of\_first\_three(v: BoundedVec) -> u32 {

 // Always ensure the length is larger than the largest

 // index passed to get\_unchecked

 assert(v.len() > 2);

 let first = v.get\_unchecked(0);

 let second = v.get\_unchecked(1);

 let third = v.get\_unchecked(2);

 first + second + third

}



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L54-L64



set

pub fn set(&mut self: Self, index: u64, value: T) {



Writes an element to the vector at the given index, starting from zero.



If the given index is equal to or greater than the length of the vector, this will issue a constraint failure.



Example:



fn foo(v: BoundedVec) {

 let first = v.get(0);

 assert(first != 42);

 v.set(0, 42);

 let new\_first = v.get(0);

 assert(new\_first == 42);

}



set\_unchecked

pub fn set\_unchecked(&mut self: Self, index: u64, value: T) -> T {



Writes an element to the vector at the given index, starting from zero, without performing a bounds check.



Since this function does not perform a bounds check on length before accessing the element, it is unsafe! Use at your own risk!



Example:



set\_unchecked\_example

fn set\_unchecked\_example() {

 let mut vec: BoundedVec = BoundedVec::new();

 vec.extend\_from\_array([1, 2]);



 // Here we're safely writing within the valid range of `vec`

 // `vec` now has the value [42, 2]

 vec.set\_unchecked(0, 42);



 // We can then safely read this value back out of `vec`.

 // Notice that we use the checked version of `get` which would prevent reading unsafe values.

 assert\_eq(vec.get(0), 42);



 // We've now written past the end of `vec`.

 // As this index is still within the maximum potential length of `v`,

 // it won't cause a constraint failure.

 vec.set\_unchecked(2, 42);

 println(vec);



 // This will write past the end of the maximum potential length of `vec`,

 // it will then trigger a constraint failure.

 vec.set\_unchecked(5, 42);

 println(vec);

}





Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L67-L91



push

pub fn push(&mut self, elem: T) {



Pushes an element to the end of the vector. This increases the length of the vector by one.



Panics if the new length of the vector will be greater than the max length.



Example:



bounded-vec-push-example

let mut v: BoundedVec = BoundedVec::new();



 v.push(1);

 v.push(2);



 // Panics with failed assertion "push out of bounds"

 v.push(3);



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L95-L103



pop

pub fn pop(&mut self) -> T



Pops the element at the end of the vector. This will decrease the length of the vector by one.



Panics if the vector is empty.



Example:



bounded-vec-pop-example

let mut v: BoundedVec = BoundedVec::new();

 v.push(1);

 v.push(2);



 let two = v.pop();

 let one = v.pop();



 assert(two == 2);

 assert(one == 1);

 // error: cannot pop from an empty vector

 // let \_ = v.pop();



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L108-L120



len

pub fn len(self) -> u64 {



Returns the current length of this vector



Example:



bounded-vec-len-example

let mut v: BoundedVec = BoundedVec::new();

 assert(v.len() == 0);



 v.push(100);

 assert(v.len() == 1);



 v.push(200);

 v.push(300);

 v.push(400);

 assert(v.len() == 4);



 let \_ = v.pop();

 let \_ = v.pop();

 assert(v.len() == 2);



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L125-L140



max\_len

pub fn max\_len(\_self: BoundedVec) -> u64 {



Returns the maximum length of this vector. This is always equal to the MaxLen parameter this vector was initialized with.



Example:



bounded-vec-max-len-example

let mut v: BoundedVec = BoundedVec::new();



 assert(v.max\_len() == 5);

 v.push(10);

 assert(v.max\_len() == 5);



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L145-L151



storage

pub fn storage(self) -> [T; MaxLen] {



Returns the internal array within this vector. Since arrays in Noir are immutable, mutating the returned storage array will not mutate the storage held internally by this vector.



Note that uninitialized elements may be zeroed out!



Example:



bounded-vec-storage-example

let mut v: BoundedVec = BoundedVec::new();



 assert(v.storage() == [0, 0, 0, 0, 0]);



 v.push(57);

 assert(v.storage() == [57, 0, 0, 0, 0]);



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L156-L163



extend\_from\_array

pub fn extend\_from\_array(&mut self, array: [T; Len])



Pushes each element from the given array to this vector.



Panics if pushing each element would cause the length of this vector to exceed the maximum length.



Example:



bounded-vec-extend-from-array-example

let mut vec: BoundedVec = BoundedVec::new();

 vec.extend\_from\_array([2, 4]);



 assert(vec.len == 2);

 assert(vec.get(0) == 2);

 assert(vec.get(1) == 4);



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L168-L175



extend\_from\_bounded\_vec

pub fn extend\_from\_bounded\_vec(&mut self, vec: BoundedVec)



Pushes each element from the other vector to this vector. The length of the other vector is left unchanged.



Panics if pushing each element would cause the length of this vector to exceed the maximum length.



Example:



bounded-vec-extend-from-bounded-vec-example

let mut v1: BoundedVec = BoundedVec::new();

 let mut v2: BoundedVec = BoundedVec::new();



 v2.extend\_from\_array([1, 2, 3]);

 v1.extend\_from\_bounded\_vec(v2);



 assert(v1.storage() == [1, 2, 3, 0, 0]);

 assert(v2.storage() == [1, 2, 3, 0, 0, 0, 0]);



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L180-L189



from\_array

pub fn from\_array(array: [T; Len]) -> Self



Creates a new vector, populating it with values derived from an array input. The maximum length of the vector is determined based on the type signature.



Example:



let bounded\_vec: BoundedVec = BoundedVec::from\_array([1, 2, 3])



from\_parts

pub fn from\_parts(mut array: [T; MaxLen], len: u32) -> Self



Creates a new BoundedVec from the given array and length. The given length must be less than or equal to the length of the array.



This function will zero out any elements at or past index len of array. This incurs an extra runtime cost of O(MaxLen). If you are sure your array is zeroed after that index, you can use from\_parts\_unchecked to remove the extra loop.



Example:



from-parts

let vec: BoundedVec = BoundedVec::from\_parts([1, 2, 3, 0], 3);

 assert\_eq(vec.len(), 3);



 // Any elements past the given length are zeroed out, so these

 // two BoundedVecs will be completely equal

 let vec1: BoundedVec = BoundedVec::from\_parts([1, 2, 3, 1], 3);

 let vec2: BoundedVec = BoundedVec::from\_parts([1, 2, 3, 2], 3);

 assert\_eq(vec1, vec2);





Source code: noir\_stdlib/src/collections/bounded\_vec.nr#L693-L702



from\_parts\_unchecked

pub fn from\_parts\_unchecked(array: [T; MaxLen], len: u32) -> Self



Creates a new BoundedVec from the given array and length. The given length must be less than or equal to the length of the array.



This function is unsafe because it expects all elements past the len index of array to be zeroed, but does not check for this internally. Use from\_parts for a safe version of this function which does zero out any indices past the given length. Invalidating this assumption can notably cause BoundedVec::eq to give incorrect results since it will check even elements past len.



Example:



from-parts-unchecked

let vec: BoundedVec = BoundedVec::from\_parts\_unchecked([1, 2, 3, 0], 3);

 assert\_eq(vec.len(), 3);



 // invalid use!

 let vec1: BoundedVec = BoundedVec::from\_parts\_unchecked([1, 2, 3, 1], 3);

 let vec2: BoundedVec = BoundedVec::from\_parts\_unchecked([1, 2, 3, 2], 3);



 // both vecs have length 3 so we'd expect them to be equal, but this

 // fails because elements past the length are still checked in eq

 assert(vec1 != vec2);





Source code: noir\_stdlib/src/collections/bounded\_vec.nr#L707-L718



map

pub fn map(self, f: fn[Env](T) -> U) -> BoundedVec



Creates a new vector of equal size by calling a closure on each element in this vector.



Example:



bounded-vec-map-example

let vec: BoundedVec = BoundedVec::from\_array([1, 2, 3, 4]);

 let result = vec.map(|value| value * 2);



Source code: noir\_stdlib/src/collections/bounded\_vec.nr#L580-L583



any

pub fn any(self, predicate: fn[Env](T) -> bool) -> bool



Returns true if the given predicate returns true for any element in this vector.



Example:



bounded-vec-any-example

let mut v: BoundedVec = BoundedVec::new();

 v.extend\_from\_array([2, 4, 6]);



 let all\_even = !v.any(|elem: u32| elem % 2 != 0);

 assert(all\_even);



Source code: test\_programs/noir\_test\_success/bounded\_vec/src/main.nr#L256-L262



HashMap

HashMap is used to efficiently store and look up key-value pairs.



HashMap is a bounded type which can store anywhere from zero to MaxLen total elements. Note that due to hash collisions, the actual maximum number of elements stored by any particular hashmap is likely lower than MaxLen. This is true even with cryptographic hash functions since every hash value will be performed modulo MaxLen.



Example:



// Create a mapping from Fields to u32s with a maximum length of 12

// using a poseidon2 hasher

use std::hash::poseidon2::Poseidon2Hasher;

let mut map: HashMap> = HashMap::default();



map.insert(1, 2);

map.insert(3, 4);



let two = map.get(1).unwrap();





Methods

default

default

impl Default for HashMap

where

 B: BuildHasher + Default,

 H: Hasher + Default,

{

 /// Constructs an empty HashMap.

 ///

 /// Example:

 ///

 /// ```noir

 /// let hashmap: HashMap> = HashMap::default();

 /// assert(hashmap.is\_empty());

 /// ```

 fn default() -> Self {





Source code: noir\_stdlib/src/collections/map.nr#L688-L703



Creates a fresh, empty HashMap.



When using this function, always make sure to specify the maximum size of the hash map.



This is the same default from the Default implementation given further below. It is repeated here for convenience since it is the recommended way to create a hashmap.



Example:



default\_example

let hashmap: HashMap> = HashMap::default();

 assert(hashmap.is\_empty());





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L208-L211



Because HashMap has so many generic arguments that are likely to be the same throughout your program, it may be helpful to create a type alias:



type\_alias

type MyMap = HashMap>;



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L202-L204



with\_hasher

with\_hasher

pub fn with\_hasher(\_build\_hasher: B) -> Self

 where

 B: BuildHasher,

 {



Source code: noir\_stdlib/src/collections/map.nr#L103-L108



Creates a hashmap with an existing BuildHasher. This can be used to ensure multiple hashmaps are created with the same hasher instance.



Example:



with\_hasher\_example

let my\_hasher: BuildHasherDefault = Default::default();

 let hashmap: HashMap> =

 HashMap::with\_hasher(my\_hasher);

 assert(hashmap.is\_empty());





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L212-L217



get

get

pub fn get(self, key: K) -> Option

 where

 K: Eq + Hash,

 B: BuildHasher,

 H: Hasher,

 {



Source code: noir\_stdlib/src/collections/map.nr#L472-L479



Retrieves a value from the hashmap, returning Option::none() if it was not found.



Example:



get\_example

fn get\_example(map: HashMap>) {

 let x = map.get(12);



 if x.is\_some() {

 assert(x.unwrap() == 42);

 }

}





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L297-L305



insert

insert

pub fn insert(&mut self, key: K, value: V)

 where

 K: Eq + Hash,

 B: BuildHasher,

 H: Hasher,

 {



Source code: noir\_stdlib/src/collections/map.nr#L514-L521



Inserts a new key-value pair into the map. If the key was already in the map, its previous value will be overridden with the newly provided one.



Example:



insert\_example

let mut map: HashMap> = HashMap::default();

 map.insert(12, 42);

 assert(map.len() == 1);





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L218-L222



remove

remove

pub fn remove(&mut self, key: K)

 where

 K: Eq + Hash,

 B: BuildHasher,

 H: Hasher,

 {



Source code: noir\_stdlib/src/collections/map.nr#L570-L577



Removes the given key-value pair from the map. If the key was not already present in the map, this does nothing.



Example:



remove\_example

map.remove(12);

 assert(map.is\_empty());



 // If a key was not present in the map, remove does nothing

 map.remove(12);

 assert(map.is\_empty());



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L225-L232



is\_empty

is\_empty

pub fn is\_empty(self) -> bool {



Source code: noir\_stdlib/src/collections/map.nr#L167-L169



True if the length of the hash map is empty.



Example:



is\_empty\_example

assert(map.is\_empty());



 map.insert(1, 2);

 assert(!map.is\_empty());



 map.remove(1);

 assert(map.is\_empty());



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L233-L241



len

len

pub fn len(self) -> u32 {



Source code: noir\_stdlib/src/collections/map.nr#L431-L433



Returns the current length of this hash map.



Example:



len\_example

// This is equivalent to checking map.is\_empty()

 assert(map.len() == 0);



 map.insert(1, 2);

 map.insert(3, 4);

 map.insert(5, 6);

 assert(map.len() == 3);



 // 3 was already present as a key in the hash map, so the length is unchanged

 map.insert(3, 7);

 assert(map.len() == 3);



 map.remove(1);

 assert(map.len() == 2);





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L242-L257



capacity

capacity

pub fn capacity(\_self: Self) -> u32 {



Source code: noir\_stdlib/src/collections/map.nr#L453-L455



Returns the maximum capacity of this hashmap. This is always equal to the capacity specified in the hashmap's type.



Unlike hashmaps in general purpose programming languages, hashmaps in Noir have a static capacity that does not increase as the map grows larger. Thus, this capacity is also the maximum possible element count that can be inserted into the hashmap. Due to hash collisions (modulo the hashmap length), it is likely the actual maximum element count will be lower than the full capacity.



Example:



capacity\_example

let empty\_map: HashMap> =

 HashMap::default();

 assert(empty\_map.len() == 0);

 assert(empty\_map.capacity() == 42);





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L258-L263



clear

clear

pub fn clear(&mut self) {



Source code: noir\_stdlib/src/collections/map.nr#L123-L125



Clears the hashmap, removing all key-value pairs from it.



Example:



clear\_example

assert(!map.is\_empty());

 map.clear();

 assert(map.is\_empty());



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L264-L268



contains\_key

contains\_key

pub fn contains\_key(self, key: K) -> bool

 where

 K: Hash + Eq,

 B: BuildHasher,

 H: Hasher,

 {



Source code: noir\_stdlib/src/collections/map.nr#L143-L150



True if the hashmap contains the given key. Unlike get, this will not also return the value associated with the key.



Example:



contains\_key\_example

if map.contains\_key(7) {

 let value = map.get(7);

 assert(value.is\_some());

 } else {

 println("No value for key 7!");

 }



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L269-L276



entries

entries

pub fn entries(self) -> BoundedVec<(K, V), N> {



Source code: noir\_stdlib/src/collections/map.nr#L191-L193



Returns a vector of each key-value pair present in the hashmap.



The length of the returned vector is always equal to the length of the hashmap.



Example:



entries\_example

let entries = map.entries();



 // The length of a hashmap may not be compile-time known, so we

 // need to loop over its capacity instead

 for i in 0..map.capacity() {

 if i < entries.len() {

 let (key, value) = entries.get(i);

 println(f"{key} -> {value}");

 }

 }



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L308-L319



keys

keys

pub fn keys(self) -> BoundedVec {



Source code: noir\_stdlib/src/collections/map.nr#L230-L232



Returns a vector of each key present in the hashmap.



The length of the returned vector is always equal to the length of the hashmap.



Example:



keys\_example

let keys = map.keys();



 for i in 0..keys.max\_len() {

 if i < keys.len() {

 let key = keys.get\_unchecked(i);

 let value = map.get(key).unwrap\_unchecked();

 println(f"{key} -> {value}");

 }

 }



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L320-L330



values

values

pub fn values(self) -> BoundedVec {



Source code: noir\_stdlib/src/collections/map.nr#L267-L269



Returns a vector of each value present in the hashmap.



The length of the returned vector is always equal to the length of the hashmap.



Example:



values\_example

let values = map.values();



 for i in 0..values.max\_len() {

 if i < values.len() {

 let value = values.get\_unchecked(i);

 println(f"Found value {value}");

 }

 }



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L331-L340



iter\_mut

iter\_mut

pub fn iter\_mut(&mut self, f: fn(K, V) -> (K, V))

 where

 K: Eq + Hash,

 B: BuildHasher,

 H: Hasher,

 {



Source code: noir\_stdlib/src/collections/map.nr#L304-L311



Iterates through each key-value pair of the HashMap, setting each key-value pair to the result returned from the given function.



Note that since keys can be mutated, the HashMap needs to be rebuilt as it is iterated through. If this is not desired, use iter\_values\_mut if only values need to be mutated, or entries if neither keys nor values need to be mutated.



The iteration order is left unspecified. As a result, if two keys are mutated to become equal, which of the two values that will be present for the key in the resulting map is also unspecified.



Example:



iter\_mut\_example

// Add 1 to each key in the map, and double the value associated with that key.

 map.iter\_mut(|k, v| (k + 1, v * 2));





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L344-L347



iter\_keys\_mut

iter\_keys\_mut

pub fn iter\_keys\_mut(&mut self, f: fn(K) -> K)

 where

 K: Eq + Hash,

 B: BuildHasher,

 H: Hasher,

 {



Source code: noir\_stdlib/src/collections/map.nr#L342-L349



Iterates through the HashMap, mutating each key to the result returned from the given function.



Note that since keys can be mutated, the HashMap needs to be rebuilt as it is iterated through. If only iteration is desired and the keys are not intended to be mutated, prefer using entries instead.



The iteration order is left unspecified. As a result, if two keys are mutated to become equal, which of the two values that will be present for the key in the resulting map is also unspecified.



Example:



iter\_keys\_mut\_example

// Double each key, leaving the value associated with that key untouched

 map.iter\_keys\_mut(|k| k * 2);



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L348-L351



iter\_values\_mut

iter\_values\_mut

pub fn iter\_values\_mut(&mut self, f: fn(V) -> V) {



Source code: noir\_stdlib/src/collections/map.nr#L374-L376



Iterates through the HashMap, applying the given function to each value and mutating the value to equal the result. This function is more efficient than iter\_mut and iter\_keys\_mut because the keys are untouched and the underlying hashmap thus does not need to be reordered.



Example:



iter\_values\_mut\_example

// Halve each value

 map.iter\_values\_mut(|v| v / 2);



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L352-L355



retain

retain

pub fn retain(&mut self, f: fn(K, V) -> bool) {



Source code: noir\_stdlib/src/collections/map.nr#L395-L397



Retains only the key-value pairs for which the given function returns true. Any key-value pairs for which the function returns false will be removed from the map.



Example:



retain\_example

map.retain(|k, v| (k != 0) & (v != 0));



Source code: test\_programs/execution\_success/hashmap/src/main.nr#L280-L282



Trait Implementations

default

default

impl Default for HashMap

where

 B: BuildHasher + Default,

 H: Hasher + Default,

{

 /// Constructs an empty HashMap.

 ///

 /// Example:

 ///

 /// ```noir

 /// let hashmap: HashMap> = HashMap::default();

 /// assert(hashmap.is\_empty());

 /// ```

 fn default() -> Self {





Source code: noir\_stdlib/src/collections/map.nr#L688-L703



Constructs an empty HashMap.



Example:



default\_example

let hashmap: HashMap> = HashMap::default();

 assert(hashmap.is\_empty());





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L208-L211



eq

eq

impl Eq for HashMap

where

 K: Eq + Hash,

 V: Eq,

 B: BuildHasher,

 H: Hasher,

{

 /// Checks if two HashMaps are equal.

 ///

 /// Example:

 ///

 /// ```noir

 /// let mut map1: HashMap> = HashMap::default();

 /// let mut map2: HashMap> = HashMap::default();

 ///

 /// map1.insert(1, 2);

 /// map1.insert(3, 4);

 ///

 /// map2.insert(3, 4);

 /// map2.insert(1, 2);

 ///

 /// assert(map1 == map2);

 /// ```

 fn eq(self, other: HashMap) -> bool {





Source code: noir\_stdlib/src/collections/map.nr#L636-L661



Checks if two HashMaps are equal.



Example:



eq\_example

let mut map1: HashMap> = HashMap::default();

 let mut map2: HashMap> = HashMap::default();



 map1.insert(1, 2);

 map1.insert(3, 4);



 map2.insert(3, 4);

 map2.insert(1, 2);



 assert(map1 == map2);





Source code: test\_programs/execution\_success/hashmap/src/main.nr#L283-L294



Vectors

Experimental Feature

This feature is experimental. The documentation may be incomplete or out of date, which means it could change in future versions, potentially causing unexpected behavior or not working as expected.



Contributions Welcome: If you notice any inaccuracies or potential improvements, please consider contributing. Visit our GitHub repository to make your contributions: Contribute Here.



A vector is a collection type similar to Rust's Vec type. In Noir, it is a convenient way to use slices as mutable arrays.



Example:



let mut vector: Vec = Vec::new();

for i in 0..5 {

 vector.push(i);

}

assert(vector.len() == 5);



Methods

new

Creates a new, empty vector.



pub fn new() -> Self



Example:



let empty\_vector: Vec = Vec::new();

assert(empty\_vector.len() == 0);



from\_slice

Creates a vector containing each element from a given slice. Mutations to the resulting vector will not affect the original slice.



pub fn from\_slice(slice: [T]) -> Self



Example:



let slice: [Field] = &[1, 2, 3];

let vector\_from\_slice = Vec::from\_slice(slice);

assert(vector\_from\_slice.len() == 3);



len

Returns the number of elements in the vector.



pub fn len(self) -> Field



Example:



let empty\_vector: Vec = Vec::new();

assert(empty\_vector.len() == 0);



get

Retrieves an element from the vector at a given index. Panics if the index points beyond the vector's end.



pub fn get(self, index: Field) -> T



Example:



let vector: Vec = Vec::from\_slice(&[10, 20, 30]);

assert(vector.get(1) == 20);



set

pub fn set(&mut self: Self, index: u64, value: T) {



Writes an element to the vector at the given index, starting from zero.



Panics if the index points beyond the vector's end.



Example:



let vector: Vec = Vec::from\_slice(&[10, 20, 30]);

assert(vector.get(1) == 20);

vector.set(1, 42);

assert(vector.get(1) == 42);



push

Adds a new element to the vector's end, returning a new vector with a length one greater than the original unmodified vector.



pub fn push(&mut self, elem: T)



Example:



let mut vector: Vec = Vec::new();

vector.push(10);

assert(vector.len() == 1);



pop

Removes an element from the vector's end, returning a new vector with a length one less than the original vector, along with the removed element. Panics if the vector's length is zero.



pub fn pop(&mut self) -> T



Example:



let mut vector = Vec::from\_slice(&[10, 20]);

let popped\_elem = vector.pop();

assert(popped\_elem == 20);

assert(vector.len() == 1);



insert

Inserts an element at a specified index, shifting subsequent elements to the right.



pub fn insert(&mut self, index: Field, elem: T)



Example:



let mut vector = Vec::from\_slice(&[10, 30]);

vector.insert(1, 20);

assert(vector.get(1) == 20);



remove

Removes an element at a specified index, shifting subsequent elements to the left, and returns the removed element.



pub fn remove(&mut self, index: Field) -> T



Example:



let mut vector = Vec::from\_slice(&[10, 20, 30]);

let removed\_elem = vector.remove(1);

assert(removed\_elem == 20);

assert(vector.len() == 2);



fmtstr

fmtstr is the type resulting from using format string (f"...").



Methods

quoted\_contents

quoted\_contents

pub comptime fn quoted\_contents(self) -> Quoted {}



Source code: noir\_stdlib/src/meta/format\_string.nr#L3-L5



Returns the format string contents (that is, without the leading and trailing double quotes) as a Quoted value.



Is Unconstrained Function

It's very common for functions in circuits to take unconstrained hints of an expensive computation and then verify it. This is done by running the hint in an unconstrained context and then verifying the result in a constrained context.



When a function is marked as unconstrained, any subsequent functions that it calls will also be run in an unconstrained context. However, if we are implementing a library function, other users might call it within an unconstrained context or a constrained one. Generally, in an unconstrained context we prefer just computing the result instead of taking a hint of it and verifying it, since that'd mean doing the same computation twice:





fn my\_expensive\_computation(){

 ...

}



unconstrained fn my\_expensive\_computation\_hint(){

 my\_expensive\_computation()

}



pub fn external\_interface(){

 my\_expensive\_computation\_hint();

 // verify my\_expensive\_computation: If external\_interface is called from unconstrained, this is redundant

 ...

}







In order to improve the performance in an unconstrained context you can use the function at std::runtime::is\_unconstrained() -> bool:



use dep::std::runtime::is\_unconstrained;



fn my\_expensive\_computation(){

 ...

}



unconstrained fn my\_expensive\_computation\_hint(){

 my\_expensive\_computation()

}



pub fn external\_interface(){

 if is\_unconstrained() {

 my\_expensive\_computation();

 } else {

 my\_expensive\_computation\_hint();

 // verify my\_expensive\_computation

 ...

 }

}





The is\_unconstrained result is resolved at compile time, so in unconstrained contexts the compiler removes the else branch, and in constrained contexts the compiler removes the if branch, reducing the amount of compute necessary to run external\_interface.




Note that using is\_unconstrained in a comptime context will also return true:



fn main() {

 comptime {

 assert(is\_unconstrained());

 }

}



Logging

The standard library provides two familiar statements you can use: println and print. Despite being a limited implementation of rust's println! and print! macros, these constructs can be useful for debugging.



You can print the output of both statements in your Noir code by using the nargo execute command or the --show-output flag when using nargo test (provided there are print statements in your tests).



It is recommended to use nargo execute if you want to debug failing constraints with println or print statements. This is due to every input in a test being a constant rather than a witness, so we issue an error during compilation while we only print during execution (which comes after compilation). Neither println, nor print are callable for failed constraints caught at compile time.



Both print and println are generic functions which can work on integers, fields, strings, and even structs or expressions. Note however, that slices are currently unsupported. For example:



struct Person {

 age: Field,

 height: Field,

}



fn main(age: Field, height: Field) {

 let person = Person {

 age: age,

 height: height,

 };

 println(person);

 println(age + height);

 println("Hello world!");

}



You can print different types in the same statement (including strings) with a type called fmtstr. It can be specified in the same way as a normal string, just prepended with an "f" character:



 let fmt\_str = f"i: {i}, j: {j}";

 println(fmt\_str);



 let s = myStruct { y: x, x: y };

 println(s);



 println(f"i: {i}, s: {s}");



 println(x);

 println([x, y]);



 let foo = fooStruct { my\_struct: s, foo: 15 };

 println(f"s: {s}, foo: {foo}");



 println(15); // prints 0x0f, implicit Field

 println(-1 as u8); // prints 255

 println(-1 as i8); // prints -1



Examples shown above are interchangeable between the two print statements:



let person = Person { age : age, height : height };



println(person);

print(person);



println("Hello world!"); // Prints with a newline at the end of the input

print("Hello world!"); // Prints the input and keeps cursor on the same line





Edit this page

std::mem::zeroed

fn zeroed() -> T



Returns a zeroed value of any type. This function is generally unsafe to use as the zeroed bit pattern is not guaranteed to be valid for all types. It can however, be useful in cases when the value is guaranteed not to be used such as in a BoundedVec library implementing a growable vector, up to a certain length, backed by an array. The array can be initialized with zeroed values which are guaranteed to be inaccessible until the vector is pushed to. Similarly, enumerations in noir can be implemented using this method by providing zeroed values for the unused variants.



This function currently supports the following types:



Field

Bool

Uint

Array

Slice

String

Tuple

Functions

Using it on other types could result in unexpected behavior.



std::mem::checked\_transmute

fn checked\_transmute(value: T) -> U



Transmutes a value of one type into the same value but with a new type U.



This function is safe to use since both types are asserted to be equal later during compilation after the concrete values for generic types become known. This function is useful for cases where the compiler may fail a type check that is expected to pass where a user knows the two types to be equal. For example, when using arithmetic generics there are cases the compiler does not see as equal, such as [Field; N*(A + B)] and [Field; N*A + N*B], which users may know to be equal. In these cases, checked\_transmute can be used to cast the value to the desired type while also preserving safety by checking this equality once N, A, B are fully resolved.



Note that since this safety check is performed after type checking rather than during, no error is issued if the function containing checked\_transmute is never called.



std::mem::array\_refcount

fn array\_refcount(array: [T; N]) -> u32 {}



Returns the internal reference count of an array value in unconstrained code.



Arrays only have reference count in unconstrained code - using this anywhere else will return zero.



This function is mostly intended for debugging compiler optimizations but can also be used to find where array copies may be happening in unconstrained code by placing it before array mutations.



std::mem::slice\_refcount

fn slice\_refcount(slice: [T]) -> u32 {}



Returns the internal reference count of a slice value in unconstrained code.



Slices only have reference count in unconstrained code - using this anywhere else will return zero.



This function is mostly intended for debugging compiler optimizations but can also be used to find where slice copies may be happening in unconstrained code by placing it before slice mutations.



Merkle Trees

compute\_merkle\_root

Returns the root of the tree from the provided leaf and its hash path, using a Pedersen hash.



fn compute\_merkle\_root(leaf : Field, index : Field, hash\_path: [Field]) -> Field





example:



/**

 // these values are for this example only

 index = "0"

 priv\_key = "0x000000000000000000000000000000000000000000000000000000616c696365"

 secret = "0x1929ea3ab8d9106a899386883d9428f8256cfedb3c4f6b66bf4aa4d28a79988f"

 note\_hash\_path = [

 "0x1e61bdae0f027b1b2159e1f9d3f8d00fa668a952dddd822fda80dc745d6f65cc",

 "0x0e4223f3925f98934393c74975142bd73079ab0621f4ee133cee050a3c194f1a",

 "0x2fd7bb412155bf8693a3bd2a3e7581a679c95c68a052f835dddca85fa1569a40"

 ]

 */

fn main(index: Field, priv\_key: Field, secret: Field, note\_hash\_path: [Field; 3]) {



 let pubkey = std::scalar\_mul::fixed\_base\_embedded\_curve(priv\_key);

 let pubkey\_x = pubkey[0];

 let pubkey\_y = pubkey[1];

 let note\_commitment = std::hash::pedersen(&[pubkey\_x, pubkey\_y, secret]);



 let root = std::merkle::compute\_merkle\_root(note\_commitment[0], index, note\_hash\_path.as\_slice());

 println(root);

}





To check merkle tree membership:



Include a merkle root as a program input.

Compute the merkle root of a given leaf, index and hash path.

Assert the merkle roots are equal.

For more info about merkle trees, see the Wikipedia page.



Edit this page





Metaprogramming

std::meta is the entry point for Noir's metaprogramming API. This consists of comptime functions and types used for inspecting and modifying Noir programs.



Functions

type\_of

type\_of

pub comptime fn type\_of(x: T) -> Type {}



Source code: noir\_stdlib/src/meta/mod.nr#L29-L31



Returns the type of a variable at compile-time.



Example:



comptime {

 let x: i32 = 1;

 let x\_type: Type = std::meta::type\_of(x);



 assert\_eq(x\_type, quote { i32 }.as\_type());

}



unquote

unquote

pub comptime fn unquote(code: Quoted) -> Quoted {



Source code: noir\_stdlib/src/meta/mod.nr#L21-L23



Unquotes the passed-in token stream where this function was called.



Example:



comptime {

 let code = quote { 1 + 2 };



 // let x = 1 + 2;

 let x = unquote!(code);

}



derive

derive

#[varargs]

pub comptime fn derive(s: StructDefinition, traits: [TraitDefinition]) -> Quoted {





Source code: noir\_stdlib/src/meta/mod.nr#L50-L53



Attribute placed on struct definitions.



Creates a trait impl for each trait passed in as an argument. To do this, the trait must have a derive handler registered with derive\_via beforehand. The traits in the stdlib that can be derived this way are Eq, Ord, Default, and Hash.



Example:



#[derive(Eq, Default)]

struct Foo {

 x: i32,

 y: T,

}



fn main() {

 let foo1 = Foo::default();

 let foo2 = Foo { x: 0, y: &[0] };

 assert\_eq(foo1, foo2);

}



derive\_via

derive\_via\_signature

pub comptime fn derive\_via(t: TraitDefinition, f: DeriveFunction) {



Source code: noir\_stdlib/src/meta/mod.nr#L70-L72



Attribute placed on trait definitions.



Registers a function to create impls for the given trait when the trait is used in a derive call. Users may use this to register their own functions to enable their traits to be derived by derive.



Because this function requires a function as an argument which should produce a trait impl for any given struct, users may find it helpful to use a function like std::meta::make\_trait\_impl to help creating these impls.



Example:



#[derive\_via(derive\_do\_nothing)]

trait DoNothing {

 fn do\_nothing(self);

}



comptime fn derive\_do\_nothing(s: StructDefinition) -> Quoted {

 let typ = s.as\_type();

 quote {

 impl DoNothing for $typ {

 fn do\_nothing(self) {

 println("Nothing");

 }

 }

 }

}



As another example, derive\_eq in the stdlib is used to derive the Eq trait for any struct. It makes use of make\_trait\_impl to do this:



derive\_eq

comptime fn derive\_eq(s: StructDefinition) -> Quoted {

 let signature = quote { fn eq(\_self: Self, \_other: Self) -> bool };

 let for\_each\_field = |name| quote { (\_self.$name == \_other.$name) };

 let body = |fields| {

 if s.fields\_as\_written().len() == 0 {

 quote { true }

 } else {

 fields

 }

 };

 crate::meta::make\_trait\_impl(

 s,

 quote { Eq },

 signature,

 for\_each\_field,

 quote { & },

 body,

 )

}





Source code: noir\_stdlib/src/cmp.nr#L10-L30



make\_trait\_impl

make\_trait\_impl

pub comptime fn make\_trait\_impl(

 s: StructDefinition,

 trait\_name: Quoted,

 function\_signature: Quoted,

 for\_each\_field: fn[Env1](Quoted) -> Quoted,

 join\_fields\_with: Quoted,

 body: fn[Env2](Quoted) -> Quoted,

) -> Quoted {



Source code: noir\_stdlib/src/meta/mod.nr#L89-L98



A helper function to more easily create trait impls while deriving traits.



Note that this function only works for traits which:



Have only one method

Have no generics on the trait itself.

E.g. Using this on a trait such as trait Foo { ... } will result in the generated impl incorrectly missing the T generic.

If your trait fits these criteria then make\_trait\_impl is likely the easiest way to write your derive handler. The arguments are as follows:



s: The struct to make the impl for

trait\_name: The name of the trait to derive. E.g. quote { Eq }.

function\_signature: The signature of the trait method to derive. E.g. fn eq(self, other: Self) -> bool.

for\_each\_field: An operation to be performed on each field. E.g. |name| quote { (self.$name == other.$name) }.

join\_fields\_with: A separator to join each result of for\_each\_field with. E.g. quote { & }. You can also use an empty quote {} for no separator.

body: The result of the field operations is passed into this function for any final processing. This is the place to insert any setup/teardown code the trait requires. If the trait doesn't require any such code, you can return the body as-is: |body| body.


Example deriving Hash:



derive\_hash

comptime fn derive\_hash(s: StructDefinition) -> Quoted {

 let name = quote { Hash };

 let signature = quote { fn hash(\_self: Self, \_state: &mut H) where H: std::hash::Hasher };

 let for\_each\_field = |name| quote { \_self.$name.hash(\_state); };

 crate::meta::make\_trait\_impl(

 s,

 name,

 signature,

 for\_each\_field,

 quote {},

 |fields| fields,

 )

}





Source code: noir\_stdlib/src/hash/mod.nr#L138-L152



Example deriving Ord:



derive\_ord

comptime fn derive\_ord(s: StructDefinition) -> Quoted {

 let signature = quote { fn cmp(\_self: Self, \_other: Self) -> std::cmp::Ordering };

 let for\_each\_field = |name| quote {

 if result == std::cmp::Ordering::equal() {

 result = \_self.$name.cmp(\_other.$name);

 }

 };

 let body = |fields| quote {

 let mut result = std::cmp::Ordering::equal();

 $fields

 result

 };

 crate::meta::make\_trait\_impl(s, quote { Ord }, signature, for\_each\_field, quote {}, body)

}





Source code: noir\_stdlib/src/cmp.nr#L221-L236



Edit this page



Crates and Packages

Crates

A crate is the smallest amount of code that the Noir compiler considers at a time. Crates can contain modules, and the modules may be defined in other files that get compiled with the crate, as we’ll see in the coming sections.



Crate Types

A Noir crate can come in several forms: binaries, libraries or contracts.



Binaries

Binary crates are programs which you can compile to an ACIR circuit which you can then create proofs against. Each must have a function called main that defines the ACIR circuit which is to be proved.



Libraries

Library crates don't have a main function and they don't compile down to ACIR. Instead they define functionality intended to be shared with multiple projects, and eventually included in a binary crate.



Contracts

Contract crates are similar to binary crates in that they compile to ACIR which you can create proofs against. They are different in that they do not have a single main function, but are a collection of functions to be deployed to the Aztec network. You can learn more about the technical details of Aztec in the monorepo or contract examples.



Crate Root

Every crate has a root, which is the source file that the compiler starts, this is also known as the root module. The Noir compiler does not enforce any conditions on the name of the file which is the crate root, however if you are compiling via Nargo the crate root must be called lib.nr or main.nr for library or binary crates respectively.



Packages

A Nargo package is a collection of one or more crates that provides a set of functionality. A package must include a Nargo.toml file.



A package must contain either a library or a binary crate, but not both.



Differences from Cargo Packages

One notable difference between Rust's Cargo and Noir's Nargo is that while Cargo allows a package to contain an unlimited number of binary crates and a single library crate, Nargo currently only allows a package to contain a single crate.



In future this restriction may be lifted to allow a Nargo package to contain both a binary and library crate or multiple binary crates.



Edit this page



Dependencies

Nargo allows you to upload packages to GitHub and use them as dependencies.



Specifying a dependency

Specifying a dependency requires a tag to a specific commit and the git url to the url containing the package.



Currently, there are no requirements on the tag contents. If requirements are added, it would follow semver 2.0 guidelines.



Note: Without a tag , there would be no versioning and dependencies would change each time you compile your project.



For example, to add the ecrecover-noir library to your project, add it to Nargo.toml:



# Nargo.toml



[dependencies]

ecrecover = {tag = "v0.8.0", git = "https://github.com/colinnielsen/ecrecover-noir"}





If the module is in a subdirectory, you can define a subdirectory in your git repository, for example:



# Nargo.toml



[dependencies]

easy\_private\_token\_contract = {tag ="v0.1.0-alpha62", git = "https://github.com/AztecProtocol/aztec-packages", directory = "noir-contracts/contracts/easy\_private\_token\_contract"}





Specifying a local dependency

You can also specify dependencies that are local to your machine.



For example, this file structure has a library and binary crate



├── binary\_crate

│ ├── Nargo.toml

│ └── src

│ └── main.nr

└── lib\_a

 ├── Nargo.toml

 └── src

 └── lib.nr



Inside of the binary crate, you can specify:



# Nargo.toml



[dependencies]

lib\_a = { path = "../lib\_a" }



Importing dependencies

You can import a dependency to a Noir file using the following syntax. For example, to import the ecrecover-noir library and local lib\_a referenced above:



use ecrecover;

use lib\_a;



You can also import only the specific parts of dependency that you want to use, like so:



use std::hash::sha256;

use std::scalar\_mul::fixed\_base\_embedded\_curve;



Lastly, You can import multiple items in the same line by enclosing them in curly braces:



use std::hash::{keccak256, sha256};



We don't have a way to consume libraries from inside a workspace as external dependencies right now.



Inside a workspace, these are consumed as { path = "../to\_lib" } dependencies in Nargo.toml.



Dependencies of Dependencies

Note that when you import a dependency, you also get access to all of the dependencies of that package.



For example, the phy\_vector library imports an fraction library. If you're importing the phy\_vector library, then you can access the functions in fractions library like so:



use phy\_vector;



fn main(x : Field, y : pub Field) {

 //...

 let f = phy\_vector::fraction::toFraction(true, 2, 1);

 //...

}



Available Libraries

Noir does not currently have an official package manager. You can find a list of available Noir libraries in the awesome-noir repo here.



Some libraries that are available today include:



Standard Library - the Noir Standard Library

Ethereum Storage Proof Verification - a library that contains the primitives necessary for RLP decoding (in the form of look-up table construction) and Ethereum state and storage proof verification (or verification of any trie proof involving 32-byte long keys)

BigInt - a library that provides a custom BigUint56 data type, allowing for computations on large unsigned integers

ECrecover - a library to verify an ECDSA signature and return the source Ethereum address

Sparse Merkle Tree Verifier - a library for verification of sparse Merkle trees

Signed Int - a library for accessing a custom Signed Integer data type, allowing access to negative numbers on Noir

Fraction - a library for accessing fractional number data type in Noir, allowing results that aren't whole numbers



Modules

Noir's module system follows the same convention as the newer version of Rust's module system.



Purpose of Modules

Modules are used to organize files. Without modules all of your code would need to live in a single file. In Noir, the compiler does not automatically scan all of your files to detect modules. This must be done explicitly by the developer.



Examples

Importing a module in the crate root

Filename : src/main.nr



mod foo;



fn main() {

 foo::hello\_world();

}



Filename : src/foo.nr



fn from\_foo() {}



In the above snippet, the crate root is the src/main.nr file. The compiler sees the module declaration mod foo which prompts it to look for a foo.nr file.



Visually this module hierarchy looks like the following :



crate

 ├── main

 │

 └── foo

 └── from\_foo





The module filename may also be the name of the module as a directory with the contents in a file named mod.nr within that directory. The above example can alternatively be expressed like this:



Filename : src/main.nr



mod foo;



fn main() {

 foo::hello\_world();

}



Filename : src/foo/mod.nr



fn from\_foo() {}



Note that it's an error to have both files src/foo.nr and src/foo/mod.nr in the filesystem.



Importing a module throughout the tree

All modules are accessible from the crate:: namespace.



crate

 ├── bar

 ├── foo

 └── main





In the above snippet, if bar would like to use functions in foo, it can do so by use crate::foo::function\_name.



Sub-modules

Filename : src/main.nr



mod foo;



fn main() {

 foo::from\_foo();

}



Filename : src/foo.nr



mod bar;

fn from\_foo() {}



Filename : src/foo/bar.nr



fn from\_bar() {}



In the above snippet, we have added an extra module to the module tree; bar. bar is a submodule of foo hence we declare bar in foo.nr with mod bar. Since foo is not the crate root, the compiler looks for the file associated with the bar module in src/foo/bar.nr



Visually the module hierarchy looks as follows:



crate

 ├── main

 │

 └── foo

 ├── from\_foo

 └── bar

 └── from\_bar



Similar to importing a module in the crate root, modules can be placed in a mod.nr file, like this:



Filename : src/main.nr



mod foo;



fn main() {

 foo::from\_foo();

}



Filename : src/foo/mod.nr



mod bar;

fn from\_foo() {}



Filename : src/foo/bar/mod.nr



fn from\_bar() {}



Referencing a parent module

Given a submodule, you can refer to its parent module using the super keyword.



Filename : src/main.nr



mod foo;



fn main() {

 foo::from\_foo();

}



Filename : src/foo.nr



mod bar;



fn from\_foo() {}



Filename : src/foo/bar.nr



// Same as bar::from\_foo

use super::from\_foo; 



fn from\_bar() {

 from\_foo(); // invokes super::from\_foo(), which is bar::from\_foo()

 super::from\_foo(); // also invokes bar::from\_foo()

}





use visibility

use declarations are private to the containing module, by default. However, like functions, they can be marked as pub or pub(crate). Such a use declaration serves to re-export a name. A public use declaration can therefore redirect some public name to a different target definition: even a definition with a private canonical path, inside a different module.



An example of re-exporting:



mod some\_module {

 pub use foo::{bar, baz};

 mod foo {

 pub fn bar() {}

 pub fn baz() {}

 }

}



fn main() {

 some\_module::bar();

 some\_module::baz();

}



In this example, the module some\_module re-exports two public names defined in foo.



Visibility

By default, like functions, modules are private to the module (or crate) they exist in. You can use pub to make the module public or pub(crate) to make it public to just its crate:



// This module is now public and can be seen by other crates.

pub mod foo;



Workspaces

Workspaces are a feature of nargo that allow you to manage multiple related Noir packages in a single repository. A workspace is essentially a group of related projects that share common build output directories and configurations.



Each Noir project (with its own Nargo.toml file) can be thought of as a package. Each package is expected to contain exactly one "named circuit", being the "name" defined in Nargo.toml with the program logic defined in ./src/main.nr.



For a project with the following structure:



├── crates

│ ├── a

│ │ ├── Nargo.toml

│ │ └── Prover.toml

│ │ └── src

│ │ └── main.nr

│ └── b

│ ├── Nargo.toml

│ └── Prover.toml

│ └── src

│ └── main.nr

│

└── Nargo.toml



You can define a workspace in Nargo.toml like so:



[workspace]

members = ["crates/a", "crates/b"]

default-member = "crates/a"



members indicates which packages are included in the workspace. As such, all member packages of a workspace will be processed when the --workspace flag is used with various commands or if a default-member is not specified. The --package option can be used to limit the scope of some commands to a specific member of the workspace; otherwise these commands run on the package nearest on the path to the current directory where nargo was invoked.



default-member indicates which package various commands process by default.



Libraries can be defined in a workspace. Inside a workspace, these are consumed as { path = "../to\_lib" } dependencies in Nargo.toml.



Inside a workspace, these are consumed as { path = "../to\_lib" } dependencies in Nargo.toml.



Please note that nesting regular packages is not supported: certain commands work on the workspace level and will use the topmost Nargo.toml file they can find on the path; unless this is a workspace configuration with members, the command might run on some unintended package.



Generate a Solidity Verifier

Noir is universal. The witness and the compiled program can be fed into a proving backend such as Aztec's Barretenberg, which can then generate a verifier contract for deployment on blockchains.



This allows for a powerful feature set, as one can make use of the conciseness and the privacy provided by Noir in an immutable ledger. Applications can range from simple P2P guessing games, to complex private DeFi interactions.



Although not strictly in the domain of Noir itself, this guide shows how to generate a Solidity Verifier with Barretenberg and deploy it on the Remix IDE. It is assumed that:



You will be using Barretenberg as your proving backend

You will be using an EVM blockchain to verify your proof

You are comfortable with the Solidity programming language and understand how contracts are deployed on the Ethereum network

You have Noir installed and you have a Noir program. If you don't, get started with Nargo and the example Hello Noir circuit

You are comfortable navigating RemixIDE. If you aren't or you need a refresher, you can find some video tutorials here that could help you.

Rundown

Generating a Solidity Verifier with Barretenberg contract is actually a one-command process. However, compiling it and deploying it can have some caveats. Here's the rundown of this guide:



How to generate a solidity smart contract

How to compile the smart contract in the RemixIDE

How to deploy it to a testnet

Step 1 - Generate a contract

This is by far the most straightforward step. Just run:



nargo compile



This will compile your source code into a Noir build artifact to be stored in the ./target directory. From here on, it's Barretenberg's work. You can generate the smart contract using the commands:



# Generate the verification key. You need to pass the `--oracle\_hash keccak` flag when generating vkey and proving

# to instruct bb to use keccak as the hash function, which is more optimal in Solidity

bb write\_vk -b ./target/.json -o ./target --oracle\_hash keccak



# Generate the Solidity verifier from the vkey

bb write\_solidity\_verifier -k ./target/vk -o ./target/Verifier.sol





replacing  with the name of your Noir project. A Verifier.sol contract is now in the target folder and can be deployed to any EVM blockchain acting as a verifier smart contract.



You can find more information about bb and the default Noir proving backend on this page.



Step 2 - Compiling

We will mostly skip the details of RemixIDE, as the UI can change from version to version. For now, we can just open Remix and create a blank workspace.



Create Workspace



We will create a new file to contain the contract Nargo generated, and copy-paste its content.



warning

You'll likely see a warning advising you to not trust pasted code. While it is an important warning, it is irrelevant in the context of this guide and can be ignored. We will not be deploying anywhere near a mainnet.



To compile our the verifier, we can navigate to the compilation tab:



Compilation Tab



Remix should automatically match a suitable compiler version. However, hitting the "Compile" button will most likely tell you the contract is too big to deploy on mainnet, or complain about a stack too deep:



Contract code too big Stack too deep



To avoid this, you can just use some optimization. Open the "Advanced Configurations" tab and enable optimization. The default 200 runs will suffice.



Compilation success



Step 3 - Deploying

At this point we should have a compiled contract ready to deploy. If we navigate to the deploy section in Remix, we will see many different environments we can deploy to. The steps to deploy on each environment would be out-of-scope for this guide, so we will just use the default Remix VM.



Looking closely, we will notice that our "Solidity Verifier" is composed on multiple contracts working together. Remix will take care of the dependencies for us so we can simply deploy the Verifier contract by selecting it and hitting "deploy":



Deploying HonkVerifier



A contract will show up in the "Deployed Contracts" section.



Step 4 - Verifying

To verify a proof using the Solidity verifier contract, we call the verify function:



function verify(bytes calldata \_proof, bytes32[] calldata \_publicInputs) external view returns (bool)





First generate a proof with bb. We need a Prover.toml file for our inputs. Run:



nargo check



This will generate a Prover.toml you can fill with the values you want to prove. We can now execute the circuit with nargo and then use the proving backend to prove:



nargo execute 

bb prove -b ./target/.json -w ./target/ -o ./target --oracle\_hash keccak





Public inputs

Barretenberg attaches the public inputs to the proof, which in this case it's not very useful. If you're up for some JS, bb.js has a method for it, but in the CLI you can use this ugly snippet for now:



PROOF\_HEX=$(cat ./target/proof | od -An -v -t x1 | tr -d $' \n' | sed 's/^.\{8\}//')



NUM\_PUBLIC\_INPUTS=1 # Replace this with the number of public inputs in your circuit

HEX\_PUBLIC\_INPUTS=${PROOF\_HEX:0:$((32 * $NUM\_PUBLIC\_INPUTS * 2))}

SPLIT\_HEX\_PUBLIC\_INPUTS=$(sed -e 's/.\{64\}/"0x&",/g' <<<$HEX\_PUBLIC\_INPUTS)



PROOF\_WITHOUT\_PUBLIC\_INPUTS="${PROOF\_HEX:$((NUM\_PUBLIC\_INPUTS * 32 * 2))}"



echo 0x$PROOF\_WITHOUT\_PUBLIC\_INPUTS

echo "[${SPLIT\_HEX\_PUBLIC\_INPUTS}]"





You can pass the proof and public inputs from above to the verify function in Remix.



A programmatic example of how the verify function is called can be seen in the example zk voting application here:



function castVote(bytes calldata proof, uint proposalId, uint vote, bytes32 nullifierHash) public returns (bool) {

 // ...

 bytes32[] memory publicInputs = new bytes32[](4);

 publicInputs[0] = merkleRoot;

 publicInputs[1] = bytes32(proposalId);

 publicInputs[2] = bytes32(vote);

 publicInputs[3] = nullifierHash;

 require(verifier.verify(proof, publicInputs), "Invalid proof");





Return Values

A circuit doesn't have the concept of a return value. Return values are just syntactic sugar in Noir.



Under the hood, the return value is passed as an input to the circuit and is checked at the end of the circuit program.



For example, if you have Noir program like this:



fn main(

 // Public inputs

 pubkey\_x: pub Field,

 pubkey\_y: pub Field,

 // Private inputs

 priv\_key: Field,

) -> pub Field



the verify function will expect the public inputs array (second function parameter) to be of length 3, the two inputs and the return value.



Passing only two inputs will result in an error such as PUBLIC\_INPUT\_COUNT\_INVALID(3, 2).



In this case, the inputs parameter to verify would be an array ordered as [pubkey\_x, pubkey\_y, return].



Structs

You can pass structs to the verifier contract. They will be flattened so that the array of inputs is 1-dimensional array.



For example, consider the following program:



struct Type1 {

 val1: Field,

 val2: Field,

}



struct Nested {

 t1: Type1,

 is\_true: bool,

}



fn main(x: pub Field, nested: pub Nested, y: pub Field) {

 //...

}



The order of these inputs would be flattened to: [x, nested.t1.val1, nested.t1.val2, nested.is\_true, y]



The other function you can call is our entrypoint verify function, as defined above.



tip

It's worth noticing that the verify function is actually a view function. A view function does not alter the blockchain state, so it doesn't need to be distributed (i.e. it will run only on the executing node), and therefore doesn't cost any gas.



This can be particularly useful in some situations. If Alice generated a proof and wants Bob to verify its correctness, Bob doesn't need to run Nargo, NoirJS, or any Noir specific infrastructure. He can simply make a call to the blockchain with the proof and verify it is correct without paying any gas.



It would be incorrect to say that a Noir proof verification costs any gas at all. However, most of the time the result of verify is used to modify state (for example, to update a balance, a game state, etc). In that case the whole network needs to execute it, which does incur gas costs (calldata and execution, but not storage).



Compatibility with different EVM chains

Barretenberg proof verification requires the ecMul, ecAdd, ecPairing, and modexp EVM precompiles. You can deploy and use the verifier contract on all EVM chains that support the precompiles.



EVM Diff provides a great table of which EVM chains support which precompiles: https://www.evmdiff.com/features?feature=precompiles



Some EVM chains manually tested to work with the Barretenberg verifier include:



Optimism

Arbitrum

Polygon PoS

Scroll

Celo

BSC

Blast L2

Avalanche C-Chain

Mode

Linea

Moonbeam

Meanwhile, some EVM chains chains manually tested that failed to work with the Barretenberg verifier include:



zkSync ERA

Polygon zkEVM

Pull requests to update this section is welcome and appreciated if you have compatibility updates on existing / new chains to contribute: https://github.com/noir-lang/noir



What's next

Now that you know how to call a Noir Solidity Verifier on a smart contract using Remix, you should be comfortable with using it with some programmatic frameworks. You can find other tools, examples, boilerplates and libraries in the awesome-noir repository.



You should also be ready to write and deploy your first NoirJS app and start generating proofs on websites, phones, and NodeJS environments! Head on to the NoirJS tutorial to learn how to do that.



Building a web app with Noir and Barretenberg

NoirJS is a Typescript package meant to work both in a browser and a server environment.



In this tutorial, we will combine NoirJS with Aztec's Barretenberg backend to build a simple web app. From here, you should get an idea on how to proceed with your own Noir projects!



You can find the complete app code for this guide here.



Dependencies

Before we start, we want to make sure we have Node installed. If you don't have it already you can install it here, we recommend using Yarn as our package manager for this tutorial.



We'll also need version 1.0.0-beta.2 nargo installed, see the Noir installation guide for details.



Let's go barebones. Doing the bare minimum is not only simple, but also allows you to easily adapt it to almost any frontend framework.



Barebones means we can immediately start with the dependencies even on an empty folder 😈:



yarn add @noir-lang/noir\_js@1.0.0-beta.2 @aztec/bb.js@0.72.1



Wait, what are these dependencies?



noir\_js is the main Noir package. It will execute our program, and generate the witness that will be sent to the backend.

bb.js is the Typescript interface for Aztec's Barretenberg proving backend. It also uses the wasm version in order to run on the browser.

info

In this guide, we will install versions pinned to 1.0.0-beta.2. These work with Barretenberg version 0.72.1, so we are using that one version too. Feel free to try with older or later versions, though!



Setting up our Noir program

ZK is a powerful technology. An app that reveals computational correctness but doesn't reveal some of its inputs is almost unbelievable, yet Noir makes it as easy as a single line of code.



tip

It's not just you. We also enjoy syntax highlighting. Check out the Language Server



All you need is a main.nr and a Nargo.toml file. You can follow the noirup installation and just run noirup -v 1.0.0-beta.2, or just create them by hand:



mkdir -p circuit/src

touch circuit/src/main.nr circuit/Nargo.toml



To make our program interesting, let's give it a real use-case scenario: Bob wants to prove he is older than 18, without disclosing his age. Open main.nr and write:



fn main(age: u8) {

 assert(age >= 18);

}



This program accepts a private input called age, and simply proves this number is higher than 18. But to run this code, we need to give the compiler a Nargo.toml with at least a name and a type:



[package]

name = "circuit"

type = "bin"



This is all that we need to get started with Noir.



my heart is ready for you, noir.js



Compile compile compile

Finally we're up for something cool. But before we can execute a Noir program, we need to compile it into ACIR: an abstract representation.



This can be done by cd-ing into our circuit directory and running the nargo compile command.



cd circuit



nargo compile



This will write the compiled circuit into the target directory, which we'll then load into our JS later on.



Setting up our app

Remember when apps only had one html and one js file? Well, that's enough for Noir webapps. Let's create them:



touch index.html index.js



And add something useful to our HTML file:







 .outer {

 display: flex;

 justify-content: space-between;

 width: 100%;

 }

 .inner {

 width: 45%;

 border: 1px solid black;

 padding: 10px;

 word-wrap: break-word;

 }

 



# Noir app




Submit Age


## Logs


## Proof








It could be a beautiful UI... Depending on which universe you live in. In any case, we're using some scary CSS to make two boxes that will show cool things on the screen.



As for the JS, real madmen could just console.log everything, but let's say we want to see things happening (the true initial purpose of JS... right?). Here's some boilerplate for that. Just paste it in index.js:



const show = (id, content) => {

 const container = document.getElementById(id);

 container.appendChild(document.createTextNode(content));

 container.appendChild(document.createElement("br"));

};



document.getElementById("submit").addEventListener("click", async () => {

 try {

 // noir goes here

 } catch {

 show("logs", "Oh 💔");

 }

});





info

At this point in the tutorial, your folder structure should look like this:



.

└── circuit

 └── src

 └── main.nr

 Nargo.toml

 index.js

 package.json

 index.html

 ...etc



Some more JS

We're starting with the good stuff now. We want to execute our circuit to get the witness, and then feed that witness to Barretenberg. Luckily, both packages are quite easy to work with. Let's import them at the top of the file:



import { UltraHonkBackend } from '@aztec/bb.js';

import { Noir } from '@noir-lang/noir\_js';

import circuit from "./circuit/target/circuit.json";



And instantiate them inside our try-catch block:



// try {

const noir = new Noir(circuit);

const backend = new UltraHonkBackend(circuit.bytecode);

// }



Executing and proving

Now for the app itself. We're capturing whatever is in the input when people press the submit button. Inside our try block, let's just grab that input and get its value. Noir will gladly execute it, and give us a witness:



const age = document.getElementById("age").value;

show("logs", "Generating witness... ⏳");

const { witness } = await noir.execute({ age });

show("logs", "Generated witness... ✅");





note

For the remainder of the tutorial, everything will be happening inside the try block



Now we're ready to prove stuff! Let's feed some inputs to our circuit and calculate the proof:



show("logs", "Generating proof... ⏳");

const proof = await backend.generateProof(witness);

show("logs", "Generated proof... ✅");

show("results", proof.proof);



Our program is technically done . You're probably eager to see stuff happening! To serve this in a convenient way, we can use a bundler like vite by creating a vite.config.js file:



touch vite.config.js



Noir needs to load two WASM modules, but Vite doesn't include them by default in the bundle. We need to add the configuration below to vite.config.js to make it work. We also need to target ESNext since bb.js uses top-level await, which isn't supported in some browsers.



export default {

 optimizeDeps: {

 esbuildOptions: { target: "esnext" },

 exclude: ['@noir-lang/noirc\_abi', '@noir-lang/acvm\_js']

 }

};



This should be enough for vite. We don't even need to install it, just run:



yarn dlx vite



If it doesn't open a browser for you, just visit localhost:5173. You should now see the worst UI ever, with an ugly input.



Noir Webapp UI



Now, our circuit requires a private input fn main(age: u8), and fails if it is less than 18. Let's see if it works. Submit any number above 18 (as long as it fits in 8 bits) and you should get a valid proof. Otherwise the proof won't even generate correctly.



By the way, if you're human, you shouldn't be able to understand anything on the "proof" box. That's OK. We like you, human ❤️.



Verifying

Time to celebrate, yes! But we shouldn't trust machines so blindly. Let's add these lines to see our proof being verified:



show('logs', 'Verifying proof... ⌛');

const isValid = await backend.verifyProof(proof);

show("logs", `Proof is ${isValid ? "valid" : "invalid"}... ✅`);



You have successfully generated a client-side Noir web app!



coded app without math knowledge



Next steps

At this point, you have a working ZK app that works on the browser. Actually, it works on a mobile phone too!



If you want to continue learning by doing, here are some challenges for you:



Install nargo and write Noir tests

Change the circuit to accept a public input as the cutoff age. It could be different depending on the purpose, for example!

Enjoy Noir's Rust-like syntax and write a struct Country that implements a trait MinAge with a method get\_min\_age. Then, make a struct Person have an u8 as its age and a country of type Country. You can pass a person in JS just like a JSON object person: { age, country: { min\_age: 18 }}

The world is your stage, just have fun with ZK! You can see how noirjs is used in some common frameworks in the awesome-noir repo.



Data Types

Every value in Noir has a type, which determines which operations are valid for it.



All values in Noir are fundamentally composed of Field elements. For a more approachable developing experience, abstractions are added on top to introduce different data types in Noir.



Noir has two category of data types: primitive types (e.g. Field, integers, bool) and compound types that group primitive types (e.g. arrays, tuples, structs). Each value can either be private or public.



Private & Public Types

A private value is known only to the Prover, while a public value is known by both the Prover and Verifier. Mark values as private when the value should only be known to the prover. All primitive types (including individual fields of compound types) in Noir are private by default, and can be marked public when certain values are intended to be revealed to the Verifier.



Note: For public values defined in Noir programs paired with smart contract verifiers, once the proofs are verified on-chain the values can be considered known to everyone that has access to that blockchain.



Public data types are treated no differently to private types apart from the fact that their values will be revealed in proofs generated. Simply changing the value of a public type will not change the circuit (where the same goes for changing values of private types as well).



Private values are also referred to as witnesses sometimes.



Note: The terms private and public when applied to a type (e.g. pub Field) have a different meaning than when applied to a function (e.g. pub fn foo() {}).



The former is a visibility modifier for the Prover to interpret if a value should be made known to the Verifier, while the latter is a visibility modifier for the compiler to interpret if a function should be made accessible to external Noir programs like in other languages.



pub Modifier

All data types in Noir are private by default. Types are explicitly declared as public using the pub modifier:



fn main(x : Field, y : pub Field) -> pub Field {

 x + y

}



In this example, x is private while y and x + y (the return value) are public. Note that visibility is handled per variable, so it is perfectly valid to have one input that is private and another that is public.



Note: Public types can only be declared through parameters on main.



Type Aliases

A type alias is a new name for an existing type. Type aliases are declared with the keyword type:



type Id = u8;



fn main() {

 let id: Id = 1;

 let zero: u8 = 0;

 assert(zero + 1 == id);

}



Type aliases can also be used with generics:



type Id = Size;



fn main() {

 let id: Id = 1;

 let zero: u32 = 0;

 assert(zero + 1 == id);

}



Type aliases can even refer to other aliases. An error will be issued if they form a cycle:



// Ok!

type A = B;

type B = Field;



type Bad1 = Bad2;



// error: Dependency cycle found

type Bad2 = Bad1;

// ^^^^^^^^^^^ 'Bad2' recursively depends on itself: Bad2 -> Bad1 -> Bad2



By default, like functions, type aliases are private to the module they exist in. You can use pub to make the type alias public or pub(crate) to make it public to just its crate:



// This type alias is now public

pub type Id = u8;



Wildcard Type

Noir can usually infer the type of the variable from the context, so specifying the type of a variable is only required when it cannot be inferred. However, specifying a complex type can be tedious, especially when it has multiple generic arguments. Often some of the generic types can be inferred from the context, and Noir only needs a hint to properly infer the other types. We can partially specify a variable's type by using \_ as a marker, indicating where we still want the compiler to infer the type.



let a: [\_; 4] = foo(b);



Edit this page



