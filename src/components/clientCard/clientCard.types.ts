import { IClientCreateTypes } from '@/server/validations/client';

export interface IFirebaseClient extends IClientCreateTypes {
  id: string;
}

export interface IClientCardProps {
  data: IFirebaseClient;
  onClick?: () => void;
}
