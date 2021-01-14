export type FirebaseCollections =
  | "attendees"
  | "categories"
  | "competitions"
  | "questions"
  | "results"
  | "tracks"
  | "user_accounts"
  | "checkpoints";

export namespace B3RuntimeAPI {
  export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    organization: string;
    username: string;
    email: string;
  }

  export interface Checkpoint {
    id: string;
    label: string;
    latitude: number;
    longitude: number;
    order: number;
    penalty?: boolean;
    questionKey?: string;
  }

  export interface Question {
    id: string;
    categoryKey: string;
    text: string;
    imgUrl: string;
    correctAnswer: string;
    options: QuestionOption[];
  }

  export interface QuestionOption {
    option: string;
    text: string;
    imgUrl?: string;
  }

  export interface Competition {
    id: string;
    name: string;
    date: string;
    active: boolean;
    showFutureMarkers: boolean;
    trackKeys: string[];
  }

  export interface Track {
    name: string;
    categoryKey: string;
    isComplete: boolean;
  }

  export interface Category {
    id: string;
  }

  export interface Result {
    id: string;
    totalTime: number | null;
    startedTime: number;
    attendee: Attendee;
    results: ResultData[];
    lastUpdated?: {
      seconds: number;
      nanoseconds: number;
    };
  }
  export interface NewResult {
    totalTime: number;
    startedTime: number;
    attendee: NewAttendee;
    results: Omit<B3RuntimeAPI.ResultData, "id">[];
  }

  export interface ResultData {
    id: string;
    answeredCorrect: boolean;
    completed: boolean;
    completedTime: number;
    label: string | null;
    latitude: number;
    longitude: number;
    order: number;
    penalty: boolean;
    questionKey: string | null;
    skipped: boolean;
  }

  export interface Attendee {
    id: string;
    userAccountKey: string;
    email: string;
    name: string;
    competitionKey: string;
    competitionName: string;
    trackKey: string;
    trackName: string;
  }
  export interface NewAttendee {
    competitionKey: string;
    competitionName?: string;
    trackKey: string;
    trackName?: string;
    userAccountKey: string;
  }
}
