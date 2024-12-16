import { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

type CardProps = PropsWithChildren<{}> & HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, ...props }: CardProps) => (
  <div
    className={classNames(
      'border rounded-xl bg-white shadow-lg p-2',
      props.className
    )}
  >
    {children}
  </div>
);
