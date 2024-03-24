FROM rust:1.76

WORKDIR /usr/src/service/packages/rust-backend-auth
COPY . .

RUN apt update && apt upgrade -y
RUN apt install -y protobuf-compiler libprotobuf-dev

RUN cargo install --path .

EXPOSE 8001

CMD ["myapp"]