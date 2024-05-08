export interface CreateSimulateProps {
  id: number | string;
  simulated: string;
  category: string;
}

export type CreateSimulateRequireProps = Omit<CreateSimulateProps, 'id'>;
