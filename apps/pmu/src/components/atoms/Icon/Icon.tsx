import SpinnerIcon from './assets/spin.svg?react';
import { FunctionComponent, SVGProps } from 'react';

type IconName = 'spin';

type IconProps = {
  name: IconName;
  className?: string;
};

const icons: Record<IconName, FunctionComponent<SVGProps<SVGSVGElement>>> = {
  spin: SpinnerIcon,
};

export const Icon = ({ name, className }: IconProps) => {
  const SvgIcon = icons[name];
  return <SvgIcon className={className} />;
};
