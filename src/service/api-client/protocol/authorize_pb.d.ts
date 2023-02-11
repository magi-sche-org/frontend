import * as jspb from 'google-protobuf'



export class GetTokenRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenRequest): GetTokenRequest.AsObject;
  static serializeBinaryToWriter(message: GetTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenRequest;
  static deserializeBinaryFromReader(message: GetTokenRequest, reader: jspb.BinaryReader): GetTokenRequest;
}

export namespace GetTokenRequest {
  export type AsObject = {
  }
}

export class GetTokenReply extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): GetTokenReply;

  getToken(): string;
  setToken(value: string): GetTokenReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenReply): GetTokenReply.AsObject;
  static serializeBinaryToWriter(message: GetTokenReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenReply;
  static deserializeBinaryFromReader(message: GetTokenReply, reader: jspb.BinaryReader): GetTokenReply;
}

export namespace GetTokenReply {
  export type AsObject = {
    status: number,
    token: string,
  }
}

export class LinkTokenRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): LinkTokenRequest;

  getGcptoken(): string;
  setGcptoken(value: string): LinkTokenRequest;

  getEmail(): string;
  setEmail(value: string): LinkTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LinkTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LinkTokenRequest): LinkTokenRequest.AsObject;
  static serializeBinaryToWriter(message: LinkTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LinkTokenRequest;
  static deserializeBinaryFromReader(message: LinkTokenRequest, reader: jspb.BinaryReader): LinkTokenRequest;
}

export namespace LinkTokenRequest {
  export type AsObject = {
    token: string,
    gcptoken: string,
    email: string,
  }
}

export class LinkTokenReply extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): LinkTokenReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LinkTokenReply.AsObject;
  static toObject(includeInstance: boolean, msg: LinkTokenReply): LinkTokenReply.AsObject;
  static serializeBinaryToWriter(message: LinkTokenReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LinkTokenReply;
  static deserializeBinaryFromReader(message: LinkTokenReply, reader: jspb.BinaryReader): LinkTokenReply;
}

export namespace LinkTokenReply {
  export type AsObject = {
    status: number,
  }
}

