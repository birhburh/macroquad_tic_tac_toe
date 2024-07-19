fn main() {
    println!("cargo::rerun-if-changed=src/main.rs");
    println!(
        "cargo:rustc-env=HOST={}",
        std::env::var("HOST").unwrap()
    );
    println!(
        "cargo:rustc-env=TARGET={}",
        std::env::var("TARGET").unwrap()
    );
}