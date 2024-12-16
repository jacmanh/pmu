import { PropsWithChildren } from 'react';
import classNames from 'classnames';

type TabProps = PropsWithChildren<{
  items: {
    label: string;
    active?: boolean;
    onClick: () => void;
  }[];
}>;

export const Tab = ({ children, items }: TabProps) => (
  <div className="flex space-x-4">
    {items.map((item) => (
      <a
        href="#"
        onClick={item.onClick}
        className={classNames({
          'border-b border-blue-500': item.active,
        })}
      >
        {item.label}
      </a>
    ))}
  </div>
);
