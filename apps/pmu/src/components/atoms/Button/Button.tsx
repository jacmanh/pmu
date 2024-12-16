import { ButtonHTMLAttributes, PropsWithChildren, ReactElement } from 'react';
import classNames from 'classnames';

type ButtonProps = {
  primary?: boolean;
  secondary?: boolean;
  active?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  active,
  children,
  primary,
  secondary,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={classNames(
        'rounded-md p-2',
        {
          'bg-primary hover:bg-primary-hover text-white': primary && !active,
          'bg-primary-active hover:bg-primary-hover text-white':
            primary && active,
          'bg-secondary hover:bg-secondary-hover text-black':
            secondary && !active,
          'bg-secondary-active hover:bg-secondary-hover text-black':
            secondary && active,
          'bg-neutral hover:bg-neutral-hover text-gray-800':
            !primary && !secondary && !active,
          'bg-neutral-active hover:bg-neutral-hover text-white': active,
        },
        props.className
      )}
    >
      {children}
    </button>
  );
};
