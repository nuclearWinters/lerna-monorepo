FROM rust:1.81

WORKDIR /usr/src/service/packages/backend-auth-rust

RUN apt update && apt upgrade -y
RUN apt install -y protobuf-compiler libprotobuf-dev

# We'll get to what this file is below!
COPY dummy.rs .
# If this changed likely the Cargo.toml changed so lets trigger the
# recopying of it anyways
COPY Cargo.lock .
COPY Cargo.toml .
# We'll get to what this substitution is for but replace main.rs with
# lib.rs if this is a library
RUN sed -i 's#src/main.rs#dummy.rs#' Cargo.toml
# Drop release if you want debug builds. This step cache's our deps!
RUN cargo build --release
# Now return the file back to normal
RUN sed -i 's#dummy.rs#src/main.rs#' Cargo.toml
# Copy the rest of the files into the container
COPY . .
# Now this only builds our changes to things like src
RUN cargo build --release

EXPOSE 4004

CMD ["target/release/backend-auth-rust"]