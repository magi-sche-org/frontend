import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';


export class GetEventRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetEventRequest;

  getToken(): string;
  setToken(value: string): GetEventRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventRequest): GetEventRequest.AsObject;
  static serializeBinaryToWriter(message: GetEventRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventRequest;
  static deserializeBinaryFromReader(message: GetEventRequest, reader: jspb.BinaryReader): GetEventRequest;
}

export namespace GetEventRequest {
  export type AsObject = {
    id: string,
    token: string,
  }
}

export class GetEventResponse extends jspb.Message {
  getId(): string;
  setId(value: string): GetEventResponse;

  getName(): string;
  setName(value: string): GetEventResponse;

  getOwner(): boolean;
  setOwner(value: boolean): GetEventResponse;

  getTimeunit(): google_protobuf_duration_pb.Duration | undefined;
  setTimeunit(value?: google_protobuf_duration_pb.Duration): GetEventResponse;
  hasTimeunit(): boolean;
  clearTimeunit(): GetEventResponse;

  getDuration(): google_protobuf_duration_pb.Duration | undefined;
  setDuration(value?: google_protobuf_duration_pb.Duration): GetEventResponse;
  hasDuration(): boolean;
  clearDuration(): GetEventResponse;

  getAnswersList(): Array<Answer>;
  setAnswersList(value: Array<Answer>): GetEventResponse;
  clearAnswersList(): GetEventResponse;
  addAnswers(value?: Answer, index?: number): Answer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventResponse): GetEventResponse.AsObject;
  static serializeBinaryToWriter(message: GetEventResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventResponse;
  static deserializeBinaryFromReader(message: GetEventResponse, reader: jspb.BinaryReader): GetEventResponse;
}

export namespace GetEventResponse {
  export type AsObject = {
    id: string,
    name: string,
    owner: boolean,
    timeunit?: google_protobuf_duration_pb.Duration.AsObject,
    duration?: google_protobuf_duration_pb.Duration.AsObject,
    answersList: Array<Answer.AsObject>,
  }
}

export class CreateEventRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateEventRequest;

  getToken(): string;
  setToken(value: string): CreateEventRequest;

  getTimeunit(): google_protobuf_duration_pb.Duration | undefined;
  setTimeunit(value?: google_protobuf_duration_pb.Duration): CreateEventRequest;
  hasTimeunit(): boolean;
  clearTimeunit(): CreateEventRequest;

  getDuration(): google_protobuf_duration_pb.Duration | undefined;
  setDuration(value?: google_protobuf_duration_pb.Duration): CreateEventRequest;
  hasDuration(): boolean;
  clearDuration(): CreateEventRequest;

  getProposedstarttimeList(): Array<google_protobuf_timestamp_pb.Timestamp>;
  setProposedstarttimeList(value: Array<google_protobuf_timestamp_pb.Timestamp>): CreateEventRequest;
  clearProposedstarttimeList(): CreateEventRequest;
  addProposedstarttime(value?: google_protobuf_timestamp_pb.Timestamp, index?: number): google_protobuf_timestamp_pb.Timestamp;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEventRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEventRequest): CreateEventRequest.AsObject;
  static serializeBinaryToWriter(message: CreateEventRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateEventRequest;
  static deserializeBinaryFromReader(message: CreateEventRequest, reader: jspb.BinaryReader): CreateEventRequest;
}

export namespace CreateEventRequest {
  export type AsObject = {
    name: string,
    token: string,
    timeunit?: google_protobuf_duration_pb.Duration.AsObject,
    duration?: google_protobuf_duration_pb.Duration.AsObject,
    proposedstarttimeList: Array<google_protobuf_timestamp_pb.Timestamp.AsObject>,
  }
}

export class CreateEventResponse extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): CreateEventResponse;

  getId(): string;
  setId(value: string): CreateEventResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEventResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEventResponse): CreateEventResponse.AsObject;
  static serializeBinaryToWriter(message: CreateEventResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateEventResponse;
  static deserializeBinaryFromReader(message: CreateEventResponse, reader: jspb.BinaryReader): CreateEventResponse;
}

export namespace CreateEventResponse {
  export type AsObject = {
    status: number,
    id: string,
  }
}

export class RegisterAnswerRequest extends jspb.Message {
  getId(): string;
  setId(value: string): RegisterAnswerRequest;

  getToken(): string;
  setToken(value: string): RegisterAnswerRequest;

  getAnswer(): Answer | undefined;
  setAnswer(value?: Answer): RegisterAnswerRequest;
  hasAnswer(): boolean;
  clearAnswer(): RegisterAnswerRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterAnswerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterAnswerRequest): RegisterAnswerRequest.AsObject;
  static serializeBinaryToWriter(message: RegisterAnswerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterAnswerRequest;
  static deserializeBinaryFromReader(message: RegisterAnswerRequest, reader: jspb.BinaryReader): RegisterAnswerRequest;
}

export namespace RegisterAnswerRequest {
  export type AsObject = {
    id: string,
    token: string,
    answer?: Answer.AsObject,
  }
}

export class RegisterAnswerResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterAnswerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterAnswerResponse): RegisterAnswerResponse.AsObject;
  static serializeBinaryToWriter(message: RegisterAnswerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterAnswerResponse;
  static deserializeBinaryFromReader(message: RegisterAnswerResponse, reader: jspb.BinaryReader): RegisterAnswerResponse;
}

export namespace RegisterAnswerResponse {
  export type AsObject = {
  }
}

export class Answer extends jspb.Message {
  getName(): string;
  setName(value: string): Answer;

  getNote(): string;
  setNote(value: string): Answer;

  getScheduleList(): Array<Answer.ProposedSchedule>;
  setScheduleList(value: Array<Answer.ProposedSchedule>): Answer;
  clearScheduleList(): Answer;
  addSchedule(value?: Answer.ProposedSchedule, index?: number): Answer.ProposedSchedule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Answer.AsObject;
  static toObject(includeInstance: boolean, msg: Answer): Answer.AsObject;
  static serializeBinaryToWriter(message: Answer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Answer;
  static deserializeBinaryFromReader(message: Answer, reader: jspb.BinaryReader): Answer;
}

export namespace Answer {
  export type AsObject = {
    name: string,
    note: string,
    scheduleList: Array<Answer.ProposedSchedule.AsObject>,
  }

  export class ProposedSchedule extends jspb.Message {
    getStarttime(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setStarttime(value?: google_protobuf_timestamp_pb.Timestamp): ProposedSchedule;
    hasStarttime(): boolean;
    clearStarttime(): ProposedSchedule;

    getAvailability(): Answer.ProposedSchedule.Availability;
    setAvailability(value: Answer.ProposedSchedule.Availability): ProposedSchedule;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ProposedSchedule.AsObject;
    static toObject(includeInstance: boolean, msg: ProposedSchedule): ProposedSchedule.AsObject;
    static serializeBinaryToWriter(message: ProposedSchedule, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ProposedSchedule;
    static deserializeBinaryFromReader(message: ProposedSchedule, reader: jspb.BinaryReader): ProposedSchedule;
  }

  export namespace ProposedSchedule {
    export type AsObject = {
      starttime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
      availability: Answer.ProposedSchedule.Availability,
    }

    export enum Availability { 
      UNSPECIFIED = 0,
      AVAILABLE = 1,
      MAYBE = 2,
      UNAVAILABLE = 3,
    }
  }

}

