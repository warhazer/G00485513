export interface Movie {
  id: number;
  overview: string;
  poster_path: string | null;
  title?: string;
}

export interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

export interface CrewMember {
  id: number;
  name: string;
  profile_path: string | null;
  job: string;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface PersonDetails {
  id: number;
  name: string;
  profile_path: string | null;
  also_known_as: string[];
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  biography: string;
}

export interface PersonMovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
}