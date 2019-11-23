import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
const cn = classNameBuilder('loader');

export const Loader: React.FC = () => <div className={cn()}>.... loading ....</div>;
