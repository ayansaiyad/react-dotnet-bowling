export type Bowler = {
  bowlerId: number;
  bowlerLastName: string;
  bowlerFirstName: string;
  bowlerMiddleInit: string | null;
  bowlerAddress: string;
  bowlerCity: string;
  bowlerState: string;
  bowlerZip: number | string;
  bowlerPhoneNumber: string;
  team: {
    teamID?: number;
    teamId?: number;
    teamName: string;
  };
};
